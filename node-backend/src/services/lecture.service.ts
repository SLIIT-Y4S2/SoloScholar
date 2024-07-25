import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import {
    DetailedLessonOutlinePrompt,
} from "../prompt-templates/lecture.template";
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
 * Extract searching keywords from a lesson outline
 * @param lesson The lesson outline
 * @returns The searching keywords
 **/

export function extractSearchingKeywordsForLecture(
    lesson: any
) {
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

// MARK: ConvertLessonOutlineToText
// Lesson Title: Introduction to Programming
// subtopic:
// 1. Variables
// 2. Data Types
// 3. Control Structures
// Learning Outcomes:
// 1. Understand basic programming concepts
// 2. Write simple programs


export function convertLessonOutlineToText(lesson: LessonOutlineType) {
    let text = `Lesson Title: ${lesson.lessonTitle}\nsubtopic:\n`;

    lesson.subtopics.forEach((subtopic, index) => {
        text += `${index + 1}. ${subtopic}\n`;
    });

    text += `Learning Outcomes:\n`;

    lesson.learningOutcomes.forEach((outcome, index) => {
        text += `${index + 1}. ${outcome.outcome}\n`;
    });

    return text;
}

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


//make intro script


//scripts
