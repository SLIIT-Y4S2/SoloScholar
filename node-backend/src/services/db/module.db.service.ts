import prisma from "../../utils/prisma-client.util";

/**
 * Create module
 * @param module
 */
export const createModule = async (module: {
  name: string;
  description: string;
  lessons: {
    title: string;
    description: string;
    learning_outcomes: {
      cognitive_level: string[];
      outcome: string;
    }[];
    subtopics: string[];
  }[];
}) => {
  const createdModule = await prisma.module.create({
    data: {
      name: module.name,
      description: module.description,
      lesson: {
        create: module.lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          lesson_subtopic: {
            create: lesson.subtopics.map((subtopic) => ({
              text: subtopic,
            })),
          },
          lesson_learning_outcome: {
            create: lesson.learning_outcomes.map((outcome) => ({
              learning_outcome: {
                create: {
                  description: outcome.outcome,
                  learning_outcome_cognitive_level: {
                    create: outcome.cognitive_level.map((level) => ({
                      cognitive_level: {
                        connect: {
                          level: level,
                        },
                      },
                    })),
                  },
                },
              },
            })),
          },
        })),
      },
    },
    include: {
      lesson: {
        include: {
          lesson_subtopic: true,
          lesson_learning_outcome: {
            include: {
              learning_outcome: {
                include: {
                  learning_outcome_cognitive_level: {
                    include: {
                      cognitive_level: true,
                    },
                  },
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

    // 3. Delete learning_outcome_cognitive_levels
    await prisma.learning_outcome_cognitive_level.deleteMany({
      where: {
        learning_outcome_id: {
          in: learningOutcomeIds,
        },
      },
    });

    // 4. Delete learning_outcomes
    await prisma.learning_outcome.deleteMany({
      where: {
        id: {
          in: learningOutcomeIds,
        },
      },
    });

    // 5. Delete lesson_subtopics
    await prisma.lesson_subtopic.deleteMany({
      where: {
        lesson: {
          module_id: id,
        },
      },
    });

    // 6. Delete tutorials
    await prisma.tutorial.deleteMany({
      where: {
        lesson: {
          module_id: id,
        },
      },
    });

    // 7. Delete learning_materials
    await prisma.learning_material.deleteMany({
      where: {
        lesson: {
          module_id: id,
        },
      },
    });

    // 8. Delete lessons
    await prisma.lesson.deleteMany({
      where: {
        module_id: id,
      },
    });

    // 9. Finally, delete the module itself
    const deletedModule = await prisma.module.delete({
      where: { id },
      include: {
        lesson: true,
      },
    });

    return deletedModule;
  });

  return deletedModule;
};
