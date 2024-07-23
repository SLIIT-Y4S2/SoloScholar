import { Router } from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";
import requireUser from "../middlewares/requireUser.middleware";
const authRouter = Router();

authRouter.post(
  "/login",
  // validateResource(createSessionSchema),

  authController.createUserSessionHandler
);

// TODO change this to a protected route (ADMIN ONLYs)
authRouter.post(
  "/create-user-for-testing",
  // validateResource(createSessionSchema),
  userController.createUserHandler
);

authRouter.post(
  "/logout",
  requireUser,
  authController.invalidateUserSessionHandler
);
export default authRouter;
