import { Request, Response } from "express";
import { responseSynthesizerForLabs } from "../services/lab.rag.service";
import { getLessonOutlineByModuleAndLessonName } from "../services/db/module.db.service";
import { createLabMaterials, updateLabMaterial, getLabSheetById } from "../services/db/lab.db.service";


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
