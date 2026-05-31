// @ts-nocheck
import apiClient from "../utils/apiClient";

const withUsersPrefix = (url) => `/api/users${url}`;

const api = {
  get: (url, config) => apiClient.get(withUsersPrefix(url), config),
  post: (url, data, config) => apiClient.post(withUsersPrefix(url), data, config),
  put: (url, data, config) => apiClient.put(withUsersPrefix(url), data, config),
  patch: (url, data, config) => apiClient.patch(withUsersPrefix(url), data, config),
  delete: (url, config) => apiClient.delete(withUsersPrefix(url), config),
};

export default api;
