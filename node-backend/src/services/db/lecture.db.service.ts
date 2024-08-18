import { LectureQuestion } from "./../../types/lecture.types";
import { logger } from "./../../utils/logger.utils";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../../utils/prisma-client.util";
import { Prisma } from "@prisma/client";

/**
 * Create lecture without content
 *
 * @param
 */
export const createLecture = async (
  lessonId: number,
  learnerId: string,
  learning_level: string
): Promise<{
  id: string;
  lessonId: number;
  learnerId: string;
}> => {
  const lecture = await prisma.lecture.create({
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
    id: lecture.id,
    lessonId: lecture.learning_material.lesson_id,
    learnerId: lecture.learning_material.learner_id,
  };
};

export const saveLectureContenttoDB =  (
  lectureId: string,
  sub_lecture: { content: string; topic: string }[],
  assestment_questions: {
    question: string;
    answer: string;
    type: string;
    question_number: number;
    options: string[];
  }[]
) => {
  return  prisma.lecture.update({
    where: {
      id: lectureId,
    },
    data: {
      status: "generated",
      sub_lecture: {
        create: sub_lecture,
      },
      assessment_question: {
        create: assestment_questions.map((question) => {
          return {
            question: question.question,
            answer: question.answer,
            type: question.type,
            question_number: question.question_number,
            options: {
              create: question.options.map((option) => {
                return {
                  answer_option:option,
                };
              }),
            },
          };
        }),
      },
    },
  });
};
