import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { marcaService } from '../services/marcaService';
import '../styles/Productos.css';

function Productos() {
  const navigate = useNavigate();
  
  // ===== STATE =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ===== LOAD DATA =====
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productoService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriaService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  }, []);

  const loadBrands = useCallback(async () => {
    try {
      const data = await marcaService.getAll();
      setBrands(data);
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
      // Verificar si el producto está activo (no eliminado)
      if (product.deletedAt) return false;

      const productName = product.nombre?.toLowerCase() || '';
      const brandName = product.marca?.nombre?.toLowerCase() || 
                       product.productosMarcas?.[0]?.marcas?.nombre?.toLowerCase() || '';
      const categoryName = product.categoria?.nombre?.toLowerCase() || 
                          product.categoriasProductos?.[0]?.categorias?.nombre?.toLowerCase() || '';
      
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        productName.includes(searchLower) ||
        brandName.includes(searchLower) ||
        categoryName.includes(searchLower);

      // Filtro por estado de stock
      let matchesStock = true;
      if (filter === 'instock') {
        matchesStock = (product.stock || 0) > 0;
      } else if (filter === 'outofstock') {
        matchesStock = (product.stock || 0) === 0;
      } else if (filter === 'on-sale') {
        matchesStock = product.oferta === true || product.descuento > 0;
      }

      return matchesSearch && matchesStock;
    });
  }, [products, searchTerm, filter]);

  // ===== SORT PRODUCTS =====
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const aPrice = a.oferta?.precioOferta || a.precio || 0;
      const bPrice = b.oferta?.precioOferta || b.precio || 0;
      const aSavings = a.oferta ? (a.oferta.precioOriginal - a.oferta.precioOferta) : 0;
      const bSavings = b.oferta ? (b.oferta.precioOriginal - b.oferta.precioOferta) : 0;

      switch (sortBy) {
        case 'price-low':
          return aPrice - bPrice;
        case 'price-high':
          return bPrice - aPrice;
        case 'savings':
          return bSavings - aSavings;
        default: // 'popular'
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  // ===== HANDLERS =====
  const handleViewDetails = useCallback((productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const slug = createSlug(product.nombre);
      navigate(`/productos/${slug}/${productId}`);
    } else {
      navigate(`/productos/${productId}`);
    }
  }, [products, navigate]);

  const handleRetry = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // ===== HELPERS =====
  const createSlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="productos-wrapper">
        <section className="productos-page">
          <div className="page-container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR
  // ============================================
  if (error) {
    return (
      <div className="productos-wrapper">
        <section className="productos-page">
          <div className="page-container">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h2>Error al cargar productos</h2>
              <p>{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                🔄 Reintentar
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ============================================
  // RENDER: PRODUCTOS
  // ============================================
  return (
    <div className="productos-wrapper">
      <section className="productos-page">
        <div className="page-container">
          {/* Header */}
          <div className="productos-header">
            <h1>Productos</h1>
            
            {/* Filtros */}
            <div className="productos-filters">
              <div className="filter-group">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos los productos</option>
                  <option value="instock">En stock</option>
                  <option value="outofstock">Sin stock</option>
                  <option value="on-sale">En oferta</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="popular">Más vendidos</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="savings">Mayor ahorro</option>
                </select>
              </div>
              
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="productos-stats">
            <span>{sortedProducts.length} productos encontrados</span>
            {searchTerm && (
              <span className="search-term"> para "{searchTerm}"</span>
            )}
          </div>

          {/* Grid */}
          {sortedProducts.length === 0 ? (
            <div className="no-products">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="productos-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Productos;