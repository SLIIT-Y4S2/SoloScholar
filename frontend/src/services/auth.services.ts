import { User } from "../types/auth-user";
import { API_URLS } from "../utils/api_routes";
import axiosInstance from "../utils/axiosInstance";

export const login = async (email: string, password: string) => {
  // Send a request to the server to login
  const response = await axiosInstance.post<User>(API_URLS.LOGIN, {
    email,
    password,
  });

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
