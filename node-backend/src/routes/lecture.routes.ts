import { Router } from "express";
import { generateLectureHandler,getLectureByIdHandler,getLecturesByLearnerHandler } from "../controllers/lecture.controller";


const lecturesRouter = Router();

lecturesRouter.get("/", getLecturesByLearnerHandler);

lecturesRouter.post("/generate", generateLectureHandler);
lecturesRouter.get('/:id', getLectureByIdHandler);
lecturesRouter.get

export default lecturesRouter;
