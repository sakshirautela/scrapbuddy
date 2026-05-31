// @ts-nocheck
import apiClient from "../utils/apiClient";
import { unwrapResponse } from "../utils/apiResponse";

const notificationApi = {
  getNotifications: (page = 1, limit = 10) =>
    unwrapResponse(() => apiClient.get(`/api/notifications?page=${page}&limit=${limit}`)),

  getNotificationById: (id) =>
    unwrapResponse(() => apiClient.get(`/api/notifications/${id}`)),

  createNotification: (notificationData) =>
    unwrapResponse(() => apiClient.post(`/api/notifications`, notificationData)),

  updateNotification: (id, notificationData) =>
    unwrapResponse(() => apiClient.put(`/api/notifications/${id}`, notificationData)),

  deleteNotification: (id) =>
    unwrapResponse(() => apiClient.delete(`/api/notifications/${id}`)),

  markAsRead: (id) =>
    unwrapResponse(() => apiClient.patch(`/api/notifications/${id}/read`)),
};

export default notificationApi;
