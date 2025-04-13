import { VITE_REACT_APP_API_URL } from "@/lib/constants";
import { UserAuth, UserAuthResponse } from "@/lib/types";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

interface ProviderProps {
  user: UserAuth | null;
  token: string;
  login(username: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({
  user: null,
  token: "",
  login: async () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedInfo: UserAuthResponse | null = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  const [user, setUser] = useState<UserAuth | null>(storedInfo?.user || null);
  const [token, setToken] = useState(storedInfo?.token || "");
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${VITE_REACT_APP_API_URL}/auth/login`,
        {
          username,
          password,
        }
      );
      console.log("Login response:", response.data);
      const { token, user } = response.data.data as UserAuthResponse;
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify({ token, user }));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate(0);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate(0);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
