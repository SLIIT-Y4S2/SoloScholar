import { Request, Response } from "express";
import { splitPDFintoChunks, uploadChunkstoVectorDB } from "../utils/rag.util";

const postPDFDocument = async (req: Request, res: Response) => {
    const pdf_doc = req.file!;


    const chunks = await splitPDFintoChunks(pdf_doc);


    const vectorStore = await uploadChunkstoVectorDB(chunks);


    const similarity = await vectorStore.similaritySearch("Quantization of  vector spaces", 5);

    res.status(200).json({
        message: 'PDF document uploaded successfully',
        data: similarity

    });

};
export { postPDFDocument };
