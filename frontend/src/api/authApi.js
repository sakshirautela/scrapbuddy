import apiClient from '../utils/apiClient';

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
    const email = userData.email.trim().toLowerCase();
    const response = await apiClient.post('/api/auth/signup', {
      username: userData.username || email,
      password: userData.password,
      email,
      phone: userData.phone || '',
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim()
    });
    return response.data;
  },

  sendRegistrationOtp: async (email) => {
    const response = await apiClient.post('/api/verification/send-otp', null, {
      params: { email: email.trim().toLowerCase() }
    });
    return response.data;
  },

  verifyRegistrationOtp: async (email, otp) => {
    const response = await apiClient.post('/api/verification/verify-otp', null, {
      params: { email: email.trim().toLowerCase(), otp: otp.trim() }
    });
    return response.data;
  },

  sendPhoneVerificationOtp: async (phone) => {
    const response = await apiClient.post('/api/verification/send-phone-otp', null, {
      params: { phone: phone.trim() }
    });
    return response.data;
  },

  verifyPhoneOtp: async (phone, otp) => {
    const response = await apiClient.post('/api/verification/verify-phone-otp', null, {
      params: { phone: phone.trim(), otp: otp.trim() }
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

  verifyOtp: async (_email, otp) => {
    const response = await apiClient.get('/api/auth/password/validate', {
      params: { token: otp }
    });
    return response.data;
  },

  setPassword: async (_email, newPassword, token) => {
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
