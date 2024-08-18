import { logger } from "@azure/storage-blob";
import { Request, Response } from "express";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

import {
  createLecture,
  saveLectureContenttoDB,
} from "../services/db/lecture.db.service";

import {
  generateLectureForSubtopic,
  generateIntroForLecture,
  generateConclusionForLecture,
  generateMCQsForLecture,
} from "../services/lecture.service";

import { getLessonOutlineByModuleAndLessonName } from "../services/db/module.db.service";
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

    // create a tutorial for the student
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

    // Generate the lecture for each subtopic
    const sectionTranscripts = [];
    for (let i = 0; i < lessonOutline.sub_lessons.length; i++) {
      const subtopic = lessonOutline.sub_lessons[i];
      const sectionTranscript = await generateLectureForSubtopic(
        lessonOutline.title,
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
        ...sectionTranscripts.map((section, index) => ({
          topic: lessonOutline.sub_lessons[index].topic,
          content: section,
        })),
        { topic: "Conclusion", content: conclusionTranscript },
      ],
      [...preAssessmentMCQs, ...postAssessmentMCQs]
    );

    return res.status(200).send(updatedLecture);

    // TTS Conversion
    const speechKey = process.env.SPEECH_KEY || "";
    const speechRegion = process.env.SPEECH_REGION || "";

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );
    speechConfig.speechSynthesisVoiceName = `en-US-${
      req.query.teacher || "Ava"
    }Neural`;

    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const visemes: number[][] = [];
    speechSynthesizer.visemeReceived = function (s, e) {
      visemes.push([e.audioOffset / 10000, e.visemeId]);
    };

    const audioStream: PassThrough = await new Promise((resolve, reject) => {
      speechSynthesizer.speakTextAsync(
        //fullTranscript,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const { audioData } = result;
            speechSynthesizer.close();

            if (!audioData) {
              reject(new Error("No audio data received"));
              return;
            }

            const bufferStream = new PassThrough();
            bufferStream.end(Buffer.from(audioData));
            resolve(bufferStream);
          } else {
            speechSynthesizer.close();
            reject(
              new Error(`Speech synthesis failed. Reason: ${result.reason}`)
            );
          }
        },
        (error) => {
          speechSynthesizer.close();
          reject(error);
        }
      );
    });

    const audioChunks = [];
    for await (const chunk of audioStream) {
      audioChunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(audioChunks);
    const audioBase64 = audioBuffer.toString("base64");

    res.status(200).json({
      fullTranscript,
      audioBase64,
      visemes,
    });
  } catch (error) {
    console.log(error);
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
            include:{
                options:true
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
