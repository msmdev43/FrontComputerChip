import React from 'react';
import '../../styles/components/admin/AdminStats.css';

const AdminStats = ({ stats }) => {
  const statItems = [
    { 
      label: 'Productos', 
      value: stats.products, 
      icon: '🛍️',
      color: '#3b82f6'
    },
    { 
      label: 'Pedidos', 
      value: stats.orders, 
      icon: '📦',
      color: '#8b5cf6'
    },
    { 
      label: 'Usuarios', 
      value: stats.users, 
      icon: '👥',
      color: '#10b981'
    },
    { 
      label: 'Ingresos', 
      value: `$${stats.revenue.toLocaleString()}`, 
      icon: '💰',
      color: '#f59e0b'
    }
  ];

  return (
    <div className="admin-stats">
      {statItems.map((item, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ background: `${item.color}20`, color: item.color }}>
            {item.icon}
          </div>
          <div className="stat-info">
            <span className="stat-value">{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;