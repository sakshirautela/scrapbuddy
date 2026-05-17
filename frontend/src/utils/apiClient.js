import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const PUBLIC_AUTH_ROUTES = [
  '/api/auth/login',
  '/api/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-otp'
];

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const requestPath = config.url || '';
    const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => requestPath.includes(route));

    if (token && !isPublicAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error.response?.data || error.message);
  }
);
export default apiClient;
