import { Request, Response } from "express";
import { logger } from "../../utils/logger.utils";
import { StatusCodes } from "http-status-codes";
import { TutorialGenerationSchema } from "../../models/tutorial.schema";
import {
  synthesizeFeedbackForQuestions,
  synthesizeQuestionsForSubtopic,
} from "../../services/tutorial.rag.service";
import {
  createTutorial,
  addQuestionsToTheTutorial,
  getTutorialByLearnerId,
  deleteTutorial,
  updateTutorialStatus,
  updateQuestionWithFeedback,
  getTutorialByIdWithQuestions,
} from "../../services/db/tutorial.db.service";
import {
  findSubtopicById,
  getLessonOutlineByModuleAndLessonName,
} from "../../services/db/module.db.service";
import { getHighestCognitiveLevel } from "../../utils/tutorial.util";
import { groupBy } from "lodash";

/**
 * Generate tutorial
 * @param req
 * @param res
 * @returns
 */

export const generateTutorialHandler = async (
  req: Request<{}, {}, TutorialGenerationSchema["body"]>,
  res: Response
) => {
  // const { moduleName, lessonTitle, learningLevel } = req.body;
  const { moduleName, lessonTitle, learningLevel } = req.body;
  const { id: learner_id } = res.locals.user;

  let createdTutorial: {
    id: string;
    lessonId: number;
    learnerId: string;
  } | null = null;

  try {
    // MARK: STEP 1
    // get the lesson outline from the database

    const lessonOutline = await getLessonOutlineByModuleAndLessonName(
      moduleName,
      lessonTitle
    );

    const existingTutorials = await getTutorialByLearnerId(
      learner_id,
      lessonOutline.module_id,
      lessonOutline.id
    );

    const tutorialForLearningLevel = existingTutorials.find(
      (tutorial) => tutorial.learning_level === learningLevel
    );

    // MARK: STEP 2
    // check if the student has already generated the tutorial for the lesson for the given learning rate
    if (tutorialForLearningLevel) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Only one tutorial can be generated per learning level",
      });
    }
    const combined_cognitive_level =
      lessonOutline.lesson_learning_outcomes.flatMap(
        (outcome) => outcome.cognitive_level
      );
    const highest_cognitive_level = getHighestCognitiveLevel(
      combined_cognitive_level
    );

    createdTutorial = await createTutorial(
      lessonOutline.id,
      learner_id,
      learningLevel
    );

    // MARK: STEP 3
    // loop through the detailed lesson plan and create questions for each subtopic
    const totalNumberOfQuestions = 30; // TEMPORARY
    const MCQRatio =
      learningLevel === "beginner"
        ? 0.5
        : learningLevel === "intermediate"
        ? 0.4
        : 0.3;

    const numberOfMCQQuestions = Math.floor(totalNumberOfQuestions * MCQRatio);

    const numberOfEssayQuestions =
      totalNumberOfQuestions - numberOfMCQQuestions;

    const numberOfMCQQuestionsPerSubLesson = Math.floor(
      numberOfMCQQuestions / lessonOutline.sub_lessons.length
    );

    const numberOfEssayQuestionsPerSubLesson = Math.floor(
      numberOfEssayQuestions / lessonOutline.sub_lessons.length
    );

    const learningOutcomes = lessonOutline.lesson_learning_outcomes.map(
      (outcome) => outcome.outcome
    );

    const generateQuestionsForSubtopic = async (subtopic: {
      id: number;
      topic: string;
      description: string;
    }) => {
      const [mcqQuestions, essayQuestions] = await Promise.all([
        synthesizeQuestionsForSubtopic(
          `${subtopic.topic} ${subtopic.description}`,
          moduleName,
          lessonOutline.title,
          lessonOutline.description,
          subtopic.id,
          subtopic.topic,
          subtopic.description,
          learningOutcomes,
          highest_cognitive_level,
          learningLevel,
          numberOfMCQQuestionsPerSubLesson,
          "mcq"
        ),
        synthesizeQuestionsForSubtopic(
          `${subtopic.topic} ${subtopic.description}`,
          moduleName,
          lessonOutline.title,
          lessonOutline.description,
          subtopic.id,
          subtopic.topic,
          subtopic.description,
          learningOutcomes,
          highest_cognitive_level,
          learningLevel,
          numberOfEssayQuestionsPerSubLesson,
          "short-answer"
        ),
      ]);

      return { mcqQuestions, essayQuestions };
    };

    const results = await Promise.all(
      lessonOutline.sub_lessons.map(generateQuestionsForSubtopic)
    );

    const mcqQuestions = results.flatMap((result) => result.mcqQuestions);
    const essayQuestions = results.flatMap((result) => result.essayQuestions);

    const questions = [...mcqQuestions, ...essayQuestions];

    // MARK: STEP 4
    // save the tutorial to the database
    // change the status of the tutorial to generated
    // return the tutorial to the student
    const updatedTutorialWithQuestions = await addQuestionsToTheTutorial(
      createdTutorial.id,
      questions.map((question, index) => ({
        ...question,
        question_number: index + 1,
      }))
    );

    res.status(StatusCodes.CREATED).json({
      message: "Tutorial generated successfully",
      data: {
        id: updatedTutorialWithQuestions.id,
        status: updatedTutorialWithQuestions.status,
        questions: questions,
      },
    });
  } catch (error) {
    if (createdTutorial) {
      try {
        await deleteTutorial(createdTutorial.id);
        logger.info(
          `Deleted tutorial with id ${createdTutorial.id} due to generation failure`
        );
      } catch (deleteError) {
        logger.error(
          `Failed to delete tutorial with id ${createdTutorial.id}: ${
            (deleteError as Error).message
          }`
        );
      }
    }

    const message = (error as Error).message;
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error });
    logger.error({ message });
    console.log(error);
  }
};

