import { TutorialQuestion } from "./../../types/tutorial.types";
import { logger } from "./../../utils/logger.utils";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../../utils/prisma-client.util";

/**
 * Create tutorial without questions
 *
 * @param
 */
export const createTutorial = async (
  lessonId: number,
  learnerId: string,
  learning_level: string
): Promise<{
  id: string;
  lessonId: number;
  learnerId: string;
}> => {
  const tutorial = await prisma.tutorial.create({
    data: {
      status: "generating",
      learning_material: {
        create: {
          lesson: {
            connect: {
              id: lessonId,
            },
          },
          learner: {
            connect: {
              id: learnerId,
            },
          },
          learning_level,
          completion_status: 0,
        },
      },
    },
    include: {
      learning_material: true,
    },
  });

  return {
    id: tutorial.id,
    lessonId: tutorial.learning_material.lesson_id,
    learnerId: tutorial.learning_material.learner_id,
  };
};

/**
 * Update tutorial
 * @param id
 * @param questions
 */
export const updateTutorialQuestions = async (
  id: string,
  questions: {
    subtopic_id: number;
    question: string;
    answer: string;
    type: string;
    options: string[];
  }[]
): Promise<{
  id: string;
  status: string;
  learning_material: {
    id: string;
    lesson_id: number;
    learner_id: string;
    learning_level: string;
    completion_status: Decimal;
  };
  questions: {
    id: number;
    question: string;
    answer: string;
    type: string;
    question_number: number;
    options: string[];
    subtopic_id: number;
  }[];
}> => {
  const tutorial = await prisma.tutorial.findFirst({
    where: { id },
  });

  if (!tutorial) {
    throw new Error("Tutorial not found");
  }

  const updatedTutorial = await prisma.tutorial.update({
    where: { id },
    data: {
      status: "generated",
      questions: {
        create: questions.map((q, index) => ({
          subtopic_id: q.subtopic_id,
          question: q.question,
          answer: q.answer,
          type: q.type,
          question_number: index + 1,
          options: {
            create: q.options.map((text) => ({ text })),
          },
        })),
      },
    },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
      learning_material: true,
    },
  });

  return {
    id: updatedTutorial.id,
    learning_material: updatedTutorial.learning_material,
    status: updatedTutorial.status,
    questions: updatedTutorial.questions.map((q) => ({
      ...q,
      options: q.options.map((o) => o.text),
    })),
  };
};

/**
 * Get tutorial by id
 * @param id
 * @returns
 * @throws
 * @async
 * @function
 * @public
 * /
 */
export const getTutorialById = async (id: string) => {
  const tutorial = await prisma.tutorial.findFirst({
    where: { id },
    include: {
      learning_material: true,
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!tutorial) {
    throw new Error("Tutorial not found");
  }

  return {
    ...tutorial,
    questions: tutorial.questions.map((q) => ({
      ...q,
      options: q.options.map((o) => o.text),
    })),
  };
};

/**
 * Get tutorials by learner id, module name, and lesson title
 * @param learnerId
 * @param moduleName
 * @param lessonTitle
 * @returns
 * @async
 * @function
 * @public
 */
export const getTutorialByLearnerId = async (
  learnerId: string,
  moduleId: number,
  lessonId: number
): Promise<
  {
    id: string;
    create_at: Date;
    status: string;
    learning_level: string;
  }[]
> => {
  const tutorials = await prisma.tutorial.findMany({
    where: {
      learning_material: {
        learner_id: learnerId,
        lesson: {
          id: lessonId,
          module: {
            id: moduleId,
          },
        },
      },
    },
    include: {
      learning_material: {
        include: {
          lesson: {
            include: {
              module: true,
            },
          },
        },
      },
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  return tutorials.map((tutorial) => ({
    id: tutorial.id,
    create_at: tutorial.learning_material.create_at,
    status: tutorial.status,
    learning_level: tutorial.learning_material.learning_level,
  }));
};

/**
 * Delete tutorial by id
 * @param id
 * @returns
 */
export const deleteTutorial = async (id: string): Promise<void> => {
  await prisma.$transaction([
    prisma.tutorial_question_option.deleteMany({
      where: { tutorial_question: { tutorial_id: id } },
    }),
    prisma.tutorial_question.deleteMany({
      where: { tutorial_id: id },
    }),
    prisma.tutorial.delete({
      where: { id },
    }),
    prisma.learning_material.delete({
      where: { id },
    }),
  ]);
};

/**
 * Save the tutorial answer
 * update the status of the tutorial to in-progress
 * return the updated tutorial question and the current question number
 * @param tutorialId
 * @param questionId
 * @param answer
 * @returns
 */

export const saveTutorialAnswer = async (
  tutorialId: string,
  questionId: number,
  answer: string | undefined,
  nextQuestionNumber: number,
  isSubmission: boolean = false
): Promise<{
  id: number;
  current_question: number;
  status: string;
}> => {
  const tutorial = await prisma.tutorial.update({
    where: {
      id: tutorialId,
    },
    data: {
      current_question: nextQuestionNumber,
      status: isSubmission ? "submitted" : "in-progress",
    },
  });

  if (!tutorial) {
    throw new Error("Tutorial not found");
  }

  if (answer == undefined) {
    return {
      id: questionId,
      current_question: tutorial.current_question,
      status: tutorial.status,
    };
  }

  const tutorialQuestion = await prisma.tutorial_question.update({
    where: {
      id: questionId,
    },
    data: {
      student_answer: {
        set: answer,
      },
    },
  });

  if (!tutorialQuestion) {
    throw new Error("Tutorial question not found");
  }

  if (!tutorialQuestion.student_answer) {
    throw new Error("Student answer not found");
  }

  return {
    id: tutorialQuestion.id,
    current_question: tutorial.current_question,
    status: tutorial.status,
  };
};

export const updateTutorialQuestionResult = async (
  questionId: number,
  is_student_answer_correct: boolean
): Promise<void> => {
  const tutorialQuestion = await prisma.tutorial_question.update({
    where: {
      id: questionId,
    },
    data: {
      is_student_answer_correct,
    },
  });
  if (!tutorialQuestion) {
    throw new Error("Tutorial question not found");
  }
};
