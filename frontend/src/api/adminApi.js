import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const adminApi = {
  getAdmins: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admins?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAdminById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createAdmin: async (adminData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admins`, adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateAdmin: async (id, adminData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admins/${id}`, adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteAdmin: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAdminStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admins/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminApi;