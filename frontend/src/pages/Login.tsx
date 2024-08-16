import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { Button, Form, Input } from "antd";
import authService from "../services/auth.services";
import { useState } from "react";
import { handleAxiosError } from "../utils/axiosInstance";

const Login = () => {
  const { setUserDetails } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(values.email, values.password);
      setUserDetails(response);
      navigate("/", { replace: true });
    } catch (error) {
      const message = handleAxiosError(error);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row lg:bg-accent h-screen">
      <img
        src="/assets/login-background.png"
        alt="Login"
        className="hidden lg:block object-contain w-1/2 p-24"
      />

      <div className="flex flex-col justify-center items-center p-8 w-full lg:w-1/2 lg:rounded-bl-[49px] lg:rounded-tl-[49px] lg:bg-white rounded overflow-y-scroll">
        <h1 className="text-[#0e5699] text-2xl font-medium font-['Roboto']">
          Login to your account
        </h1>
        <Form
          onFinish={handleLogin}
          className="max-w-[400px] w-full flex flex-col gap-1"
          layout="vertical"
          onError={(error) => console.log(error)}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            extra={error && <div className="text-red-500">{error}</div>}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
