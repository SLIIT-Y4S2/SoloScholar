import { Router } from "express";
import { createIndicator } from "../controllers/dashboard.controller";

const dashboardRouter: Router = Router();

/**
 * @route POST /api/v1/dashboard/
 */
dashboardRouter.post("/", createIndicator);

export default dashboardRouter;
