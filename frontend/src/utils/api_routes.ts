import Lecture from "../Components/Lecture";

export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

export const API_URLS = {
  LOGIN: `/auth/login`,
  LOGOUT: `/auth/logout`,
  TUTORIAL: `/tutorial`,
  Lecture: `/lecture`,
  LectureTTS: `/lecture/tts`,
  LectureGenerate: `/lecture/generate`,
};

export const LAB_API_URLS = {
  ANSWER_EVALUATE: `/labs/evaluate-answer`,
  GET_LAB_BY_MODULE_NAME_AND_LESSON_TITLE: `/labs`,
  GENERATE_LAB_SHEET: `/labs/generate`,
  GET_LAB_SHEET: `/labs`,
  EVALUATE_ANSWER: `/labs/evaluate-answer`,
  GET_HINT: `/labs/hint`,
  UPDATE_SUBMISSION_STATUS: `/labs`,
};

export const DASHBOARD_API_URLS = {
  DASHBOARD: `${BASE_API_URL}/dashboard`,
  DASHBOARD_INDICATORS: `${BASE_API_URL}/dashboard/indicators`,
};
