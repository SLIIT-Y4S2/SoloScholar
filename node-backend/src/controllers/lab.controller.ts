import { Request, Response } from "express";
import { evaluateStudentAnswers, generateHintsForStudentAnswers, responseSynthesizerForLabs } from "../services/lab.rag.service";
import { getLessonByModuleIdAndTitle, getLessonOutlineByModuleAndLessonName, getModuleByName } from "../services/db/module.db.service";
import { createLabMaterials, updateLabMaterial, getLabSheetByLabSheetIdAndLearnerId, getLearningMaterialDetailsByLearnerIdAndLessonId, getLessonDetailsByLabSheetId, updateLabSheetAnswers, deleteLabSheetById, getStudentAnswersByLabSheetIdAndQuestionNumber, updateLabSheetQuestionAnswerSubmissionStatus, updateLabSheetStatusAsCompleted } from "../services/db/lab.db.service";
import { StatusCodes } from "http-status-codes";

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function generateLabMaterialsHandler(req: Request, res: Response) {
    try {
        const { moduleName, lessonTitle, learningLevel } = req.body;
        const { id: learnerId } = res.locals.user;

        if (!moduleName || !lessonTitle || !learningLevel) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        const lessonOutline = await getLessonOutlineByModuleAndLessonName(moduleName, lessonTitle);

        const subTopics = lessonOutline.sub_lessons.reduce((acc, subtopic) => {
            return acc + `${subtopic.topic}:\n${subtopic.description}\n\n`;
        }, '');

        // Get all lab sheets for the learner
        const existingLabSheets = await getLearningMaterialDetailsByLearnerIdAndLessonId(lessonOutline.id, learnerId);

        // Check if lab sheet already exists for the learning level
        const labWithSameLearningLevel = existingLabSheets.find(labSheet => labSheet.learningLevel === learningLevel);

        // If lab sheet already exists for the learning level, return conflict
        if (labWithSameLearningLevel) {
            return res.status(StatusCodes.CONFLICT).json({
                message: "Lab sheet already exists for this learning level",
            });
        }


        const labMaterials = await createLabMaterials(lessonOutline.id, learnerId, learningLevel);

        const practicalLabData = await responseSynthesizerForLabs({ learningLevel: learningLevel, lessonTitle: lessonTitle, lessonOutline: subTopics, learningOutcomes: lessonOutline.lesson_learning_outcomes })
            .then((practicalLabData) => {
                return updateLabMaterial(labMaterials.id, practicalLabData.realWorldScenario, JSON.stringify(practicalLabData.supportingMaterial), practicalLabData.questions);
            }).catch((error) => {
                deleteLabSheetById(labMaterials.id);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                    {
                        message: "Failed to generate lab sheet",
                        error: error
                    }
                )
            });



        return res.status(StatusCodes.CREATED).send(practicalLabData);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Internal server error",
        });
    }

}

/**
 * 
 * @param req 
 * @param res 
 */
