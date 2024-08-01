export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

export const API_URLS = {
  LOGIN: `/auth/login`,
  LOGOUT: `/auth/logout`,
  TUTORIAL: `/tutorial`,
};

export const LAB_API_URLS = {
  ANSWER_EVALUATE: `/labs/evaluate-answer`,
  GENERATE_LAB_SHEET: `/labs/generate`,
  GET_LAB_SHEET: `/labs`,
};

export const DASHBOARD_API_URLS = {
  CREATE_INDICATOR: `${BASE_API_URL}/dashboard`,
};
