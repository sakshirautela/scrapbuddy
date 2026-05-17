import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const categoryApi = {
  getCategories: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSubCategories: async (parentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${parentId}/subcategories`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createSubCategory: async (parentId, subCategoryData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories/${parentId}/subcategories`, subCategoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default categoryApi;