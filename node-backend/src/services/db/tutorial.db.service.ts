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
  // const lessonObject = await prisma.lesson.findFirst({
  //   where: { title: lesson },
  // });

  // if (!lessonObject) {
  //   throw new Error("Lesson not found");
  // }

  const createdTutorial = await prisma.tutorial.create({
    data: {
      learner: { connect: { id: learnerId } },
      lesson: { connect: { id: lessonId } },
      learning_material: {
        create: {
          lesson: { connect: { id: lessonId } },
        },
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
    },
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
    },
  });

  return {
    id: updatedTutorial.id,
    lessonId: updatedTutorial.lessonId,
    learnerId: updatedTutorial.learnerId,
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
    id: string;
    lessonId: number;
    learnerId: string;
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
