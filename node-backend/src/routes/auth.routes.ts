import { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  createInstructorHandler,
  createLearnerHandler,
} from "../controllers/user.controller";
import requireUser from "../middlewares/requireUser.middleware";
const authRouter = Router();

authRouter.post(
  "/login",
  // validateResource(createSessionSchema),
  authController.createUserSessionHandler
);

// TODO change this to a protected route (ADMIN ONLYs)
authRouter.post(
  "/create-learner-for-testing",
  // validateResource(createSessionSchema),
  createLearnerHandler
);

// TODO change this to a protected route (ADMIN ONLY)
authRouter.post(
  "/create-instructor-for-testing",
  // validateResource(createSessionSchema),
  createInstructorHandler
);

authRouter.post(
  "/logout",
  requireUser,
  authController.invalidateUserSessionHandler
);
export default authRouter;
