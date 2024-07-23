import { Document } from "@langchain/core/documents";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VECTORDIMENSIONS } from "../constants/pinecone.constants";
import { uploadDocumentToPinecone } from "./pinecone.util";

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
        separators: ['\n'],
        chunkSize: VECTORDIMENSIONS,
        chunkOverlap: 256,
    });

    // Split the document into text chunks
    const splitedTextChunks = await splitter.splitDocuments(doc);

    return splitedTextChunks;
};


/**
 * 
 * @param textChunks Array of text chunks
 * @returns A PineconeStore object
 */
async function uploadChunkstoVectorDB(textChunks: Document<Record<string, any>>[]) {
    const vectorStore = await uploadDocumentToPinecone(textChunks);

    return vectorStore;
};

/**
 * 
 * @param documents Array of Document objects
 * @returns A string of concatenated documents formatted in a way that LLM can understand
 */
async function convertDocsToString(documents: Document[]) {
    return documents
        .map(document => {
            return `<document>\n ${document.pageContent} \n</document>`
        })
        .join("\n");
};

export { convertDocsToString, splitPDFintoChunks, uploadChunkstoVectorDB };

