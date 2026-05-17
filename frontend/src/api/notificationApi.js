import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const notificationApi = {
  getNotifications: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getNotificationById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createNotification: async (notificationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications`, notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateNotification: async (id, notificationData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/${id}`, notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default notificationApi;