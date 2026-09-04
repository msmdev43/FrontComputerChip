import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import CatLogo from './CatLogo';
import '../../styles/components/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
      navigate('/admin/login');
    }
  };

  const menuItems = [
    // Principales
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard', group: 'main' },
    { icon: '🛍️', label: 'Productos', path: '/admin/products', group: 'main' },
    { icon: '🏷️', label: 'Categorías y Marcas', path: '/admin/categories-brands', group: 'main' },
    { icon: '📦', label: 'Pedidos', path: '/admin/orders', group: 'main' },
    { icon: '👥', label: 'Usuarios', path: '/admin/users', group: 'main' },
    // Gestión
    { icon: '🚚', label: 'Zonas de Envío', path: '/admin/shipping-zones', group: 'gestion' },
    { icon: '📋', label: 'Especificaciones', path: '/admin/specifications', group: 'gestion' },
    // Sistema
    { icon: '⚙️', label: 'Configuración', path: '/admin/settings', group: 'sistema' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <CatLogo size={45} />
        <h2>Computer Chip</h2>
        <span className="sidebar-subtitle">Admin Panel</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const showDivider = 
            (item.group === 'gestion' && menuItems[index - 1]?.group === 'main') ||
            (item.group === 'sistema' && menuItems[index - 1]?.group === 'gestion');

          return (
            <React.Fragment key={item.path}>
              {showDivider && <div className="sidebar-divider" />}
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="sidebar-icon">🚪</span>
          Salir
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;