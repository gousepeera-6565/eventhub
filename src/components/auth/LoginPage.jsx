import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, password } = formData;

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

    try {
      const userData = await authService.login({ username, password });
      onLogin(userData.user || userData);
      
      // Redirect based on role
      const role = userData.user?.role || userData.role;
      navigate(`/${role}`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login for testing without backend
  const handleDemoLogin = (role) => {
    const demoUser = {
      id: 1,
      username: `demo_${role}`,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role,
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    onLogin(demoUser);
    navigate(`/${role}`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your EventHub account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="form-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register">Register here</Link>
            </p>
          </div>
        </form>

        <div className="demo-login">
          <p>Demo Login (No Backend Required):</p>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => handleDemoLogin('planner')}
            >
              Login as Planner
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => handleDemoLogin('staff')}
            >
              Login as Staff
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => handleDemoLogin('client')}
            >
              Login as Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

