import { Router } from "express";
import {
  getTutorialsByLearnerHandler,
  getTutorialByIdHandler,
  saveTutorialAnswerHandler,
  submitTutorialHandler,
  markTutorialAsCompletedHandler,
  markHintAsViewedHandler,
} from "../controllers/tutorial/tutorial.controller";
import { validateData } from "../middlewares/zod.middleware";
import {
  getTutorialByIdSchema,
  getTutorialsByLearnerSchema,
  tutorialGenerationSchema,
} from "../models/tutorial.schema";
import {
  generateTutorialHandler,
  requestFeedbackHandler,
} from "../controllers/tutorial/tutorial_synthesize.controller";

const tutorialsRouter = Router();

/**
 * Tutorial generation route
 * @route POST /api/v1/tutorial/
 */

tutorialsRouter.post(
  "/",
  validateData(tutorialGenerationSchema),
  generateTutorialHandler
);

/**
 *  Get all tutorials by learner
 * @route GET /api/v1/tutorial/
 */

tutorialsRouter.get(
  "/",
  validateData(getTutorialsByLearnerSchema),
  getTutorialsByLearnerHandler
);

/**
 * Get tutorial by id
 * @route GET /api/v1/tutorial/:tutorialId
 */

tutorialsRouter.get(
  "/:tutorialId",
  validateData(getTutorialByIdSchema),
  getTutorialByIdHandler
);

/**
 * Save tutorial answer
 * @route POST /api/v1/tutorial/:tutorialId/answer
 */

tutorialsRouter.post("/:tutorialId/answer", saveTutorialAnswerHandler);

/**
 * Submit tutorial
 * @route POST /api/v1/tutorial/:tutorialId/submission
 */

tutorialsRouter.post("/:tutorialId/submission", submitTutorialHandler);

/**
 * Request feedback
 * @route POST /api/v1/tutorial/:tutorialId/feedback
 */

tutorialsRouter.post("/:tutorialId/feedback", requestFeedbackHandler);

/**
 * Mark tutorial as completed
 * @route POST /api/v1/tutorial/:tutorialId/complete
 */

tutorialsRouter.post("/:tutorialId/complete", markTutorialAsCompletedHandler);

/**
 * Mark hint as viewed
 * @route PATCH /api/v1/tutorial/:tutorialId/:questionId/hint
 */

tutorialsRouter.patch("/:tutorialId/:questionId/hint", markHintAsViewedHandler);

export default tutorialsRouter;
