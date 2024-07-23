import { RunnableSequence } from "@langchain/core/runnables";
import { PineconeStore } from "@langchain/pinecone";
import { PromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString, splitPDFintoChunks, uploadChunkstoVectorDB } from "../utils/rag.util";
import { QuestionGenerationPrompt, RealWorldScenarioPrompt, PracticalLabOutlinePrompt, SupportingMaterialGenerationPrompt } from "../prompt-templates/lab.prompts";
import { LessonOutlineType } from "../types/lesson.types";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { zodSchemaForDetailedLabOutline, zodSchemaForQuestions, zodSchemaForRealWorldScenario, zodSchemaForSupportingMaterial } from "../utils/zodSchema.util";

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

    // Generate supporting materials for the lab activity using the real-world scenario
    const supportingMaterialPrompt = PromptTemplate.fromTemplate(SupportingMaterialGenerationPrompt);

    // Define the output parser for the supporting material prompt using Zod
    const outputParserForSupportingMaterial = StructuredOutputParser.fromZodSchema(zodSchemaForSupportingMaterial);

    // Create a runnable sequence for generating supporting materials
    const supportingMaterialPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            topicOfTheLab: (input) => input.topicOfTheLab,
            detailedOutline: (input) => input.detailedOutline,
            realWorldScenario: (input) => input.realWorldScenario,
            formatInstructions: (input) => input.formatInstructions
        },
        supportingMaterialPrompt,
        getChatModel,
        outputParserForSupportingMaterial
    ]);

    const supportingMaterial = await supportingMaterialPipeline.invoke({
        relatedContext: relatedContext,
        learningOutcomes: lessonOutline.learningOutcomes,
        topicOfTheLab: lessonOutline.lessonTitle,
        detailedOutline: detailedLabOutline,
        realWorldScenario: realWorldScenario,
        formatInstructions: outputParserForSupportingMaterial.getFormatInstructions()
    });

    // Define question generation prompt
    const questionGenerationPrompt = PromptTemplate.fromTemplate(QuestionGenerationPrompt);

    const outputParserForQuestions = StructuredOutputParser.fromZodSchema(zodSchemaForQuestions);

    // Create a runnable sequence for generating questions
    const questionGenerationPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            topicOfTheLab: (input) => input.topicOfTheLab,
            detailedOutline: (input) => input.detailedOutline,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial,
            formatInstructions: (input) => input.formatInstructions
        },
        questionGenerationPrompt,
        getChatModel,
        outputParserForQuestions
    ]);

    const questions = await questionGenerationPipeline.invoke({
        relatedContext: relatedContext,
        learningOutcomes: lessonOutline.learningOutcomes,
        topicOfTheLab: lessonOutline.lessonTitle,
        detailedOutline: detailedLabOutline,
        realWorldScenario: realWorldScenario,
        supportingMaterial: supportingMaterial,
        formatInstructions: outputParserForQuestions.getFormatInstructions()
    });

    return {
        realWorldScenario,
        detailedLabOutline,
        supportingMaterial,
        questions
    };

}


export { documentRetrievalPipeline, ingestionPipeline, responseSynthesizerForLabs };
