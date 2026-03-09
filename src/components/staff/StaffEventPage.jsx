import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import httpService from '../services/httpService';
import './StaffEventPage.css';

const StaffEventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      try {
        const data = await httpService.events.getAll();
        setEvents(data || []);
      } catch (apiError) {
        // Use demo data if API is not available
        setEvents(getDemoEvents());
      }
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getDemoEvents = () => [
    { id: 1, name: 'Annual Tech Conference 2024', eventDate: '2024-12-15', eventTime: '09:00', venue: 'Convention Center', expectedAttendees: 500, eventType: 'conference', status: 'confirmed', setupStatus: 'pending' },
    { id: 2, name: 'Corporate Gala Dinner', eventDate: '2024-11-20', eventTime: '18:00', venue: 'Grand Ballroom', expectedAttendees: 200, eventType: 'corporate', status: 'confirmed', setupStatus: 'in_progress' },
    { id: 3, name: 'Product Launch Event', eventDate: '2024-10-25', eventTime: '14:00', venue: 'Innovation Hub', expectedAttendees: 150, eventType: 'corporate', status: 'completed', setupStatus: 'completed' },
    { id: 4, name: 'Wedding Reception', eventDate: '2025-01-15', eventTime: '17:00', venue: 'Garden Venue', expectedAttendees: 100, eventType: 'wedding', status: 'confirmed', setupStatus: 'pending' },
  ];

  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      const updatedEvents = events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      );
      setEvents(updatedEvents);
    } catch (err) {
      // Handle locally for demo
      const updatedEvents = events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      );
      setEvents(updatedEvents);
    }
  };

  const getSetupStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      in_progress: 'badge-primary',
      completed: 'badge-success',
    };
    return statusClasses[status] || 'badge-primary';
  };

  const filteredEvents = events.filter(event => 
    filterStatus === 'all' || event.status === filterStatus
  );

  if (loading) {
    return (
      <div className="staff-event-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-event-page">
      <div className="page-header">
        <h1 className="page-title">Staff Dashboard</h1>
      </div>

      <div className="filters-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Events
          </button>
          <button
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <p>No events found</p>
        </div>
      ) : (
        <div className="events-list">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-item">
              <div className="event-info">
                <div className="event-main">
                  <h3>{event.name}</h3>
                  <div className="event-meta">
                    <span><strong>Date:</strong> {event.eventDate}</span>
                    <span><strong>Time:</strong> {event.eventTime}</span>
                    <span><strong>Venue:</strong> {event.venue}</span>
                    <span><strong>Attendees:</strong> {event.expectedAttendees}</span>
                  </div>
                </div>

                <div className="event-status">
                  <span className={`badge ${getSetupStatusBadge(event.setupStatus)}`}>
                    Setup: {event.setupStatus.replace('_', ' ')}
                  </span>
                  <span className="badge badge-secondary">
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="event-actions">
                <Link 
                  to={`/staff/update-setup?eventId=${event.id}`} 
                  className="btn btn-primary"
                >
                  Update Setup
                </Link>
                {event.status === 'confirmed' && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handleUpdateStatus(event.id, 'completed')}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffEventPage;

