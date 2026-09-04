// src/context/AdminContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { adminAuthService } from '../services/adminAuthService';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay token almacenado usando el servicio
        if (adminAuthService.isAuthenticated()) {
          const result = await adminAuthService.verifyToken();
          
          if (result.isValid) {
            setIsAuthenticated(true);
            setUser(result.user);
          } else {
            // Token inválido, limpiar
            adminAuthService.clearAuthData();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        adminAuthService.clearAuthData();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (usuario, password) => {
    try {
      setError(null);
      setLoading(true);

      const result = await adminAuthService.login(usuario, password);

      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error inesperado al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminAuthService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      adminAuthService.clearAuthData();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    clearError
  }), [isAuthenticated, user, loading, error, login, logout, clearError]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de un AdminProvider');
  }
  
  return context;
};

export default AdminContext;