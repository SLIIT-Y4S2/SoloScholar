import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { logger } from "../utils/logger.utils";

export async function createLearnerHandler(
  req: Request<
    {},
    {},
    { first_name: string; last_name: string; email: string; password: string }
  >,
  res: Response
) {
  try {
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.email ||
      !req.body.password
    ) {
      return res
        .status(400)
        .send("Invalid request. Please provide all required fields.");
    }

    const user = await createUser(req.body, "learner");
    return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}

export async function createInstructorHandler(
  req: Request<
    {},
    {},
    { first_name: string; last_name: string; email: string; password: string }
  >,
  res: Response
) {
  try {
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.email ||
      !req.body.password
    ) {
      return res
        .status(400)
        .send("Invalid request. Please provide all required fields.");
    }

    const user = await createUser(req.body, "instructor");
    return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
