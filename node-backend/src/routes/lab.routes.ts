import { Router } from "express";
import { evaluateStudentsAnswer, getPracticalLabActivities } from "../controllers/lab.controller";

const labRouter = Router();

/**
 * @route POST /api/v1/labs
 */
labRouter.get('/generate', getPracticalLabActivities);
labRouter.post('/evaluate-answer', evaluateStudentsAnswer);

export default labRouter;