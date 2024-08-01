import { LAB_API_URLS } from "../utils/api_routes";
import axiosInstance from "../utils/axiosInstance";

export async function evaluateStudentsAnswer(studentsAnswer: string, correctAnswer: string): Promise<boolean> {
    //Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return false;
}

export async function generateLabExercise(moduleName: string, lessonTitle: string, learningLevel: string) {
    const response = axiosInstance.post(LAB_API_URLS.GENERATE_LAB_SHEET, {
        moduleName,
        lessonTitle,
        learningLevel
    });

    return response;
}

export async function getLabExerciseById(labSheetId: string) {
    const response = axiosInstance.get(`${LAB_API_URLS.GET_LAB_SHEET}/${labSheetId}`);

    return response;
}
