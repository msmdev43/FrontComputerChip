// src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import '../../src/styles/admin/AdminLoading.css';

// Importar páginas admin (SOLO las que tienen endpoints)
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminCategoriesBrands from '../pages/Admin/AdminCategoriesBrands';
import AdminOrders from '../pages/Admin/AdminOrders';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminSettings from '../pages/Admin/AdminSettings';
import AdminShippingZones from '../pages/Admin/AdminShippingZones';
import AdminSpecifications from '../pages/Admin/AdminSpecifications';

// ============================================
// COMPONENTE PRIVATE ROUTE
// ============================================
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner">
          <div className="spinner-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="admin-loading-text">
            Verificando autenticación<span className="dots">...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// ============================================
// COMPONENTE PRINCIPAL DE RUTAS ADMIN
// ============================================
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/products" 
        element={
          <PrivateRoute>
            <AdminProducts />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/categories-brands" 
        element={
          <PrivateRoute>
            <AdminCategoriesBrands />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/orders" 
        element={
          <PrivateRoute>
            <AdminOrders />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/users" 
        element={
          <PrivateRoute>
            <AdminUsers />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/shipping-zones" 
        element={
          <PrivateRoute>
            <AdminShippingZones />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/specifications" 
        element={
          <PrivateRoute>
            <AdminSpecifications />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <AdminSettings />
          </PrivateRoute>
        } 
      />
      
      <Route path="/*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;