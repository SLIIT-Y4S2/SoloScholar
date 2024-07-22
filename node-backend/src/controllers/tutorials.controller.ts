import { Request, Response } from "express";
import {
  convertLessonOutlineToText,
  extractSearchingKeywordsFromLessonOutline,
  synthesizeDetailedLessonOutline,
  synthesizeShortAnswerQuestionsForSubtopic,
} from "../services/tutorial.rag.service";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";
import {
  createTutorial,
  updateTutorialQuestions,
  getTutorialByLearnerId,
} from "../services/db/tutorial.db.service";
import { getLessonOutlineByModuleAndLessonName } from "../services/db/module.db.service";

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
    const lessonOutline = await getLessonOutlineByModuleAndLessonName(
      moduleName,
      lessonTitle
    );
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

    // MARK: STEP 3
    // loop through the detailed lesson plan and create questions for each subtopic
    const totalNumberOfQuestions = 15; // TEMPORARY
    const totalNumberOfQuestionsPerSubtopics = Math.floor(
      totalNumberOfQuestions / lessonOutline.lesson_subtopic.length
    );

    const learningOutcomes = lessonOutline.lesson_learning_outcome.map(
      (outcome) => outcome.outcome
    );

    const combined_cognitive_level =
      lessonOutline.lesson_learning_outcome.reduce((acc, outcome) => {
        return acc.concat(outcome.cognitive_level);
      }, [] as string[]);

    const questions = await Promise.all(
      detailedLessonOutline.map(async (subtopic) => {
        const subtopicQuestions =
          await synthesizeShortAnswerQuestionsForSubtopic(
            `${subtopic.subtopic} ${subtopic.description}`,
            subtopic.subtopic,
            subtopic.description,
            learningOutcomes,
            combined_cognitive_level,
            learningLevel, // "Beginner", "Intermediate", "Advanced"
            totalNumberOfQuestionsPerSubtopics
          );
        return subtopicQuestions;
      })
    ).then((result) => result.flat());

    const updatedTutorialWithQuestions = await updateTutorialQuestions(
      tutorial.id,
      questions
    );

    // MARK: STEP 4
    // save the tutorial to the database
    // change the status of the tutorial to generated
    // return the tutorial to the student
    res.status(200).json({
      message: "Tutorial generated successfully",
      data: {
        questions: updatedTutorialWithQuestions.questions,
        detailedLessonOutline: detailedLessonOutline,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

    console.error(error);
  }
};

export const getTutorials = async (req: Request, res: Response) => {
  try {
    const { id: learner_id } = res.locals.user;
    const tutorials = await getTutorialByLearnerId(learner_id);

    res.status(200).json({
      message: "Tutorials fetched successfully",
      data: tutorials,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

    console.error(error);
  }
};
