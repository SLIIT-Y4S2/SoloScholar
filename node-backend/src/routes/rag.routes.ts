import { Router } from "express";
import { getOutput } from "../controllers/rag.controller";

const ragRouter = Router();

/**
 * @route GET /api/v1/rag/
 */
ragRouter.get('/', getOutput);

export default ragRouter;