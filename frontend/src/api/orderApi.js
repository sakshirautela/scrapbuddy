import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const orderApi = {
  getOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/orders?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default orderApi;