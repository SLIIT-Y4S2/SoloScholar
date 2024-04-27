import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { uploadDocumentToPinecone, retrieveVectorsFromPinecone } from "./pinecone.util";
import { encoding_for_model } from "tiktoken";
import { VECTORDIMENSIONS } from "../constants/pinecone.constants";

const enc = (text: string) => {
    const encoding = encoding_for_model("text-davinci-003");
    return encoding;
}

const splitPDFintoChunks = async (file: Express.Multer.File) => {
    const data = file.buffer;
    const mimeType = file.mimetype;

    const blob = new Blob([data], { type: mimeType });

    const loader = new PDFLoader(blob);

    const doc = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        separators: ['\n'],
        chunkOverlap: 256,
        chunkSize: VECTORDIMENSIONS,
    });
    const splitedTextChunks = await splitter.splitDocuments(doc);
    return splitedTextChunks;
};

const uploadChunkstoVectorDB = async (textChunks: Document<Record<string, any>>[]) => {
    const vectorStore = await uploadDocumentToPinecone(textChunks);

    return vectorStore;
};

const docsToString = async (req: Request, res: Response) => {

};


export { splitPDFintoChunks, uploadChunkstoVectorDB, docsToString, enc };