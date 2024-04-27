import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SAMPLE_TEMPLATE } from "../prompt-templates/prompt_template";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString, splitPDFintoChunks, uploadChunkstoVectorDB } from "../utils/rag.util";

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
 * Document retrieval pipeline
 * @param userQuery - The user query
 * @returns A PineconeStore object
 */
async function documentRetrievalPipeline() {
    const pineconeIndex = await getPineconeIndex();
    const embeddingModel = getEmbeddings();

    // Get the PineconeStore object
    const pineconeStore = await PineconeStore.fromExistingIndex(
        embeddingModel,
        { pineconeIndex, }
    );

    const retriever = pineconeStore.asRetriever();

    // Create a runnable sequence
    const runnableSequence = RunnableSequence.from([
        (input) => input.question,
        retriever,
        convertDocsToString,
    ]);

    return runnableSequence;

};

async function responseSythesizer(userQuery: string) {
    const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(SAMPLE_TEMPLATE);

    const retrievalChain = RunnableSequence.from([
        {
            context: documentRetrievalPipeline,
            question: (input) => input.question
        },
        answerGenerationPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const response = await retrievalChain.invoke({
        question: userQuery,
    });

    return JSON.parse(response);
}


export { documentRetrievalPipeline, ingestionPipeline, responseSythesizer };
