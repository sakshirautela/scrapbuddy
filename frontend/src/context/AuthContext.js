import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyToken = useCallback(async () => {
    try {
      setError(null);
      const userData = await authApi.verifyToken();
      setUser(userData);
    } catch (err) {
      console.error('Token verification failed:', err);
    localStorage.clear();
      setUser(null);
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await verifyToken();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [verifyToken]);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Login failed';
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await authApi.register(userData);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      return response;
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Registration failed';
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
     localStorage.clear();
      setUser(null);
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
