import e, { Request, Response } from "express";
import {
  convertLessonOutlineToText,
  extractSearchingKeywordsFromLessonOutline,
  synthesizeDetailedLessonOutline,
  synthesizeShortAnswerQuestionsForSubtopic,
} from "../services/tutorial.rag.service";
import {
  createTutorial,
  updateTutorialQuestions,
  getTutorialByLearnerId,
  getTutorialById,
  saveTutorialAnswer,
} from "../services/db/tutorial.db.service";
import {
  getLessonOutlineByModuleAndLessonName,
  getModuleByName,
  getLessonByModuleIdAndTitle,
} from "../services/db/module.db.service";
import { logger } from "../utils/logger.utils";

export const generateTutorials = async (req: Request, res: Response) => {
  try {
    //MARK: pre-requisite
    // we need check if the student has already generated the tutorial for the lesson for the given learning rate
    // if the tutorial has already been generated return the tutorial to the student

    // MARK: STEP 1
    // get the lesson outline from the database

    const { moduleName, lessonTitle, learningLevel } = req.body;
    const { id: learner_id } = res.locals.user;

    if (!moduleName || !lessonTitle || !learningLevel) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }
    const lessonOutline = await getLessonOutlineByModuleAndLessonName(
      moduleName,
      lessonTitle
    );
    // create a tutorial for the student
    const tutorial = await createTutorial(
      lessonOutline.id,
      learner_id,
      learningLevel
    );

    // MARK: STEP 2
    // make the detailed lesson plan for the tutorial
    const searchingKeywords =
      extractSearchingKeywordsFromLessonOutline(lessonOutline);
    const lessonOutlineAsAText: string =
      convertLessonOutlineToText(lessonOutline);

    const detailedLessonOutline = await synthesizeDetailedLessonOutline(
      searchingKeywords,
      lessonOutlineAsAText
    );

    // MARK: STEP 3
    // loop through the detailed lesson plan and create questions for each subtopic
    const totalNumberOfQuestions = 15; // TEMPORARY
    const totalNumberOfQuestionsPerSubtopics = Math.floor(
      totalNumberOfQuestions / lessonOutline.lesson_subtopic.length
    );

    const learningOutcomes = lessonOutline.lesson_learning_outcome.map(
      (outcome) => outcome.outcome
    );

    const combined_cognitive_level =
      lessonOutline.lesson_learning_outcome.reduce((acc, outcome) => {
        return acc.concat(outcome.cognitive_level);
      }, [] as string[]);

    const questions = await Promise.all(
      detailedLessonOutline.map(async (subtopic) => {
        const subtopicQuestions =
          await synthesizeShortAnswerQuestionsForSubtopic(
            `${subtopic.subtopic} ${subtopic.description}`,
            subtopic.subtopic,
            subtopic.description,
            learningOutcomes,
            combined_cognitive_level,
            learningLevel, // "Beginner", "Intermediate", "Advanced"
            totalNumberOfQuestionsPerSubtopics
          );
        return subtopicQuestions;
      })
    ).then((result) => result.flat());

    const updatedTutorialWithQuestions = await updateTutorialQuestions(
      tutorial.id,
      questions
    );

    // MARK: STEP 4
    // save the tutorial to the database
    // change the status of the tutorial to generated
    // return the tutorial to the student
    res.status(200).json({
      message: "Tutorial generated successfully",
      data: {
        id: updatedTutorialWithQuestions.id,
        status: updatedTutorialWithQuestions.status,
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

export const getTutorials = async (req: Request, res: Response) => {
  try {
    const { id: learner_id } = res.locals.user;
    const { moduleName, lessonTitle } = req.query;

    if (
      !moduleName ||
      !lessonTitle ||
      typeof moduleName !== "string" ||
      typeof lessonTitle !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const module = await getModuleByName(moduleName);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    const lesson = await getLessonByModuleIdAndTitle(module.id, lessonTitle);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const tutorials = await getTutorialByLearnerId(
      learner_id,
      module.id,
      lesson.id
    );

    res.status(200).json({
      message: "Tutorials fetched successfully",
      data: tutorials,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

export const getTutorialByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;

    if (!tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const tutorial = await getTutorialById(tutorialId);

    res.status(200).json({
      message: "Tutorial fetched successfully",
      data: tutorial,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

export const saveTutorialAnswerHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;
    const { questionId, answer, next } = req.body;

    console.log(req.body);

    if (!tutorialId || !questionId || !answer || !next) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const result = await saveTutorialAnswer(
      tutorialId,
      questionId,
      answer,
      next
    );

    res.status(200).json({
      message: "Tutorial answer saved successfully",
      data: result,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};
