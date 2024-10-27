import { Router } from "express";
import { generateLectureHandler,getLectureByIdHandler,getLecturesByLearnerHandler, saveStudentAnswerHandler,generateMarkdownPPTSlides,updateSubLectureCompletionHandler } from "../controllers/lecture.controller";
import { getTTSHandler } from '../controllers/tts.controller';


const lecturesRouter = Router();

lecturesRouter.get("/", getLecturesByLearnerHandler);
lecturesRouter.post("/tts",getTTSHandler);

lecturesRouter.post("/generate", generateLectureHandler);
lecturesRouter.get('/:id', getLectureByIdHandler);
lecturesRouter.post('/:id/answer', saveStudentAnswerHandler);
lecturesRouter.post('/subtopicslides', generateMarkdownPPTSlides);
lecturesRouter.patch('/:lectureId/sublecture/:subLectureId/completion', updateSubLectureCompletionHandler);


export default lecturesRouter;
