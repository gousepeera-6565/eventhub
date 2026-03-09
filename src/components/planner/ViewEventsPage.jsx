import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import httpService from '../services/httpService';
import './ViewEventsPage.css';

const ViewEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    { id: 1, name: 'Annual Tech Conference 2024', eventDate: '2024-12-15', eventTime: '09:00', venue: 'Convention Center', expectedAttendees: 500, eventType: 'conference', status: 'planning', budget: 50000 },
    { id: 2, name: 'Corporate Gala Dinner', eventDate: '2024-11-20', eventTime: '18:00', venue: 'Grand Ballroom', expectedAttendees: 200, eventType: 'corporate', status: 'confirmed', budget: 25000 },
    { id: 3, name: 'Product Launch Event', eventDate: '2024-10-25', eventTime: '14:00', venue: 'Innovation Hub', expectedAttendees: 150, eventType: 'corporate', status: 'completed', budget: 15000 },
    { id: 4, name: 'Wedding Reception', eventDate: '2025-01-15', eventTime: '17:00', venue: 'Garden Venue', expectedAttendees: 100, eventType: 'wedding', status: 'planning', budget: 20000 },
    { id: 5, name: 'Birthday Party', eventDate: '2024-11-05', eventTime: '19:00', venue: 'Party Hall', expectedAttendees: 50, eventType: 'birthday', status: 'confirmed', budget: 3000 },
  ];

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await httpService.events.delete(eventId);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err) {
      // For demo, just filter locally
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      planning: 'badge-primary',
      confirmed: 'badge-success',
      completed: 'badge-secondary',
      cancelled: 'badge-danger',
    };
    return statusClasses[status] || 'badge-primary';
  };

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="view-events-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-events-page">
      <div className="page-header">
        <h1 className="page-title">Events</h1>
        <Link to="/planner/create-event" className="btn btn-primary">
          Create New Event
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === 'planning' ? 'active' : ''}`}
            onClick={() => setFilterStatus('planning')}
          >
            Planning
          </button>
          <button
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmed
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
          <Link to="/planner/create-event" className="btn btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span className={`badge ${getStatusBadge(event.status)}`}>
                  {event.status}
                </span>
              </div>

              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{event.eventDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{event.eventTime}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Venue:</span>
                  <span className="detail-value">{event.venue}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Attendees:</span>
                  <span className="detail-value">{event.expectedAttendees}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{event.eventType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Budget:</span>
                  <span className="detail-value">${event.budget?.toLocaleString() || '0'}</span>
                </div>
              </div>

              <div className="event-actions">
                <Link to={`/planner/events/${event.id}`} className="btn btn-secondary">
                  View Details
                </Link>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewEventsPage;

