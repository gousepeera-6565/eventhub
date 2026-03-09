import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/images/logo.jpg";
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getMenuLinks = () => {
    if (!user) {
      return [
        { path: '/', label: 'Home' },
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' },
      ];
    }

    switch (user.role) {
      case 'planner':
      case 'admin':
        return [
          { path: '/planner', label: 'Dashboard' },
          { path: '/planner/events', label: 'Events' },
          { path: '/planner/create-event', label: 'Create Event' },
          { path: '/planner/add-resource', label: 'Resources' },
          { path: '/planner/allocate-resource', label: 'Allocate' },
        ];
      case 'staff':
        return [
          { path: '/staff', label: 'Dashboard' },
          { path: '/staff/events', label: 'Events' },
          { path: '/staff/update-setup', label: 'Update Setup' },
        ];
      case 'client':
        return [
          { path: '/client', label: 'Dashboard' },
          { path: '/client/bookings', label: 'My Bookings' },
        ];
      default:
        return [{ path: '/', label: 'Home' }];
    }
  };

  const menuLinks = getMenuLinks();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
        <img src={logo} alt="EventHub Logo" className="brand-logo" />
        <span className="brand-text">EventHub</span>
      </Link>
        </div>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            {menuLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {user && (
            <div className="navbar-user">
              <div className="user-info">
                <span className="user-name">{user.name || user.username}</span>
                <span className="user-role badge">{user.role}</span>
              </div>
              <button 
                className="btn btn-logout" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

