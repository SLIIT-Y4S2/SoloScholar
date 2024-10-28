import { Request, Response } from "express";
import {
    evaluateStudentAnswers,
    generateFeedbackForLabActivity,
    generateHintsForStudentAnswers,
    responseSynthesizerForLabs,
} from "../services/lab.rag.service";
import {
    getLessonByModuleIdAndTitle,
    getLessonOutlineByModuleAndLessonName,
    getModuleByName,
} from "../services/db/module.db.service";
import {
    createLabMaterials,
    updateLabMaterial,
    getLabSheetByLabSheetIdAndLearnerId,
    getLearningMaterialDetailsByLearnerIdAndLessonId,
    getLessonDetailsByLabSheetId,
    updateLabSheetAnswersByLearnerIdAndLabSheetId,
    deleteLabSheetById,
    getStudentAnswersByLabSheetIdAndQuestionNumberANDLearnerId,
    updateLabSheetQuestionAnswerSubmissionStatusByLearnerIdAndLabSheetId,
    updateLabSheetStatusAsCompletedByLearnerIdAndLabSheetId,
    updateHintCountByLabSheetIdAndQuestionId,
    updateLabSheetFeedbackByLabSheetId
} from "../services/db/lab.db.service";
import { StatusCodes } from "http-status-codes";

//MARK:Lab Materials Generation
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function generateLabMaterialsHandler(req: Request, res: Response) {
    let labMaterials: { id: string, lessonId: number, learnerId: string } | null = null;
    try {
        const { moduleName, lessonTitle, learningLevel, enableFeedback } = req.body;
        const { id: learnerId } = res.locals.user;


        if (!moduleName || !lessonTitle || !learningLevel || enableFeedback === undefined) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        const lessonOutline = await getLessonOutlineByModuleAndLessonName(
            moduleName,
            lessonTitle
        );

        const subTopics = lessonOutline.sub_lessons.reduce((acc, subtopic) => {
            return acc + `${subtopic.topic}:\n${subtopic.description}\n\n`;
        }, "");

        // Get all lab sheets for the learner
        const existingLabSheets =
            await getLearningMaterialDetailsByLearnerIdAndLessonId(
                lessonOutline.id,
                learnerId
            );

        // Check if lab sheet already exists for the learning level
        const labWithSameLearningLevel = existingLabSheets.find(
            (labSheet) => labSheet.learningLevel === learningLevel
        );

        // If lab sheet already exists for the learning level, return conflict
        if (labWithSameLearningLevel) {
            return res.status(StatusCodes.CONFLICT).json({
                message: "Lab sheet already exists for this learning level",
            });
        }

        labMaterials = await createLabMaterials(
            lessonOutline.id,
            learnerId,
            learningLevel,
            enableFeedback
        );

        const practicalLabData = await responseSynthesizerForLabs({
            learningLevel: learningLevel,
            lessonTitle: lessonTitle,
            lessonOutline: subTopics,
            learningOutcomes: lessonOutline.lesson_learning_outcomes,
        });


        if (!labMaterials) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to generate lab sheet",
            });
        }

        const updatedLabMaterials = await updateLabMaterial(
            labMaterials.id,
            practicalLabData.realWorldScenario,
            JSON.stringify(practicalLabData.supportingMaterial),
            practicalLabData.questions
        );

        return res.status(StatusCodes.CREATED).json(updatedLabMaterials);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        if (labMaterials) {
            await deleteLabSheetById(labMaterials.id);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to generate lab sheet",
                error: error,
            });
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Internal server error",
        });
    }
}


// MARK: Get Lab Materials By Id
/**
 *
 * @param req
 * @param res
 */
export async function getLabSheetByIdHandler(req: Request, res: Response) {
    let labSheet = null;
    try {
        const { labSheetId } = req.params;
        const { id: learnerId } = res.locals.user;

        if (!labSheetId || !learnerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        labSheet = await getLabSheetByLabSheetIdAndLearnerId(
            labSheetId,
            learnerId
        );

        if (!labSheet) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Lab sheet not found",
            });
        }

        return res.status(StatusCodes.OK).send(labSheet);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to get lab sheet",
        });
    }
}

