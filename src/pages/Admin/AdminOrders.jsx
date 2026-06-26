import React from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import '../../styles/admin/AdminDashboard.css';

const AdminOrders = () => {
  const orders = [
    { id: '#12345', customer: 'Juan Pérez', date: '2026-06-25', total: '$156.900', status: 'Pendiente' },
    { id: '#12344', customer: 'María García', date: '2026-06-24', total: '$450.000', status: 'Completado' },
    { id: '#12343', customer: 'Carlos López', date: '2026-06-23', total: '$72.960', status: 'Enviado' },
    { id: '#12342', customer: 'Ana Martínez', date: '2026-06-22', total: '$128.900', status: 'Pendiente' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'status-pending',
      'Completado': 'status-completed',
      'Enviado': 'status-shipped'
    };
    return colors[status] || 'status-pending';
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Pedidos" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>📋 Pedidos</h2>
              <div className="filter-group">
                <select className="filter-select">
                  <option>Todos los estados</option>
                  <option>Pendiente</option>
                  <option>Enviado</option>
                  <option>Completado</option>
                </select>
              </div>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.total}</td>
                      <td>
                        <span className={`order-status ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action view">👁️</button>
                        <button className="btn-action edit">✏️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;