/**
 * Request feedback
 * @param req
 * @param res
 * @returns
 */

export const requestFeedbackHandler = async (
  req: Request<{ tutorialId: string }, {}, { [key: number]: string }>,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;
    const feedbackRequest = req.body;

    if (feedbackRequest === null || !tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const tutorial = await getTutorialByIdWithQuestions(tutorialId, learner_id);
    if (tutorial.status !== "submitted") {
      return res.status(400).json({
        message: "Tutorial not submitted",
      });
    }

    await updateTutorialStatus(tutorialId, "feedback-generating");

    // get all the questions for the tutorial
    const noFeedbackQuestions = tutorial.questions;

    // need to group all the tutorials by subtopic

    const feedbackInput = noFeedbackQuestions.map((question) => {
      return {
        ...question,
        feedback_type: feedbackRequest[question.id],
      };
    });

    //update questions with feedback skip
    await updateQuestionWithFeedback(
      feedbackInput
        .filter((question) => question.feedback_type === "skip")
        .map((question) => ({
          id: question.id,
          feedback_type: question.feedback_type,
        }))
    );

    const groupedEssayQuestions = groupBy(
      feedbackInput.filter((question) => question.feedback_type !== "skip"),
      "sub_lesson_id"
    );

    // generate feedback for questions based on the student answer under each subtopic
    await Promise.all(
      Object.entries(groupedEssayQuestions).map(
        async ([sub_lesson_id, questions]) => {
          const subtopic = await findSubtopicById(parseInt(sub_lesson_id));

          if (!subtopic) {
            throw new Error("Subtopic not found");
          }

          const result = await synthesizeFeedbackForQuestions(
            subtopic.lesson.title,
            subtopic.topic,
            subtopic.description,
            questions.map((question) => ({
              question: question.question,
              studentAnswer: question.student_answer ?? "No answer provided",
              correctAnswer: question.answer,
              isCorrect: question.is_student_answer_correct ?? false,
              feedbackType: question.feedback_type as "basic" | "detailed",
            }))
          );

          await updateQuestionWithFeedback(
            questions.map((question, index) => ({
              id: question.id,
              feedback: result[index],
              feedback_type: question.feedback_type,
            }))
          );
        }
      )
    );

    const updatedTutorial = await updateTutorialStatus(
      tutorialId,
      "feedback-generated",
      true
    );

    res.status(200).json({
      message: "Feedback requested successfully",
      data: { ...updatedTutorial },
    });
  } catch (error) {
    try {
      const { tutorialId } = req.params;
      await updateTutorialStatus(tutorialId, "submitted");
      logger.error(
        `Failed to update tutorial status to submitted after feedback request failure: ${
          (error as Error).message
        }`
      );
    } catch (error) {
      logger.error(
        `Failed to update tutorial status to submitted after feedback request failure: ${
          (error as Error).message
        }`
      );
    }
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};
