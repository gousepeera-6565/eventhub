import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpService from '../services/httpService';
import './CreateEventForm.css';

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    venueAddress: '',
    expectedAttendees: '',
    eventType: 'corporate',
    status: 'planning',
    budget: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const eventData = {
        ...formData,
        expectedAttendees: parseInt(formData.expectedAttendees),
        budget: parseFloat(formData.budget),
      };

      await httpService.events.create(eventData);
      setSuccess('Event created successfully!');
      
      // Clear form
      setFormData({
        name: '',
        description: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        venueAddress: '',
        expectedAttendees: '',
        eventType: 'corporate',
        status: 'planning',
        budget: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
      });

      // Redirect to events page after short delay
      setTimeout(() => {
        navigate('/planner/events');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo data for testing
  const handleDemoSubmit = () => {
    setFormData({
      name: 'Annual Tech Conference 2024',
      description: 'A technology conference featuring the latest innovations',
      eventDate: '2024-12-15',
      eventTime: '09:00',
      venue: 'Convention Center',
      venueAddress: '123 Tech Street, Silicon Valley, CA',
      expectedAttendees: 500,
      eventType: 'corporate',
      status: 'planning',
      budget: 50000,
      clientName: 'John Smith',
      clientEmail: 'john@example.com',
      clientPhone: '+1 234 567 890',
    });
  };

  return (
    <div className="create-event-page">
      <div className="page-header">
        <h1 className="page-title">Create New Event</h1>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={handleDemoSubmit}
        >
          Load Demo Data
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-section">
            <h3>Event Details</h3>
            
            <div className="form-group">
              <label htmlFor="name">Event Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventDate">Event Date *</label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventTime">Event Time *</label>
                <input
                  type="time"
                  id="eventTime"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventType">Event Type</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                >
                  <option value="corporate">Corporate</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="conference">Conference</option>
                  <option value="concert">Concert</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="expectedAttendees">Expected Attendees</label>
                <input
                  type="number"
                  id="expectedAttendees"
                  name="expectedAttendees"
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                  placeholder="Number of attendees"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Venue Information</h3>
            
            <div className="form-group">
              <label htmlFor="venue">Venue Name *</label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venueAddress">Venue Address</label>
              <textarea
                id="venueAddress"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                placeholder="Enter venue address"
                rows="2"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Client Information</h3>
            
            <div className="form-group">
              <label htmlFor="clientName">Client Name *</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientEmail">Client Email *</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="clientPhone">Client Phone</label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Budget</h3>
            
            <div className="form-group">
              <label htmlFor="budget">Budget ($)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/planner/events')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;

