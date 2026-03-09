import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './UpdateSetupPage.css';

const UpdateSetupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');

  const [formData, setFormData] = useState({
    eventId: eventId || '',
    setupStatus: 'pending',
    setupNotes: '',
    tables: '',
    chairs: '',
    lighting: '',
    sound: '',
    decorations: '',
    catering: false,
    avEquipment: false,
    stage: false,
    status: 'confirmed',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Setup details updated successfully!');
      
      setTimeout(() => {
        navigate('/staff/events');
      }, 1500);
    } catch (err) {
      setError('Failed to update setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLoad = () => {
    setFormData({
      ...formData,
      eventId: '1',
      setupStatus: 'in_progress',
      setupNotes: 'All major setup items are ready. Minor adjustments needed for lighting.',
      tables: 25,
      chairs: 200,
      lighting: 'Complete',
      sound: 'Complete',
      decorations: '70%',
      catering: true,
      avEquipment: true,
      stage: true,
    });
  };

  return (
    <div className="update-setup-page">
      <div className="page-header">
        <h1 className="page-title">Update Event Setup</h1>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={handleDemoLoad}
        >
          Load Demo Data
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-section">
            <h3>Setup Status</h3>
            
            <div className="form-group">
              <label htmlFor="setupStatus">Current Status</label>
              <select
                id="setupStatus"
                name="setupStatus"
                value={formData.setupStatus}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="setupNotes">Setup Notes</label>
              <textarea
                id="setupNotes"
                name="setupNotes"
                value={formData.setupNotes}
                onChange={handleChange}
                placeholder="Add notes about the setup progress..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Furniture & Equipment</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tables">Tables Setup</label>
                <input
                  type="text"
                  id="tables"
                  name="tables"
                  value={formData.tables}
                  onChange={handleChange}
                  placeholder="Number of tables"
                />
              </div>

              <div className="form-group">
                <label htmlFor="chairs">Chairs Setup</label>
                <input
                  type="text"
                  id="chairs"
                  name="chairs"
                  value={formData.chairs}
                  onChange={handleChange}
                  placeholder="Number of chairs"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lighting">Lighting Status</label>
                <select
                  id="lighting"
                  name="lighting"
                  value={formData.lighting}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sound">Sound Status</label>
                <select
                  id="sound"
                  name="sound"
                  value={formData.sound}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="decorations">Decorations Progress</label>
              <input
                type="text"
                id="decorations"
                name="decorations"
                value={formData.decorations}
                onChange={handleChange}
                placeholder="e.g., 50% complete"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Services</h3>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="catering"
                  checked={formData.catering}
                  onChange={handleChange}
                />
                <span>Catering</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="avEquipment"
                  checked={formData.avEquipment}
                  onChange={handleChange}
                />
                <span>AV Equipment</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="stage"
                  checked={formData.stage}
                  onChange={handleChange}
                />
                <span>Stage</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/staff/events')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSetupPage;