// MARK: Get Learning Material Summary By Lesson Name
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function getLearningMaterialSummaryByLessonNameHandler(
    req: Request,
    res: Response
) {
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
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Module not found",
            });
        }

        const lesson = await getLessonByModuleIdAndTitle(
            module.id,
            formattedLessonName
        );

        if (!lesson) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Lesson not found",
            });
        }

        const labSheet = await getLearningMaterialDetailsByLearnerIdAndLessonId(
            lesson.id,
            learnerId
        );

        if (!labSheet) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Lab sheet not found",
            });
        }

        const allLearningLevels: ("beginner" | "intermediate" | "advanced")[] = [
            "beginner",
            "intermediate",
            "advanced",
        ];

        const generatedLabSheetLearningLevel = labSheet.map((lab) => lab.learningLevel);

        const remainingLevels = allLearningLevels.filter(
            (level) => !generatedLabSheetLearningLevel.includes(level)
        );

        res.status(StatusCodes.OK).send({
            remainingLevels,
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

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to get learning material",
        });
    }
}


// MARK: Evaluate Student Answers
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function evaluateStudentAnswersHandler(
    req: Request,
    res: Response
) {
    try {
        const { studentsAnswer, labSheetId, questionsId } = req.body;
        const { id: learnerId } = res.locals.user;

        if (!labSheetId || !studentsAnswer || !questionsId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        const labSheet = await getLabSheetByLabSheetIdAndLearnerId(
            labSheetId,
            learnerId
        );
        const lesson = await getLessonDetailsByLabSheetId(labSheetId);

        if (!lesson) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Lesson not found",
            });
        }

        if (!labSheet) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Lab sheet not found",
            });
        }

        const questionObject = labSheet.labsheet_question.find(
            (question) => question.id === questionsId
        );

        if (!questionObject) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Question not found",
            });
        }

        // Get questions and answers prior to this question
        const previousQuestionsAndAnswers = labSheet.labsheet_question.filter(
            (question) => question.question_number < questionObject.question_number
        ).map((question) => {
            return {
                question: question.question,
                answer: question.answer
            };
        });

        // Get is_correct value for current question from labsheet_question
        const isCorrect = questionObject.is_correct;

        let results = null;

        if (studentsAnswer !== null && studentsAnswer !== undefined && studentsAnswer.length > 0) {
            results = await evaluateStudentAnswers({
                question: questionObject.question,
                studentAnswer: studentsAnswer,
                previousQuestionsAndAnswers: previousQuestionsAndAnswers,
                topicOfTheLab: lesson.title,
                realWorldScenario: labSheet.real_world_scenario!,
                supportingMaterial: labSheet.supportMaterial,
            });
        }

        await updateLabSheetAnswersByLearnerIdAndLabSheetId(
            learnerId,
            labSheetId,
            questionsId,
            studentsAnswer,
            results === null ? isCorrect : results.studentAnswerEvaluation.isCorrect
        );

        return res.status(StatusCodes.OK).json(results);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to evaluate student answers",
        });
    }
}


