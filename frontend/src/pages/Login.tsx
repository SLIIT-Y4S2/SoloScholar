import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { Form, Input } from "antd";
import authService from "../services/auth.services";

const Login = () => {
  const { setUserDetails } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (values: { username: string; password: string }) => {
    authService
      .login(values.username, values.password)
      .then((response) => {
        setUserDetails(response);
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
