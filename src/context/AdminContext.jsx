import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('adminAuth');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(parsed.user);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('adminAuth', JSON.stringify({
      isAuthenticated: true,
      user: userData
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
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