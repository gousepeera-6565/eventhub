import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import httpService from '../services/httpService';
import './BookingDetailsPage.css';

const BookingDetailsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [user] = useState(authService.getCurrentUser());
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    venueAddress: '',
    expectedAttendees: '',
    eventType: 'corporate',
    description: '',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      try {
        const data = await httpService.bookings.getAll();
        setBookings(data || []);
      } catch (apiError) {
        // Use demo data if API is not available
        setBookings(getDemoBookings());
      }
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getDemoBookings = () => [
    { id: 1, eventName: 'Annual Tech Conference 2024', eventDate: '2024-12-15', eventTime: '09:00', venue: 'Convention Center', expectedAttendees: 500, status: 'confirmed', bookingDate: '2024-10-01' },
    { id: 2, eventName: 'Product Launch Event', eventDate: '2024-10-25', eventTime: '14:00', venue: 'Innovation Hub', expectedAttendees: 150, status: 'completed', bookingDate: '2024-09-15' },
  ];

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
      const newBooking = {
        id: Date.now(),
        ...formData,
        expectedAttendees: parseInt(formData.expectedAttendees),
        status: 'pending',
        bookingDate: new Date().toISOString().split('T')[0],
      };

      setBookings([...bookings, newBooking]);
      setSuccess('Booking request submitted successfully!');
      
      // Reset form
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        venueAddress: '',
        expectedAttendees: '',
        eventType: 'corporate',
        description: '',
      });
      setShowBookingForm(false);
    } catch (err) {
      setError('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-secondary',
      cancelled: 'badge-danger',
    };
    return statusClasses[status] || 'badge-primary';
  };

  if (loading && !showBookingForm) {
    return (
      <div className="booking-details-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-details-page">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowBookingForm(true)}
        >
          New Booking Request
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showBookingForm && (
        <div className="booking-form-section">
          <div className="form-container">
            <h2>Request New Booking</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="eventName">Event Name *</label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
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
                    placeholder="Number of guests"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="venue">Preferred Venue</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter venue name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Additional Details</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event requirements"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bookings-list">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings yet</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowBookingForm(true)}
            >
              Make Your First Booking
            </button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.eventName}</h3>
                  <span className={`badge ${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{booking.eventDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{booking.eventTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Venue</span>
                    <span className="detail-value">{booking.venue}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Guests</span>
                    <span className="detail-value">{booking.expectedAttendees}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Booked On</span>
                    <span className="detail-value">{booking.bookingDate}</span>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="booking-actions">
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;

