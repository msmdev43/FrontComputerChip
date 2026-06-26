import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminStats from '../../components/Admin/AdminStats';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    // Simular carga de datos
    setStats({
      products: 156,
      orders: 89,
      users: 243,
      revenue: 12500000
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Panel de Control" />
        <div className="admin-content">
          <AdminStats stats={stats} />
          
          <div className="dashboard-grid">
            <div className="dashboard-card recent-orders">
              <h3>📦 Pedidos Recientes</h3>
              <div className="order-list">
                <div className="order-item">
                  <span className="order-id">#12345</span>
                  <span className="order-customer">Juan Pérez</span>
                  <span className="order-amount">$156.900</span>
                  <span className="order-status status-pending">Pendiente</span>
                </div>
                <div className="order-item">
                  <span className="order-id">#12344</span>
                  <span className="order-customer">María García</span>
                  <span className="order-amount">$450.000</span>
                  <span className="order-status status-completed">Completado</span>
                </div>
                <div className="order-item">
                  <span className="order-id">#12343</span>
                  <span className="order-customer">Carlos López</span>
                  <span className="order-amount">$72.960</span>
                  <span className="order-status status-shipped">Enviado</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card quick-actions">
              <h3>⚡ Acciones Rápidas</h3>
              <div className="action-grid">
                <button className="action-btn">➕ Agregar Producto</button>
                <button className="action-btn">📊 Ver Reportes</button>
                <button className="action-btn">👥 Gestionar Usuarios</button>
                <button className="action-btn">🎯 Promociones</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;