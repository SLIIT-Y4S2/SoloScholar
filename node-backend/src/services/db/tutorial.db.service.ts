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
      questions: {
        create: questions.map((q, index) => ({
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
      id: q.id,
      question: q.question,
      answer: q.answer,
      type: q.type,
      question_number: q.question_number,
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
export const getTutorialById = async (
  id: string
): Promise<{
  id: string;
  lessonId: number;
  learnerId: string;
  questions: {
    id: number;
    question: string;
    answer: string;
    type: string;
    question_number: number;
    options: string[];
  }[];
}> => {
  const tutorial = await prisma.tutorial.findFirst({
    where: { id },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
      learning_material: true,
    },
  });

  if (!tutorial) {
    throw new Error("Tutorial not found");
  }

  return {
    id: tutorial.id,
    lessonId: tutorial.learning_material.lesson_id,
    learnerId: tutorial.learning_material.learner_id,
    questions: tutorial.questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      type: q.type,
      question_number: q.question_number,
      options: q.options.map((o) => o.text),
    })),
  };
};

/**
 * Get all tutorials
 * @returns
 * @async
 * @function
 * @public
 */

export const getAllTutorials = async (): Promise<
  {
    id: string;
    lessonId: number;
    learnerId: string;
  }[]
> => {
  const tutorials = await prisma.tutorial.findMany({
    include: {
      learning_material: true,
    },
  });

  return tutorials.map((tutorial) => ({
    id: tutorial.id,
    lessonId: tutorial.learning_material.lesson_id,
    learnerId: tutorial.learning_material.learner_id,
  }));
};

/**
 * Get tutorials by learner id
 * @param learnerId
 * @returns
 * @async
 * @function
 * @public
 */

export const getTutorialByLearnerId = async (
  learnerId: string
): Promise<
  {
    id: string;
    create_at: Date;
    status: string;
    questions: {
      id: number;
      question: string;
      answer: string;
      type: string;
      question_number: number;
      options: string[];
    }[];
  }[]
> => {
  const tutorials = await prisma.tutorial.findMany({
    where: {
      learning_material: {
        learner_id: learnerId,
      },
    },
    include: {
      learning_material: true,
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
    questions: tutorial.questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      type: q.type,
      question_number: q.question_number,
      options: q.options.map((o) => o.text),
    })),
  }));
};

/**
 * Delete tutorial by id
 * @param id
 * @returns
 */
export const deleteTutorial = async (id: string): Promise<void> => {
  await prisma.$transaction([
    prisma.learning_material.delete({
      where: { id },
    }),
    prisma.tutorial_question_option.deleteMany({
      where: { tutorial_question: { tutorial_id: id } },
    }),
    prisma.tutorial_question.deleteMany({
      where: { tutorial_id: id },
    }),
    prisma.tutorial.delete({
      where: { id },
    }),
  ]);
};
