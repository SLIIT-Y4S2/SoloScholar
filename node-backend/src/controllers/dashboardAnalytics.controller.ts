import { Request, Response } from "express";
import { dashboardAnalyticsDbService } from "../services/db/dashboardAnalytics.db.service";

export async function getLessonsOfModule(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      result: await dashboardAnalyticsDbService.getLessonsOfModule(
        req.params.moduleId
      ),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}

export async function getTutorialAnalytics(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { moduleId, learningLevel, lessonId, lessonTitle } = req.body;
    res.status(200).send({
      result: await dashboardAnalyticsDbService.getTutorialAnalytics({
        moduleId,
        learningLevel,
        lessonId,
        lessonTitle,
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}

export async function getLectureAnalytics(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { moduleId, learningLevel, lessonId, lessonTitle } = req.body;

    res.status(200).send({
      result: await dashboardAnalyticsDbService.getLectureAnalytics({
        moduleId,
        learningLevel,
        lessonId,
        lessonTitle,
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}
export async function getLabAnalytics(
  req: Request,
  res: Response
): Promise<void> {
  const { moduleId, learningLevel, lessonId, lessonTitle } = req.body;
  try {
    res.status(200).send({
      result: await dashboardAnalyticsDbService.getLabAnalytics({
        moduleId,
        learningLevel,
        lessonId,
        lessonTitle,
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}
