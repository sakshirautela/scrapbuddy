import apiClient from "../utils/apiClient";

const cityApi = {
  getCities: async () => {
    const response = await apiClient.get("/api/cities");
    return Array.isArray(response.data) ? response.data : [];
  },

  getCityById: async (id) => {
    const response = await apiClient.get(`/api/cities/${id}`);
    return response.data;
  },

  createCity: async (data) => {
    const response = await apiClient.post("/api/cities", data);
    return response.data;
  },

  updateCity: async (id, data) => {
    const response = await apiClient.put(`/api/cities/${id}`, data);
    return response.data;
  },

  deleteCity: async (id) => {
    await apiClient.delete(`/api/cities/${id}`);
  },
};

export default cityApi;
