import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect } from "react";
import authServices from "../services/auth.services";
import { Spin } from "antd";

const Logout = () => {
  const { setUserDetails } = useAuth();
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   setUserDetails(null);
  //   navigate("/", { replace: true });
  // };

  useEffect(() => {
    const logout = async () => {
      try {
        setUserDetails(null);
        await authServices.logout();
        navigate("/login", { replace: true });
      } catch (error) {
        navigate("/", { replace: true });
        console.error("Error logging out:", error);
      }
    };

    logout();
  }, [setUserDetails, navigate]);

  return (
    <div className="text-center">
      <Spin size="large" />
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
