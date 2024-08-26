import { uniqBy } from "lodash";
import { CognitiveLevel, Module } from "../../types/module.types";
import prisma from "../../utils/prisma-client.util";

/**
 * Create module
 * @param module
 */
export const createModule = async (module: Module) => {
  // Step 1: Create or connect learning outcomes
  const uniqueOutcomes = uniqBy(
    module.lessons.flatMap((lesson) => lesson.lesson_learning_outcomes),
    (lo) => lo.outcome
  );
  await Promise.all(
    uniqueOutcomes.map(async ({ cognitive_level, outcome }) => {
      return await prisma.learning_outcome.upsert({
        where: { description: outcome },
        update: {},
        create: {
          description: outcome,
          cognitive_level: {
            connect: {
              level: cognitive_level,
            },
          },
        },
      });
    })
  );

  const createdModule = await prisma.module.create({
    data: {
      name: module.name,
      description: module.description,
      lessons: {
        create: module.lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          sub_lessons: {
            create: lesson.sub_lessons.map((subtopic) => ({
              topic: subtopic.topic,
              description: subtopic.description,
            })),
          },
          lesson_learning_outcomes: {
            create: lesson.lesson_learning_outcomes.map((outcome) => ({
              learning_outcome: {
                connect: {
                  description: outcome.outcome,
                },
              },
            })),
          },
        })),
      },
    },
    include: {
      lessons: {
        include: {
          sub_lessons: true,
          lesson_learning_outcomes: {
            include: {
              learning_outcome: {
                include: {
                  lesson_learning_outcome: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return createdModule;
};
/**
 *  Get lessonOutline by module name and lesson name
 * @param moduleName - module name
 * @param lessonTitle - lesson title
 * @returns lesson outline
 */

export const getLessonOutlineByModuleAndLessonName = async (
  moduleName: string,
  lessonTitle: string
) => {
  const module = await prisma.module.findFirst({
    where: { name: moduleName },
    include: {
      lessons: {
        where: { title: lessonTitle },
        include: {
          lesson_learning_outcomes: {
            include: {
              learning_outcome: {
                include: {
                  cognitive_level: true,
                },
              },
            },
          },
          sub_lessons: true,
        },
      },
    },
  });

  const lesson = module?.lessons[0];

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  return {
    ...lesson,
    lesson_learning_outcomes: lesson.lesson_learning_outcomes.map((lo) => ({
      outcome: lo.learning_outcome.description,
      cognitive_level: lo.learning_outcome.cognitive_level
        .level as CognitiveLevel,
    })),
  };
};

/**
 * Get module by name
 * @param moduleName
 * @returns module
 * @async
 * @function
 * @public
 */
export const getModuleByName = async (moduleName: string) => {
  const module = await prisma.module.findFirst({
    where: { name: moduleName },
    include: {
      lessons: {
        include: {
          //TODO: remove include
          sub_lessons: true,
          lesson_learning_outcomes: {
            include: {
              learning_outcome: {
                include: {
                  cognitive_level: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!module) {
    throw new Error("Module not found");
  }

  return {
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      lesson_learning_outcomes: lesson.lesson_learning_outcomes.map((lo) => ({
        outcome: lo.learning_outcome.description,
        cognitive_level: lo.learning_outcome.cognitive_level.level,
      })),
    })),
  };
};

/**
 *  Get lesson by module id and title
 * @param moduleId - module id
 * @param lessonTitle - lesson title
 * @returns lesson
 * @async
 * @function
 * @public
 */
export const getLessonByModuleIdAndTitle = async (
  moduleId: number,
  lessonTitle: string
) => {
  const lesson = await prisma.lesson.findFirst({
    where: {
      module_id: moduleId,
      title: lessonTitle,
    },
    include: {
      lesson_learning_outcomes: {
        include: {
          learning_outcome: {
            include: {
              cognitive_level: true,
            },
          },
        },
      },
    },
  });

  return lesson;
};
/**
 * delete module
 * @param id
 * @returns
 * @async
 * @function
 * @public
 */

export const deleteModule = async (id: number) => {
  const deletedModule = await prisma.$transaction(async (prisma) => {
    // 1. Find all learning outcome IDs related to this module
    const relatedLearningOutcomeIds =
      await prisma.lesson_learning_outcome.findMany({
        where: {
          lesson: {
            module_id: id,
          },
        },
        select: {
          learning_outcome_id: true,
        },
      });

    const learningOutcomeIds = relatedLearningOutcomeIds.map(
      (lo) => lo.learning_outcome_id
    );

    // 2. Delete lesson_learning_outcomes
    await prisma.lesson_learning_outcome.deleteMany({
      where: {
        lesson: {
          module_id: id,
        },
      },
    });

    // 3. Delete learning_outcomes
    await prisma.learning_outcome.deleteMany({
      where: {
        id: {
          in: learningOutcomeIds,
        },
      },
    });

    // 4. Delete lesson_subtopics
    await prisma.sub_lesson.deleteMany({
      where: {
        lesson: {
          module_id: id,
        },
      },
    });

    // 5. Delete tutorials
    await prisma.tutorial.deleteMany({
      where: {
        learning_material: {
          lesson: {
            module_id: id,
          },
        },
      },
    });

    // 6. Delete learning_materials
    await prisma.learning_material.deleteMany({
      where: {
        lesson: {
          module_id: id,
        },
      },
    });

    // 7. Delete lessons
    await prisma.lesson.deleteMany({
      where: {
        module_id: id,
      },
    });

    // 8. Finally, delete the module itself
    const deletedModule = await prisma.module.delete({
      where: { id },
      include: {
        lessons: true,
      },
    });

    return deletedModule;
  });

  return deletedModule;
};

// deleteModule(1);

/**
 * Find subtopic by id
 * @param id
 * @returns
 * @async
 */
export const findSubtopicById = async (sub_lesson_id: number) => {
  const subtopic = await prisma.sub_lesson.findFirst({
    where: { id: sub_lesson_id },
    include: {
      lesson: {
        include: {
          module: true,
        },
      },
    },
  });

  return subtopic;
};
