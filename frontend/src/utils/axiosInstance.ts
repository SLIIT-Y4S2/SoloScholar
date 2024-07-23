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

export default axiosInstance;
