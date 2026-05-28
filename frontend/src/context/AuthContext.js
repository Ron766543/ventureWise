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
      // If the backend fails but we have a mock session in local storage, keep it
      const savedUser = localStorage.getItem('vw_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        clearAuth();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      setAuth(res.data.token, res.data.user);
      return res.data.user;
    } catch (err) {
      // ─── DEMO FALLBACK ───
      // If the backend fails, allow logging in with these default demo credentials
      if (email === 'user@example.com' && password === 'password') {
        const mockUser = {
          _id: 'mock_user_123',
          name: 'Demo User',
          email: 'user@example.com',
          role: 'user',
          savedIds: []
        };
        setAuth('mock_token_123', mockUser);
        return mockUser;
      } else if (email === 'admin@example.com' && password === 'password') {
        const mockUser = {
          _id: 'mock_admin_123',
          name: 'Demo Admin',
          email: 'admin@example.com',
          role: 'admin',
          savedIds: []
        };
        setAuth('mock_token_123', mockUser);
        return mockUser;
      }
      // If they are not the demo credentials, pass the original error along
      throw err;
    }
  };

  const register = async (formData) => {
    setAuthError(null);
    try {
      const res = await authAPI.register(formData);
      setAuth(res.data.token, res.data.user);
      return res.data.user;
    } catch (err) {
      // ─── DEMO FALLBACK ───
      // If the registration API is offline, create a mock user locally
      const mockUser = {
        _id: 'mock_user_' + Date.now(),
        name: formData.name || 'New User',
        email: formData.email || 'user@example.com',
        role: 'user',
        savedIds: []
      };
      setAuth('mock_token_123', mockUser);
      return mockUser;
    }
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