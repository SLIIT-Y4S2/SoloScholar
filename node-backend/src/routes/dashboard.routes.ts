import { Router } from "express";
import {
  createIndicator,
  getIndicatorData,
  getIndicators,
} from "../controllers/dashboard.controller";

const dashboardRouter: Router = Router();

/**
 * @route POST /api/v1/dashboard/
 */
dashboardRouter.post("/", createIndicator);
dashboardRouter.get("/:instructorId", getIndicators);
dashboardRouter.get("/indicators/:indicatorId", getIndicatorData);

export default dashboardRouter;
