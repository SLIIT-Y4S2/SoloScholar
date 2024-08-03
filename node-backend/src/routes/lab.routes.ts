import { Router } from "express";
import { generateLabMaterialsHandler, getLabSheetByIdHandler, getLearningMaterialSummaryByLessonNameHandler } from "../controllers/lab.controller";

const labRouter = Router();

/**
 * @route POST /api/v1/labs
 */
labRouter.post('/generate', generateLabMaterialsHandler);
labRouter.get('/:labSheetId', getLabSheetByIdHandler);
labRouter.get('/:moduleName/:lessonName', getLearningMaterialSummaryByLessonNameHandler);

export default labRouter;