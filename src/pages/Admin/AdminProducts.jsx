// C:\xampp\htdocs\FrontComputerChip\src\pages\Admin\AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { SAMPLE_PRODUCTS, MARCAS, CATEGORIAS } from '../../data/sampleProducts';
import '../../styles/admin/AdminProducts.css';

const AdminProducts = () => {
  // ===== STATE =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ===== LOAD PRODUCTS =====
  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      setTimeout(() => {
        const activeProducts = SAMPLE_PRODUCTS.filter(p => p.deletedAt === null);
        setProducts(activeProducts);
        setLoading(false);
      }, 500);
    };
    loadProducts();
  }, []);

  // ===== FILTER PRODUCTS =====
  const filteredProducts = products.filter(product => {
    const matchSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.marca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || product.categoria === filterCategory;
    const matchBrand = filterBrand === 'all' || product.marca === filterBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  // ===== HANDLERS =====
  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    const index = SAMPLE_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      SAMPLE_PRODUCTS[index].deletedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      const index = SAMPLE_PRODUCTS.findIndex(p => p.id === editingProduct.id);
      if (index !== -1) {
        SAMPLE_PRODUCTS[index] = {
          ...SAMPLE_PRODUCTS[index],
          ...productData,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
        setProducts(products.map(p => 
          p.id === editingProduct.id ? SAMPLE_PRODUCTS[index] : p
        ));
      }
    } else {
      const newId = Math.max(...SAMPLE_PRODUCTS.map(p => p.id)) + 1;
      const newProduct = {
        id: newId,
        ...productData,
        stock: 1,
        envioGratis: 1,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        deletedAt: null,
        imagenes: [{ id: Date.now(), nombre: 'placeholder', url: '/images/product-placeholder.webp', orden: 1 }],
        especificaciones: [],
        atributos: [],
        preguntas: [],
        oferta: null
      };
      SAMPLE_PRODUCTS.push(newProduct);
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterBrand('all');
  };

  // ===== HELPERS =====
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const hasStock = (stock) => {
    return stock > 0;
  };

  // ===== UNIQUE VALUES =====
  const uniqueCategories = ['all', ...new Set(products.map(p => p.categoria))];
  const uniqueBrands = ['all', ...new Set(products.map(p => p.marca))];
  const hasActiveFilters = searchTerm || filterCategory !== 'all' || filterBrand !== 'all';

  // ===== RENDER =====
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Productos" />
        <div className="admin-content">
          <div className="admin-page-content">
            {/* Header */}
            <div className="page-header">
              <h2>📦 Lista de Productos</h2>
              <button 
                className="btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  setShowModal(true);
                }}
              >
                ➕ Agregar Producto
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar productos por nombre o marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <select 
                  className="filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? '📂 Todas las categorías' : cat}
                    </option>
                  ))}
                </select>
                
                <select 
                  className="filter-select"
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                >
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand === 'all' ? '🏷️ Todas las marcas' : brand}
                    </option>
                  ))}
                </select>
                
                {hasActiveFilters && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearFilters}
                  >
                    ✕ Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            
            {/* Loading */}
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
              <>
                {/* Table */}
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="no-results">
                            <div className="empty-state">
                              <span className="empty-icon">🔍</span>
                              <p>No se encontraron productos</p>
                              <span className="empty-sub">Prueba con otros filtros</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(product => (
                          <tr key={product.id}>
                            <td>#{product.id}</td>
                            <td>
                              <span className="product-name">{product.nombre}</span>
                            </td>
                            <td><span className="product-brand">{product.marca}</span></td>
                            <td><span className="product-category">{product.categoria}</span></td>
                            <td className="product-price">{formatPrice(product.precio)}</td>
                            <td>
                              <span className={`stock-badge ${hasStock(product.stock) ? 'stock-yes' : 'stock-no'}`}>
                                {hasStock(product.stock) ? 'Sí' : 'No'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-action btn-action-edit"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setShowModal(true);
                                  }}
                                  title="Editar producto"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-action btn-action-delete"
                                  onClick={() => handleDelete(product.id)}
                                  title="Eliminar producto"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Footer */}
                <div className="table-footer">
                  <div className="pagination-info">
                    Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          marcas={MARCAS}
          categorias={CATEGORIAS}
        />
      )}
    </div>
  );
};

// ===== PRODUCT MODAL COMPONENT =====
const ProductModal = ({ product, onClose, onSave, marcas, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    precio: product?.precio || '',
    marca: product?.marca || '',
    categoria: product?.categoria || '',
    garantia: product?.garantia || '12 meses'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nombre || !formData.precio || !formData.marca || !formData.categoria) {
      alert('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      onSave({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        marca: formData.marca,
        categoria: formData.categoria,
        garantia: formData.garantia
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{product ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Producto *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              required
              placeholder="Ej: Gabinete Gamer Zer01 Orion"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                value={formData.precio}
                onChange={e => setFormData({...formData, precio: e.target.value})}
                required
                placeholder="Ej: 72960"
                min="0"
                step="100"
              />
            </div>
            <div className="form-group">
              <label>Garantía</label>
              <input
                type="text"
                value={formData.garantia}
                onChange={e => setFormData({...formData, garantia: e.target.value})}
                placeholder="Ej: 12 meses"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marca *</label>
              <select
                value={formData.marca}
                onChange={e => setFormData({...formData, marca: e.target.value})}
                required
              >
                <option value="">Seleccionar marca</option>
                {marcas.map(marca => (
                  <option key={marca.id} value={marca.nombre}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Categoría *</label>
              <select
                value={formData.categoria}
                onChange={e => setFormData({...formData, categoria: e.target.value})}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;