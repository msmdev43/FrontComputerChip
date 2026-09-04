import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/components/admin/AdminHeader.css';

const AdminHeader = ({ title, subtitle }) => {
  const { logout } = useAdmin();

  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
        <span className="header-date">📅 {currentDate}</span>
      </div>

      <div className="header-right">
        <div className="header-user">
          <span className="user-avatar">A</span>
          <span className="user-name">Administrador</span>
        </div>

        <button className="header-logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <span>🚪</span>
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;