import { RunnableSequence } from "@langchain/core/runnables";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString, splitPDFintoChunks, uploadChunkstoVectorDB } from "../utils/rag.util";
import { QuestionGenerationPrompt, RealWorldScenarioPrompt, PracticalLabOutlinePrompt, SupportingMaterialGenerationPrompt } from "../prompt-templates/lab.prompts";
import { LessonOutlineType } from "../types/lesson.types";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

/**
 * Ingestion pipeline
 * @param file - The PDF file to ingest
 */
async function ingestionPipeline(file: Express.Multer.File) {
    // Split the PDF document into text chunks
    const textChunks = await splitPDFintoChunks(file);

    // Upload the text chunks to Pinecone
    await uploadChunkstoVectorDB(textChunks);
}

/**
 * Extract keywords from the lesson outline
 * @param lessonOutline - The lesson outline
 * @returns A list of keywords
 */
function extractKeywordsFromLessonOutline(lessonOutline: LessonOutlineType): string {
    let keywords = [];

    keywords.push(lessonOutline.lessonTitle);

    for (const subtopic of lessonOutline.subtopics) {
        keywords.push(subtopic);
    }

    for (const learningOutcome of lessonOutline.learningOutcomes) {
        keywords.push(learningOutcome.outcome);
    }

    return keywords.toString();
}

/**
 * Document retrieval pipeline
 * @param keyWords - The user query
 * @returns A string of related context
 */
async function documentRetrievalPipeline(keyWords: string) {
    const pineconeIndex = await getPineconeIndex();
    const embeddingModel = getEmbeddings();

    // Get the PineconeStore object
    const pineconeStore = await PineconeStore.fromExistingIndex(
        embeddingModel,
        { pineconeIndex, }
    );

    // Fetch the top 10 similar documents.
    const retriever = pineconeStore.asRetriever();

    // const parser = JsonOutput 

    // Create a runnable sequence
    const runnableSequence = RunnableSequence.from([
        (input) => input.keyWords,
        retriever,
        convertDocsToString,
    ]);

    const relatedContext = await runnableSequence.invoke({ keyWords: keyWords });

    return relatedContext;

};

/**
 * This function is responsible for generating a practical lab activities.
 * @param topic - The topic of the lab 
 * @returns 
 */
async function responseSynthesizerForLabs(topic: string) {
    // Get the lesson outline for the given topic
    const lessonOutline = MODULE_OUTLINE_LESSON_ARRAY.find((lesson) => lesson.lessonTitle === topic)!;

    // Extract the keywords from the lesson outline
    const keywords = extractKeywordsFromLessonOutline(lessonOutline);

    // Retrieve related context to the keywords from the vector database
    const relatedContext = await documentRetrievalPipeline(keywords);

    // Generate a detailed outline for the lab activity using the related context and incomplete lab outline
    const practicalLabDetailedOutlinePrompt = PromptTemplate.fromTemplate(PracticalLabOutlinePrompt);

    // Define the output parser for the detailed lab outline using Zod schema
    const zodSchemaForDetailedLabOutline = z.object(
        {
            subTopics: z.array(
                z.object({
                    title: z.string().describe("The title of the subtopic"),
                    description: z.string().describe("The description of the subtopic"),
                })
            )
        }
    );

    const outputParserForDetailedLabOutline = StructuredOutputParser.fromZodSchema(zodSchemaForDetailedLabOutline);


    // Create a runnable sequence for generating a detailed lab outline
    const practicalLabOutlinePipeline = RunnableSequence.from([
        {
            learningOutcomes: (input) => input.learningOutcomes,
            incompleteOutline: (input) => input.incompleteOutline,
            formatInstructions: (input) => input.formatInstructions,
            context: (input) => input.relatedContext
        },
        practicalLabDetailedOutlinePrompt,
        getChatModel,
        outputParserForDetailedLabOutline
    ]);

    const detailedLabOutline = await practicalLabOutlinePipeline.invoke({
        relatedContext: relatedContext,
        incompleteOutline: lessonOutline,
        learningOutcomes: lessonOutline.learningOutcomes,
        formatInstructions: outputParserForDetailedLabOutline.getFormatInstructions()
    });

    // Generate a real-world scenario for the lab activity using the related context and subtopics
    const realWorldScenarioPrompt = PromptTemplate.fromTemplate(RealWorldScenarioPrompt);

    // Define the output parser for the real-world scenario prompt using Zod schema
    const zodSchemaForRealWorldScenario = z.string().describe("The real-world scenario for the lab activity");


    const outputParserForRealWorldScenario = StructuredOutputParser.fromZodSchema(zodSchemaForRealWorldScenario);

    // Create a runnable sequence for generating a real-world scenario
    const realWorldScenarioPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            detailedOutline: (input) => input.detailedOutline,
        },
        realWorldScenarioPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const realWorldScenario = await realWorldScenarioPipeline.invoke({
        relatedContext: relatedContext,
        learningOutcomes: lessonOutline.learningOutcomes,
        detailedOutline: detailedLabOutline,
        formatInstructions: outputParserForRealWorldScenario.getFormatInstructions()
    });

    //ToDo Generate supporting materials for the lab activity using the real-world scenario
    const supportingMaterialPrompt = PromptTemplate.fromTemplate(SupportingMaterialGenerationPrompt);

    return {
        realWorldScenario: realWorldScenario,
    };

}


export { documentRetrievalPipeline, ingestionPipeline, responseSynthesizerForLabs };
