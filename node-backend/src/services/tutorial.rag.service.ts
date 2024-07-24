import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import {
  DetailedLessonOutlinePrompt,
  GenerateMultipleChoiceQuestionPrompt,
  GenerateShortAnswerQuestionPrompt,
} from "../prompt-templates/tutorial.template";
import { LessonOutlineType } from "../types/lesson.types";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString } from "../utils/rag.util";

// MARK: Detailed Lesson Outline

async function documentRetrievalPipelineForDetailedOutline() {
  const pineconeIndex = await getPineconeIndex();
  const embeddingModel = getEmbeddings();
  // Get the PineconeStore object
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex,
  });
  const retriever = pineconeStore.asRetriever();
  // Create a runnable sequence
  const runnableSequence = RunnableSequence.from([
    (input) => input.searchingKeywords,
    retriever,
    convertDocsToString,
  ]);
  return runnableSequence;
}

/**
 * Synthesize a detailed lesson outline from a lesson outline and searching keywords
 * @param searchingKeywords The searching keywords
 * @param lessonOutline The lesson outline
 * @returns The detailed lesson outline
 *
 **/

export async function synthesizeDetailedLessonOutline(
  searchingKeywords: string,
  lessonOutline: string
): Promise<{ subtopic: string; description: string }[]> {
  const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(
    DetailedLessonOutlinePrompt
  );

  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalPipelineForDetailedOutline,
      lessonOutline: (input) => input.lessonOutline,
    },
    answerGenerationPrompt,
    getChatModel,
    new StringOutputParser(),
  ]);

  const response = await retrievalChain.invoke({
    searchingKeywords,
    lessonOutline,
  });

  return JSON.parse(response);
}

/**
 * Extract searching keywords from a lesson outline
 * @param lesson The lesson outline
 * @returns The searching keywords
 **/
export function extractSearchingKeywordsFromLessonOutline(
  lesson: LessonOutlineType
) {
  let keywords = [];

  keywords.push(lesson.title);

  lesson.lesson_subtopic.forEach((subtopic) => {
    keywords.push(subtopic);
  });

  lesson.lesson_learning_outcome.forEach((outcome) => {
    keywords.push(outcome.outcome);
  });

  return keywords.toString();
}

/**
 * Convert a lesson outline to text
 * @param lesson The lesson outline
 * @returns The lesson outline as text
 **/

export function convertLessonOutlineToText(lesson: LessonOutlineType) {
  let text = `Lesson Title: ${lesson.title}\nsubtopic:\n`;

  lesson.lesson_subtopic.forEach((subtopic, index) => {
    text += `${index + 1}. ${subtopic}\n`;
  });

  text += `Learning Outcomes:\n`;

  lesson.lesson_learning_outcome.forEach((outcome, index) => {
    text += `${index + 1}. ${outcome.outcome}\n`;
  });

  return text;
}

// MARK: Question Generation

async function documentRetrievalPipelineForQuestionGeneration() {
  const pineconeIndex = await getPineconeIndex();
  const embeddingModel = getEmbeddings();
  // Get the PineconeStore object
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex,
  });
  const retriever = pineconeStore.asRetriever(3);
  // Create a runnable sequence
  const runnableSequence = RunnableSequence.from([
    (input) => input.searchingKeywords,
    retriever,
    convertDocsToString,
  ]);
  return runnableSequence;
}

/**
 * Synthesize questions for a subtopic
 * @param searchingKeywords The searching keywords
 * @param subtopic The subtopic
 * @param description The description
 * @param lesson_learning_outcome The learning outcomes
 * @param cognitive_level The cognitive level
 * @param learningRate The learning rate
 * @param totalNumberOfQuestions The total number of questions
 * @param questionType The type of questions to generate ('short_answer' or 'multiple_choice')
 * @returns The generated questions
 */
export async function synthesizeQuestionsForSubtopic(
  searchingKeywords: string,
  subtopic: string,
  description: string,
  lesson_learning_outcome: string[],
  cognitive_level: string[],
  learningRate: string,
  totalNumberOfQuestions: number,
  questionType: "essay" | "mcq"
): Promise<
  {
    question: string;
    answer: string;
    type: string;
    options: string[];
  }[]
> {
  const prompt =
    questionType === "essay"
      ? GenerateShortAnswerQuestionPrompt
      : GenerateMultipleChoiceQuestionPrompt;

  const questionGenerationPrompt = ChatPromptTemplate.fromTemplate(prompt);

  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalPipelineForQuestionGeneration,
      subtopic: (input) => input.subtopic,
      description: (input) => input.description,
      lesson_learning_outcome: (input) => input.lesson_learning_outcome,
      cognitive_level: (input) => input.cognitive_level,
      learningRate: (input) => input.learningRate,
      totalNumberOfQuestions: (input) => input.totalNumberOfQuestions,
    },
    questionGenerationPrompt,
    getChatModel,
    new StringOutputParser(),
  ]);

  const questionResponse = await retrievalChain.invoke({
    searchingKeywords,
    subtopic,
    description,
    lesson_learning_outcome,
    cognitive_level,
    learningRate,
    totalNumberOfQuestions,
  });

  const questions = JSON.parse(questionResponse).map(
    (question: { question: string; answer: string; options?: string[] }) => ({
      ...question,
      type: questionType,
      options: question.options || [],
    })
  );

  return questions;
}
