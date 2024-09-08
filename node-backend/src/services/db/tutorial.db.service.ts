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
export const addQuestionsToTheTutorial = async (
  id: string,
  questions: {
    sub_lesson_id: number;
    question: string;
    answer: string;
    type: "mcq" | "short-answer";
    question_number: number;
    options: string[];
    hint?: string;
  }[]
): Promise<{
  id: string;
  status: string;
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
        create: questions.map((q) => ({
          sub_lesson_id: q.sub_lesson_id,
          question: q.question,
          answer: q.answer,
          type: q.type,
          question_number: q.question_number,
          hint: q.hint,
          options: {
            create: q.options.map((answer_option) => ({ answer_option })),
          },
        })),
      },
    },
  });

  return {
    id: updatedTutorial.id,
    status: updatedTutorial.status,
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
export const getTutorialByIdWithQuestions = async (
  id: string,
  learner_id: string
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
    student_answer: string | null;
    is_student_answer_correct?: boolean;
    options: string[];
    sub_lesson_id: number;
  }[];
}> => {
  const tutorial = await prisma.tutorial.findFirst({
    where: { id, learning_material: { learner_id: learner_id } },
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
      options: q.options.map((o) => o.answer_option),
    })),
  };
};

export const getTutorialById = async (id: string) => {
  const tutorial = await prisma.tutorial.findFirst({
    where: { id },
  });

  if (!tutorial) {
    throw new Error("Tutorial not found");
  }

  return tutorial;
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
    created_at: Date;
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
    created_at: tutorial.learning_material.created_at,
    status: tutorial.status,
    learning_level: tutorial.learning_material.learning_level,
  }));
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
  learnerId: string,
  tutorialId: string,
  questionId: number,
  answer: string | null,
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
      learning_material: { learner_id: learnerId },
    },
    data: {
      current_question: nextQuestionNumber,
      status: isSubmission ? "submitted" : "in-progress",
    },
  });

  if (!tutorial) {
    throw new Error("Tutorial not found");
  }

  // if (answer == undefined) {
  //   return {
  //     id: questionId,
  //     current_question: tutorial.current_question,
  //     status: tutorial.status,
  //   };
  // }

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

  // if (!tutorialQuestion.student_answer) {
  //   throw new Error("Student answer not found");
  // }

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

export const updateQuestionWithFeedback = async (
  feedback: {
    id: number;
    feedback?: string;
    feedback_type: string;
  }[]
): Promise<void> => {
  const updatePromises = feedback.map(async (feedbackItem) => {
    const tutorialQuestion = await prisma.tutorial_question.update({
      where: {
        id: feedbackItem.id,
      },
      data: {
        feedback_type: feedbackItem.feedback_type,
        feedback: feedbackItem.feedback,
      },
    });

    if (!tutorialQuestion) {
      throw new Error("Tutorial question not found");
    }
  });
  try {
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating tutorial questions:", error);
    throw new Error("Failed to update tutorial questions");
  }
};

/**
 * Mark tutorial as completed
 * @param tutorialId
 * @param status
 * @param includeQuestions
 * @returns
 * @returns {Promise<void>}
 */

export const updateTutorialStatus = async (
  tutorialId: string,
  status: string,
  includeQuestions: boolean = false
) => {
  if (!includeQuestions) {
    const tutorial = await prisma.tutorial.update({
      where: {
        id: tutorialId,
      },
      data: {
        status,
      },
      include: {
        learning_material: true,
      },
    });

    if (!tutorial) {
      throw new Error("Tutorial not found");
    }

    return tutorial;
  }

  const tutorial = await prisma.tutorial.update({
    where: {
      id: tutorialId,
    },
    data: {
      status,
    },
    include: {
      learning_material: true,
      ...{
        questions: {
          include: {
            options: true,
          },
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
      options: q.options.map((o) => o.answer_option),
    })),
  };
};

/**
 * Delete tutorial by id
 * @param id
 * @returns
 */
export const deleteTutorial = async (id: string): Promise<void> => {
  await prisma.$transaction([
    prisma.mcq_tutorial_question_option.deleteMany({
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
// deleteTutorial("cm0s39piz00058fbtodkpofnz");
