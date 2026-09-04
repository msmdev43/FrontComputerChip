// src/pages/Admin/AdminProducts.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { productoService } from '../../services/productoService';
import { categoriaService } from '../../services/categoriaService';
import { marcaService } from '../../services/marcaService';
import { formatPrice } from '../../config/currency';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminProducts.css';

// ============================================
// CONSTANTES
// ============================================
const INITIAL_FORM_DATA = {
  nombre: '',
  descripcion: '',
  precio: '',
  precioOferta: '',
  stock: true,
  garantia: '12 meses',
  envioGratis: true,
  codigoSerie: '',
  categoriaIds: [],
  marcaIds: []
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
      const data = await productoService.getAll();
      setProducts(data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(err.response?.data?.Error || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriaService.getAll();
      setCategories(data || []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  }, []);

  const loadBrands = useCallback(async () => {
    try {
      const data = await marcaService.getAll();
      setBrands(data || []);
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
      const brandNames = product.marcas?.map(m => m.nombre).join(' ') || '';
      const categoryNames = product.categorias?.map(c => c.nombre).join(' ') || '';
      
      const matchSearch = 
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brandNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryNames.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = 
        filterCategory === 'all' || 
        product.categorias?.some(c => c.id === parseInt(filterCategory) || c.nombre === filterCategory);
      
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
      await productoService.delete(id);
      await loadProducts();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert(err.response?.data?.Error || 'No se pudo eliminar el producto');
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm('¿Restaurar este producto?')) return;
    try {
      await productoService.restore(id);
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
        precioOferta: formData.precioOferta ? parseFloat(formData.precioOferta) : null,
        stock: Boolean(formData.stock),
        garantia: formData.garantia || '12 meses',
        envioGratis: formData.envioGratis ? 1 : 0,
        codigoSerie: formData.codigoSerie || null,
        categoriaIds: formData.categoriaIds || [],
        marcaIds: formData.marcaIds || [],
        especificacionIds: [],
        atributos: []
      };

      console.log('📦 Enviando al backend:', JSON.stringify(productData, null, 2));

      if (editingProduct) {
        await productoService.update(editingProduct.id, productData);
      } else {
        await productoService.create(productData);
      }
      
      await loadProducts();
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      const errorMsg = err.response?.data?.Error || 
                       err.response?.data?.message || 
                       err.response?.data?.title ||
                       'Error al guardar el producto';
      alert(errorMsg);
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
  const hasStock = (stock) => Boolean(stock);

  const getCategoryNames = (product) => {
    if (product.categorias && product.categorias.length > 0) {
      return product.categorias.map(c => c.nombre).join(', ');
    }
    return 'N/D';
  };

  const getBrandNames = (product) => {
    if (product.marcas && product.marcas.length > 0) {
      return product.marcas.map(m => m.nombre).join(', ');
    }
    return 'N/D';
  };

  const isActive = (product) => !product.deletedAt;

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Gestión de Productos" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando productos<span className="dots">...</span></div>
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
        <AdminHeader title="Gestión de Productos" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>📦 Lista de Productos</h2>
              <button className="btn-primary" onClick={openCreateModal}>
                ➕ Agregar Producto
              </button>
            </div>

            <div className="search-bar">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar productos por nombre, marca o categoría..."
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
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    ✕ Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadProducts}>Reintentar</button>
              </div>
            )}

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
                        <td><span className="product-name">{product.nombre}</span></td>
                        <td><span className="product-brand">{getBrandNames(product)}</span></td>
                        <td><span className="product-category">{getCategoryNames(product)}</span></td>
                        <td className="product-price">{formatPrice(product.precio)}</td>
                        <td>
                          <span className={`stock-badge ${hasStock(product.stock) ? 'stock-yes' : 'stock-no'}`}>
                            {hasStock(product.stock) ? '✅ En Stock' : '❌ Sin Stock'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${isActive(product) ? 'status-active' : 'status-inactive'}`}>
                            {isActive(product) ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action btn-action-edit" onClick={() => openEditModal(product)} title="Editar producto">✏️</button>
                            {isActive(product) ? (
                              <button className="btn-action btn-action-delete" onClick={() => handleDelete(product.id)} title="Eliminar producto">🗑️</button>
                            ) : (
                              <button className="btn-action btn-action-restore" onClick={() => handleRestore(product.id)} title="Restaurar producto">🔄</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="table-footer">
              <div className="pagination-info">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL REDISEÑADO */}
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
// PRODUCT MODAL 
// ============================================
const ProductModal = ({ product, onClose, onSave, categories, brands, submitting }) => {
  const [formData, setFormData] = useState(() => {
    if (product) {
      const rawPrice = typeof product.precio === 'string' 
        ? product.precio.replace(/[^0-9.]/g, '') 
        : product.precio;

      const rawPriceOferta = typeof product.precioOferta === 'string' 
        ? product.precioOferta.replace(/[^0-9.]/g, '') 
        : product.precioOferta;

      const categoriaIds = product.categorias?.map(c => c.id) || [];
      const marcaIds = product.marcas?.map(m => m.id) || [];

      return {
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: rawPrice || '',
        precioOferta: rawPriceOferta || '',
        stock: typeof product.stock === 'boolean' ? product.stock : Boolean(product.stock),
        garantia: product.garantia || '12 meses',
        envioGratis: product.envioGratis !== undefined ? Boolean(product.envioGratis) : true,
        codigoSerie: product.codigoSerie || '',
        categoriaIds: categoriaIds,
        marcaIds: marcaIds
      };
    }
    return INITIAL_FORM_DATA;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre del producto es obligatorio');
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    if (formData.categoriaIds.length === 0) {
      alert('Debe seleccionar al menos una categoría');
      return;
    }

    if (formData.marcaIds.length === 0) {
      alert('Debe seleccionar al menos una marca');
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

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      categoriaIds: selectedOptions
    }));
  };

  const handleBrandChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      marcaIds: selectedOptions
    }));
  };

  // Formatear precio con separadores de miles para mostrar
  const formatPriceDisplay = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('es-AR').format(value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-product" onClick={e => e.stopPropagation()}>
        {/* HEADER CON BOTÓN CERRAR */}
        <div className="modal-header">
          <h3>{product ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Cerrar">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre - Ocupa todo el ancho */}
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

          {/* Descripción - Ocupa todo el ancho */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada del producto..."
              rows="4"
              disabled={submitting}
            />
          </div>
          
          {/* Precios - 2 columnas */}
          <div className="form-row">
            <div className="form-group">
              <label>Precio * (ARS)</label>
              <input
                type="text"
                name="precio"
                value={formData.precio}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, precio: rawValue }));
                }}
                required
                placeholder="Ej: 199999"
                disabled={submitting}
              />
              {formData.precio && (
                <small className="help-text">
                  {formatPriceDisplay(formData.precio)} ARS
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Precio en Oferta (ARS)</label>
              <input
                type="text"
                name="precioOferta"
                value={formData.precioOferta}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, precioOferta: rawValue }));
                }}
                placeholder="Ej: 149999"
                disabled={submitting}
              />
              {formData.precioOferta && (
                <small className="help-text">
                  {formatPriceDisplay(formData.precioOferta)} ARS
                </small>
              )}
            </div>
          </div>

          {/* Garantía + Código Serie - 2 columnas */}
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

            <div className="form-group">
              <label>Código de Serie</label>
              <input
                type="text"
                name="codigoSerie"
                value={formData.codigoSerie}
                onChange={handleChange}
                placeholder="Código único del producto"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Checkboxes - 2 columnas */}
          <div className="form-row checkboxes-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="stock"
                  checked={Boolean(formData.stock)}
                  onChange={handleChange}
                  disabled={submitting}
                />
                ¿En Stock / Disponible?
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="envioGratis"
                  checked={Boolean(formData.envioGratis)}
                  onChange={handleChange}
                  disabled={submitting}
                />
                ¿Envío Gratis?
              </label>
            </div>
          </div>

          {/* Marcas y Categorías - 2 columnas con selects más grandes */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Marcas * 
                <span className="help-label"> (selecciona múltiples)</span>
              </label>
              <select
                name="marcaIds"
                multiple
                value={formData.marcaIds.map(String)}
                onChange={handleBrandChange}
                disabled={submitting}
                className="select-multiple"
                required
              >
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.nombre}
                  </option>
                ))}
              </select>
              <small className="help-text">
                ⌨️ Ctrl/Cmd + clic para seleccionar múltiples
              </small>
            </div>

            <div className="form-group">
              <label>
                Categorías * 
                <span className="help-label"> (selecciona múltiples)</span>
              </label>
              <select
                name="categoriaIds"
                multiple
                value={formData.categoriaIds.map(String)}
                onChange={handleCategoryChange}
                disabled={submitting}
                className="select-multiple"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <small className="help-text">
                ⌨️ Ctrl/Cmd + clic para seleccionar múltiples
              </small>
            </div>
          </div>

          {/* Acciones */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;