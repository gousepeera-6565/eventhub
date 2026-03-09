import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">EventHub</h3>
            <p className="footer-description">
              Your complete event management solution. 
              Plan, organize, and execute events seamlessly.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Services</h4>
            <ul className="footer-links">
              <li><a href="/planner/events">Event Planning</a></li>
              <li><a href="/planner/add-resource">Resource Management</a></li>
              <li><a href="/client/bookings">Bookings</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact</h4>
            <ul className="footer-links">
              <li>Email: support@eventhub.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Event Street</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

