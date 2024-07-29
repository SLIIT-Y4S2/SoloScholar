import { Request, Response } from "express";
import {
  synthesizeQuestionsForSubtopic,
  markStudentAnswerCorrectOrIncorrect,
} from "../services/tutorial.rag.service";
import {
  createTutorial,
  updateTutorialQuestions,
  getTutorialByLearnerId,
  getTutorialById,
  saveTutorialAnswer,
  updateTutorialQuestionResult,
} from "../services/db/tutorial.db.service";
import {
  getLessonOutlineByModuleAndLessonName,
  getModuleByName,
  getLessonByModuleIdAndTitle,
} from "../services/db/module.db.service";
import { logger } from "../utils/logger.utils";
import { groupBy } from "lodash";
import prisma from "../utils/prisma-client.util";

export const generateTutorials = async (req: Request, res: Response) => {
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
      totalNumberOfQuestions / 2 / lessonOutline.lesson_subtopics.length
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
          subtopic.id,
          subtopic.topic,
          subtopic.description,
          learningOutcomes,
          combined_cognitive_level,
          learningLevel,
          totalNumberOfQuestionsPerSubtopics,
          "mcq"
        ),
        synthesizeQuestionsForSubtopic(
          `${subtopic.topic} ${subtopic.description}`,
          subtopic.id,
          subtopic.topic,
          subtopic.description,
          learningOutcomes,
          combined_cognitive_level,
          learningLevel,
          totalNumberOfQuestionsPerSubtopics,
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
    const { id: learner_id } = res.locals.user; //TODO: verify if the learner is the owner of the tutorial
    const { tutorialId } = req.params;

    if (!tutorialId) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const tutorial = await getTutorialById(tutorialId);

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
    const tutorial = await getTutorialById(tutorialId);

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
          const subtopic = await prisma.lesson_subtopic.findFirst({
            where: { id: parseInt(subtopic_id) },
            include: {
              lesson: {
                include: {
                  module: true,
                },
              },
            },
          });

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

    const updateTutorial = await getTutorialById(tutorialId);

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
