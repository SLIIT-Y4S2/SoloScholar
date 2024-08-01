import Prisma from "@prisma/client";
import prisma from "../../utils/prisma-client.util";
import { omit, remove } from "lodash";

interface LabSheetQuestion {
    question: string;
    answer: string;
    exampleQuestion: string;
    exampleAnswer: string
}

/**
 * 
 * @param lessonId 
 * @param learnerId 
 * @param learningLevel 
 * @returns 
 */
export async function createLabMaterials(lessonId: number, learnerId: string, learningLevel: string
): Promise<{
    id: string;
    lessonId: number;
    learnerId: string;
}> {
    const labSheet = await prisma.labsheet.create({
        data: {
            status: "GENERATING",
            learning_material: {
                create: {
                    lesson: {
                        connect: {
                            id: lessonId
                        },
                    },
                    learner: {
                        connect: {
                            id: learnerId
                        },
                    },
                    learning_level: learnerId,
                    completion_status: 0,
                },
            },
        },
        include: {
            learning_material: true,
        },
    });

    return {
        id: labSheet.id,
        lessonId: labSheet.learning_material.lesson_id,
        learnerId: labSheet.learning_material.learner_id,
    };
}


export async function updateLabMaterial(labSheetId: string, realWorldScenario: string, supportingMaterials: string, questions: LabSheetQuestion[]) {
    const updatedLabSheet = await prisma.labsheet.update({
        where: {
            id: labSheetId
        },
        data: {
            status: "GENERATED",
            labsheet_question: {
                createMany: {
                    data: questions.map((question, index) => {
                        return {
                            question: question.question,
                            answer: question.answer,
                            example_question: question.exampleQuestion,
                            example_answer: question.exampleAnswer,
                            question_number: index + 1,
                        };
                    }),
                }
            },
            real_world_scenario: realWorldScenario,
            support_material: supportingMaterials,
        }, include: {
            labsheet_question: true,
            learning_material: true,
        }
    });



    return omit({
        ...updatedLabSheet,
        ...updatedLabSheet.learning_material,
        supportMaterial: JSON.parse(updatedLabSheet.support_material!),
    }, ["support_material", "learning_material"]);

}

export async function getLabSheetById(labSheetId: string) {
    const labSheet = await prisma.labsheet.findUnique({
        where: {
            id: labSheetId
        },
        include: {
            labsheet_question: true,
            learning_material: true,
        }
    });

    if (!labSheet) throw new Error("Lab sheet not found");

    return omit({
        ...labSheet,
        ...labSheet.learning_material,
        supportMaterial: JSON.parse(labSheet.support_material!),
    }, ["support_material", "learning_material"]);
}