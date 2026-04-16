import React, { createContext, useContext, useState, useCallback } from "react";
import type { UserResponse } from "../responses/UserResponse";
import type { User } from "../models/User";
import AuthService from "../services/AuthService";
import type { Login2FAPayload, Resend2FaPayload } from "../payloads/LoginPayload";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  login2Fa: (code: string) => Promise<void>;
  resend2Fa: () => Promise<void>;
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
  const isAuthenticated = !!token;

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
      const response = await authService.resend2Fa({token : tokenFromStorage } as Resend2FaPayload);
      setToken(response.token);

      localStorage.setItem("token", response.token);
    }
    catch (error: any) {
      console.log(error.message)
      throw new Error(error.message || "2FA Login failed");
    }
  }, [authService]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, login2Fa, resend2Fa, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
