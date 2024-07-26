import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import { DetailedLessonOutlinePrompt } from "../prompt-templates/module.template";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString } from "../utils/rag.util";
import { InputLesson, Lesson } from "../types/module.types";

/**
 * The prompt template for generating a detailed lesson outline
 * @returns A PineconeStore object
 */
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
): Promise<{ topic: string; description: string }[]> {
  const prompt = ChatPromptTemplate.fromTemplate(DetailedLessonOutlinePrompt);

  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalPipelineForDetailedOutline,
      incompleteOutline: (input) => input.lessonOutline,
    },
    prompt,
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
export function extractSearchingKeywordsFromLessonOutline(lesson: InputLesson) {
  let keywords = [];

  keywords.push(lesson.title);

  lesson.lesson_subtopics.forEach((subtopic) => {
    keywords.push(subtopic);
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

export function convertLessonOutlineToText(lesson: InputLesson) {
  let text = `Lesson Title: ${lesson.title}\nsubtopic:\n`;

  lesson.lesson_subtopics.forEach((subtopic, index) => {
    text += `${index + 1}. ${subtopic}\n`;
  });

  text += `Learning Outcomes:\n`;

  lesson.lesson_learning_outcomes.forEach((outcome, index) => {
    text += `${index + 1}. ${outcome.outcome}\n`;
  });

  return text;
}
