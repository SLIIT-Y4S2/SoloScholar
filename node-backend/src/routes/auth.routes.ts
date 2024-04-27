import { Router } from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";
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

// authRouter.get("/api/sessions", requireUser, authController.getUserSessionsHandler);

// authRouter.delete(
//   "/api/sessions",
//   requireUser,
//   authController.deleteSessionHandler
// );
authRouter.post("/logout", authController.invalidateUserSessionHandler);
export default authRouter;
