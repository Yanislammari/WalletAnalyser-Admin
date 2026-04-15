import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
