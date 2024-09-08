import { Router } from "express";
import {
  generateIndicator,
  deleteIndicator,
  getIndicatorData,
  getIndicators,
  saveIndicator,
  editIndicator,
} from "../controllers/dashboard.controller";

const dashboardRouter: Router = Router();

/**
 * @route POST /api/v1/dashboard/
 */
dashboardRouter.post("/", generateIndicator);
dashboardRouter.post("/indicators", saveIndicator);
dashboardRouter.put("/indicators", editIndicator);
dashboardRouter.get("/", getIndicators);
dashboardRouter.get("/indicators/:indicatorId", getIndicatorData);
dashboardRouter.delete("/indicators/:indicatorId", deleteIndicator);

export default dashboardRouter;
