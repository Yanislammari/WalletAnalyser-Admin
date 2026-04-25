import type React from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Users from "./pages/users/Users";
import Assets from "./pages/Assets";
import AuthWrapper from "./components/AutoAuthentificator/AuthWrapper";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/users" element={<AuthWrapper><Users /></AuthWrapper>} />
        <Route path="/assets" element={<AuthWrapper><Assets /></AuthWrapper>} />
    </Routes>
  );
}

export default AppRoutes;
