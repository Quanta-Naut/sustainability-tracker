import React, { useState, useEffect } from "react";
import "../index.css";

function ActionForm({ onAddAction }) {
  const initialFormState = {
    action: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    points: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("Checking Server...");

  // Function to check server status
    const checkServer = async () => {
      try {
        await fetch("http://localhost:8000/", { mode: "no-cors" });
        setServerStatus("🟢 Server is Running");
      } catch (error) {
        setServerStatus("🔴 Server is Down");
      }
    };

    useEffect(() => {
      checkServer(); // Initial check
      const interval = setInterval(checkServer, 5000);
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "points" ? parseInt(value) || 0 : value,
    });
  };

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

  return (
    <div className="card mb-4 border-0 rounded-3">
      <div className="card-header bg-success border-0 text-white d-flex justify-content-between">
        <h3>Add New Sustainability Action</h3>
        <span className={`mt-2`}>
          {serverStatus}
        </span>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">
            {/* Action Field */}
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

            {/* Date Field */}
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

            {/* Points Field */}
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

            {/* Submit Button */}
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
