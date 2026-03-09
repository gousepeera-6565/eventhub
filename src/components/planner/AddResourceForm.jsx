import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpService from '../services/httpService';
import './AddResourceForm.css';

const AddResourceForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'equipment',
    quantity: '',
    unitPrice: '',
    description: '',
    supplier: '',
    supplierContact: '',
    location: '',
    status: 'available',
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
      const resourceData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
      };

      await httpService.resources.create(resourceData);
      setSuccess('Resource added successfully!');
      
      // Clear form
      setFormData({
        name: '',
        type: 'equipment',
        quantity: '',
        unitPrice: '',
        description: '',
        supplier: '',
        supplierContact: '',
        location: '',
        status: 'available',
      });
    } catch (err) {
      setError(err.message || 'Failed to add resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo data for testing
  const handleDemoSubmit = () => {
    setFormData({
      name: 'Conference Chairs',
      type: 'furniture',
      quantity: 100,
      unitPrice: 25,
      description: 'Comfortable folding chairs for conferences',
      supplier: 'Event Supplies Co.',
      supplierContact: '+1 234 567 890',
      location: 'Storage Room A',
      status: 'available',
    });
  };

  return (
    <div className="add-resource-page">
      <div className="page-header">
        <h1 className="page-title">Add New Resource</h1>
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
            <h3>Resource Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Resource Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter resource name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Resource Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="equipment">Equipment</option>
                  <option value="furniture">Furniture</option>
                  <option value="decoration">Decoration</option>
                  <option value="catering">Catering</option>
                  <option value="av_equipment">AV Equipment</option>
                  <option value="lighting">Lighting</option>
                  <option value="tent">Tent/Canopy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Number of units"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unitPrice">Unit Price ($)</label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="Price per unit"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the resource"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Storage & Supplier Information</h3>
            
            <div className="form-group">
              <label htmlFor="location">Storage Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where is this resource stored"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="supplier">Supplier Name</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Supplier name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplierContact">Supplier Contact</label>
                <input
                  type="text"
                  id="supplierContact"
                  name="supplierContact"
                  value={formData.supplierContact}
                  onChange={handleChange}
                  placeholder="Supplier phone/email"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/planner')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceForm;

