import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { getDocumentById, getDocumentNames, handlePdfDocumentUpload } from "../services/document.service";
import { ingestionPipeline } from "../services/rag.service";

/**
 * @route POST /api/v1/docs
 * @param req Express request object
 * @param res Express response object
 * @returns Response with the uploaded document
 * @throws {MongooseError || Error} MongooseError or Error if an error occurs
 */
async function postPDFDocument(req: Request, res: Response) {

    const pdfDoc = req.file;

    if (pdfDoc == undefined) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    if (pdfDoc.mimetype !== "application/pdf") {
        return res.status(415).json({ message: "Invalid file type" });
    }

    try {
        // Upload the document to Azure Blob Storage and metadata to MongoDB
        const document = await handlePdfDocumentUpload(pdfDoc);

        // Upload the document to Pinecone
        await ingestionPipeline(pdfDoc);

        return res.status(201).json(document);
    } catch (error) {
        if (error instanceof MongooseError || error instanceof Error) {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(500).json({ message: error });
        }
    }
};

/**
 * @route GET /api/v1/docs
 * @param req Express request object
 * @param res Express response object
 * @returns Response with the names of all documents
 * @throws {MongooseError || Error} MongooseError or Error if an error occurs
 */
async function getPDFDocumentNames(req: Request, res: Response) {
    try {
        const documentNames = await getDocumentNames();
        const documentsCount = documentNames.length;

        if (documentsCount === 0) {
            return res.status(200).json({ message: "No documents found" });
        }

        return res.status(200).json({
            documentNames: documentNames,
            count: documentsCount,
        });

    } catch (error) {
        if (error instanceof MongooseError || error instanceof Error) {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(500).json({ message: error });
        }
    }
};

/**
 * @route GET /api/v1/docs/:id
 * @param req Express request object
 * @param res Express response object
 * @returns Response with the document
 * @throws {MongooseError || Error} MongooseError or Error if an error occurs
 */
async function getPDFDocumentById(req: Request, res: Response) {
    try {
        const documentId = req.params.id;

        const document = await getDocumentById(documentId);

        return res.status(200).json({
            document: document,
        });
    } catch (error) {
        if (error instanceof MongooseError || error instanceof Error) {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(500).json({ message: error });
        }
    }
};

export { getPDFDocumentById, getPDFDocumentNames, postPDFDocument };

