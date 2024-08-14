import axios, { AxiosInstance } from "axios";
import { BASE_API_URL } from "./api_routes";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  // timeout: 5000, // Set the timeout value in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      // Clear local storage if the status code is 401 (Unauthorized)
      console.log("Error response:", error.response);

      if (status === 401 && data.message.startsWith("Unauthorized")) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    // Return the error so that it can be handled by the calling code
    return Promise.reject(error);
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAxiosError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return "An unexpected error occurred";
};

export default axiosInstance;
