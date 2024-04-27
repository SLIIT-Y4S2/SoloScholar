import axios, { AxiosInstance } from "axios";
import { BASE_API_URL } from "./constants";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  // timeout: 5000, // Set the timeout value in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
