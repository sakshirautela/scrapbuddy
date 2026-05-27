import apiClient from "../utils/apiClient";

const orderApi = {

  // CREATE ORDER
  createOrder: async (data) => {
    return await apiClient.post(
      "/api/orders",
      data
    );
  },

  // GET ALL ORDERS
  getAllOrders: async () => {
    return await apiClient.get(
      "/api/orders"
    );
  },

  getOrdersByUser: async (userId) => {
    return await apiClient.get(
      `/api/orders/orderByUser/${userId}`
    );
  },

  getMyOrders: async () => {
    return await apiClient.get(
      "/api/orders/my"
    );
  },

  getOrderById: async (id) => {
    return await apiClient.get(
      `/api/orders/${id}`
    );
  },

  trackOrder: async (id) => {
    return await apiClient.get(
      `/api/orders/track/${id}`
    );
  },

  // DELETE ORDER
  deleteOrder: async (id) => {
    return await apiClient.delete(
      `/api/orders/${id}`
    );
  },

  cancelOrder: async (id) => {
    return await apiClient.patch(
      `/api/orders/${id}/cancel`
    );
  },

  // UPDATE ORDER
  updateOrder: async (
    id,
    data
  ) => {
    return await apiClient.put(
      `/api/orders/${id}`,
      data
    );
  },

  acceptOrder: async (id) => {
    return await apiClient.patch(
      `/api/orders/${id}/accept`
    );
  },

  assignOrder: async (id, adminId) => {
    return await apiClient.patch(
      `/api/orders/${id}/assign`,
      { adminId }
    );
  },

  unassignOrder: async (id) => {
    return await apiClient.patch(
      `/api/orders/${id}/unassign`
    );
  },

  rescheduleOrder: async (id, data) => {
    return await apiClient.patch(
      `/api/orders/${id}/reschedule`,
      data
    );
  },

  sendDeliveryOtp: async (id) => {
    return await apiClient.post(
      `/api/orders/${id}/delivery-otp`
    );
  },

  deliverOrder: async (id, data) => {
    return await apiClient.patch(
      `/api/orders/${id}/deliver`,
      data
    );
  },

};

export default orderApi;
