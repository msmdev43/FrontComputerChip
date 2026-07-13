// C:\xampp\htdocs\FrontComputerChip\src\pages\Admin\AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import '../../styles/admin/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Generar usuarios de ejemplo
    const generateSampleUsers = () => {
      const sampleUsers = [
        { idusuarios: 1, nombreCompleto: 'Juan Pérez', email: 'juan@email.com', email_verify: 1, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { idusuarios: 2, nombreCompleto: 'María García', email: 'maria@email.com', email_verify: 1, createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
        { idusuarios: 3, nombreCompleto: 'Carlos López', email: 'carlos@email.com', email_verify: 1, createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { idusuarios: 4, nombreCompleto: 'Ana Martínez', email: 'ana@email.com', email_verify: 0, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        { idusuarios: 5, nombreCompleto: 'Pedro Sánchez', email: 'pedro@email.com', email_verify: 1, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { idusuarios: 6, nombreCompleto: 'Laura Fernández', email: 'laura@email.com', email_verify: 1, createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { idusuarios: 7, nombreCompleto: 'Miguel Rodríguez', email: 'miguel@email.com', email_verify: 0, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { idusuarios: 8, nombreCompleto: 'Carmen Gómez', email: 'carmen@email.com', email_verify: 1, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      return sampleUsers;
    };

    setLoading(true);
    setTimeout(() => {
      setUsers(generateSampleUsers());
      setLoading(false);
    }, 500);
  }, []);

  const toggleUserStatus = (id, currentStatus) => {
    setUsers(users.map(user => 
      user.idusuarios === id ? { ...user, email_verify: currentStatus ? 0 : 1 } : user
    ));
  };

  const filteredUsers = users.filter(user => 
    user.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Usuarios" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>👥 Usuarios</h2>
              <div className="search-bar" style={{ maxWidth: '300px' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="loading-spinner-modern">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">
                Cargando datos<span className="dots">...</span>
              </div>
            </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha Registro</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                          No se encontraron usuarios
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.idusuarios}>
                          <td>#{user.idusuarios}</td>
                          <td>{user.nombreCompleto}</td>
                          <td>{user.email}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString('es-CL')}</td>
                          <td>
                            <span className={`status-badge ${user.email_verify ? 'status-active' : 'status-inactive'}`}>
                              {user.email_verify ? 'Verificado' : 'No verificado'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className={`btn-action ${user.email_verify ? 'edit' : 'delete'}`}
                              onClick={() => toggleUserStatus(user.idusuarios, user.email_verify)}
                              title={user.email_verify ? 'Desactivar usuario' : 'Activar usuario'}
                            >
                              {user.email_verify ? '🔒' : '🔓'}
                            </button>
                            <button className="btn-action view" title="Ver detalles">👁️</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="pagination-info">
                  Mostrando {filteredUsers.length} de {users.length} usuarios
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;