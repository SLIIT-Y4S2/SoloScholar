import { Router } from "express";
import {
  getTutorialAnalytics,
  getLabAnalytics,
  getLectureAnalytics,
  getLessonsOfModule,
} from "../controllers/dashboardAnalytics.controller";

const dashboardAnalyticsRouter: Router = Router();

dashboardAnalyticsRouter.get("/lessons/:moduleId", getLessonsOfModule);
dashboardAnalyticsRouter.post("/tutorial-analytics", getTutorialAnalytics);
dashboardAnalyticsRouter.post("/lab-analytics", getLabAnalytics);
dashboardAnalyticsRouter.post("/lecture-analytics", getLectureAnalytics);

export default dashboardAnalyticsRouter;
