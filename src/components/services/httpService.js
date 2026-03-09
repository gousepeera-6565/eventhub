// HTTP Service
// This service handles all HTTP requests to the backend

import authService from './authService';

const API_URL = 'http://localhost:8080/api';

const httpService = {
  // Helper to get headers
  getHeaders() {
    const token = authService.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },

  // GET request
  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('GET error:', error);
      throw error;
    }
  },

  // POST request
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('POST error:', error);
      throw error;
    }
  },

  // PUT request
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('PUT error:', error);
      throw error;
    }
  },

  // DELETE request
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Request failed');
      }

      return await response.text();
    } catch (error) {
      console.error('DELETE error:', error);
      throw error;
    }
  },

  // Event API calls
  events: {
    getAll: () => httpService.get('/events'),
    getById: (id) => httpService.get(`/events/${id}`),
    create: (event) => httpService.post('/events', event),
    update: (id, event) => httpService.put(`/events/${id}`, event),
    delete: (id) => httpService.delete(`/events/${id}`),
  },

  // Resource API calls
  resources: {
    getAll: () => httpService.get('/resources'),
    getById: (id) => httpService.get(`/resources/${id}`),
    create: (resource) => httpService.post('/resources', resource),
    update: (id, resource) => httpService.put(`/resources/${id}`, resource),
    delete: (id) => httpService.delete(`/resources/${id}`),
  },

  // Booking API calls
  bookings: {
    getAll: () => httpService.get('/bookings'),
    getById: (id) => httpService.get(`/bookings/${id}`),
    create: (booking) => httpService.post('/bookings', booking),
    update: (id, booking) => httpService.put(`/bookings/${id}`, booking),
    delete: (id) => httpService.delete(`/bookings/${id}`),
  },
};

export default httpService;

