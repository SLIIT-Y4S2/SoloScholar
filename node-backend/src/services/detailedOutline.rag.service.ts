import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import { DetailedLessonOutlinePrompt } from "../prompt-templates/module.template";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString } from "../utils/rag.util";
import { InputLesson, Lesson, SubLesson } from "../types/module.types";

/**
 * TODO: remove this
 * The prompt template for generating a detailed lesson outline
 * @returns A PineconeStore object
 */
async function documentRetrievalPipeline(
  keyWords: string,
  kValue: number = 10
) {
  const pineconeIndex = await getPineconeIndex();
  const embeddingModel = getEmbeddings();

  // Get the PineconeStore object
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex,
  });

  // Fetch the top 10 similar documents.
  const retriever = pineconeStore.asRetriever(kValue);

  // Create a runnable sequence
  const runnableSequence = RunnableSequence.from([
    (input) => input.keyWords,
    retriever,
    convertDocsToString,
  ]);

  const relatedContext = await runnableSequence.invoke({ keyWords: keyWords });

  return relatedContext;
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
): Promise<{ topic: string; description: string }[]> {
  const prompt = PromptTemplate.fromTemplate(DetailedLessonOutlinePrompt);

  const context = documentRetrievalPipeline(searchingKeywords);

  const jsonParser = new JsonOutputParser<SubLesson[]>();

  const formatInstructions =
    "Respond with a valid JSON array, containing the subtopic object with two fields: 'topic' and 'description'.";

  const promptWithFormattingInstructions = await prompt.partial({
    format_instructions: formatInstructions,
  });

  const retrievalChain = RunnableSequence.from([
    {
      context: (input) => input.context,
      incompleteOutline: (input) => input.lessonOutline,
    },
    promptWithFormattingInstructions,
    getChatModel,
    jsonParser,
  ]);

  const response = await retrievalChain.invoke({
    context,
    lessonOutline,
  });

  return response;
}

/**
 * Extract searching keywords from a lesson outline
 * @param lesson The lesson outline
 * @returns The searching keywords
 **/
export function extractSearchingKeywordsFromLessonOutline(lesson: InputLesson) {
  let keywords = [];

  keywords.push(lesson.title);

  lesson.sub_lessons.forEach((sub_lesson) => {
    keywords.push(sub_lesson);
  });

  lesson.lesson_learning_outcomes.forEach((outcome) => {
    keywords.push(outcome.outcome);
  });

  return keywords.toString();
}

/**
 * Convert a lesson outline to text
 * @param lesson The lesson outline
 * @returns The lesson outline as text
 **/

export function convertLessonOutlineToText(
  module: string,
  description: string,
  lesson: InputLesson
) {
  let text = `
  Module:${module}
  Description for module:${description}
  Lesson Title: ${lesson.title}
  subtopic:\n`;

  lesson.sub_lessons.forEach((subtopic, index) => {
    text += `${index + 1}. ${subtopic}\n`;
  });

  text += `Learning Outcomes:\n`;

  lesson.lesson_learning_outcomes.forEach((outcome, index) => {
    text += `${index + 1}. ${outcome.outcome}\n`;
  });

  return text;
}
