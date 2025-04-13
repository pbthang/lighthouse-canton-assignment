import { useAuth } from "@/providers/AuthProvider";
import { z } from "zod";
import { Outlet, useNavigate } from "react-router";
import LoginForm, { loginFormSchema } from "./LoginForm";
import axios from "axios";

const ProtectedRoute = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  axios.interceptors.request.use(function (config) {
    // Decode the jwt to get expiration time
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("user");
        navigate(0);
      }
      return Promise.reject(error);
    }
  );

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      login(values.username, values.password);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  }

  return user && token ? (
    <Outlet />
  ) : (
    <div className="flex justify-center py-20">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

export default ProtectedRoute;
