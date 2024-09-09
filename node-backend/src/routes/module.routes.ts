import { Router } from "express";
import {
  createModuleHandler,
  getModuleByNameHandler,
} from "../controllers/module.controller";
import requireInstructorMiddleware from "../middlewares/requireInstructor.middleware";
import requireUser from "../middlewares/requireUser.middleware";

const moduleRouter = Router();

/**
 * @route POST /api/v1/module/
 */

moduleRouter.post("/", requireInstructorMiddleware, createModuleHandler);

moduleRouter.get("/:name", requireUser, getModuleByNameHandler);

export default moduleRouter;
