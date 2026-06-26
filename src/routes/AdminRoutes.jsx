import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminOrders from '../pages/Admin/AdminOrders';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminSettings from '../pages/Admin/AdminSettings';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();
  
  if (loading) {
    return <div className="admin-loading">Cargando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/products" element={
        <PrivateRoute>
          <AdminProducts />
        </PrivateRoute>
      } />
      <Route path="/orders" element={
        <PrivateRoute>
          <AdminOrders />
        </PrivateRoute>
      } />
      <Route path="/users" element={
        <PrivateRoute>
          <AdminUsers />
        </PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute>
          <AdminSettings />
        </PrivateRoute>
      } />
      <Route path="/*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;