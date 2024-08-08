import { Router } from "express";
import { evaluateStudentAnswersHandler, generateLabMaterialsHandler, getLabSheetByIdHandler, getLearningMaterialSummaryByLessonNameHandler, generateHintForQuestionHandler } from "../controllers/lab.controller";

const labRouter = Router();

/**
 * @route POST /api/v1/labs
 */
labRouter.get('/hint/:labSheetId/:questionId', generateHintForQuestionHandler);
labRouter.get('/:labSheetId', getLabSheetByIdHandler);
labRouter.get('/:moduleName/:lessonName', getLearningMaterialSummaryByLessonNameHandler);
labRouter.post('/generate', generateLabMaterialsHandler);
labRouter.post('/evaluate-answer', evaluateStudentAnswersHandler);

export default labRouter;