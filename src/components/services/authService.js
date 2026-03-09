// Authentication Service
// This service handles all authentication-related operations

const API_URL = 'http://localhost:8080/api/auth';

const authService = {
  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }

      const data = await response.json();
      
      // Store user data and token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('user', JSON.stringify(data.user || data));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Registration failed');
      }

      const data = await response.json();
      
      // Auto-login after registration
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('user', JSON.stringify(data.user || data));
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },
};

export default authService;

