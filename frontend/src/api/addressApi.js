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
};

export default addressApi;
