
import UsersIcon from "@/assets/icon_nav_bar/users.svg";
import AssetsIcon from "@/assets/icon_nav_bar/assets.svg";
import ETFIcon from "@/assets/icon_nav_bar/etf.svg";
import SectorsIcon from "@/assets/icon_nav_bar/sectors.svg";
import CountriesIcon from "@/assets/icon_nav_bar/countries.svg";
import CurrenciesIcon from "@/assets/icon_nav_bar/currencies.svg";
import RFRIcon from "@/assets/icon_nav_bar/rfr.svg";
import SettingsIcon from "@/assets/icon_nav_bar/settings.svg";

export interface MenuItem {
  icon: string;
  path: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { icon: UsersIcon, path: '/users', label: 'Users' },
  { icon: AssetsIcon, path: '/assets', label: 'Assets' },
  { icon: ETFIcon, path: '/etf', label: 'ETF' },
  { icon: SectorsIcon, path: '/sectors', label: 'Sectors' },
  { icon: CountriesIcon, path: '/countries', label: 'Countries' },
  { icon: CurrenciesIcon, path: '/currencies', label: 'Currencies' },
  { icon: RFRIcon, path: '/rfr', label: 'RiskFreeRate' },
  { icon: SettingsIcon, path: '/settings', label: 'Settings' },
];

export default menuItems;
