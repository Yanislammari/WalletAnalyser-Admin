import type React from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Users from "./pages/users/Users";
import Assets from "./pages/assets/Assets";
import Countries from "./pages/countries/Countries";
import CountriesAllias from "./pages/country-allias/Country_Allias";
import Sectors from "./pages/sectors/Sectors";
import SectorsAllias from "./pages/sector-allias/Sector_Allias";
import SettingsPage from "./pages/settings/Reset_Password";
import RfrCountry from "./pages/rfrCountry/RfrCountry";
import RfrRates from "./pages/rfrRates/RfrRates";
import Currencies from "./pages/currencies/Currencies";
import Forex from "./pages/forex/Forex";
import ForexRates from "./pages/forexRates/ForexRates";
import AssetPrices from "./pages/assetPrices/AssetPrices";
import Etf from "./pages/etf/Etf";
import EtfConcentration from "./pages/etf_concentration/EtfConcentration";
import { AssetType } from "./payloads/AssetPayload";
import NotFoundPage from "./pages/DefaultPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/assets/:asset_uuid" element={<AssetPrices type={AssetType.STOCKS}/>} />
        <Route path="/etf" element={<Etf/>} />
        <Route path="/etf/:asset_uuid" element={<AssetPrices type={AssetType.ETF}/>} />
        <Route path="/etf/:etf_uuid/concentration" element={<EtfConcentration/>} />
        <Route path="/countries" element={<Countries/>} />
        <Route path="/countries-allias/:country_uuid" element={<CountriesAllias/>} />
        <Route path="/sectors" element={<Sectors/>} />
        <Route path="/sectors-allias/:sector_uuid" element={<SectorsAllias/>} />
        <Route path="/rfr" element={<RfrCountry/>} />
        <Route path="/rfr/:rfr_country_uuid" element={<RfrRates/>} />
        <Route path="/currencies" element={<Currencies/>} />
        <Route path="/forex" element={<Forex/>} />
        <Route path="/forex/:forex_uuid" element={<ForexRates/>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  );
}

export default AppRoutes;
