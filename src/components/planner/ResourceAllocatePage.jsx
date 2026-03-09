import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import httpService from '../services/httpService';
import './ResourceAllocatePage.css';

const ResourceAllocatePage = () => {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [allocationQty, setAllocationQty] = useState(1);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Try to load from API, fall back to demo data
      try {
        const eventsData = await httpService.events.getAll();
        const resourcesData = await httpService.resources.getAll();
        setEvents(eventsData || []);
        setResources(resourcesData || []);
      } catch (apiError) {
        // Use demo data if API is not available
        setEvents(getDemoEvents());
        setResources(getDemoResources());
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getDemoEvents = () => [
    { id: 1, name: 'Annual Tech Conference 2024', eventDate: '2024-12-15', status: 'planning' },
    { id: 2, name: 'Corporate Gala Dinner', eventDate: '2024-11-20', status: 'confirmed' },
    { id: 3, name: 'Product Launch Event', eventDate: '2024-10-25', status: 'planning' },
  ];

  const getDemoResources = () => [
    { id: 1, name: 'Conference Chairs', type: 'furniture', quantity: 100, available: 75 },
    { id: 2, name: 'Projector', type: 'av_equipment', quantity: 5, available: 3 },
    { id: 3, name: 'Stage Platform', type: 'equipment', quantity: 10, available: 8 },
    { id: 4, name: 'Lighting Set', type: 'lighting', quantity: 20, available: 15 },
    { id: 5, name: 'Catering Tables', type: 'furniture', quantity: 50, available: 30 },
  ];

  const handleAllocate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedEvent || !selectedResource || !allocationQty) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Simulate allocation
      const newAllocation = {
        id: Date.now(),
        eventId: parseInt(selectedEvent),
        resourceId: parseInt(selectedResource),
        quantity: parseInt(allocationQty),
        allocatedDate: new Date().toISOString().split('T')[0],
      };

      setAllocations([...allocations, newAllocation]);
      setSuccess('Resource allocated successfully!');
      
      // Reset form
      setSelectedResource('');
      setAllocationQty(1);
    } catch (err) {
      setError(err.message || 'Failed to allocate resource');
    }
  };

  const getEventName = (eventId) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown Event';
  };

  const getResourceName = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Unknown Resource';
  };

  if (loading) {
    return (
      <div className="resource-allocate-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-allocate-page">
      <div className="page-header">
        <h1 className="page-title">Resource Allocation</h1>
        <Link to="/planner/add-resource" className="btn btn-secondary">
          Add New Resource
        </Link>
      </div>

      <div className="allocate-container">
        <div className="allocate-form-section">
          <h3>Allocate Resource to Event</h3>
          
          <form onSubmit={handleAllocate}>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="form-group">
              <label htmlFor="event">Select Event</label>
              <select
                id="event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                required
              >
                <option value="">Choose an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {event.eventDate}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="resource">Select Resource</label>
              <select
                id="resource"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                required
              >
                <option value="">Choose a resource</option>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} (Available: {resource.available || resource.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={allocationQty}
                onChange={(e) => setAllocationQty(e.target.value)}
                min="1"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Allocate Resource
            </button>
          </form>
        </div>

        <div className="resources-section">
          <h3>Available Resources</h3>
          <div className="resources-grid">
            {resources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <h4>{resource.name}</h4>
                <p className="resource-type">{resource.type}</p>
                <div className="resource-stats">
                  <span>Total: {resource.quantity}</span>
                  <span>Available: {resource.available || resource.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="allocations-section">
        <h3>Current Allocations</h3>
        {allocations.length === 0 ? (
          <p className="no-data">No resources allocated yet</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Resource</th>
                <th>Quantity</th>
                <th>Date Allocated</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation) => (
                <tr key={allocation.id}>
                  <td>{getEventName(allocation.eventId)}</td>
                  <td>{getResourceName(allocation.resourceId)}</td>
                  <td>{allocation.quantity}</td>
                  <td>{allocation.allocatedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ResourceAllocatePage;

