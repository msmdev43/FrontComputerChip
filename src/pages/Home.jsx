import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productoService } from '../services/productoService';
import '../styles/Home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);

  // ===== LOAD DATA =====
  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar productos en paralelo para mejor rendimiento
      const [featured, newItems, saleItems] = await Promise.all([
        // Productos destacados (los primeros 4)
        productoService.getAll().then(data => data.slice(0, 4)),
        // Productos nuevos (últimos 4)
        productoService.getNewProducts(7).then(data => data.slice(0, 4)),
        // Productos en oferta
        productoService.getOnSale().then(data => data.slice(0, 4))
      ]);

      // Filtrar productos activos (no eliminados)
      const filterActive = (products) => products.filter(p => !p.deletedAt);

      setFeaturedProducts(filterActive(featured) || []);
      setNewProducts(filterActive(newItems) || []);
      setSaleProducts(filterActive(saleItems) || []);

    } catch (err) {
      console.error('Error al cargar datos del home:', err);
      setError('No se pudieron cargar los productos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

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

  const handleViewDetails = (productId) => {
    // El ProductCard maneja la navegación
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="home-page">
        <div className="home-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando productos...</p>
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
      <div className="home-page">
        <div className="home-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Error al cargar productos</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={loadHomeData}>
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: HOME
  // ============================================
  const hasFeatured = featuredProducts.length > 0;
  const hasNew = newProducts.length > 0;
  const hasSales = saleProducts.length > 0;

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>🐱 Bienvenido a ComputerChip</h1>
            <p>Tu tienda de confianza para componentes de computadora, reparación y servicio técnico especializado</p>
            <div className="hero-buttons">
              <Link to="/productos" className="hero-btn-primary">
                Ver productos
              </Link>
              <Link to="/contacto" className="hero-btn-secondary">
                Contactarnos
              </Link>
            </div>
          </div>
        </section>

        {/* Ofertas especiales */}
        {hasSales && (
          <section className="home-section">
            <div className="section-header">
              <h2>🔥 Ofertas Especiales</h2>
              <Link to="/productos?filter=on-sale" className="see-all">
                Ver todas →
              </Link>
            </div>
            <div className="products-grid">
              {saleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* Productos destacados */}
        {hasFeatured && (
          <section className="home-section">
            <div className="section-header">
              <h2>⭐ Productos Destacados</h2>
              <Link to="/productos" className="see-all">
                Ver todos →
              </Link>
            </div>
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* Nuevos productos */}
        {hasNew && (
          <section className="home-section">
            <div className="section-header">
              <h2>🆕 Nuevos Productos</h2>
              <Link to="/productos" className="see-all">
                Ver todos →
              </Link>
            </div>
            <div className="products-grid">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* Sin productos */}
        {!hasFeatured && !hasNew && !hasSales && (
          <div className="empty-home">
            <p>No hay productos disponibles en este momento.</p>
          </div>
        )}

        {/* CTA Final */}
        <section className="cta-section">
          <div className="cta-content">
            <h3>¿Necesitas ayuda con tu PC?</h3>
            <p>Ofrecemos servicio técnico especializado para computadoras, notebooks y consolas.</p>
            <Link to="/contacto" className="cta-btn">
              📞 Contáctanos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;