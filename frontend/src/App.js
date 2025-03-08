import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import ActionForm from './components/ActionForm';
import ActionTable from './components/ActionTable';
import EditActionForm from './components/EditActionForm';
import api from './services/api';

function App() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAction, setEditingAction] = useState(null);

  // Fetch all actions on component mount
  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      setLoading(true);
      const data = await api.getActions();
      setActions(data);
      setError('');
    } catch (err) {
      setError('Failed to load actions. Please try refreshing the page. Check if the server is running');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAction = async (newAction) => {
    try {
      const addedAction = await api.createAction(newAction);
      setActions([...actions, addedAction]);
      return true;
    } catch (err) {
      console.error('Error adding action:', err);
      throw err;
    }
  };

  const handleUpdateAction = async (id, updatedAction) => {
    try {
      const updated = await api.updateAction(id, updatedAction);
      setActions(actions.map(action => action.id === id ? updated : action));
      setEditingAction(null); // Close edit form
      return true;
    } catch (err) {
      console.error('Error updating action:', err);
      throw err;
    }
  };

  const handleDeleteAction = async (id) => {
    try {
      await api.deleteAction(id);
      setActions(actions.filter(action => action.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting action:', err);
      return false;
    }
  };

  const handleEditClick = (action) => {
    setEditingAction(action);
    // Scroll to the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingAction(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      <div className="container mb-5 flex-grow-1">
        {error && <div className="alert alert-danger">{error}</div>}

        {editingAction ? (
          <EditActionForm 
            action={editingAction}
            onUpdateAction={handleUpdateAction}
            onCancel={handleCancelEdit}
          />
        ) : (
          <ActionForm onAddAction={handleAddAction} />
        )}

        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className='text-white'>Loading actions...</p>
          </div>
        ) : (
          <ActionTable 
            actions={actions}
            onEdit={handleEditClick}
            onDelete={handleDeleteAction}
          />
        )}
      </div>

      <footer className="bg-dark text-white text-center p-3 mt-auto">
        <div className="container">
          <p className="mb-0">Tarun © 2025 Sustainability Actions Tracker</p>
        </div>
      </footer>
    </div>
  );
}

export default App;