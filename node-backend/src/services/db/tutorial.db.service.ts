import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Create tutorial
 *
 * @param
 */
export const createTutorial = async (
  lesson: string,
  learnerId: number,
  learning_level: string,
  questions: {
    question: string;
    answer: string;
    type: string;
    options: string[];
  }[]
): Promise<{
  id: string;
  lessonId: number;
  learnerId: number;
  questions: {
    id: number;
    question: string;
    answer: string;
    type: string;
    question_number: number;
    options: string[];
  }[];
}> => {
  const lessonObject = await prisma.lesson.findFirst({
    where: { title: lesson },
  });

  if (!lessonObject) {
    throw new Error("Lesson not found");
  }

  const createdTutorial = await prisma.tutorial.create({
    data: {
      learner: { connect: { id: learnerId } },
      lesson: { connect: { id: lessonObject.id } },
      learning_material: {
        create: {
          lesson: { connect: { id: lessonObject.id } },
        },
      },
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
      status: "generating",
      learning_level,
    },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  return {
    id: createdTutorial.id,
    lessonId: createdTutorial.lessonId,
    learnerId: createdTutorial.learnerId,
    questions: createdTutorial.questions.map((q) => ({
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
  id: number;
  lessonId: number;
  learnerId: number;
  questions: {
    id: string;
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
    },
  });

  if (!tutorial) {
    throw new Error("Tutorial not found");
  }

  return {
    id: tutorial.id,
    lessonId: tutorial.lessonId,
    learnerId: tutorial.learnerId,
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
    id: number;
    lessonId: number;
    learnerId: number;
  }[]
> => {
  const tutorials = await prisma.tutorial.findMany();

  return tutorials.map((tutorial) => ({
    id: tutorial.id,
    lessonId: tutorial.lessonId,
    learnerId: tutorial.learnerId,
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

/**
 * Delete tutorial by id
 * @param id
 * @returns
 */
export const deleteTutorial = async (id: string): Promise<void> => {
  await prisma.$transaction([
    prisma.tutorial_question_option.deleteMany({
      where: { tutorial_question: { tutorialId: id } },
    }),
    prisma.tutorial_question.deleteMany({
      where: { tutorialId: id },
    }),
    prisma.tutorial.delete({
      where: { id },
    }),
  ]);
};

// export const testPrisma = async () => {
//   // just a test learner creation
//   const learner = await prisma.learner.create({
//     data: {
//       first_name: "John",
//       last_name: "Doe",
//       email: "john.doe@example.com",
//       password: "password123",
//     },
//   });

//   const module = await prisma.module.create({
//     data: {
//       name: "Module 1",
//       description: "This is module 1",
//     },
//   });
//   const lesson = await prisma.lesson.create({
//     data: {
//       title: "Lesson 1",
//       description: "This is lesson 1",
//       module: {
//         connect: {
//           id: module.id,
//         },
//       },
//     },
//   });

//   const learningMaterial = await prisma.learning_material.create({
//     data: {
//       lesson: {
//         connect: {
//           id: lesson.id,
//         },
//       },
//     },
//   });

//   // const turoawait prisma.tutorial_question.create({
//   //   data: {
//   //     answer: "answer",
//   //     question: "question",
//   //   },
//   // });

//   // just a test tutorial creation
//   // await prisma.tutorial.create({
//   //   data: {
//   //     questions: {
//   //       create: [
//   //         {
//   //           question: "question 1",
//   //           answer: "answer 1",
//   //           type: "MCQ",
//   //           question_number: 1,
//   //         },
//   //         {
//   //           question: "question 2",
//   //           answer: "answer 2",
//   //         },
//   //       ],
//   //     },
//   //     learner: {
//   //       connect: {
//   //         id: learner.id,
//   //       },
//   //     },
//   //     lesson: {
//   //       connect: {
//   //         id: lesson.id,
//   //       },
//   //     },
//   //     learning_material: {
//   //       create: {
//   //         lesson: {
//   //           connect: {
//   //             id: lesson.id,
//   //           },
//   //         },
//   //       },
//   //     },
//   //   },
//   // });
// };
