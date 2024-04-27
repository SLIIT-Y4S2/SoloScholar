export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

export const API_URLS = {
  LOGIN: `${BASE_API_URL}/auth/login`,
  LOGOUT: `${BASE_API_URL}/auth/logout`,
};
