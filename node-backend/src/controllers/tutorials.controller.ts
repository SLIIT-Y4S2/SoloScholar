import { Request, Response } from "express";
import {
  convertLessonOutlineToText,
  extractSearchingKeywordsFromLessonOutline,
  synthesizeDetailedLessonOutline,
  synthesizeQuestionsForSubtopic,
} from "../services/tutorial.rag.service";
import { LessonOutlineType } from "../types/lesson.types";
import {
  DUMMY_LESSON_OUTLINE,
  // DummyGenerated_DetailedLessonOutline,
} from "../constants/dummydata";

const generateTutorials = async (req: Request, res: Response) => {
  try {
    // From the body we get
    // {
    //   "moduleName": "Database Systems",
    //   "lesson": "Transactions and Concurrency Control",
    //   "learningRate": "Advanced",
    // [ "Beginner", "Intermediate", "Advanced"]
    // }
    //MARK: pre-requisite
    // we need check if the student has already generated the tutorial for the lesson for the given learning rate
    // if the tutorial has already been generated return the tutorial to the student

    // MARK: STEP 1
    // get the lesson outline from the database

    // MARK: STEP 2
    // we need to make the detailed lesson plan for the lesson
    // 1. we need to create a text that will be used to create the lesson plan from the json
    const searchingKeywords =
      extractSearchingKeywordsFromLessonOutline(DUMMY_LESSON_OUTLINE);
    const lessonOutlineAsAText: string =
      convertLessonOutlineToText(DUMMY_LESSON_OUTLINE);

    const detailedLessonOutline = await synthesizeDetailedLessonOutline(
      searchingKeywords,
      lessonOutlineAsAText
    );

    // MARK: STEP 3
    // loop through the detailed lesson plan and create questions for each subtopic
    const totalNumberOfQuestions = 15;
    const totalNumberOfQuestionsPerSubtopics = Math.floor(
      totalNumberOfQuestions / DUMMY_LESSON_OUTLINE.subtopics.length
    );

    const learningOutcomes = DUMMY_LESSON_OUTLINE.learningOutcomes.map(
      (outcome) => outcome.outcome
    );

    const combinedBloomLevels = DUMMY_LESSON_OUTLINE.learningOutcomes.reduce(
      (acc, outcome) => {
        return acc.concat(outcome.bloomsLevels);
      },
      [] as string[]
    );

    const questions = await Promise.all(
      detailedLessonOutline.map(async (subtopic) => {
        const subtopicQuestions = await synthesizeQuestionsForSubtopic(
          `${subtopic.subtopic} ${subtopic.description}`,
          subtopic.subtopic,
          subtopic.description,
          learningOutcomes,
          combinedBloomLevels,
          "Beginner", //TODO: get the learning rate from the student
          totalNumberOfQuestionsPerSubtopics
        );
        return subtopicQuestions;
      })
    ).then((result) => result.flat());

    // MARK: STEP 4
    // save the tutorial to the database
    // change the status of the tutorial to generated
    // return the tutorial to the student
    res.status(200).json({
      message: "Tutorial generated successfully",
      data: {
        lessonOutline: DUMMY_LESSON_OUTLINE,
        detailedLessonOutline: detailedLessonOutline,
        questions: questions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

    console.error(error);
  }
};

export { generateTutorials as getTutorials };
