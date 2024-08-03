import { Request, Response } from "express";
import { responseSynthesizerForLabs } from "../services/lab.rag.service";
import { getLessonByModuleIdAndTitle, getLessonOutlineByModuleAndLessonName, getModuleByName } from "../services/db/module.db.service";
import { createLabMaterials, updateLabMaterial, getLabSheetById, getLearningMaterialDetailsByLearnerIdAndLessonId } from "../services/db/lab.db.service";


export async function generateLabMaterialsHandler(req: Request, res: Response) {
    try {
        const { moduleName, lessonTitle, learningLevel } = req.body;
        const { id: learnerId } = res.locals.user;

        if (!moduleName || !lessonTitle || !learningLevel) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }

        const lessonOutline = await getLessonOutlineByModuleAndLessonName(moduleName, lessonTitle);



        const subTopics = lessonOutline.lesson_subtopics.reduce((acc, subtopic) => {
            return acc + `${subtopic.topic}:\n${subtopic.description}\n\n`;
        }, '');

        const labMaterials = await createLabMaterials(lessonOutline!.id, learnerId, learningLevel);
        const practicalLabData = await responseSynthesizerForLabs(moduleName, lessonOutline.title, learningLevel, subTopics);
        const updateLabSheet = await updateLabMaterial(labMaterials.id, practicalLabData.realWorldScenario, JSON.stringify(practicalLabData.supportingMaterial), practicalLabData.questions);

        res.status(200).send(updateLabSheet);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            error.stack && console.error(error.stack);
        }

        if (error) {
            console.error(error);
        }

        res.status(500).send({
            message: "Failed to generate lab sheet",
        });
    }

}


export async function getLabSheetByIdHandler(req: Request, res: Response) {
    try {
        const { labSheetId } = req.params;
        const labSheet = await getLabSheetById(labSheetId);

        res.status(200).send(labSheet);
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


