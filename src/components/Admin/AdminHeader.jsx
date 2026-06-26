import React from 'react';
import '../../styles/components/admin/AdminHeader.css';

const AdminHeader = ({ title }) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="admin-header">
      <div className="header-left">
        <h1>{title}</h1>
        <span className="header-date">🐱 {currentDate}</span>
      </div>
      <div className="header-right">
        <div className="header-user">
          <span className="user-avatar">👤</span>
          <span className="user-name">Administrador</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;