import { Router } from "express";
import {
    evaluateStudentAnswersHandler,
    generateLabMaterialsHandler,
    getLabSheetByIdHandler,
    getLearningMaterialSummaryByLessonNameHandler,
    generateHintForQuestionHandler,
    deleteLabSheetByIdHandler,
    updateLabSheetQuestionAnswerSubmissionStatusHandler,
    updateLabSheetStatusAsCompletedHandler
} from "../controllers/lab.controller";

const labRouter = Router();

/**
 * @route POST /api/v1/labs
 */
labRouter.get('/hint/:labSheetId/:questionNumber', generateHintForQuestionHandler);

/**
 * @route GET /api/v1/labs/:labSheetId
 */
labRouter.get('/:labSheetId', getLabSheetByIdHandler);

/**
 * @route GET /api/v1/labs/:moduleName/:lessonName
 */
labRouter.get('/:moduleName/:lessonName', getLearningMaterialSummaryByLessonNameHandler);

/**
 * @route POST /api/v1/labs/generate
 */
labRouter.post('/generate', generateLabMaterialsHandler);

/**
 * @route POST /api/v1/labs/evaluate-answer
 */
labRouter.post('/evaluate-answer', evaluateStudentAnswersHandler);

/**
 * @route POST /api/v1/labs/:labSheetId/update-submission-status
 */
labRouter.post('/:labSheetId/update-submission-status', updateLabSheetQuestionAnswerSubmissionStatusHandler);

/**
 * @route POST /api/v1/labs/:labSheetId/complete
 */
labRouter.post('/:labSheetId/complete', updateLabSheetStatusAsCompletedHandler);

/**
 * @route DELETE /api/v1/labs/:labSheetId
 */
labRouter.delete('/:labSheetId', deleteLabSheetByIdHandler);

export default labRouter;