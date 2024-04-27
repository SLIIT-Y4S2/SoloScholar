import { Router } from "express";
import { getPDFDocumentById, getPDFDocumentNames, postPDFDocument } from "../controllers/document.controller";

const documentRouter = Router();

/**
 * @route GET /api/v1/docs
 * @description Get names of all documents
 * @access Public
 * @returns {Array} documentNames
 * @returns {Number} count
 */
documentRouter.get('/', getPDFDocumentNames);

/**
 * @route POST /api/v1/docs
 * @description Upload a PDF document
 * @access Public
 * @returns {String} message
 */
documentRouter.post('/', postPDFDocument);

/**
 * @route GET /api/v1/docs/:id
 * @description Get a document by id
 * @access Public
 * @returns {Object} document
 */
documentRouter.get('/:id', getPDFDocumentById);

export default documentRouter;