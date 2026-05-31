// @ts-nocheck
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/login-otp',
  '/api/auth/send-login-otp',
  '/api/auth/signup',
  '/api/auth/password/forgot',
  '/api/auth/password/reset',
  '/api/auth/password/validate',
  '/api/verification/send-otp',
  '/api/verification/send-phone-otp',
  '/api/verification/verify-otp',
  '/api/verification/verify-phone-otp',
];

const PUBLIC_GET_ROUTES = [
  '/api/categories',
  '/api/subcategories',
  '/api/cities',
  '/api/orders/track',
];

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const requestPath = config.url || '';
    const requestMethod = (config.method || 'get').toLowerCase();
    const isPublicRoute = PUBLIC_ROUTES.some((route) => requestPath.includes(route));
    const isPublicGetRoute =
      requestMethod === 'get' &&
      PUBLIC_GET_ROUTES.some((route) => requestPath.includes(route));

    if (token && !isPublicRoute && !isPublicGetRoute) {
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
    localStorage.clear();

      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
    }

    const responseData = error.response?.data;
    if (typeof responseData === 'string') {
      return Promise.reject(Object.assign(new Error(responseData), { response: error.response }));
    }
    if (responseData?.error) {
      return Promise.reject(Object.assign(new Error(responseData.error), { response: error.response }));
    }
    if (responseData?.message) {
      return Promise.reject(Object.assign(new Error(responseData.message), { response: error.response }));
    }

    return Promise.reject(error);
  }
);
export default apiClient;
