import { Tutorial } from "./../types/tutorial.types";
import { Request, Response } from "express";
import {
  synthesizeQuestionsForSubtopic,
  markStudentAnswerCorrectOrIncorrect,
  synthesizeFeedbackForQuestions,
} from "../services/tutorial.rag.service";
import {
  createTutorial,
  updateTutorialQuestions,
  getTutorialByLearnerId,
  getTutorialByIdWithQuestions,
  saveTutorialAnswer,
  updateTutorialQuestionResult,
  updateQuestionWithFeedback,
  updateTutorialStatus,
} from "../services/db/tutorial.db.service";
import {
  getLessonOutlineByModuleAndLessonName,
  getModuleByName,
  getLessonByModuleIdAndTitle,
  findSubtopicById,
} from "../services/db/module.db.service";
import { logger } from "../utils/logger.utils";
import { groupBy } from "lodash";

export const generateTutorialHandler = async (req: Request, res: Response) => {
  try {
    // MARK: pre-requisite
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

    // MARK: TODO - check if the tutorial has already been generated for the student
    // make only 3 attempts to generate the tutorial for the student
    // make sure the tutorial questions do not repeat for the same student

    // MARK: STEP 3
    // loop through the detailed lesson plan and create questions for each subtopic
    const totalNumberOfQuestions = 30; // TEMPORARY
    const totalNumberOfQuestionsPerSubtopics = Math.floor(
      totalNumberOfQuestions / lessonOutline.lesson_subtopics.length
    );

    const numberOfMCQQuestionsPerSubtopic = Math.floor(
      totalNumberOfQuestionsPerSubtopics / 3
    );

    const numberOfEssayQuestionsPerSubtopic = Math.floor(
      (totalNumberOfQuestionsPerSubtopics / 3) * 2
    );

    const learningOutcomes = lessonOutline.lesson_learning_outcomes.map(
      (outcome) => outcome.outcome
    );

    const combined_cognitive_level =
      lessonOutline.lesson_learning_outcomes.reduce((acc, outcome) => {
        return acc.concat(outcome.cognitive_levels);
      }, [] as string[]);

    const generateQuestionsForSubtopic = async (subtopic: {
      id: number;
      topic: string;
      description: string;
    }) => {
      const [mcqQuestions, essayQuestions] = await Promise.all([
        synthesizeQuestionsForSubtopic(
          `${subtopic.topic} ${subtopic.description}`,
          moduleName,
          lessonTitle,
          subtopic.id,
          subtopic.topic,
          subtopic.description,
          learningOutcomes,
          combined_cognitive_level,
          learningLevel,
          numberOfMCQQuestionsPerSubtopic,
          "mcq"
        ),
        synthesizeQuestionsForSubtopic(
          `${subtopic.topic} ${subtopic.description}`,
          moduleName,
          lessonTitle,
          subtopic.id,
          subtopic.topic,
          subtopic.description,
          learningOutcomes,
          combined_cognitive_level,
          learningLevel,
          numberOfEssayQuestionsPerSubtopic,
          "essay"
        ),
      ]);

      return { mcqQuestions, essayQuestions };
    };

    const results = await Promise.all(
      lessonOutline.lesson_subtopics.map(generateQuestionsForSubtopic)
    );

    const mcqQuestions = results.flatMap((result) => result.mcqQuestions);
    const essayQuestions = results.flatMap((result) => result.essayQuestions);

    const questions = [...mcqQuestions, ...essayQuestions];

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
        questions: questions,
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

export const getTutorialsByLearnerHandler = async (
  req: Request,
  res: Response
) => {
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
    const { id: learner_id } = res.locals.user; //TODO: verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;

    if (!tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const tutorial = await getTutorialByIdWithQuestions(tutorialId);

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

export const saveTutorialAnswerHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;
    const { questionId, answer, next } = req.body;

    if (!tutorialId || !questionId || !next) {
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

export const submitTutorialHandler = async (req: Request, res: Response) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;
    const { questionId, answer } = req.body;

    if (!tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }
    const submitted = await saveTutorialAnswer(
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

    //MARK: Questions getting marked correct or incorrect

    // get all the questions for the tutorial
    const tutorial = await getTutorialByIdWithQuestions(tutorialId);

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
      (question) => question.type === "essay"
    );

    const groupedEssayQuestions = groupBy(essayQuestions, "subtopic_id");

    await Promise.all(
      Object.entries(groupedEssayQuestions).map(
        async ([subtopic_id, questions]) => {
          const subtopic = await findSubtopicById(parseInt(subtopic_id));

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

    const updateTutorial = await getTutorialByIdWithQuestions(tutorialId);

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

export const requestFeedbackHandler = async (
  req: Request<{ tutorialId: string }, {}, { [key: number]: string }>,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user; // verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;
    const feedback = req.body;

    if (feedback === null || !tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const tutorial = await getTutorialByIdWithQuestions(tutorialId);
    //TODO: uncomment this
    // if (tutorial.status !== "submitted") {
    //   return res.status(400).json({
    //     message: "Tutorial not submitted",
    //   });
    // }

    await updateTutorialStatus(tutorialId, "feedback-generating");

    // get all the questions for the tutorial
    const noFeedbackQuestions = tutorial.questions;

    // need to group all the tutorials by subtopic

    const feedbackInput = noFeedbackQuestions.map((question) => {
      return {
        ...question,
        feedback_type: feedback[question.id],
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
      "subtopic_id"
    );

    // generate feedback for questions based on the student answer under each subtopic
    await Promise.all(
      Object.entries(groupedEssayQuestions).map(
        async ([subtopic_id, questions]) => {
          const subtopic = await findSubtopicById(parseInt(subtopic_id));

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
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

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

    const tutorial = await getTutorialByIdWithQuestions(tutorialId);

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
