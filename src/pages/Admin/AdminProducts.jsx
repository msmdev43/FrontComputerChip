import React from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import '../../styles/admin/AdminDashboard.css';

const AdminProducts = () => {
  // Datos de ejemplo
  const products = [
    { id: 1, name: 'Gabinete Gamer Zer01 Orion', price: '$72.960', stock: 15, status: 'Activo' },
    { id: 2, name: 'Gabinete Gamer Zer01 Centauri', price: '$30.250', stock: 8, status: 'Activo' },
    { id: 3, name: 'Fuente de Poder Corsair 750W', price: '$128.900', stock: 0, status: 'Agotado' },
    { id: 4, name: 'Placa de Video RTX 4060', price: '$450.000', stock: 5, status: 'Activo' },
  ];

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Productos" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>📦 Lista de Productos</h2>
              <button className="btn-primary">➕ Agregar Producto</button>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>#{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`status-badge ${product.status === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                          {product.status}
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

export default AdminProducts;