export async function getLabSheetByIdHandler(req: Request, res: Response) {
    try {
        const { labSheetId } = req.params;
        const { id: learnerId } = res.locals.user;

        const labSheet = await getLabSheetByLabSheetIdAndLearnerId(labSheetId, learnerId);

        return res.status(200).send(labSheet);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getLearningMaterialSummaryByLessonNameHandler(req: Request, res: Response) {
    try {
        const { moduleName, lessonName } = req.params;
        const { id: learnerId } = res.locals.user;

        console.log(moduleName, lessonName);



        if (!moduleName || !lessonName) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        const formattedLessonName = lessonName.replace(/-/g, " ");
        const formattedModuleName = moduleName.replace(/-/g, " ");

        const module = await getModuleByName(formattedModuleName);

        if (!module) {
            return res.status(404).json({
                message: "Module not found",
            });
        }

        const lesson = await getLessonByModuleIdAndTitle(module.id, formattedLessonName);

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found",
            });
        }

        const labSheet = await getLearningMaterialDetailsByLearnerIdAndLessonId(lesson.id, learnerId);

        if (!labSheet) {
            return res.status(404).json({
                message: "Lab sheet not found",
            });
        }

        res.status(200).send(labSheet);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Failed to get learning material",
        });
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function evaluateStudentAnswersHandler(req: Request, res: Response) {

    try {
        const { studentsAnswer, labSheetId, questionsId } = req.body;
        const { id: learnerId } = res.locals.user;

        if (!labSheetId || !studentsAnswer) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        const labSheet = await getLabSheetByLabSheetIdAndLearnerId(labSheetId, learnerId);
        const lesson = await getLessonDetailsByLabSheetId(labSheetId);

        if (!labSheet) {
            return res.status(404).json({
                message: "Lab sheet not found",
            });
        }

        const question_object = labSheet.labsheet_question.find((question) => question.id === questionsId);

        if (!question_object) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        const results = await evaluateStudentAnswers({
            question: question_object.question,
            studentAnswer: studentsAnswer,
            topicOfTheLab: lesson.title,
            realWorldScenario: labSheet.real_world_scenario!,
            supportingMaterial: labSheet.supportMaterial
        })

        await updateLabSheetAnswers(labSheetId, questionsId, studentsAnswer, results.studentAnswerEvaluation.isCorrect);

        return res.status(200).json(results);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Failed to evaluate student answers",
        });
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function generateHintForQuestionHandler(req: Request, res: Response) {
    try {
        const { labSheetId, questionNumber } = req.params;
        const { id: learnerId } = res.locals.user;

        if (!labSheetId || !questionNumber) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        if (isNaN(Number(questionNumber))) {
            return res.status(400).json({
                message: "Invalid question id",
            });
        }

        console.log(labSheetId, questionNumber);

        const studentAnswers = await getStudentAnswersByLabSheetIdAndQuestionNumber(labSheetId, Number(questionNumber));
        const labSheet = await getLabSheetByLabSheetIdAndLearnerId(labSheetId, learnerId);

        if (!studentAnswers || !labSheet) {
            return res.status(404).json({
                message: "Student answers not found",
            });
        }

        if (studentAnswers.student_answers && studentAnswers.student_answers.length === 0) {
            return res.status(404).json({
                message: "Student answers not found",
            });
        }

        const hint = await generateHintsForStudentAnswers({
            previousAnswers: studentAnswers.student_answers?.map((answer) => answer.student_answer)!,
            realWorldScenario: labSheet.real_world_scenario!,
            supportingMaterial: labSheet.supportMaterial,
            question: labSheet.labsheet_question.find((question) => question.question_number === Number(questionNumber))!.question,
        });

        return res.status(200).json(
            { ...hint }
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Failed to generate hint",
        });
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteLabSheetByIdHandler(req: Request, res: Response) {
    try {
        const { labSheetId } = req.params;

        if (!labSheetId) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        await deleteLabSheetById(labSheetId);

        return res.status(204).json({
            message: "Lab sheet deleted",
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Failed to delete lab sheet",
        });
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateLabSheetQuestionAnswerSubmissionStatusHandler(req: Request, res: Response) {
    try {
        const { questionId, reflection } = req.body;
        const { labSheetId } = req.params;

        if (!labSheetId || !questionId || typeof reflection !== "string") {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        const submissionStatus = await updateLabSheetQuestionAnswerSubmissionStatus(labSheetId, questionId, reflection);

        return res.status(200).json({
            message: "Lab sheet question answer submission status updated",
            submission_status: submissionStatus.labsheet_question
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Failed to update lab sheet question answer submission status",
        });
    }
}


export async function updateLabSheetStatusAsCompletedHandler(req: Request, res: Response) {
    const { questionId, reflection } = req.body;
    const { labSheetId } = req.params;
    const { learnerID } = res.locals.user;

    try {
        if (!labSheetId) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        const labSheet = await updateLabSheetStatusAsCompleted(labSheetId, questionId, reflection);

        return res.status(StatusCodes.OK).json({
            message: "Lab sheet status updated",
            labSheet
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Failed to update lab sheet status",
        });
    }
}