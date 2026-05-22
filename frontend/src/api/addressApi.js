import apiClient from "../utils/apiClient";

const addressApi = {
  getMyAddresses: async () => {
    const response = await apiClient.get("/api/addresses/me");
    return Array.isArray(response.data) ? response.data : [];
  },

  createAddress: async (data) => {
    const response = await apiClient.post("/api/addresses", data);
    return response.data;
  },

  updateAddress: async (id, data) => {
    const response = await apiClient.put(`/api/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id) => {
    await apiClient.delete(`/api/addresses/${id}`);
  },
};

export default addressApi;
