import { Router } from "express";
import {
  createModuleHandler,
  getModuleByNameHandler,
} from "../controllers/module.controller";

const moduleRouter = Router();

/**
 * @route POST /api/v1/module/
 */

moduleRouter.post("/", createModuleHandler);

moduleRouter.get("/:name", getModuleByNameHandler);

export default moduleRouter;
