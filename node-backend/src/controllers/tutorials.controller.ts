import { Request, Response } from "express";
import {
  convertLessonOutlineToText,
  extractSearchingKeywordsFromLessonOutline,
  synthesizeDetailedLessonOutline,
  synthesizeQuestionsForSubtopic,
} from "../services/tutorial.rag.service";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";

const generateTutorials = async (req: Request, res: Response) => {
  try {
    //MARK: pre-requisite
    // we need check if the student has already generated the tutorial for the lesson for the given learning rate
    // if the tutorial has already been generated return the tutorial to the student

    // MARK: STEP 1
    // get the lesson outline from the database

    const { moduleName, lessonTitle, learningRate } = req.body;

    if (!moduleName || !lessonTitle || !learningRate) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const lessonOutline = MODULE_OUTLINE_LESSON_ARRAY.find(
      (lesson) => lesson.lessonTitle === lessonTitle
    );

    if (!lessonOutline) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    // MARK: STEP 2
    // we need to make the detailed lesson plan for the tutorial
    const searchingKeywords =
      extractSearchingKeywordsFromLessonOutline(lessonOutline);
    const lessonOutlineAsAText: string =
      convertLessonOutlineToText(lessonOutline);

    const detailedLessonOutline = await synthesizeDetailedLessonOutline(
      searchingKeywords,
      lessonOutlineAsAText
    );

    // MARK: STEP 3
    // loop through the detailed lesson plan and create questions for each subtopic
    const totalNumberOfQuestions = 15; // TEMPORARY
    const totalNumberOfQuestionsPerSubtopics = Math.floor(
      totalNumberOfQuestions / lessonOutline.subtopics.length
    );

    const learningOutcomes = lessonOutline.learningOutcomes.map(
      (outcome) => outcome.outcome
    );

    const combinedBloomLevels = lessonOutline.learningOutcomes.reduce(
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
          learningRate, // "Beginner", "Intermediate", "Advanced"
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
        questions: questions,
        detailedLessonOutline: detailedLessonOutline,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

    console.error(error);
  }
};

export { generateTutorials as getTutorials };
