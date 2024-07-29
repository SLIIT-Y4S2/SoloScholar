import { Request, Response } from "express";
import { createModule } from "../services/db/module.db.service";
import {
  convertLessonOutlineToText,
  extractSearchingKeywordsFromLessonOutline,
  synthesizeDetailedLessonOutline,
} from "../services/detailedOutline.rag.service";

import { InputModule, Lesson, LessonSubtopic } from "../types/module.types";

export const createModuleHandler = async (req: Request, res: Response) => {
  try {
    const moduleData: InputModule = req.body;

    if (
      !moduleData ||
      !moduleData.name ||
      !moduleData.description ||
      !moduleData.lessons
    ) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const lessons = moduleData.lessons;

    // MARK: STEP 2
    // make the detailed lesson plan for the tutorial
    const detailedLessons = lessons.map(async (lesson): Promise<Lesson> => {
      const searchingKeywords =
        extractSearchingKeywordsFromLessonOutline(lesson);
      const lessonOutlineAsAText: string = convertLessonOutlineToText(lesson);

      const detailedLessonOutline = await synthesizeDetailedLessonOutline(
        searchingKeywords,
        lessonOutlineAsAText
      );

      return {
        ...lesson,
        lesson_subtopics: detailedLessonOutline,
      };
    });

    const detailedLessonOutlines = await Promise.all(detailedLessons);

    const module = await createModule({
      ...moduleData,
      lessons: detailedLessonOutlines,
    });

    res.status(201).json({
      message: "Module created successfully",
      data: {
        module,
      },
    });
  } catch (error) {
    res.status(500).json((error as Error).message);

    console.error(error);
  }
};
