import { Router } from "express";
import { generateLectureHandler,getLectureByIdHandler } from "../controllers/lecture.controller";


const lecturesRouter = Router();

lecturesRouter.post("/generate", generateLectureHandler);
lecturesRouter.get('/:id', getLectureByIdHandler);

export default lecturesRouter;
