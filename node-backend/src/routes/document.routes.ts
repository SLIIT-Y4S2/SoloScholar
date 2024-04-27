import { Router } from "express";
import { postPDFDocument } from "../controllers/document.controller";

const documentRouter = Router();

documentRouter.post('/', postPDFDocument);

export default documentRouter;