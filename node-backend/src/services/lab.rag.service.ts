import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString, splitPDFintoChunks, uploadChunkstoVectorDB } from "../utils/rag.util";
import { SetterQuesionGenerationPrompt, SetterRealWorldScenarioPrompt, SetterPracticalLabOutlinePrompt, SetterSupportingMaterialGenerationPrompt } from "../prompt-templates/lab.prompts";
import { LessonOutlineType } from "../types/lesson.types";
import { LESSON_OUTLINE } from "../dummyData/lessonOutline";

// Define the type of the output for the real-world scenario prompt
interface RealWorldScenarioPromptOutput {
    realWorldScenario: string;
}


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
 * @param topicOftheLab 
 * @returns 
 */
async function responseSythesizerForLabs(topic: String) {

    // Topic of the lab
    const lessonOutline = LESSON_OUTLINE.find((lesson) => lesson.lessonTitle === topic)!;

    // Extract keywords from the lesson outline
    const keyWords = extractKeywordsFromLessonOutline(lessonOutline);



    // Document retrieval pipeline
    const relatedContext = await documentRetrievalPipeline(keyWords);


    // Runnable sequence for generating the practical lab outline
    const practicalLabOutlinePrompt = ChatPromptTemplate.fromTemplate(SetterPracticalLabOutlinePrompt);

    const practicalLabOutlinePipeline = RunnableSequence.from([
        {
            learningOutcomes: (input) => input.learningOutcomes,
            incompleteOutline: (input) => input.incompleteOutline,
            context: (input) => input.relatedContext
        },
        practicalLabOutlinePrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const subTopicsForPracticalLab = await practicalLabOutlinePipeline.invoke({
        learningOutcomes: lessonOutline.learningOutcomes,
        incompleteOutline: lessonOutline,
        relatedContext: relatedContext
    });

    // Runnable sequence for generating a real-world scenario
    const realWorldScenarioGenerationPrompt = ChatPromptTemplate.fromTemplate(SetterRealWorldScenarioPrompt);

    const realWorldScenarioGenerationPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            learningOutcomes: (input) => input.learningOutcomes,
            subTopics: (input) => input.subTopics
        },
        realWorldScenarioGenerationPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const realWorldScenario: RealWorldScenarioPromptOutput = {
        realWorldScenario: await realWorldScenarioGenerationPipeline.invoke({
            context: relatedContext,
            subTopics: subTopicsForPracticalLab,
            learningOutcomes: lessonOutline.learningOutcomes
        })
    } as RealWorldScenarioPromptOutput


    // Runnable sequence for generating supporting materials for the lab
    const supportingMaterialGenerationPrompt = ChatPromptTemplate.fromTemplate(SetterSupportingMaterialGenerationPrompt);

    const supportingMaterialGenerationPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            learningOutcomes: (input) => input.learningOutcomes,
            subTopics: (input) => input.subTopics,
            realWorldScenario: (input) => input.realWorldScenario
        },
        supportingMaterialGenerationPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const supportingMat = await supportingMaterialGenerationPipeline.invoke({
        context: relatedContext,
        learningOutcomes: lessonOutline.learningOutcomes,
        subTopics: subTopicsForPracticalLab,
        realWorldScenario: realWorldScenario.realWorldScenario
    });



    // Runnable sequence for generating questions based on the real-world scenario
    const questionGenerationPrompt = ChatPromptTemplate.fromTemplate(SetterQuesionGenerationPrompt);

    const questionGenerationPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            learningOutcomes: (input) => input.learningOutcomes,
            subTopics: (input) => input.subTopics,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial
        },
        questionGenerationPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const labActivity = await questionGenerationPipeline.invoke({
        context: relatedContext,
        learningOutcomes: lessonOutline.learningOutcomes,
        subTopics: subTopicsForPracticalLab,
        realWorldScenario: realWorldScenario.realWorldScenario,
        supportingMaterial: supportingMat
    });


    return ({
        realWorldScenario: realWorldScenario.realWorldScenario,
        subTopics: JSON.parse(subTopicsForPracticalLab),
        supportingMaterial: supportingMat,
        labActivity: JSON.parse(labActivity)
    });
}


export { documentRetrievalPipeline, ingestionPipeline, responseSythesizerForLabs };
