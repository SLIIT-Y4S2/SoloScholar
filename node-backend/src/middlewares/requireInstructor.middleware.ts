import { Request, Response, NextFunction } from "express";
import requireUser from "./requireUser.middleware";

const requireInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (user.role !== "instructor") {
    return res.status(403).json({
      message: "Forbidden: User is not an instructor",
    });
  }

  return next();
};

export default [requireUser, requireInstructor];
