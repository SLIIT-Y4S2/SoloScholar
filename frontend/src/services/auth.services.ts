import axios from "axios";
import { API_URLS } from "../utils/api_routes";

export const login = async (studentId: string, password: string) => {
  // Send a request to the server to login
  const response = await axios.post(
    API_URLS.LOGIN,
    {
      studentId,
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
  await axios.post(
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
