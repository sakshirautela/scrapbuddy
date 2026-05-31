// @ts-nocheck
import apiClient from "../utils/apiClient";
import { unwrapResponse } from "../utils/apiResponse";

const adminApi = {
  getAdmins: (page = 1, limit = 10) =>
    unwrapResponse(() => apiClient.get(`/api/admins?page=${page}&limit=${limit}`)),

  getAdminById: (id) =>
    unwrapResponse(() => apiClient.get(`/api/admins/${id}`)),

  createAdmin: (adminData) =>
    unwrapResponse(() => apiClient.post(`/api/admins`, adminData)),

  updateAdmin: (id, adminData) =>
    unwrapResponse(() => apiClient.put(`/api/admins/${id}`, adminData)),

  deleteAdmin: (id) =>
    unwrapResponse(() => apiClient.delete(`/api/admins/${id}`)),

  getAdminStats: () =>
    unwrapResponse(() => apiClient.get(`/api/admins/stats`)),
};

export default adminApi;
