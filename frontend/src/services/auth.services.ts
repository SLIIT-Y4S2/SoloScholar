import axios from "axios";

export const logout = async () => {
  // Send a request to the server to invalidate the token
  await axios.post(
    "http://localhost:5000/api/v1/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
  // Remove the user details from the local storage
  localStorage.removeItem("userDetails");
};

export default {
  // login,
  logout,
  // register,
  // resetPassword,
  // verifyEmail,
};
