export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

export const API_URLS = {
  LOGIN: `/auth/login`,
  LOGOUT: `/auth/logout`,
  TUTORIAL: `/tutorial`,
};

export const LAB_API_URLS = {
  ANSWER_EVALUATE: `${BASE_API_URL}/lab/evaluate-answer`,
  GET_LAB_SHEET: `${BASE_API_URL}/lab/get-lab-sheet`, //TODO: Add query params
};

export const DASHBOARD_API_URLS = {
  DASHBOARD: `${BASE_API_URL}/dashboard`,
  DASHBOARD_INDICATORS: `${BASE_API_URL}/dashboard/indicators`,
};
