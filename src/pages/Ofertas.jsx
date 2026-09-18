import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productoService } from '../services/productoService';
import '../styles/Ofertas.css';

function Ofertas() {
  const navigate = useNavigate();

  // ===== STATE =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount-high');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minDiscount, setMinDiscount] = useState(0);

  // ===== LOAD DATA =====
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productoService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error al cargar ofertas:', err);
      setError('No se pudieron cargar las ofertas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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

  const getOfferInfo = (product) => {
    const oferta = product.oferta;
    const tieneOferta =
      (oferta && oferta.precioOferta > 0) ||
      product.descuento > 0 ||
      product.enOferta === true;

    if (!tieneOferta) return null;

    const precioOriginal =
      oferta?.precioOriginal || product.precioOriginal || product.precio || 0;
    const precioOferta =
      oferta?.precioOferta || product.precioOferta || product.precio || 0;

    const ahorro = Math.max(0, precioOriginal - precioOferta);
    const descuento =
      oferta?.descuento ||
      product.descuento ||
      (precioOriginal > 0
        ? Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100)
        : 0);

    return { precioOriginal, precioOferta, ahorro, descuento };
  };

  // ===== CATEGORÍAS DISPONIBLES =====
  const availableCategories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const info = getOfferInfo(p);
      if (!info || p.deletedAt) return;
      const cat =
        p.categoria?.nombre ||
        p.categoriasProductos?.[0]?.categorias?.nombre;
      if (cat) set.add(cat);
    });
    return Array.from(set).sort();
  }, [products]);

  // ===== FILTRO =====
  const filteredOffers = useMemo(() => {
    return products
      .map((product) => {
        const offerInfo = getOfferInfo(product);
        return offerInfo ? { ...product, __offer: offerInfo } : null;
      })
      .filter((product) => {
        if (!product) return false;
        if (product.deletedAt) return false;

        const { descuento } = product.__offer;
        if (descuento < minDiscount) return false;

        const cat =
          product.categoria?.nombre ||
          product.categoriasProductos?.[0]?.categorias?.nombre ||
          '';
        if (categoryFilter !== 'all' && cat !== categoryFilter) return false;

        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const nombre = product.nombre?.toLowerCase() || '';
        const marca =
          product.marca?.nombre?.toLowerCase() ||
          product.productosMarcas?.[0]?.marcas?.nombre?.toLowerCase() ||
          '';
        return (
          nombre.includes(term) ||
          marca.includes(term) ||
          cat.toLowerCase().includes(term)
        );
      });
  }, [products, searchTerm, categoryFilter, minDiscount]);

  // ===== ORDEN =====
  const sortedOffers = useMemo(() => {
    return [...filteredOffers].sort((a, b) => {
      const oa = a.__offer;
      const ob = b.__offer;

      switch (sortBy) {
        case 'discount-high':
          return ob.descuento - oa.descuento;
        case 'discount-low':
          return oa.descuento - ob.descuento;
        case 'savings-high':
          return ob.ahorro - oa.ahorro;
        case 'price-low':
          return oa.precioOferta - ob.precioOferta;
        case 'price-high':
          return ob.precioOferta - oa.precioOferta;
        default:
          return 0;
      }
    });
  }, [filteredOffers, sortBy]);

  // ===== HANDLERS =====
  const handleViewDetails = useCallback(
    (productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const slug = createSlug(product.nombre);
        navigate(`/productos/${slug}/${productId}`);
      } else {
        navigate(`/productos/${productId}`);
      }
    },
    [products, navigate]
  );

  const handleRetry = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setMinDiscount(0);
    setSortBy('discount-high');
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="ofertas-wrapper">
        <section className="ofertas-page">
          <div className="page-container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando ofertas...</p>
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
      <div className="ofertas-wrapper">
        <section className="ofertas-page">
          <div className="page-container">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h2>Error al cargar ofertas</h2>
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
  // RENDER: OFERTAS
  // ============================================
  return (
    <div className="ofertas-wrapper">
      <section className="ofertas-page">
        <div className="page-container">
          {/* Header simple */}
          <div className="ofertas-header">
            <h1>🔥 Ofertas</h1>
            <p className="ofertas-subtitle">
              Descuentos reales en componentes, periféricos y equipos.
            </p>
          </div>

          {/* Filtros */}
          <div className="ofertas-filters">
            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="discount-high">Mayor descuento</option>
                <option value="discount-low">Menor descuento</option>
                <option value="savings-high">Mayor ahorro ($)</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas las categorías</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                value={minDiscount}
                onChange={(e) => setMinDiscount(Number(e.target.value))}
                className="filter-select"
              >
                <option value={0}>Cualquier descuento</option>
                <option value={10}>10% o más</option>
                <option value={20}>20% o más</option>
                <option value={30}>30% o más</option>
                <option value={50}>50% o más</option>
              </select>
            </div>

            <div className="search-group">
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Resultados */}
          <div className="ofertas-stats">
            <span>
              {sortedOffers.length}{' '}
              {sortedOffers.length === 1
                ? 'oferta encontrada'
                : 'ofertas encontradas'}
            </span>
            {searchTerm && (
              <span className="search-term"> para "{searchTerm}"</span>
            )}
          </div>

          {/* Grid */}
          {sortedOffers.length === 0 ? (
            <div className="no-products">
              <p>No hay ofertas que coincidan con tu búsqueda.</p>
              <button className="clear-search-btn" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="productos-grid">
              {sortedOffers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* CTA final */}
          <section className="ofertas-cta">
            <h3>¿Buscas algo más?</h3>
            <p>Explora todo nuestro catálogo de productos.</p>
            <Link to="/productos" className="ofertas-cta-btn">
              Ver todos los productos →
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
}

export default Ofertas;