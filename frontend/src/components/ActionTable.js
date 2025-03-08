import React, { useState, useEffect } from "react";

/**
 * ActionTable component displays a table of sustainability actions.
 * 
 * @param {Array} actions - List of sustainability actions to display
 * @param {Function} onEdit - Callback function when an action is edited
 * @param {Function} onDelete - Callback function when an action is deleted
 */
function ActionTable({ actions, onEdit, onDelete }) {
  // State to track the backend server status
  const [serverStatus, setServerStatus] = useState("Checking...");

  /**
   * Function to check server status by making a fetch request to the backend
   */
  const checkServerStatus = async () => {
    try {
      await fetch("http://localhost:8000/");
      setServerStatus("running");
    } catch (error) {
      setServerStatus("down");
    }
  };

  // useEffect hook to check server status periodically
  useEffect(() => {
    checkServerStatus(); // Initial check
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Calculate total points from all actions
  const totalPoints = actions.reduce((sum, action) => sum + action.points, 0);

  // Display error message if server is down
  if (serverStatus === "down") {
    return (
      <div className="alert alert-danger">
        🚨 Server is down! Please check your connection.
      </div>
    );
  }

  // Display info message if no actions exist
  if (actions.length === 0) {
    return (
      <div className="alert alert-info">
        No sustainability actions found. Start by adding a new action!
      </div>
    );
  }

  // Render the actions table when server is up and actions exist
  return (
    <div className="card border-0 shadow-lg rounded-3">
      {/* Table header with title and total points */}
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center rounded-top-4">
        <h3 className="m-0">Sustainability Actions</h3>
        <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">
          Total Points: {totalPoints}
        </span>
      </div>

      <div className="card-body p-4">
        {/* Scrollable table container with fixed height */}
        <div className="table-responsive rounded-2" style={{ maxHeight: "380px", overflowY: "auto" }}>
          <table className="table table-hover align-middle text-center">
            {/* Table header that sticks to top when scrolling */}
            <thead className="table-dark sticky-top shadow-sm">
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>Date</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* Table body containing the action rows */}
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
                  {/* Edit and Delete buttons for each action */}
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-outline-warning btn-sm text-dark" onClick={() => onEdit(action)}>
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          // Confirmation dialog before deleting an action
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
