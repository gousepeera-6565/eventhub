import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './RegistrationPage.css';

const RegistrationPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword, role, name } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.register({
        username,
        email,
        password,
        role,
        name,
      });
      onLogin(userData.user || userData);
      
      // Redirect based on role
      const userRole = userData.user?.role || userData.role;
      navigate(`/${userRole}`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo registration for testing
  const handleDemoRegister = (selectedRole) => {
    const demoUser = {
      id: Date.now(),
      username: `demo_${selectedRole}_${Date.now()}`,
      name: `Demo ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`,
      email: `demo_${selectedRole}@eventhub.com`,
      role: selectedRole,
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    onLogin(demoUser);
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join EventHub and start managing events</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              required
            >
              <option value="client">Client</option>
              <option value="staff">Staff</option>
              <option value="planner">Event Planner</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="form-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login here</Link>
            </p>
          </div>
        </form>

        <div className="demo-register">
          <p>Demo Registration (No Backend Required):</p>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => handleDemoRegister('planner')}
            >
              Register as Planner
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => handleDemoRegister('staff')}
            >
              Register as Staff
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => handleDemoRegister('client')}
            >
              Register as Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;

