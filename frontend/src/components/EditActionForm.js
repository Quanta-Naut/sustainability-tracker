import React, { useState, useEffect } from 'react';

/**
 * EditActionForm Component
 * Allows users to edit existing sustainable actions
 * 
 * @param {Object} action - The action to be edited
 * @param {Function} onUpdateAction - Function to handle action update
 * @param {Function} onCancel - Function to handle form cancellation
 */
function EditActionForm({ action, onUpdateAction, onCancel }) {
  // State to store form data
  const [formData, setFormData] = useState({
    action: '',
    date: '',
    points: 0
  });
  // State to store validation error message
  const [error, setError] = useState('');

  // Populate form data when action prop changes
  useEffect(() => {
    if (action) {
      setFormData({
        action: action.action,
        date: action.date,
        points: action.points
      });
    }
  }, [action]);

  /**
   * Update form data when input fields change
   * For points field, converts value to integer
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'points' ? parseInt(value) || 0 : value
    });
  };

  /**
   * Validates form data before submission
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    if (!formData.action.trim()) {
      setError('Action description is required');
      return false;
    }
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (formData.points <= 0) {
      setError('Points must be greater than zero');
      return false;
    }
    setError('');
    return true;
  };

  /**
   * Handle form submission
   * Validates form and calls onUpdateAction if valid
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onUpdateAction(action.id, formData);
      } catch (err) {
        setError('Failed to update action. Please try again.');
      }
    }
  };

  return (
    <div className="card mb-4 border-0">
      <div className="card-header bg-warning">
        <h3>Edit Action</h3>
      </div>
      <div className="card-body">
        {/* Display error message if present */}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">

            {/* Action Field */}
            <div className="col-md-4">
              <label htmlFor="edit-action" className="form-label fw-bold">Action:</label>
              <input
                type="text"
                className="form-control"
                id="edit-action"
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Date Field */}
            <div className="col-md-4">
              <label htmlFor="edit-date" className="form-label fw-bold">Date:</label>
              <input
                type="date"
                className="form-control"
                id="edit-date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Points Field */}
            <div className="col-md-4">
              <label htmlFor="edit-points" className="form-label fw-bold">Points:</label>
              <input
                type="number"
                className="form-control"
                id="edit-points"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            {/* Form Action Buttons */}
            <div className="d-flex gap-2 ms-auto" style={{ width: "auto" }}>
              <button type="submit" className="btn btn-success px-3">Update Action</button>
              <button type="button" className="btn btn-secondary px-3" onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditActionForm;