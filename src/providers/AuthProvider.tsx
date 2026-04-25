import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { UserResponse } from "../responses/UserResponse";
import type { User } from "../models/User";
import AuthService from "../services/AuthService";
import type { Login2FAPayload, TokenBody } from "../payloads/LoginPayload";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthentificated: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  login2Fa: (code: string) => Promise<void>;
  resend2Fa: () => Promise<void>;
  checkAuth: () => Promise<void>
  logout: () => void;
}

const mapUserResponseToUser = (userResponse: UserResponse): User => ({
  id: userResponse.id,
  email: userResponse.email,
  firstName: userResponse.firstName,
  lastName: userResponse.lastName,
  googleId: userResponse.googleId,
  googlePictureUrl: userResponse.googlePictureUrl,
  ban: userResponse.ban,
  userType: userResponse.userType,
  subscribe: false,
  createdAt: new Date(userResponse.createdAt),
  updatedAt: new Date(userResponse.updatedAt),
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authService = AuthService.getInstance();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthentificated, setIsAuthentificated] = useState<boolean | null>(null)
  const navigate = useNavigate();
  const location = useLocation();


  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      localStorage.setItem("token", response.token);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }, [authService]);

  const login2Fa = useCallback(async (code: string) => {
    try {
      if (!localStorage.getItem("token")) {
        throw new Error("No token found. Please login first.");
      }
      const tokenFromStorage = localStorage.getItem("token");
      const response = await authService.login2Fa({ code, token : tokenFromStorage } as Login2FAPayload);
      const mappedUser = mapUserResponseToUser(response.user);

      setToken(response.token);
      setUser(mappedUser);
      setIsAuthentificated(true)

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    }
    catch (error: any) {
      console.log(error.message)
      throw new Error(error.message || "2FA Login failed");
    }
  }, [authService]);

  const resend2Fa = useCallback(async () => {
    try {
      if (!localStorage.getItem("token")) {
        throw new Error("No token found. Please login first.");
      }
      const tokenFromStorage = localStorage.getItem("token");
      const response = await authService.resend2Fa({token : tokenFromStorage } as TokenBody);
      setToken(response.token);

      localStorage.setItem("token", response.token);
    }
    catch (error: any) {
      console.log(error.message)
      throw new Error(error.message || "2FA Login failed");
    }
  }, [authService]);

  const checkAuth = useCallback(async () => {
    try {
      const tokenFromStorage = localStorage.getItem("token");
      const user = await authService.authentificationCheck({token : tokenFromStorage } as TokenBody);
      const mappedUser = mapUserResponseToUser(user);
      setUser(mappedUser);
      localStorage.setItem("user", JSON.stringify(mappedUser));
      setIsAuthentificated(true)
    }
    catch (error: any) {
      console.log(error.message)
      setIsAuthentificated(false)
    }
  }, [authService]);

  const logout = useCallback(() => {
    console.log("Got Event")
    setUser(null);
    setToken(null);
    setIsAuthentificated(false)
    if (location.pathname !== "/") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/", { replace: true, state: { from: location } });
    }
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthentificated, login, login2Fa, resend2Fa, checkAuth ,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
