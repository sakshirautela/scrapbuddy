// src/api/orderApi.js

import apiClient from "./apiClient";

const orderApi = {

  // GET ALL ORDERS
  getOrders: async (params = {}) => {
    try {

      const queryString =
        new URLSearchParams(params).toString();

      const response = await apiClient.get(
        `/orders?${queryString}`
      );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data ||
        error.message
      );

    }
  },

  // GET ORDER BY ID
  getOrderById: async (id) => {
    try {

      const response =
        await apiClient.get(`/orders/${id}`);

      return response.data;

    } catch (error) {

      throw (
        error.response?.data ||
        error.message
      );

    }
  },

  // GET ORDERS BY USER
  getOrdersByUser: async (id) => {
    try {

      const response =
        await apiClient.get(
          `/orders/orderByUser/${id}`
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data ||
        error.message
      );

    }
  },

  // CREATE ORDER
  createOrder: async (orderData) => {
    try {

      const response =
        await apiClient.post(
          "/orders",
          orderData
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data ||
        error.message
      );

    }
  },

  // UPDATE ORDER
  updateOrder: async (id, orderData) => {
    try {

      const response =
        await apiClient.put(
          `/orders/${id}`,
          orderData
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data ||
        error.message
      );

    }
  },

  // DELETE ORDER
  deleteOrder: async (id) => {
    try {

      const response =
        await apiClient.delete(
          `/orders/${id}`
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data ||
        error.message
      );

    }
  }

};

export default orderApi;