import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = {
  getActions: async () => {
    try {
      const response = await axios.get(`${API_URL}/actions/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching actions:', error);
      throw error;
    }
  },

  createAction: async (action) => {
    try {
      const response = await axios.post(`${API_URL}/actions/`, action);
      return response.data;
    } catch (error) {
      console.error('Error creating action:', error);
      throw error;
    }
  },

  updateAction: async (id, action) => {
    try {
      const response = await axios.put(`${API_URL}/actions/${id}/`, action);
      return response.data;
    } catch (error) {
      console.error(`Error updating action ${id}:`, error);
      throw error;
    }
  },

  deleteAction: async (id) => {
    try {
      await axios.delete(`${API_URL}/actions/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting action ${id}:`, error);
      throw error;
    }
  }
};

export default api;