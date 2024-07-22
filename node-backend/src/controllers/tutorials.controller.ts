import { includes } from "lodash";
import { Request, Response } from "express";
import {
  convertLessonOutlineToText,
  extractSearchingKeywordsFromLessonOutline,
  synthesizeDetailedLessonOutline,
  synthesizeQuestionsForSubtopic,
} from "../services/tutorial.rag.service";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";
import {
  createTutorial,
  deleteTutorial,
} from "../services/db/tutorial.db.service";
import prisma from "../utils/prisma-client.util";

export const generateTutorials = async (req: Request, res: Response) => {
  try {
    //MARK: pre-requisite
    // we need check if the student has already generated the tutorial for the lesson for the given learning rate
    // if the tutorial has already been generated return the tutorial to the student

    // MARK: STEP 1
    // get the lesson outline from the database

    const { moduleName, lessonTitle, learningLevel } = req.body;
    const { id: learner_id } = res.locals.user;

    if (!moduleName || !lessonTitle || !learningLevel) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    // const lessonOutline = MODULE_OUTLINE_LESSON_ARRAY.find(
    //   (lesson) => lesson.lessonTitle === lessonTitle
    // );

    const module = await prisma.module.findFirst({
      where: { name: moduleName },
      include: {
        lesson: {
          where: { title: lessonTitle },
          include: {
            lesson_learning_outcome: {
              include: {
                learning_outcome: {
                  include: {
                    learning_outcome_cognitive_level: {
                      include: {
                        cognitive_level: {
                          select: {
                            level: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            lesson_subtopic: true,
          },
        },
      },
    });

    // const lessonOutline = module?.lesson[0];

    const lesson = module?.lesson[0];

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const lessonOutline = {
      ...lesson,
      lesson_subtopic: lesson.lesson_subtopic.map((subtopic) => subtopic.text),
      lesson_learning_outcome: lesson.lesson_learning_outcome.map(
        (outcome) => ({
          outcome: outcome.learning_outcome.description,
          cognitive_level:
            outcome.learning_outcome.learning_outcome_cognitive_level.map(
              (cognitiveLevel) => cognitiveLevel.cognitive_level.level
            ),
        })
      ),
    };

    // create a tutorial for the student
    const tutorial = await createTutorial(
      lessonOutline.id,
      learner_id,
      learningLevel
    );

    // MARK: STEP 2
    // make the detailed lesson plan for the tutorial
    const searchingKeywords =
      extractSearchingKeywordsFromLessonOutline(lessonOutline);
    const lessonOutlineAsAText: string =
      convertLessonOutlineToText(lessonOutline);

    const detailedLessonOutline = await synthesizeDetailedLessonOutline(
      searchingKeywords,
      lessonOutlineAsAText
    );

    // // MARK: STEP 3
    // // loop through the detailed lesson plan and create questions for each subtopic
    // const totalNumberOfQuestions = 15; // TEMPORARY
    // const totalNumberOfQuestionsPerSubtopics = Math.floor(
    //   totalNumberOfQuestions / lessonOutline.subtopics.length
    // );

    // const learningOutcomes = lessonOutline.learningOutcomes.map(
    //   (outcome) => outcome.outcome
    // );

    // const combinedBloomLevels = lessonOutline.learningOutcomes.reduce(
    //   (acc, outcome) => {
    //     return acc.concat(outcome.bloomsLevels);
    //   },
    //   [] as string[]
    // );

    // const questions = await Promise.all(
    //   detailedLessonOutline.map(async (subtopic) => {
    //     const subtopicQuestions = await synthesizeQuestionsForSubtopic(
    //       `${subtopic.subtopic} ${subtopic.description}`,
    //       subtopic.subtopic,
    //       subtopic.description,
    //       learningOutcomes,
    //       combinedBloomLevels,
    //       learningLevel, // "Beginner", "Intermediate", "Advanced"
    //       totalNumberOfQuestionsPerSubtopics
    //     );
    //     return subtopicQuestions;
    //   })
    // ).then((result) => result.flat());

    // // MARK: STEP 4
    // // save the tutorial to the database
    // // change the status of the tutorial to generated
    // // return the tutorial to the student
    // res.status(200).json({
    //   message: "Tutorial generated successfully",
    //   data: {
    //     questions: questions,
    //     detailedLessonOutline: detailedLessonOutline,
    //   },
    // });

    //TODO: remove this
    res.status(200).json({
      message: "Tutorial generated successfully",
      data: {
        tutorial,
        detailedLessonOutline,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

    console.error(error);
  }
};

// export const getTutorials = async (req: Request, res: Response) => {
//   try {
//     const tutorials = await getAllTutorials();

//     res.status(200).json({
//       message: "Tutorials fetched successfully",
//       data: tutorials,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });

//     console.error(error);
//   }
// };
