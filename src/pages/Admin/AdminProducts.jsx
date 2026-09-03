import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import clienteAxios from '../../config/axiosClient';
import { ENDPOINTS } from '../../config/config';
import '../../styles/admin/AdminProducts.css';

// ============================================
// CONSTANTES
// ============================================
const INITIAL_FORM_DATA = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  garantia: '12 meses',
  marcaId: '',
  categoriaId: '',
  oferta: false,
  descuento: 0
};

const STATUS_OPTIONS = [
  { value: 'all', label: '📂 Todas las categorías' },
  { value: 'activo', label: '✅ Activos' },
  { value: 'inactivo', label: '❌ Inactivos' }
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const AdminProducts = () => {
  // ===== STATE =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ===== LOAD DATA =====
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteAxios.get(ENDPOINTS.productos.base);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(err.response?.data?.Error || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await clienteAxios.get(ENDPOINTS.categoria.base);
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  }, []);

  const loadBrands = useCallback(async () => {
    try {
      const response = await clienteAxios.get(ENDPOINTS.marca.base);
      setBrands(response.data || []);
    } catch (err) {
      console.error('Error al cargar marcas:', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
  }, [loadProducts, loadCategories, loadBrands]);

  // ===== FILTER PRODUCTS =====
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Buscar por nombre o marca
      const brandName = product.marca || product.productosMarcas?.[0]?.marcas?.nombre || '';
      const categoryName = product.categoria || product.categoriasProductos?.[0]?.categorias?.nombre || '';
      
      const matchSearch = 
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brandName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrar por categoría
      const matchCategory = 
        filterCategory === 'all' || 
        categoryName === filterCategory ||
        product.categoriaId === parseInt(filterCategory);
      
      // Filtrar por estado (activo/inactivo)
      const matchStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'activo' && !product.deletedAt) ||
        (filterStatus === 'inactivo' && product.deletedAt);
      
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  // ===== HANDLERS =====
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await clienteAxios.delete(ENDPOINTS.productos.porId(id));
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert(err.response?.data?.Error || 'No se pudo eliminar el producto');
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm('¿Restaurar este producto?')) return;
    
    try {
      await clienteAxios.post(ENDPOINTS.productos.restaurar(id));
      await loadProducts();
    } catch (err) {
      console.error('Error al restaurar producto:', err);
      alert(err.response?.data?.Error || 'No se pudo restaurar el producto');
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      setSubmitting(true);
      
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || '',
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        garantia: formData.garantia || '12 meses',
        oferta: formData.oferta || false,
        descuento: formData.descuento || 0,
        categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : null,
        marcaId: formData.marcaId ? parseInt(formData.marcaId) : null
      };

      if (editingProduct) {
        // Actualizar
        await clienteAxios.put(
          ENDPOINTS.productos.porId(editingProduct.id),
          productData
        );
      } else {
        // Crear
        await clienteAxios.post(ENDPOINTS.productos.base, productData);
      }
      
      await loadProducts();
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert(err.response?.data?.Error || 'Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStatus('all');
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // ===== HELPERS =====
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const hasStock = (stock) => {
    return stock === true || stock > 0;
  };

  const getCategoryName = (product) => {
    return product.categoria || 
           product.categoriasProductos?.[0]?.categorias?.nombre || 
           'N/D';
  };

  const getBrandName = (product) => {
    return product.marca || 
           product.productosMarcas?.[0]?.marcas?.nombre || 
           'N/D';
  };

  const isActive = (product) => !product.deletedAt;

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
                onClick={openCreateModal}
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
                  <option value="all">📂 Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                
                <select 
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                
                {(searchTerm || filterCategory !== 'all' || filterStatus !== 'all') && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearFilters}
                  >
                    ✕ Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            
            {/* Error */}
            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button 
                  className="btn-primary" 
                  onClick={loadProducts}
                  style={{ marginTop: '10px' }}
                >
                  Reintentar
                </button>
              </div>
            )}

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
                  Cargando productos<span className="dots">...</span>
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
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="no-results">
                            <div className="empty-state">
                              <span className="empty-icon">🔍</span>
                              <p>No se encontraron productos</p>
                              <span className="empty-sub">Prueba con otros filtros o agrega un nuevo producto</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(product => (
                          <tr key={product.id} className={!isActive(product) ? 'row-inactive' : ''}>
                            <td>#{product.id}</td>
                            <td>
                              <span className="product-name">{product.nombre}</span>
                            </td>
                            <td><span className="product-brand">{getBrandName(product)}</span></td>
                            <td><span className="product-category">{getCategoryName(product)}</span></td>
                            <td className="product-price">{formatPrice(product.precio)}</td>
                            <td>
                              <span className={`stock-badge ${hasStock(product.stock) ? 'stock-yes' : 'stock-no'}`}>
                                {hasStock(product.stock) ? `✅ ${product.stock}` : '❌ Sin stock'}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${isActive(product) ? 'status-active' : 'status-inactive'}`}>
                                {isActive(product) ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-action btn-action-edit"
                                  onClick={() => openEditModal(product)}
                                  title="Editar producto"
                                >
                                  ✏️
                                </button>
                                {isActive(product) ? (
                                  <button 
                                    className="btn-action btn-action-delete"
                                    onClick={() => handleDelete(product.id)}
                                    title="Eliminar producto"
                                  >
                                    🗑️
                                  </button>
                                ) : (
                                  <button 
                                    className="btn-action btn-action-restore"
                                    onClick={() => handleRestore(product.id)}
                                    title="Restaurar producto"
                                  >
                                    🔄
                                  </button>
                                )}
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
          categories={categories}
          brands={brands}
          submitting={submitting}
        />
      )}
    </div>
  );
};

// ============================================
// PRODUCT MODAL COMPONENT
// ============================================
const ProductModal = ({ product, onClose, onSave, categories, brands, submitting }) => {
  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        stock: product.stock || '',
        garantia: product.garantia || '12 meses',
        marcaId: product.marcaId || product.marca?.id || '',
        categoriaId: product.categoriaId || product.categoria?.id || '',
        oferta: product.oferta || false,
        descuento: product.descuento || 0
      };
    }
    return INITIAL_FORM_DATA;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre del producto es obligatorio');
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    await onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Gabinete Gamer Zer01 Orion"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto..."
              rows="3"
              disabled={submitting}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Precio * (CLP)</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                placeholder="Ej: 72960"
                min="0"
                step="100"
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Garantía</label>
              <input
                type="text"
                name="garantia"
                value={formData.garantia}
                onChange={handleChange}
                placeholder="Ej: 12 meses"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marca</label>
              <select
                name="marcaId"
                value={formData.marcaId}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Seleccionar marca</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="oferta"
                  checked={formData.oferta}
                  onChange={handleChange}
                  disabled={submitting}
                />
                ¿En oferta?
              </label>
            </div>
            {formData.oferta && (
              <div className="form-group">
                <label>Descuento (%)</label>
                <input
                  type="number"
                  name="descuento"
                  value={formData.descuento}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  disabled={submitting}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;