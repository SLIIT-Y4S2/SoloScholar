import { logger } from "@azure/storage-blob";
import { Request, response, Response } from "express";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";

import { convertLessonOutlineToText, extractSearchingKeywordsForLecture, synthesizeDetailedLessonOutline } from "../services/lecture.service";

export const generateLectureHandler = async (req: Request, res: Response) => {
    try {
        const topic = "Query Processing and Optimization"

        //get the lesson outline for the given topic
        const lessonOutline = MODULE_OUTLINE_LESSON_ARRAY.find((lesson) => lesson.lessonTitle === topic)!;

        console.log("lesson outline",lessonOutline);

        //extract the keywords from the lesson outline
        const keywords = extractSearchingKeywordsForLecture(lessonOutline);

        console.log("keywords", keywords);

        //RETRIVE RELATED CONTEXT TO THE KEYWORDS FROM THE DATABASE

        const lessonOutlineAsAText: string = convertLessonOutlineToText(lessonOutline);

        console.log("lesson outline as text", lessonOutlineAsAText);

        const detailedLessonOutline = await synthesizeDetailedLessonOutline(
            keywords,
            lessonOutlineAsAText
        );

        console.log("detailed lesson outline", detailedLessonOutline);

        //generate a detailed lecture outline

        //generate the introductory lecture video

        //generate the lecture for each sub topics

        //generate the conclusion

        res.status(200).json({ message: "Lecture generated successfully", data: { detailedLessonOutline } });

    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ message });
        logger.error({ message });
    }
}