import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";
import { dashboardDbService } from "../services/db/dashboard.db.service";

export async function createIndicator(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      goal: req.body.goal,
      result: await dashboardService.createIndicator(req.body.goal),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      goal: req.body.goal,
      error: error,
    });
  }
}

export async function getIndicators(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      result: await dashboardDbService.getIndicators(req.params.instructorId),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}

export async function getIndicatorData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      result: await dashboardDbService.getIndicatorData(req.params.indicatorId),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}
