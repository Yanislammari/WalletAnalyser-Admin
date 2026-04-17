import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import menuItems from '../../constants/MenuItems';
import { useNavBar } from "../../providers/NavBarProvider";

const Navbar: React.FC = () => {
  const { isOpen, setIsOpen } = useNavBar();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={`sidenav ${isOpen ? 'sidenav-expanded' : ''}`}>
      <div className="sidenav-header">
        <button
          className="sidenav-burger"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
        <span className="sidenav-title">Admin manager</span>
      </div>

      <div className="sidenav-divider" />

      <ul className="sidenav-list">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              className={`sidenav-item ${location.pathname === item.path ? 'sidenav-item--active' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <img src={item.icon} className="sidenav-icon" />
              <span className="sidenav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;