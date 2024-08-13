import { logger } from "@azure/storage-blob";
import { Request, Response } from "express";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";


import { generateLectureForSubtopic, generateIntroForLecture, generateConclusionForLecture, generateMCQsForLecture, generatePostAssessmentMCQs } from "../services/lecture.service";

import { getLessonOutlineByModuleAndLessonName } from "../services/db/module.db.service";

export const generateLectureHandler = async (req: Request, res: Response) => {
    try {
        const { moduleName, lessonTitle, learningLevel } = req.body;

        if (!moduleName || !lessonTitle || !learningLevel) {
            return res.status(400).json({
                message: "Invalid request body",
            });
        }
        const lessonOutline = await getLessonOutlineByModuleAndLessonName(
            moduleName,
            lessonTitle
        );

        // Generate the introductory lecture video
        const introTranscript = await generateIntroForLecture(lessonOutline.title, lessonOutline.lesson_subtopics);

        // Generate the lecture for each subtopic
        const sectionTranscripts = [];
        for (let i = 0; i < lessonOutline.lesson_subtopics.length; i++) {
            const subtopic = lessonOutline.lesson_subtopics[i];
            const sectionTranscript = await generateLectureForSubtopic(
                lessonOutline.title,
                subtopic.topic,
                subtopic.description,
                sectionTranscripts
            );
            sectionTranscripts.push(sectionTranscript);
        }

        // Generate the conclusion
        const conclusionTranscript = await generateConclusionForLecture(lessonOutline.title, sectionTranscripts);

        // Generate pre-assessment MCQ questions
        const mcqQuestions = await generateMCQsForLecture(lessonOutline.title, sectionTranscripts);

        // Generate post-assessment MCQ questions
        const postAssessmentMCQs = await generatePostAssessmentMCQs(lessonOutline.title, sectionTranscripts);

        // Concatenate all sections
        const fullTranscript = [
            introTranscript,
            mcqQuestions,
            ...sectionTranscripts,
            conclusionTranscript,
            postAssessmentMCQs
        ].join("\n");

        res.status(200).send(introTranscript);

        // TTS Conversion
        const speechKey = process.env.SPEECH_KEY || "";
        const speechRegion = process.env.SPEECH_REGION || "";
        
        const speechConfig = sdk.SpeechConfig.fromSubscription(
            speechKey,
            speechRegion
        );
        speechConfig.speechSynthesisVoiceName = `en-US-${req.query.teacher || "Ava"}Neural`;

        const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
        const visemes: number[][] = [];
        speechSynthesizer.visemeReceived = function (s, e) {
            visemes.push([e.audioOffset / 10000, e.visemeId]);
        };

        const audioStream: PassThrough = await new Promise((resolve, reject) => {
            speechSynthesizer.speakTextAsync(
                fullTranscript,
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
                        reject(new Error(`Speech synthesis failed. Reason: ${result.reason}`));
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
        const audioBase64 = audioBuffer.toString('base64');

        res.status(200).json({
            fullTranscript,
            audioBase64,
            visemes,
        });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ message });
        logger.error({ message });
    }
}
