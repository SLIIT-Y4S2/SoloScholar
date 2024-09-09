import { logger } from "@azure/storage-blob";
import { Request, Response } from "express";
// import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

import {
  createLecture,
  saveLectureContenttoDB,
  getLectureByLearnerId,
  saveStudentAnswer,
  getStudentAnswers,
} from "../services/db/lecture.db.service";

import {
  GetLectureByIdSchema,
  GetLecturesByLearnerSchema,
  LectureGenerationSchema,
} from "../models/lecture.schema";

import {
  generateLectureForSubtopic,
  generateIntroForLecture,
  generateConclusionForLecture,
  generateMCQsForLecture,
  generateLectureFromLearningOutcomes,
  generateMarkdownPPTSlidesFromContent,
} from "../services/lecture.service";

import {
  getLessonOutlineByModuleAndLessonName,
  getModuleByName,
  getLessonByModuleIdAndTitle,
  findSubtopicById,
} from "../services/db/module.db.service";

import prisma from "../utils/prisma-client.util";

export const generateLectureHandler = async (req: Request, res: Response) => {
  try {
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

    // create a lecture for the student
    const lecture = await createLecture(
      lessonOutline.id,
      learner_id,
      learningLevel
    );

    // Generate the introductory lecture video
    const introTranscript = await generateIntroForLecture(
      lessonOutline.title,
      lessonOutline.sub_lessons
    );

    // Generate lecture section based on learning outcomes
    const learningOutcomesLecture = await generateLectureFromLearningOutcomes(lessonTitle);

    // Generate the lecture for each subtopic
    const sectionTranscripts = [];
    for (let i = 0; i < lessonOutline.sub_lessons.length; i++) {
      const subtopic = lessonOutline.sub_lessons[i];
      const sectionTranscript = await generateLectureForSubtopic(
        lessonOutline.title,
        learningLevel,
        subtopic.topic,
        subtopic.description,
        sectionTranscripts
      );
      sectionTranscripts.push(sectionTranscript);
    }

    // // Generate the conclusion
    // const conclusionTranscript = await generateConclusionForLecture(lessonOutline.title, sectionTranscripts);

    // // Generate pre-assessment MCQ questions
    // const preAssessmentMCQs = await generateMCQsForLecture(lessonOutline.title, sectionTranscripts);

    // // Generate post-assessment MCQ questions
    // const postAssessmentMCQs = await generatePostAssessmentMCQs(lessonOutline.title, sectionTranscripts);

    const [conclusionTranscript, preAssessmentMCQs, postAssessmentMCQs] =
      await Promise.all([
        generateConclusionForLecture(lessonOutline.title, sectionTranscripts),
        generateMCQsForLecture(lessonOutline.title, sectionTranscripts, "pre"),
        generateMCQsForLecture(lessonOutline.title, sectionTranscripts, "post"),
      ]);

    // Concatenate all sections
    // const fullTranscript = [
    //     {
    //         topic:"Introduction",
    //         content:introTranscript},
    //     // mcqQuestions,
    //     ...sectionTranscripts,
    //     conclusionTranscript,
    //     postAssessmentMCQs
    // ].join("\n");

    const updatedLecture = await saveLectureContenttoDB(
      lecture.id,
      [
        { topic: "Introduction", content: introTranscript },
        { topic: "Learning Outcomes Overview", content: learningOutcomesLecture },
        ...sectionTranscripts.map((section, index) => ({
          topic: lessonOutline.sub_lessons[index].topic,
          content: section,
        })),
        { topic: "Conclusion", content: conclusionTranscript },
      ],
      [...preAssessmentMCQs, ...postAssessmentMCQs]
    );

    return res.status(200).send(updatedLecture);


  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

export const getLectureByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lecture = await prisma.lecture.findUnique({
      where: {
        id,
      },
      include: {
        learning_material: {
          include: {
            lesson: true,
          },
        },
        sub_lecture: true,
        assessment_question: {
          include: {
            options: true
          }
        }
      },
    });

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      ...lecture,
      assessment_question: lecture.assessment_question.map((question) => ({
        ...question,
        options: question.options.map((option) => option.answer_option)
      }))
    })
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
    logger.error({ message });
  }
};

export const getLecturesByLearnerHandler = async (
  req: Request<{}, {}, {}, GetLecturesByLearnerSchema["query"]>,
  res: Response
) => {
  try {
    const { id: learner_id } = res.locals.user;
    const { moduleName, lessonTitle } = req.query;

    const module = await getModuleByName(moduleName);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    const lesson = await getLessonByModuleIdAndTitle(module.id, lessonTitle);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const tutorials = await getLectureByLearnerId(
      learner_id,
      module.id,
      lesson.id
    );

    res.status(200).json({
      message: "Lectures fetched successfully",
      data: tutorials,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message: " Internal server error", error });
    logger.error({ message });
  }
};


export const saveStudentAnswerHandler = async (req: Request, res: Response) => {
  try {
    const { id: lectureId } = req.params;
    const { questionId, studentAnswer } = req.body;

    if (!lectureId || !questionId || !studentAnswer) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const updatedQuestion = await saveStudentAnswer(lectureId, parseInt(questionId), studentAnswer);

    return res.status(200).json({
      message: "Student answer saved successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const getStudentAnswersHandler = async (req: Request, res: Response) => {
  try {
    const { lectureId } = req.params;

    if (!lectureId) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    const studentAnswers = await getStudentAnswers(lectureId);

    return res.status(200).json({
      message: "Student answers fetched successfully",
      data: studentAnswers,
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message: "Internal server error", error });
  }
};


// Controller for generating markdown slides from content
export const generateMarkdownPPTSlides = async (req: Request, res: Response) => {
  try {
    const { lesson_title, content } = req.body;

    // Validate the request
    if (!lesson_title || !content) {
      return res.status(400).json({
        message: "Both lesson_title and content are required."
      });
    }

    // Call the service function to generate markdown slides
    const markdownSlides = await generateMarkdownPPTSlidesFromContent(lesson_title, content);

    // Return the generated slides
    return res.status(200).json({
      message: "Markdown slides generated successfully.",
      markdownSlides,
    });

  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message: " Internal server error", error });
    logger.error({ message });
  }
};