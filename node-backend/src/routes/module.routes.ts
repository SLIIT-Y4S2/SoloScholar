import { Router } from "express";
import { createModuleHandler } from "../controllers/module.controller";

const moduleRouter = Router();

/**
 * @route POST /api/v1/module/
 */

moduleRouter.post("/", createModuleHandler);

export default moduleRouter;
