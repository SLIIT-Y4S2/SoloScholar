import { BlobServiceClient } from "@azure/storage-blob";
import { MongooseError } from "mongoose";
import {
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_CONTAINER_NAME,
  AZURE_STORAGE_SAS_TOKEN,
} from "../constants/azure.constants";
import PDFDocumentModel from "../models/document.model";

/**
 * Retrieves an array of document names and the count of documents.
 * @returns {Array<string>} An array of document names.
 * @throws {Error} MongooseError or Error if an error occurs.
 */
async function getDocumentNames() {
  try {
    // Find all documents and return only the name field
    const documentNames = await PDFDocumentModel.find({}, "name");

    return documentNames;
  } catch (error: any) {
    console.error("Error getting document names:", error);

    // Check if error is an instance of MongooseError
    if (error instanceof MongooseError) {
      throw error;
    } else {
      throw new Error(error);
    }
  }
}

/**
 * Retrieves a document by its ID.
 * @param {string} documentId - The ID of the document to retrieve.
 * @returns {Object} The retrieved document object.
 * @throws {MongooseError || Error}  MongooseError or Error if an error occurs.
 */
async function getDocumentById(documentId: string) {
  try {
    // Find document by id
    const document = await PDFDocumentModel.findById(documentId);

    return document;
  } catch (error: any) {
    console.error("Error uploading PDF document:", error);

    // Check if error is an instance of MongooseError
    if (error instanceof MongooseError) {
      throw error;
    } else {
      throw new Error(error);
    }
  }
}

/**
 * Handles the upload of a PDF document.
 * @param {Express.Multer.File} file - The PDF file to upload.
 * @returns {Object} The uploaded document object.
 * @throws {MongooseError || Error} MongooseError or Error if an error occurs.
 */
async function handlePdfDocumentUpload(file: Express.Multer.File) {
  try {
    // Create a new BlobServiceClient
    const blobServiceClient = new BlobServiceClient(
      `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${AZURE_STORAGE_SAS_TOKEN}`
    );

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(
      AZURE_STORAGE_CONTAINER_NAME
    );

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(
      file.originalname
    );

    // Upload data to the blob
    await blockBlobClient.uploadData(file.buffer);

    // URL of the uploaded document
    const documentUrl = blockBlobClient.url;

    // Save document details to the mongodb
    const newReferencePdf = await PDFDocumentModel.create({
      name: file.originalname,
      url: documentUrl,
      mimeType: file.mimetype,
      size: file.size,
    });

    return newReferencePdf;
  } catch (error: any) {
    console.error("Error uploading PDF document:", error);

    // Check if error is an instance of MongooseError
    if (error instanceof MongooseError) {
      throw error;
    } else {
      throw new Error(error);
    }
  }
}

export { getDocumentById, getDocumentNames, handlePdfDocumentUpload };
