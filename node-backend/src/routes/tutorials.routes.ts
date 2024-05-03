import { Router } from "express";
import { getTutorials } from "../controllers/tutorials.controller";

const tutorialsRouter = Router();

/**
 * @route GET /api/v1/tutorial/
 */

tutorialsRouter.get("/", getTutorials); 

//TODO: 1. post route to generate tutorials
//TODO: 2. get route to get all tutorials of that student

export default tutorialsRouter;
