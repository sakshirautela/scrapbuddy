import apiClient from '../utils/apiClient';

const splitName = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ')
  };
};

const authApi = {
 login: async (username, password) => {
  const response = await apiClient.post('/api/auth/login', {
    username,
    password
  });
  return response.data;
},
  loginWithOtp: async (phone, otp) => {
    const response = await apiClient.post('/api/auth/login-otp', null, {
      params: { phone, otp }
    });
    return response.data;
  },


  register: async (userData) => {
    const { firstName, lastName } = splitName(userData.name);
    const response = await apiClient.post('/api/auth/signup', {
      username: userData.username || userData.email,
      password: userData.password,
      email: userData.email,
      phone: userData.phone || '',
      firstName,
      lastName
    });
    return response.data;
  },

  sendLoginOtp: async (phone) => {
    const response = await apiClient.post('/api/auth/send-login-otp', null, {
      params: { phone }
    });
    return response.data;
  },


  logout: async () => {
    return { message: 'Logged out' };
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/api/auth/password/forgot', {
      to: email,
      subject: 'JunkBox password reset',
      body: 'Password reset requested'
    });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/api/auth/password/reset', {
      token,
      newPassword
    });

    return response.data;
  },

  validateResetToken: async (token) => {
    const response = await apiClient.get('/api/auth/password/validate', {
      params: { token }
    });
    return response.data;
  },

  verifyToken: async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiClient.get('/api/users/token');
    return response.data;
  }
};

export default authApi;
