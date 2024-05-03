import { Router } from "express";
import { getPracticalLabActivities } from "../controllers/lab.controller";

const labRouter = Router();

/**
 * @route POST /api/v1/labs
 */
labRouter.get('/', getPracticalLabActivities);

export default labRouter;