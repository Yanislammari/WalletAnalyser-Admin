import type React from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Users from "./pages/users/Users";
import Assets from "./pages/Assets";
import AuthWrapper from "./components/AutoAuthentificator/AuthWrapper";
import Countries from "./pages/countries/Countries";
import CountriesAllias from "./pages/country-allias/Country_Allias";
import Sectors from "./pages/sectors/Sectors";
import SectorsAllias from "./pages/sector-allias/Sector_Allias";
import SettingsPage from "./pages/settings/Reset_Password";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/users" element={<AuthWrapper><Users /></AuthWrapper>} />
        <Route path="/assets" element={<AuthWrapper><Assets /></AuthWrapper>} />
        <Route path="/countries" element={<AuthWrapper><Countries/></AuthWrapper>} />
        <Route path="/countries-allias/:country_uuid" element={<AuthWrapper><CountriesAllias/></AuthWrapper>} />
        <Route path="/sectors" element={<AuthWrapper><Sectors/></AuthWrapper>} />
        <Route path="/sectors-allias/:sector_uuid" element={<AuthWrapper><SectorsAllias/></AuthWrapper>} />
        <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default AppRoutes;
