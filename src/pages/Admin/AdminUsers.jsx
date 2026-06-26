import React from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import '../../styles/admin/AdminDashboard.css';

const AdminUsers = () => {
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', role: 'Cliente', status: 'Activo' },
    { id: 2, name: 'María García', email: 'maria@email.com', role: 'Cliente', status: 'Activo' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', role: 'Admin', status: 'Activo' },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com', role: 'Cliente', status: 'Inactivo' },
  ];

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Usuarios" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>👥 Usuarios</h2>
              <button className="btn-primary">➕ Agregar Usuario</button>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role === 'Admin' ? 'role-admin' : 'role-user'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action edit">✏️</button>
                        <button className="btn-action delete">🗑️</button>
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

export default AdminUsers;