export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
export const WEB_SOCKET_URL = import.meta.env.VITE_WEB_SOCKET_URL;

export const API_URLS = {
  LOGIN: `/auth/login`,
  LOGOUT: `/auth/logout`,
  TUTORIAL: `/tutorial`,
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

export const DISCUSSION_API_URLS = {
  GET_DISCUSSIONS: `/discussions/modules`,
  GET_DISCUSSION: `/discussions`,
  CREATE_DISCUSSION: `/discussions`,
  ADD_COMMENT: `/discussions/comments`,
  LIKE_DISCUSSION: `/discussions/like`,
  UNLIKE_DISCUSSION: `/discussions/unlike`,
  LIKE_COMMENT: `/discussions/comments/like`,
  UNLIKE_COMMENT: `/discussions/comments/unlike`,
};