import { API_URLS } from "../utils/api_routes";
import axiosInstance from "../utils/axiosInstance";

export const login = async (student_id: string, password: string) => {
  // Send a request to the server to login
  const response = await axiosInstance.post(
    API_URLS.LOGIN,
    {
      student_id,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const logout = async () => {
  // Send a request to the server to invalidate the token
  await axiosInstance.post(
    API_URLS.LOGOUT,
    {},
    {
      withCredentials: true,
    }
  );
  // Remove the user details from the local storage
  localStorage.removeItem("userDetails");
};

export default {
  login,
  logout,
  // register,
  // resetPassword,
  // verifyEmail,
};
