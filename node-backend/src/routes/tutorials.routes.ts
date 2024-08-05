import { Router } from "express";
import {
  generateTutorialHandler,
  getTutorialsByLearnerHandler,
  getTutorialByIdHandler,
  saveTutorialAnswerHandler,
  submitTutorialHandler,
  requestFeedbackHandler,
} from "../controllers/tutorials.controller";

const tutorialsRouter = Router();

/**
 * @route POST /api/v1/tutorial/
 */

tutorialsRouter.post("/", generateTutorialHandler);

//TODO: 2. get route to get all tutorials of that student

/**
 * @route GET /api/v1/tutorial/
 */

tutorialsRouter.get("/", getTutorialsByLearnerHandler);

export default tutorialsRouter;

/**
 * @route GET /api/v1/tutorial/:tutorialId
 */

tutorialsRouter.get("/:tutorialId", getTutorialByIdHandler);

/**
 * @route POST /api/v1/tutorial/:tutorialId/answer
 */

tutorialsRouter.post("/:tutorialId/answer", saveTutorialAnswerHandler);

/**
 * @route POST /api/v1/tutorial/:tutorialId/submission
 */

tutorialsRouter.post("/:tutorialId/submission", submitTutorialHandler);

/**
 * @route POST /api/v1/tutorial/:tutorialId/feedback
 */

tutorialsRouter.post("/:tutorialId/feedback", requestFeedbackHandler);
