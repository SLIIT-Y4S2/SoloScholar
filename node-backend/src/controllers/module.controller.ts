import { Request, Response } from "express";
import {
  createModule,
  getModuleByName,
} from "../services/db/module.db.service";
import {
  convertLessonOutlineToText,
  extractSearchingKeywordsFromLessonOutline,
  synthesizeDetailedLessonOutline,
} from "../services/detailedOutline.rag.service";

import { InputModule, Lesson } from "../types/module.types";
import { logger } from "../utils/logger.utils";

export const createModuleHandler = async (
  req: Request<{}, {}, InputModule>,
  res: Response
) => {
  try {
    const moduleData = req.body;

    if (
      !moduleData ||
      !moduleData.name ||
      !moduleData.description ||
      !moduleData.lessons ||
      !moduleData.lessons.filter((lesson) => lesson.sub_lessons.length).length
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
      const lessonOutlineAsAText: string = convertLessonOutlineToText(
        moduleData.name,
        moduleData.description,
        lesson
      );
      const detailedLessonOutline = await synthesizeDetailedLessonOutline(
        searchingKeywords,
        lessonOutlineAsAText
      );
      return {
        ...lesson,
        sub_lessons: detailedLessonOutline,
      };
    });

    const detailedLessonOutlines = await Promise.all(detailedLessons);

    const createdModule = await createModule({
      ...moduleData,
      lessons: detailedLessonOutlines,
    });

    res.status(201).json({
      message: "Module created successfully",
      data: {
        module: createdModule,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json((error as Error).message);
  }
};

export const getModuleByNameHandler = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    const module = await getModuleByName(name);

    res.status(200).json({
      message: "Module found",
      data: {
        ...module,
      },
    });
  } catch (error) {
    res.status(500).json((error as Error).message);
    logger.error(error);
  }
};
