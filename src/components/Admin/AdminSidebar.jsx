import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import CatLogo from './CatLogo';
import '../../styles/components/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '🛍️', label: 'Productos', path: '/admin/products' },
    { icon: '📦', label: 'Pedidos', path: '/admin/orders' },
    { icon: '👥', label: 'Usuarios', path: '/admin/users' },
    { icon: '⚙️', label: 'Configuración', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <CatLogo size={50} />
        <h2>Computer Chip</h2>
        <span className="sidebar-subtitle">Admin Panel</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;