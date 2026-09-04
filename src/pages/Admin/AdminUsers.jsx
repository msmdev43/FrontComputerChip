// src/pages/Admin/AdminUsers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { usuarioService } from '../../services/usuarioService';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  // ===== LOAD USERS =====
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener el usuario autenticado (admin)
      const data = await usuarioService.getMe();
      
      // Si la respuesta es un objeto único, lo convertimos en array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && typeof data === 'object') {
        // Si es un solo usuario, lo ponemos en un array
        setUsers([data]);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err.response?.data?.Error || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ===== FILTER USERS =====
  const filteredUsers = users.filter(user => {
    const nombre = user.nombreCompleto || user.nombre || user.usuario || '';
    const email = user.email || '';
    const search = searchTerm.toLowerCase();
    
    return nombre.toLowerCase().includes(search) ||
           email.toLowerCase().includes(search);
  });

  // ===== HELPERS =====
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getUserId = (user) => {
    return user.id || user.idusuarios || user.idUsuario || user.id_usuario;
  };

  const getUserName = (user) => {
    return user.nombreCompleto || user.nombre || user.usuario || 'Usuario';
  };

  const getUserEmail = (user) => {
    return user.email || 'Sin email';
  };

  const isVerified = (user) => {
    return user.emailVerify === 1 || user.email_verify === 1 || user.verificado === true;
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Gestión de Usuarios" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando usuarios<span className="dots">...</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR
  // ============================================
  if (error) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Gestión de Usuarios" />
          <div className="admin-content">
            <div className="admin-page-content">
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadUsers}>Reintentar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MAIN
  // ============================================
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
                      <td colSpan="6" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">📭</span>
                          <p>No se encontraron usuarios</p>
                          <span className="empty-sub">
                            {searchTerm ? 'Prueba con otro término de búsqueda' : 'No hay usuarios registrados'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => {
                      const userId = getUserId(user);
                      const userName = getUserName(user);
                      const userEmail = getUserEmail(user);
                      const verified = isVerified(user);
                      
                      return (
                        <tr key={userId}>
                          <td>#{userId}</td>
                          <td><strong>{userName}</strong></td>
                          <td>{userEmail}</td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <span className={`status-badge ${verified ? 'status-active' : 'status-inactive'}`}>
                              {verified ? '✅ Verificado' : '❌ No verificado'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-action btn-action-view" 
                                title="Ver detalles"
                                onClick={() => handleViewUser(user)}
                              >
                                👁️
                              </button>
                              <button 
                                className="btn-action btn-action-edit" 
                                title="Editar usuario"
                              >
                                ✏️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL DETALLE USUARIO ===== */}
      {showUserDetail && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserDetail(false)}>
          <div className="modal-content modal-user-detail" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👤 Detalle del Usuario</h3>
              <button className="modal-close-btn" onClick={() => setShowUserDetail(false)}>✕</button>
            </div>
            
            <div className="user-detail-info">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">#{getUserId(selectedUser)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{getUserName(selectedUser)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{getUserEmail(selectedUser)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Verificado:</span>
                <span className="detail-value">
                  {isVerified(selectedUser) ? '✅ Sí' : '❌ No'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha Registro:</span>
                <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
              </div>
              {selectedUser.pais && (
                <div className="detail-row">
                  <span className="detail-label">País:</span>
                  <span className="detail-value">{selectedUser.pais}</span>
                </div>
              )}
              {selectedUser.provincia && (
                <div className="detail-row">
                  <span className="detail-label">Provincia:</span>
                  <span className="detail-value">{selectedUser.provincia}</span>
                </div>
              )}
              {selectedUser.ciudad && (
                <div className="detail-row">
                  <span className="detail-label">Ciudad:</span>
                  <span className="detail-value">{selectedUser.ciudad}</span>
                </div>
              )}
              {selectedUser.celular && (
                <div className="detail-row">
                  <span className="detail-label">Celular:</span>
                  <span className="detail-value">{selectedUser.celular}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowUserDetail(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;