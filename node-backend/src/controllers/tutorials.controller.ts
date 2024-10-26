import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { groupBy } from "lodash";
import {
  GetTutorialByIdSchema,
  GetTutorialsByLearnerSchema,
} from "../models/tutorial.schema";
import { markStudentAnswerCorrectOrIncorrect } from "../services/tutorial.rag.service";
import {
  getTutorialByLearnerId,
  getTutorialByIdWithQuestions,
  saveTutorialAnswer,
  updateTutorialQuestionResult,
  updateTutorialStatus,
  updateQuestionHintViewedStatus,
} from "../services/db/tutorial.db.service";
import {
  getModuleByName,
  getLessonByModuleIdAndTitle,
  findSubtopicById,
} from "../services/db/module.db.service";

/**
 * Get tutorials by learner
 * @param req
 * @param res
 * @returns
 */

export const getTutorialsByLearnerHandler = async (
  req: Request<{}, {}, {}, GetTutorialsByLearnerSchema["query"]>,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user;
    const { moduleName, lessonTitle } = req.query;

    // TODO: might be better to use the module name and lesson title to get the tutorial in (getTutorialByLearnerId)
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

    const allLearningLevels: ("beginner" | "intermediate" | "advanced")[] = [
      "beginner",
      "intermediate",
      "advanced",
    ];
    // filter from generated tutorials
    const alreadyGenerated = tutorials.map(
      (tutorial) => tutorial.learning_level
    );
    const remaining = allLearningLevels.filter(
      (level) => !alreadyGenerated.includes(level)
    );

    const combined_cognitive_level = lesson.lesson_learning_outcomes.flatMap(
      (outcome) => outcome.learning_outcome.cognitive_level.level
    );

    res.status(200).json({
      message: "Tutorials fetched successfully",
      data: {
        tutorials,
        allowedLearningLevels: remaining,
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message: " Internal server error", error });
    logger.error({ message });
  }
};

/**
 * Get tutorial by id
 * @param req
 * @param res
 * @returns
 */

export const getTutorialByIdHandler = async (
  req: Request<GetTutorialByIdSchema["params"], {}, {}>,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user;
    const { tutorialId } = req.params;

    const tutorial = await getTutorialByIdWithQuestions(tutorialId, learner_id);

    const noAnswers =
      tutorial.status === "generated" || tutorial.status === "in-progress";

    res.status(200).json({
      message: "Tutorial fetched successfully",
      data: {
        ...tutorial,
        questions: tutorial.questions.map((q) => ({
          ...q,
          answer: noAnswers ? null : q.answer,
        })),
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

/**
 * Save tutorial answer
 * @param req
 * @param res
 * @returns
 */

export const saveTutorialAnswerHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user;
    const { tutorialId } = req.params;
    const { questionId, answer, next } = req.body;

    if (!tutorialId || !questionId || !next) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const result = await saveTutorialAnswer(
      learner_id,
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

/**
 * Submit tutorial
 * @param req
 * @param res
 * @returns
 */

export const submitTutorialHandler = async (req: Request, res: Response) => {
  try {
    const { id: learner_id } = res.locals.user;
    const { tutorialId } = req.params;
    const { questionId, answer } = req.body;

    if (!tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }
    const submitted = await saveTutorialAnswer(
      learner_id,
      tutorialId,
      questionId,
      answer,
      1,
      true
    );

    if (submitted.status !== "submitted") {
      return res.status(400).json({
        message: "Tutorial not submitted",
      });
    }

    // Questions getting marked correct or incorrect
    // get all the questions for the tutorial
    const tutorial = await getTutorialByIdWithQuestions(tutorialId, learner_id);

    // filter out the question with defined student answers
    const answeredQuestions = tutorial.questions.filter(
      (question) => question.student_answer
    );

    // filter out the essay type questions
    const mcqQuestions = answeredQuestions.filter(
      (question) => question.type === "mcq"
    );

    // if mcq type questions, check if the student is correct by comparing the student answer with the correct answer
    await Promise.all(
      mcqQuestions.map((question) => {
        updateTutorialQuestionResult(
          question.id,
          question.student_answer === question.answer
        );
      })
    );

    // check if the student is correct through llm for essay type questions
    const essayQuestions = answeredQuestions.filter(
      (question) => question.type === "short-answer"
    );

    const groupedEssayQuestions = groupBy(essayQuestions, "sub_lesson_id");

    await Promise.all(
      Object.entries(groupedEssayQuestions).map(
        async ([sub_lesson_id, questions]) => {
          const subtopic = await findSubtopicById(parseInt(sub_lesson_id));

          if (!subtopic) {
            throw new Error("Subtopic not found");
          }

          const result = await markStudentAnswerCorrectOrIncorrect(
            subtopic.lesson.title,
            subtopic.topic,
            subtopic.description,
            questions.map((question) => ({
              question: question.question,
              studentAnswer: question.student_answer!,
              correctAnswer: question.answer,
            }))
          );

          await Promise.all(
            questions.map((question, index) =>
              updateTutorialQuestionResult(question.id, result[index])
            )
          );
        }
      )
    );

    const updateTutorial = await getTutorialByIdWithQuestions(
      tutorialId,
      learner_id
    );

    res.status(200).json({
      message: "Tutorial submitted successfully",
      data: updateTutorial,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

/**
 * Mark tutorial as completed
 * @param req
 * @param res
 * @returns
 */

export const markTutorialAsCompletedHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;

    if (!tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const tutorial = await getTutorialByIdWithQuestions(tutorialId, learner_id);

    if (tutorial.status !== "feedback-generated") {
      return res.status(400).json({
        message: "Tutorial feedback not received",
      });
    }

    const updatedTutorial = await updateTutorialStatus(tutorialId, "completed");

    res.status(200).json({
      message: "Tutorial marked as completed",
      data: updatedTutorial,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

/**
 * Mark Hint for question as viewed
 * @param req
 * @param res
 * @returns
 */

export const markHintAsViewedHandler = async (req: Request, res: Response) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId, questionId } = req.params;

    if (!tutorialId || !questionId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const tutorial = await getTutorialByIdWithQuestions(tutorialId, learner_id);

    const question = tutorial.questions.find(
      (q) => q.id === parseInt(questionId)
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (question.is_hint_viewed) {
      return res.status(200).json({
        message: "Hint already viewed",
      });
    }

    await updateQuestionHintViewedStatus(parseInt(questionId));

    res.status(200).json({
      message: "Hint marked as viewed",
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};
