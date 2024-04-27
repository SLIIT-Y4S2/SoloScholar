import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { Form, Input } from "antd";
import axios from "axios";

const Login = () => {
  const { setUserDetails } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (values: { username: string; password: string }) => {
    axios
      .post(
        "http://localhost:5000/api/v1/auth/login",
        {
          studentId: values.username,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Response from server:", response.data);
        setUserDetails(response.data);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <>
      <h1>Login Page</h1>
      <Form onFinish={handleLogin}>
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <button type="submit">Login</button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
