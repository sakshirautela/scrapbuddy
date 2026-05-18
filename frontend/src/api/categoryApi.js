import apiClient from './apiClient';

const categoryApi = {
  // Category endpoints
  getCategories: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/categories?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post(`/categories`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Subcategory endpoints
  getSubCategories: async (parentId) => {
    try {
      const response = await apiClient.get(`/categories/${parentId}/subcategories`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
getAllCategoryWithSubcategories: async () => {
    try {
      const response = await apiClient.get(`/categories/with-subcategories`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createSubCategory: async (parentId, subCategoryData) => {
    try {
      const response = await apiClient.post(`/categories/${parentId}/subcategories`, subCategoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllSubcategories: async () => {
    try {
      const response = await apiClient.get('/subcategories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createSubcategoryGlobal: async (subCategoryData) => {
    try {
      const response = await apiClient.post('/subcategories', subCategoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSubcategory: async (id, subCategoryData) => {
    try {
      const response = await apiClient.put(`/subcategories/${id}`, subCategoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteSubcategory: async (id) => {
    try {
      const response = await apiClient.delete(`/subcategories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default categoryApi;