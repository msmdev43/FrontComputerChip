import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/components/admin/AdminHeader.css';

const AdminHeader = ({ title, subtitle }) => {
  const { user, logout } = useAdmin();
  
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!user) return 'A';
    
    const nombre = user.nombre || user.usuario || '';
    if (nombre.length >= 2) {
      return nombre.charAt(0).toUpperCase() + nombre.charAt(1).toUpperCase();
    }
    return nombre.charAt(0).toUpperCase() || 'A';
  };

  // Obtener nombre del usuario
  const getUserName = () => {
    if (!user) return 'Administrador';
    return user.nombre || user.usuario || 'Administrador';
  };

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
        <span className="header-date">🐱 {currentDate}</span>
      </div>
      <div className="header-right">
        <div className="header-user">
          <span className="user-avatar">{getUserInitials()}</span>
          <div className="user-info">
            <span className="user-name">{getUserName()}</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>
        <button 
          className="header-logout-btn" 
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Salir</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;