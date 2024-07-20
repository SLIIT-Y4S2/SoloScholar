export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

export const API_URLS = {
  LOGIN: `${BASE_API_URL}/auth/login`,
  LOGOUT: `${BASE_API_URL}/auth/logout`,
};

export const LAB_API_URLS = {
  ANSWER_EVALUATE: `${BASE_API_URL}/lab/evaluate-answer`,
  GET_LAB_SHEET: `${BASE_API_URL}/lab/get-lab-sheet`, //TODO: Add query params
};


