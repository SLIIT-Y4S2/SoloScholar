import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { documentRetrievalPipeline } from "./rag.service";
import { getChatModel } from "../utils/openai.util";

import {
  DetailedLessonOutline,
  GenerateQuestions,
} from "../prompt-templates/tutorial.template";
import { LessonOutlineType } from "../types/lesson.types";

/**
 * Synthesize a detailed lesson outline from a lesson outline and searching keywords
 * @param searchingKeywords The searching keywords
 * @param lessonOutline The lesson outline
 * @returns The detailed lesson outline
 *
 **/
async function synthesizeDetailedLessonOutline(
  searchingKeywords: string,
  lessonOutline: string
): Promise<{ subtopic: string; description: string }[]> {
  const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(
    DetailedLessonOutline
  );

  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalPipeline,
      lessonOutline: (input) => input.lessonOutline,
    },
    answerGenerationPrompt,
    getChatModel,
    new StringOutputParser(),
  ]);

  const response = await retrievalChain.invoke({
    question: searchingKeywords,
    lessonOutline,
  });

  return JSON.parse(response);
}

/**
 * Extract searching keywords from a lesson outline
 * @param lesson The lesson outline
 * @returns The searching keywords
 **/
function extractSearchingKeywordsFromLessonOutline(lesson: LessonOutlineType) {
  let keywords = [];

  keywords.push(lesson.lessonTitle);

  lesson.subtopics.forEach((subtopic) => {
    keywords.push(subtopic);
  });

  lesson.learningOutcomes.forEach((outcome) => {
    keywords.push(outcome.outcome);
  });

  return keywords.toString();
}

/**
 * Convert a lesson outline to text
 * @param lesson The lesson outline
 * @returns The lesson outline as text
 **/

function convertLessonOutlineToText(lesson: LessonOutlineType) {
  let text = `Lesson Title: ${lesson.lessonTitle}\nSubtopics:\n`;

  lesson.subtopics.forEach((subtopic, index) => {
    text += `${index + 1}. ${subtopic}\n`;
  });

  text += `Learning Outcomes:\n`;

  lesson.learningOutcomes.forEach((outcome, index) => {
    text += `${index + 1}. ${
      outcome.outcome
    }\nBlooms Levels: ${outcome.bloomsLevels.join(", ")}\n`;
  });

  return text;
}

/**
 * Synthesize questions for a subtopic
 */
async function synthesizeQuestionsForSubtopic(
  searchingKeywords: string,
  subtopic: string,
  description: string,
  learningOutcomes: string[],
  bloomsLevels: string[],
  learningRate: string,
  totalNumberOfQuestions: number
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  const questionGenerationPrompt =
    ChatPromptTemplate.fromTemplate(GenerateQuestions);

  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalPipeline,
      subtopic: (input) => input.subtopic,
      description: (input) => input.description,
      learningOutcomes: (input) => input.learningOutcomes,
      bloomsLevels: (input) => input.bloomsLevels,
      learningRate: (input) => input.learningRate,
      totalNumberOfQuestions: (input) => input.totalNumberOfQuestions,
    },
    questionGenerationPrompt,
    getChatModel,
    new StringOutputParser(),
  ]);

  const response = await retrievalChain.invoke({
    question: searchingKeywords,
    subtopic,
    description,
    learningOutcomes,
    bloomsLevels,
    learningRate,
    totalNumberOfQuestions,
  });

  return JSON.parse(response);
}

export {
  synthesizeDetailedLessonOutline,
  extractSearchingKeywordsFromLessonOutline,
  convertLessonOutlineToText,
  synthesizeQuestionsForSubtopic,
};
