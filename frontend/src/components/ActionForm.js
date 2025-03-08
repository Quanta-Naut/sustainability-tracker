import React, { useState, useEffect } from "react";
import "../index.css";

/**
 * ActionForm Component - Allows users to add new sustainability actions
 * @param {function} onAddAction - Callback function to add a new action
 */
function ActionForm({ onAddAction }) {
  // Default values for the form fields
  const initialFormState = {
    action: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    points: 0,
  };

  // State hooks for form data, error messages, and server status
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("Checking Server...");

  /**
   * Checks if the backend server is running
   * Uses no-cors mode to handle CORS issues during initial check
   */
  const checkServer = async () => {
    try {
      await fetch("http://localhost:8000/", { mode: "no-cors" });
      setServerStatus("🟢 Server is Running");
    } catch (error) {
      setServerStatus("🔴 Server is Down");
    }
  };

  // Effect hook to check server status periodically
  useEffect(() => {
    checkServer(); // Initial check
    const interval = setInterval(checkServer, 5000); // Check every 5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  /**
   * Handles form input changes
   * Converts points value to integer, other fields remain as strings
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "points" ? parseInt(value) || 0 : value,
    });
  };

  /**
   * Validates form data before submission
   * Checks for empty fields and ensures points are positive
   * @returns {boolean} - Whether the form data is valid
   */
  const validateForm = () => {
    if (!formData.action.trim()) {
      setError("Action description is required");
      return false;
    }
    if (!formData.date) {
      setError("Date is required");
      return false;
    }
    if (formData.points <= 0) {
      setError("Points must be greater than zero");
      return false;
    }
    setError("");
    return true;
  };

  /**
   * Handles form submission
   * Validates the form and calls the onAddAction callback
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onAddAction(formData);
        setFormData(initialFormState); // Reset form after successful submission
      } catch (err) {
        setError("Failed to add action. Please try again.");
      }
    }
  };

  // Form layout using Bootstrap classes for styling
  return (
    <div className="card mb-4 border-0 rounded-3">
      {/* Card header with title and server status */}
      <div className="card-header bg-success border-0 text-white d-flex justify-content-between">
        <h3>Add New Sustainability Action</h3>
        <span className={`mt-2`}>
          {serverStatus}
        </span>
      </div>
      <div className="card-body">
        {/* Error message display */}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">
            {/* Action input field */}
            <div className="col-md-4">
              <label htmlFor="action" className="form-label fw-bold">
                Action:
              </label>
              <input
                type="text"
                className="form-control"
                id="action"
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                placeholder="e.g., Recycling"
                required
              />
            </div>

            {/* Date input field */}
            <div className="col-md-4">
              <label htmlFor="date" className="form-label fw-bold">
                Date:
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Points input field */}
            <div className="col-md-4">
              <label htmlFor="points" className="form-label fw-bold">
                Points:
              </label>
              <input
                type="number"
                className="form-control"
                id="points"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            {/* Submit button */}
            <div className="d-flex ms-auto" style={{ width: "auto" }}>
              <button type="submit" className="btn btn-success px-3">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActionForm;
