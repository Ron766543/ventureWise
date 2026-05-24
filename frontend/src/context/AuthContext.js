import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const setAuth = (token, userData) => {
    localStorage.setItem('vw_token', token);
    localStorage.setItem('vw_user', JSON.stringify(userData));
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem('vw_token');
    localStorage.removeItem('vw_user');
    setUser(null);
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('vw_token');
    if (!token) { setLoading(false); return; }

    try {
      const res = await authAPI.getMe();
      setUser(res.data.data);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    setAuthError(null);
    const res = await authAPI.login({ email, password });
    setAuth(res.data.token, res.data.user);
    return res.data.user;
  };

  const register = async (formData) => {
    setAuthError(null);
    const res = await authAPI.register(formData);
    setAuth(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => clearAuth();

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('vw_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, authError, setAuthError,
      login, register, logout, updateUser, loadUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isMentor: user?.role === 'mentor' || user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
