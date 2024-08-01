import { Router } from "express";
import { generateLabMaterialsHandler, getLabSheetByIdHandler } from "../controllers/lab.controller";

const labRouter = Router();

/**
 * @route POST /api/v1/labs
 */
labRouter.post('/generate', generateLabMaterialsHandler);
labRouter.get('/:labSheetId', getLabSheetByIdHandler);

export default labRouter;