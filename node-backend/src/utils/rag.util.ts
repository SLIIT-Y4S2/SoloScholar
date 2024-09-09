import { Document } from "@langchain/core/documents";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VECTORDIMENSIONS } from "../constants/pinecone.constants";
import {
  getDashboardPineconeIndex,
  getPineconeIndex,
  uploadDocumentToPinecone,
} from "./pinecone.util";
import { RunnableSequence } from "@langchain/core/runnables";
import { PineconeStore } from "@langchain/pinecone";
import { getEmbeddings } from "./openai.util";

/**
 *
 * @param file Multer file object
 * @returns Array of text chunks
 */
async function splitPDFintoChunks(file: Express.Multer.File) {
  const data = file.buffer;
  const mimeType = file.mimetype;

  // Create a Blob object from the file data
  const blob = new Blob([data], { type: mimeType });

  const loader = new PDFLoader(blob);

  // Load the PDF document
  const doc = await loader.load();

  // Instantiate the RecursiveCharacterTextSplitter
  const splitter = new RecursiveCharacterTextSplitter({
    separators: ["\n"],
    chunkSize: VECTORDIMENSIONS,
    chunkOverlap: 256,
  });

  // Split the document into text chunks
  const splitedTextChunks = await splitter.splitDocuments(doc);

  return splitedTextChunks;
}

/**
 *
 * @param textChunks Array of text chunks
 * @returns A PineconeStore object
 */
async function uploadChunksToVectorDB(
  textChunks: Document<Record<string, any>>[]
) {
  const vectorStore = await uploadDocumentToPinecone(textChunks);

  return vectorStore;
}

/**
 *
 * @param documents Array of Document objects
 * @returns A string of concatenated documents formatted in a way that LLM can understand
 */
async function convertDocsToString(documents: Document[]) {
  return documents
    .map((document) => {
      return `<document>\n ${document.pageContent} \n</document>`;
    })
    .join("\n");
}

/**
 *
 * @param documents Array of Document objects
 * @returns A string of concatenated documents formatted in a way that LLM can understand
 */
async function convertTablesToString(documents: Document[]) {
  return documents
    .map((document) => {
      return `<table>\n ${document.metadata.name} \n</table>`;
    })
    .join("\n");
}

/**
 * Document retrieval pipeline
 * @param keyWords - The user query
 * @param kValue - The number of similar documents to retrieve
 * @returns A string of related context
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

async function analyticalIndicatorContextRetrievalPipeline(
  keyWords: string,
  kValue: number = 10
) {
  const pineconeIndex = await getDashboardPineconeIndex();
  const embeddingModel = getEmbeddings();

  // Get the PineconeStore object
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex,
  });

  // Fetch the top k similar documents.
  const retriever = pineconeStore.asRetriever(kValue);

  // Create a runnable sequence
  const runnableSequence = RunnableSequence.from([
    (input) => input.keyWords,
    retriever,
    convertTablesToString,
  ]);

  const relatedContext = await runnableSequence.invoke({ keyWords: keyWords });

  return relatedContext;
}

/**
 * Ingestion pipeline
 * @param file - The PDF file to ingest
 */
async function ingestionPipeline(file: Express.Multer.File) {
  // Split the PDF document into text chunks
  const textChunks = await splitPDFintoChunks(file);

  // Upload the text chunks to Pinecone
  await uploadChunksToVectorDB(textChunks);
}

export {
  convertDocsToString,
  splitPDFintoChunks,
  uploadChunksToVectorDB,
  documentRetrievalPipeline,
  analyticalIndicatorContextRetrievalPipeline,
  ingestionPipeline,
};
