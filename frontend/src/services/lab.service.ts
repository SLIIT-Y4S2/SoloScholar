import { LAB_API_URLS } from "../utils/api_routes";
import axiosInstance from "../utils/axiosInstance";

export async function evaluateStudentsAnswer(studentsAnswer: string, labSheetId: string, questionsId: number) {
    console.log("Evaluating answer", studentsAnswer, labSheetId, questionsId);
    const response = await axiosInstance.post(LAB_API_URLS.EVALUATE_ANSWER, {
        studentsAnswer,
        labSheetId,
        questionsId
    });

    return response;

}

/**
 * 
 * @param moduleName 
 * @param lessonTitle 
 * @param learningLevel 
 * @returns 
 */
export async function generateLabExercise(moduleName: string, lessonTitle: string, learningLevel: string) {
    const response = axiosInstance.post(LAB_API_URLS.GENERATE_LAB_SHEET, {
        moduleName,
        lessonTitle,
        learningLevel
    });

    return response;
}

/**
 * 
 * @param labSheetId 
 * @returns 
 */
export async function getLabExerciseById(labSheetId: string) {
    const response = axiosInstance.get(`${LAB_API_URLS.GET_LAB_SHEET}/${labSheetId}`);

    return response;
}

/**
 * 
 * @param lessonId 
 * @returns 
 */
export async function getLabExerciseByModuleAndLessonName(moduleName: string, lessonName: string) {
    const response = axiosInstance.get(`${LAB_API_URLS.GET_LAB_BY_MODULE_NAME_AND_LESSON_TITLE}/${moduleName}/${lessonName}`);

    return response;
}

export async function getHintForQuestion(labSheetId: string, questionId: number) {
    const response = axiosInstance.get(`${LAB_API_URLS.GET_HINT}/${labSheetId}/${questionId}`);

    return response;
}
