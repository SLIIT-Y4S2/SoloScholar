import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { TEXT_EMBEDDING_MODEL } from "../constants/pinecone.constants";
import { OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX } from "../constants/app.constants";


const embeddings = new OpenAIEmbeddings({
    apiKey: OPENAI_API_KEY,
    model: TEXT_EMBEDDING_MODEL,
});

const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY,

});

const pineconeIndex = pinecone.Index(PINECONE_INDEX);


const uploadDocumentToPinecone = async (chunks: Document<Record<string, any>>[]) => {

    const vectorStore = await PineconeStore.fromDocuments(chunks, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });

    return vectorStore;
};

const retrieveVectorsFromPinecone = async () => {
    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        { pineconeIndex }
    );
};

export { uploadDocumentToPinecone, retrieveVectorsFromPinecone };
