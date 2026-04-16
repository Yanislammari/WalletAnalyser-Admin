import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
