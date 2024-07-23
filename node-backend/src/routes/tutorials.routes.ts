import { Router } from "express";
import {
  generateTutorials,
  getTutorials,
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