// MARK: Generate Hint For Question
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function generateHintForQuestionHandler(
    req: Request,
    res: Response
) {
    try {
        const { labSheetId, questionNumber } = req.params;
        const { id: learnerId } = res.locals.user;

        if (!labSheetId || !questionNumber) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        if (isNaN(Number(questionNumber))) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid question id",
            });
        }

        const studentAnswers =
            await getStudentAnswersByLabSheetIdAndQuestionNumberANDLearnerId(
                labSheetId,
                Number(questionNumber)
            );
        const labSheet = await getLabSheetByLabSheetIdAndLearnerId(
            labSheetId,
            learnerId
        );

        if (!studentAnswers || !labSheet) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Student answers not found",
            });
        }

        if (
            studentAnswers.student_answers &&
            studentAnswers.student_answers.length === 0
        ) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Student answers not found",
            });
        }

        const question = labSheet.labsheet_question.filter(
            (question) => question.question_number === Number(questionNumber)
        );

        if (question.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Question not found",
            });
        }

        const hint = await generateHintsForStudentAnswers({
            previousAnswers: studentAnswers.student_answers?.map(
                (answer) => answer.student_answer!
            )!,
            realWorldScenario: labSheet.real_world_scenario!,
            supportingMaterial: labSheet.supportMaterial,
            question: labSheet.labsheet_question.find(
                (question) => question.question_number === Number(questionNumber)
            )!.question,
        });

        await updateHintCountByLabSheetIdAndQuestionId(labSheetId, question[0].id);

        return res.status(StatusCodes.OK).json({ ...hint });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to generate hint",
        });
    }
}


// MARK: Delete Lab Sheet By Id
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
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        await deleteLabSheetById(labSheetId);

        return res.status(StatusCodes.NO_CONTENT).json({
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

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to delete lab sheet",
        });
    }
}


// MARK: Update Lab Sheet Question Answer Submission Status
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function updateLabSheetQuestionAnswerSubmissionStatusHandler(
    req: Request,
    res: Response
) {
    try {
        const { questionId, reflection } = req.body;
        const { labSheetId } = req.params;
        const { learnerId } = res.locals.user;

        if (!labSheetId || !questionId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        const submissionStatus =
            await updateLabSheetQuestionAnswerSubmissionStatusByLearnerIdAndLabSheetId(
                learnerId,
                labSheetId,
                questionId,
                reflection
            );

        return res.status(StatusCodes.OK).json({
            message: "Lab sheet question answer submission status updated",
            submission_status: submissionStatus.labsheet_question,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to update lab sheet question answer submission status",
        });
    }
}


// MARK: Update Lab Sheet Status As Completed
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function updateLabSheetStatusAsCompletedHandler(
    req: Request,
    res: Response
) {
    const { questionId, reflection } = req.body;
    const { labSheetId } = req.params;
    const { id: learnerId } = res.locals.user;

    try {
        if (!labSheetId) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        await updateLabSheetStatusAsCompletedByLearnerIdAndLabSheetId(
            learnerId,
            labSheetId,
            questionId,
            reflection
        );

        const labSheet = await getLabSheetByLabSheetIdAndLearnerId(labSheetId, learnerId);

        const lesson = await getLessonDetailsByLabSheetId(labSheetId);

        const isFeedbackEnabled = labSheet.is_feedback_enabled;

        let feedback = null;

        if (isFeedbackEnabled === true) {

            feedback = await generateFeedbackForLabActivity(
                {
                    topicOfTheLab: lesson.title,
                    realWorldScenario: labSheet.real_world_scenario!,
                    supportingMaterial: labSheet.supportMaterial,
                    questions: labSheet.labsheet_question.map((question) => {
                        return {
                            question: question.question,
                            studentAnswer: question.student_answers.map((answer) => answer.student_answer!),
                            reflection: question.reflection_on_answer!,
                        }
                    }),
                },
            );
        }

        // Update lab sheet feedback
        await updateLabSheetFeedbackByLabSheetId(
            labSheetId,
            {
                areasForImprovement: isFeedbackEnabled && feedback?.areasForImprovement ? JSON.stringify(feedback.areasForImprovement) : null,
                overallScore: isFeedbackEnabled && feedback?.overallScore ? feedback.overallScore : null,
                recommendations: isFeedbackEnabled && feedback?.recommendations ? JSON.stringify(feedback.recommendations) : null,
                strengths: isFeedbackEnabled && feedback?.strengths ? JSON.stringify(feedback.strengths) : null,
            }
        );

        return res.status(StatusCodes.OK).json({
            message: "Lab sheet status updated",
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to update lab sheet status",
        });
    }
}
