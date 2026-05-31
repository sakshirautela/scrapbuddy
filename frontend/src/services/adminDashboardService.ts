import apiClient from "../utils/apiClient";
import cityApi from "../api/cityApi";
import orderApi from "../api/orderApi";

const toList = (response, fallback = []) => (Array.isArray(response?.data) ? response.data : fallback);

const requireList = async (request, resourceName) => {
  try {
    const response = await request();
    return toList(response);
  } catch (error) {
    const status = error?.response?.status;
    const detail = status ? ` (${status})` : "";
    throw new Error(`Failed to load ${resourceName}${detail}`);
  }
};

const settleList = async (request, fallback = []) => {
  try {
    const response = await request();
    return toList(response, fallback);
  } catch {
    return fallback;
  }
};

export const getAdminDashboardData = async () => {
  const [orders, categories, addresses, cities, admins] = await Promise.all([
    requireList(() => apiClient.get("/api/orders"), "orders"),
    settleList(() => apiClient.get("/api/categories/with-subcategories")),
    settleList(() => apiClient.get("/api/addresses")),
    cityApi.getCities(),
    settleList(() => apiClient.get("/api/users/admins")),
  ]);

  return { orders, categories, addresses, cities, admins };
};

export const getOrders = async () => {
  const response = await orderApi.getAllOrders();
  return toList(response);
};

export const getCustomerAddressesAndOrders = async () => {
  const [addressesResponse, ordersResponse] = await Promise.all([
    apiClient.get("/api/addresses"),
    orderApi.getAllOrders(),
  ]);

  return {
    addresses: toList(addressesResponse),
    orders: toList(ordersResponse),
  };
};

export const getAdmins = async () => {
  const response = await apiClient.get("/api/users/admins");
  return toList(response);
};

export const createCategory = async (payload) => {
  const response = await apiClient.post("/api/categories", payload);
  return response.data;
};

export const updateCategory = async (categoryId, payload) => {
  const response = await apiClient.put(`/api/categories/${categoryId}`, payload);
  return response.data;
};

export const deleteCategory = (categoryId) => apiClient.delete(`/api/categories/${categoryId}`);

export const createSubCategory = async (payload) => {
  const response = await apiClient.post("/api/subcategories", payload);
  return response.data;
};

export const updateSubCategory = async (subCategoryId, payload) => {
  const response = await apiClient.put(`/api/subcategories/${subCategoryId}`, payload);
  return response.data;
};

export const deleteSubCategory = (subCategoryId) => apiClient.delete(`/api/subcategories/${subCategoryId}`);

export const createCity = (payload) => cityApi.createCity(payload);
export const updateCity = (cityId, payload) => cityApi.updateCity(cityId, payload);
export const deleteCity = (cityId) => cityApi.deleteCity(cityId);

export const adminOrderService = orderApi;
