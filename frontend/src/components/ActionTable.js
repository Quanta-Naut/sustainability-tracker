import React, { useState, useEffect } from "react";

function ActionTable({ actions, onEdit, onDelete }) {
  const [serverStatus, setServerStatus] = useState("Checking...");

  // Function to check server status
  const checkServerStatus = async () => {
    try {
      await fetch("http://localhost:8000/");
        setServerStatus("running");
    } catch (error) {
      setServerStatus("down");
    }
  };

  // Check server status every 5 seconds
  useEffect(() => {
    checkServerStatus(); // Initial check
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Calculate total points
  const totalPoints = actions.reduce((sum, action) => sum + action.points, 0);

  // Handle cases based on server status
  if (serverStatus === "down") {
    return (
      <div className="alert alert-danger">
        🚨 Server is down! Please check your connection.
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="alert alert-info">
        No sustainability actions found. Start by adding a new action!
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-lg rounded-3">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center rounded-top-4">
        <h3 className="m-0">Sustainability Actions</h3>
        <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">
          Total Points: {totalPoints}
        </span>
      </div>

      <div className="card-body p-4">
        {/* Scrollable table container */}
        <div className="table-responsive rounded-2" style={{ maxHeight: "380px", overflowY: "auto" }}>
          <table className="table table-hover align-middle text-center">
            <thead className="table-dark sticky-top shadow-sm">
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>Date</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-light">
              {actions.map((action) => (
                <tr key={action.id} className="border-bottom">
                  <td><strong>{action.id}</strong></td>
                  <td>{action.action}</td>
                  <td>{action.date}</td>
                  <td>
                    <span className="badge bg-info text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">
                      {action.points}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-outline-warning btn-sm text-dark" onClick={() => onEdit(action)}>
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${action.action}"?`)) {
                            onDelete(action.id);
                          }
                        }}
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ActionTable;
