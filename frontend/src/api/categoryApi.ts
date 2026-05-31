// @ts-nocheck
import apiClient from './apiClient';
import { unwrapResponse } from "../utils/apiResponse";

const categoryApi = {
  // Category endpoints
  getCategories: (page = 1, limit = 10) =>
    unwrapResponse(() => apiClient.get(`/api/categories?page=${page}&limit=${limit}`)),

  getCategoryById: (id) =>
    unwrapResponse(() => apiClient.get(`/api/categories/${id}`)),

  createCategory: (categoryData) =>
    unwrapResponse(() => apiClient.post(`/api/categories`, categoryData)),

  updateCategory: (id, categoryData) =>
    unwrapResponse(() => apiClient.put(`/api/categories/${id}`, categoryData)),

  deleteCategory: (id) =>
    unwrapResponse(() => apiClient.delete(`/api/categories/${id}`)),

  // Subcategory endpoints
  getSubCategories: (parentId) =>
    unwrapResponse(() => apiClient.get(`/api/subcategories/category/${parentId}`)),

  getAllCategoryWithSubcategories: () =>
    unwrapResponse(() => apiClient.get(`/api/categories/with-subcategories`)),

  createSubCategory: (parentId, subCategoryData) =>
    unwrapResponse(() => apiClient.post('/api/subcategories', {
        ...subCategoryData,
        categoryId: subCategoryData.categoryId ?? parentId,
      })),

  getAllSubcategories: () =>
    unwrapResponse(() => apiClient.get('/api/subcategories')),

  createSubcategoryGlobal: (subCategoryData) =>
    unwrapResponse(() => apiClient.post('/api/subcategories', subCategoryData)),

  updateSubcategory: (id, subCategoryData) =>
    unwrapResponse(() => apiClient.put(`/api/subcategories/${id}`, subCategoryData)),

  deleteSubcategory: (id) =>
    unwrapResponse(() => apiClient.delete(`/api/subcategories/${id}`)),
};

export default categoryApi;
