import { Router } from "express";
import {
  generateTutorials,
  getTutorials,
  getTutorialByIdHandler,
  saveTutorialAnswerHandler,
} from "../controllers/tutorials.controller";

const tutorialsRouter = Router();

/**
 * @route POST /api/v1/tutorial/
 */

tutorialsRouter.post("/", generateTutorials);

//TODO: 2. get route to get all tutorials of that student

/**
 * @route GET /api/v1/tutorial/
 */

tutorialsRouter.get("/", getTutorials);

export default tutorialsRouter;

/**
 * @route GET /api/v1/tutorial/:tutorialId
 */

tutorialsRouter.get("/:tutorialId", getTutorialByIdHandler);

/**
 * @route POST /api/v1/tutorial/:tutorialId/answer
 */

tutorialsRouter.post("/:tutorialId/answer", saveTutorialAnswerHandler);
