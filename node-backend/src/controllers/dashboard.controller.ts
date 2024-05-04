import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

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
    res.status(400).send({
      goal: req.body.goal,
      error: error,
    });
  }
}
