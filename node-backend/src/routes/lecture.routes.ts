import { Router } from "express";
import { generateLectureHandler } from "../controllers/lecture.controller";


const lecturesRouter = Router();

lecturesRouter.post("/generate", generateLectureHandler);

export default lecturesRouter;
