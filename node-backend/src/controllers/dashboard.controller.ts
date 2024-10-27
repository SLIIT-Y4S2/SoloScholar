import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";
import { dashboardDbService } from "../services/db/dashboard.db.service";

export async function generateIndicator(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      goal: req.body.goal,
      result: await dashboardService.generateIndicator(req.body.goal),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({
      goal: req.body.goal,
      error: error,
    });
  }
}

export async function saveIndicator(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      result: await dashboardDbService.saveIndicator({
        ...req.body,
        instructorId: res.locals.user.id,
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({
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
      result: await dashboardDbService.getIndicators(res.locals.user.id),
    });
  } catch (error: any) {
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

export async function editIndicator(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      result: await dashboardDbService.editIndicator({
        ...req.body,
        instructorId: res.locals.user.id,
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}

export async function deleteIndicator(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.status(200).send({
      result: await dashboardDbService.deleteIndicator(
        req.params.indicatorId,
        res.locals.user.id
      ),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error,
    });
  }
}
