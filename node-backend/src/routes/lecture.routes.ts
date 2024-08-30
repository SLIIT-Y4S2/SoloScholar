import { Router } from "express";
import { generateLectureHandler,getLectureByIdHandler,getLecturesByLearnerHandler } from "../controllers/lecture.controller";
import { getTTSHandler } from '../controllers/tts.controller';


const lecturesRouter = Router();

lecturesRouter.get("/", getLecturesByLearnerHandler);
lecturesRouter.post("/tts",getTTSHandler);

lecturesRouter.post("/generate", generateLectureHandler);
lecturesRouter.get('/:id', getLectureByIdHandler);


export default lecturesRouter;
