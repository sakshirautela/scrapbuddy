import apiClient from '../utils/apiClient';

const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password
    });

    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/api/auth/signup', userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/api/auth/reset-password', {
      token,
      newPassword
    });

    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await apiClient.post('/api/auth/verify-otp', {
      email,
      otp
    });

    return response.data;
  },

  verifyToken: async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiClient.get('/auth/verify');
    return response.data;
  }
};

export default authApi;