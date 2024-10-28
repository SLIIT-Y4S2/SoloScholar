import e from "express";
import prisma from "../../utils/prisma-client.util";
import { omit, pick } from "lodash";

interface LabSheetQuestion {
    question: string;
    answer: string;
}

interface Feedback {
    overallScore: number;
    areasForImprovement: string;
    recommendations: string;
    strengths: string;
}

//MARK: Create a new lab sheet
/**
 * 
 * @param lessonId 
 * @param learnerId 
 * @param learningLevel 
 * @returns 
 */
export async function createLabMaterials(lessonId: number, learnerId: string, learningLevel: string, enableFeedback: boolean
): Promise<{
    id: string;
    lessonId: number;
    learnerId: string;
}> {
    const labSheet = await prisma.labsheet.create({
        data: {
            status: "GENERATING",
            is_feedback_enabled: enableFeedback,
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
                    learning_level: learningLevel,
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


// MARK: Get all lab sheets
/**
 * 
 * @param labSheetId 
 * @param realWorldScenario 
 * @param supportingMaterials 
 * @param questions 
 * @returns 
 */
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
                            question_number: index + 1,
                            is_answer_submitted: false,
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


// MARK: Get all lab sheets by learner id
/**
 * 
 * @param labSheetId 
 * @returns 
 */
export async function getLabSheetByLabSheetIdAndLearnerId(labSheetId: string, learnerId: string) {
    const labSheet = await prisma.labsheet.findUnique({
        where: {
            id: labSheetId, AND: {
                learning_material: {
                    learner_id: learnerId
                }
            }
        },
        include: {
            labsheet_question: {
                include: {
                    student_answers: true,
                }
            },
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


// MARK: Get all lab sheets by learner id and lesson id
/**
 * 
 * @param lessonId Id of the lesson
 * @param learnerId Id of the learner
 * @returns
 */
export async function getLearningMaterialDetailsByLearnerIdAndLessonId(lessonId: number, learnerId: string) {
    const labsSheets = await prisma.labsheet.findMany({
        where: {
            learning_material: {
                lesson: {
                    id: lessonId,
                },
                learner: {
                    id: learnerId,
                }
            },
        },
        include: {
            labsheet_question: true,
            learning_material: true,
        },
    })

    return labsSheets.map(labSheet => omit({
        createdAt: labSheet.learning_material.created_at,
        learningLevel: labSheet.learning_material.learning_level,
        status: labSheet.status,
        id: labSheet.id,
    }, ["support_material", "learning_material"]));
}


// MARK: Update lab sheet answers by learner id and lab sheet id
/**
 * 
 * @param labSheetId 
 * @param questionId 
 * @param answer 
 * @returns 
 */
export async function updateLabSheetAnswersByLearnerIdAndLabSheetId(learnerId: string, labSheetId: string, questionId: number, answer: string | null, isCorrect: boolean | null) {
    const updatedLabSheet = await prisma.labsheet.update(
        {
            where: {
                id: labSheetId, AND: {
                    learning_material: {
                        learner_id: learnerId
                    }
                }
            },
            data: {
                status: "IN_PROGRESS",
                labsheet_question: {
                    update: {
                        where: {
                            id: questionId
                        },
                        data: {
                            is_correct: isCorrect,
                            student_answers: {
                                create: {
                                    student_answer: answer
                                }
                            }
                        }
                    }
                }
            },
            include: {
                learning_material: true,
                labsheet_question: true,
            }
        }
    );

    return omit({
        ...updatedLabSheet,
        ...updatedLabSheet.learning_material,
        supportMaterial: JSON.parse(updatedLabSheet.support_material!),
    }, ["support_material", "learning_material"]);
}


// MARK: Update Lab Sheet Question Answer Submission Status By Learner Id And Lab Sheet Id
/**
 * 
 * @param labSheetId 
 * @param questionId 
 * @returns 
 */
export async function updateLabSheetQuestionAnswerSubmissionStatusByLearnerIdAndLabSheetId(learnerId: string, labSheetId: string, questionId: number, reflection: string | null) {
    const updatedLabSheetQuestionAnswerSubmissionStatus = await prisma.labsheet.update({
        where: {
            id: labSheetId, AND: {
                learning_material: {
                    learner_id: learnerId
                }
            }
        },
        data: {
            current_question_index: {
                increment: 1
            },
            labsheet_question: {
                update: {
                    where: {
                        id: questionId
                    },
                    data: {
                        reflection_on_answer: reflection,
                        is_answer_submitted: true,
                    }
                }
            }
        }, include: {
            labsheet_question: {
                select: {
                    is_answer_submitted: true
                }
            }
        }
    })

    return pick(updatedLabSheetQuestionAnswerSubmissionStatus, ["labsheet_question"]);
}

// MARK: Update hint count by lab sheet id and question id
/**
 * 
 * @param labSheetId 
 * @param questionNumber 
 * @returns 
 */
export async function updateHintCountByLabSheetIdAndQuestionId(labSheetId: string, questionId: number) {
    const updatedLabSheet = await prisma.labsheet_question.update({
        where: {
            id: questionId,
            labsheet_id: labSheetId
        },
        data: {
            hint_views: {
                increment: 1
            }
        }
    });

    return updatedLabSheet;
}


// MARK: Update Lab Sheet Status As Completed By Learner Id And Lab Sheet Id
/**
 * 
 * @param learnerId 
 * @param labSheetId 
 * @param questionId 
 * @param reflection 
 * @returns 
 */
export async function updateLabSheetStatusAsCompletedByLearnerIdAndLabSheetId(learnerId: string, labSheetId: string, questionId: number, reflection: string | null) {
    const updatedLabSheet = await prisma.labsheet.update({
        where: {
            id: labSheetId,
            AND: {
                learning_material: {
                    learner_id: learnerId
                }
            }
        },
        data: {
            status: "COMPLETED",
            labsheet_question: {
                update: {
                    where: {
                        id: questionId
                    },
                    data: {
                        reflection_on_answer: reflection,
                        is_answer_submitted: true,
                    }
                }
            }
        }, include: {
            labsheet_question: {
                select: {
                    is_answer_submitted: true
                }
            }
        }
    });

    return updatedLabSheet;
}

// MARK: Get all lab sheets by learner id and lesson id
/**
 * 
 * @param labSheetId 
 * @returns 
 */
export async function getLessonDetailsByLabSheetId(labSheetId: string) {
    const labSheet = await prisma.labsheet.findUnique({
        where: {
            id: labSheetId
        },
        include: {
            learning_material: {
                include: {
                    lesson: true,
                }
            }
        }
    });

    if (!labSheet) throw new Error("Lab sheet not found");

    return omit({
        ...labSheet,
        ...labSheet.learning_material.lesson,
    }, ["learning_material"]);
}


// MARK: Delete lab sheet by id
/**
 * 
 * @param labSheetId 
 */
export async function deleteLabSheetById(labSheetId: string) {
    await prisma.$transaction([
        // Delete related student answers
        prisma.student_answer.deleteMany({
            where: {
                labsheet_question: {
                    labsheet_id: labSheetId
                }
            }
        }),
        // Delete lab sheet questions
        prisma.labsheet_question.deleteMany({
            where: {
                labsheet_id: labSheetId
            }
        }),
        // Delete the lab sheet itself
        prisma.labsheet.delete({
            where: {
                id: labSheetId
            }
        })
    ]);
}

// MARK: Get student answers by lab sheet id and question number and learner id
/**
 * 
 * @param labSheetId 
 * @param questionId 
 * @returns 
 */
export async function getStudentAnswersByLabSheetIdAndQuestionNumberANDLearnerId(labSheetId: string, question_number: number) {
    const studentAnswers = await prisma.labsheet_question.findFirst({
        where: {
            labsheet_id: labSheetId, AND: {
                question_number: question_number,
                labsheet: {
                    learning_material: {
                        learner_id: labSheetId
                    }
                }
            }
        },
        include: {
            student_answers: true,
        },
    });


    return pick(studentAnswers, ["student_answers"]);


}

// MARK: Update lab sheet feedback by lab sheet id
/**
 * 
 * @param labSheetId 
 * @param overallScore 
 * @param areasForImprovement 
 * @param recommendations 
 * @param strengths 
 * @returns 
 */
export async function updateLabSheetFeedbackByLabSheetId(labSheetId: string, { overallScore, areasForImprovement, recommendations, strengths }: Feedback) {
    const updatedLabSheet = await prisma.labsheet.update({
        where: {
            id: labSheetId
        },
        data: {
            areas_for_improvement: areasForImprovement,
            overall_score: overallScore,
            recommendations: recommendations,
            strengths: strengths

        }
    });

    return updatedLabSheet;
}
