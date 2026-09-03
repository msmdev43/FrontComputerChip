import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productoService } from '../services/productoService';
import { useCart } from '../context/CartContext';
import ShareModal from '../components/ShareModal';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('especificaciones');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // ===== LOAD PRODUCT =====
  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productId = parseInt(id);
      if (isNaN(productId)) {
        setError('ID de producto inválido');
        setLoading(false);
        return;
      }

      const data = await productoService.getById(productId);
      
      if (!data) {
        setError('Producto no encontrado');
        setLoading(false);
        return;
      }

      // Verificar slug
      const expectedSlug = createSlug(data.nombre);
      if (slug && slug !== expectedSlug) {
        navigate(`/productos/${expectedSlug}/${productId}`, { replace: true });
        return;
      }

      setProduct(data);
      
      // Cargar productos relacionados
      try {
        const related = await productoService.getRelated(productId);
        setRelatedProducts(related || []);
      } catch (err) {
        console.warn('No se pudieron cargar productos relacionados:', err);
      }

    } catch (err) {
      console.error('Error al cargar producto:', err);
      setError(err.response?.data?.Error || 'Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  }, [id, slug, navigate]);

  useEffect(() => {
    loadProduct();
    // Resetear estado al cambiar de producto
    setActiveImage(0);
    setQuantity(1);
    setActiveTab('especificaciones');
    setAddedToCart(false);
  }, [loadProduct]);

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

  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // ===== HANDLERS =====
  const handleAddToCart = () => {
    if (!product) return;
    
    const productForCart = {
      id: product.id,
      nombre: product.nombre,
      precio: product.oferta?.precioOferta || product.precio,
      marca: product.marca?.nombre || product.marca || 'N/A',
      categoria: product.categoria?.nombre || product.categoria || 'N/A',
      stock: product.stock || 0,
      envioGratis: product.envioGratis || 0,
      imagen: product.imagenes?.length > 0 ? product.imagenes[0].url : '/images/product-placeholder.webp',
      oferta: product.oferta ? {
        precioOriginal: product.oferta.precioOriginal || product.precio,
        precioOferta: product.oferta.precioOferta || product.precio,
        descuento: product.oferta.descuento || 0
      } : null
    };
    
    addToCart(productForCart, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    setTimeout(() => {
      navigate('/carrito');
    }, 500);
  };

  const changeQuantity = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product?.stock && next > product.stock) return product.stock;
      return next;
    });
    if (addedToCart) setAddedToCart(false);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  // ===== RENDER: LOADING =====
  if (loading) {
    return (
      <div className="detail-wrapper">
        <div className="detail-loading-container">
          <div className="detail-loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  // ===== RENDER: ERROR =====
  if (error || !product) {
    return (
      <div className="detail-wrapper">
        <div className="detail-not-found">
          <h2>⚠️ {error || 'No encontramos este producto'}</h2>
          <p>Puede que ya no esté disponible o el enlace sea incorrecto.</p>
          <Link to="/productos" className="detail-back-to-products">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  // ===== RENDER: PRODUCT =====
  const {
    nombre,
    precio,
    garantia,
    stock,
    envioGratis,
    codigoSerie,
    marca,
    categoria,
    oferta,
    imagenes = [],
    especificaciones = [],
    atributos = [],
    preguntas = []
  } = product;

  const hasOffer = oferta !== null && oferta !== undefined && oferta.precioOferta > 0;
  const originalPrice = hasOffer ? oferta.precioOriginal : precio;
  const discountedPrice = hasOffer ? oferta.precioOferta : precio;
  const savings = hasOffer ? (originalPrice - discountedPrice) : 0;
  const discountPercent = hasOffer && originalPrice > 0
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const inStock = stock > 0;
  const brandName = marca?.nombre || marca || 'N/A';
  const categoryName = categoria?.nombre || categoria || 'N/A';

  const sortedImages = [...imagenes].sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const mainImage = sortedImages[activeImage]?.url || '/images/product-placeholder.webp';

  return (
    <div className="detail-wrapper">
      <section className="detail-page">
        <div className="detail-container">
          {/* Breadcrumb con compartir y copiar */}
          <div className="detail-breadcrumb-wrapper">
            <nav className="detail-breadcrumb">
              <Link to="/productos">Productos</Link>
              <span className="detail-breadcrumb-sep">/</span>
              <span>{categoryName}</span>
              <span className="detail-breadcrumb-sep">/</span>
              <span className="detail-breadcrumb-current">{nombre}</span>
            </nav>
            
            <div className="detail-share-actions">
              <button className="detail-share-btn" onClick={handleShare} title="Compartir">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Compartir
              </button>
              <button className={`detail-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyLink} title="Copiar enlace">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {copied ? '¡Copiado!' : 'Copiar enlace'}
              </button>
            </div>
          </div>

          <div className="detail-main">
            {/* Galería de imágenes */}
            <div className="detail-gallery">
              <div className="detail-gallery-main">
                {discountPercent > 0 && (
                  <div className="detail-discount-badge">-{discountPercent}%</div>
                )}
                <img
                  src={mainImage}
                  alt={nombre}
                  onError={(e) => { e.target.src = '/images/product-placeholder.webp'; }}
                />
              </div>

              {sortedImages.length > 1 && (
                <div className="detail-gallery-thumbnails">
                  {sortedImages.map((img, index) => (
                    <button
                      key={img.id || index}
                      className={`detail-gallery-thumb ${index === activeImage ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={img.url}
                        alt={`${nombre} - vista ${index + 1}`}
                        onError={(e) => { e.target.src = '/images/product-placeholder.webp'; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="detail-info">
              <div className="detail-brand">{brandName}</div>
              <h1 className="detail-name">{nombre}</h1>

              <div className="detail-categories">
                <span className="detail-category-tag">{categoryName}</span>
              </div>

              {/* Precios */}
              <div className="detail-prices">
                {hasOffer && originalPrice > discountedPrice && (
                  <span className="detail-original-price">{formatPrice(originalPrice)}</span>
                )}
                <div className="detail-price-row">
                  <span className="detail-discounted-price">{formatPrice(discountedPrice)}</span>
                  {savings > 0 && (
                    <span className="detail-savings-tag">Ahorras {formatPrice(savings)}</span>
                  )}
                </div>
              </div>

              {/* Perks */}
              <ul className="detail-perks">
                <li className={inStock ? 'detail-in-stock' : 'detail-no-stock'}>
                  {inStock ? `✅ En stock (${stock} unidades)` : '❌ Sin stock'}
                </li>
                {envioGratis === 1 && <li>🚚 Envío gratis</li>}
                {garantia && <li>🛡️ Garantía: {garantia}</li>}
              </ul>

              {/* Acciones */}
              <div className="detail-actions-container">
                {inStock && (
                  <div className="detail-action-row">
                    <div className="detail-quantity-selector">
                      <span>Cantidad</span>
                      <div className="detail-quantity-controls">
                        <button onClick={() => changeQuantity(-1)} disabled={quantity <= 1}>−</button>
                        <span className="detail-quantity-value">{quantity}</span>
                        <button onClick={() => changeQuantity(1)} disabled={quantity >= 10}>+</button>
                      </div>
                    </div>
                    <button
                      className={`detail-add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                      onClick={handleAddToCart}
                      disabled={!inStock}
                    >
                      {addedToCart ? '✅ AGREGADO' : (inStock ? 'AGREGAR AL CARRITO' : 'SIN STOCK')}
                    </button>
                  </div>
                )}

                <button
                  className="detail-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                >
                  COMPRAR
                </button>
              </div>

              {/* SKU */}
              {codigoSerie && (
                <div className="detail-sku-container">
                  <span className="detail-sku">SKU: {codigoSerie}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          {(especificaciones.length > 0 || atributos.length > 0 || preguntas.length > 0) && (
            <div className="detail-tabs">
              <div className="detail-tabs-header">
                {especificaciones.length > 0 && (
                  <button
                    className={activeTab === 'especificaciones' ? 'active' : ''}
                    onClick={() => setActiveTab('especificaciones')}
                  >
                    Especificaciones
                  </button>
                )}
                {atributos.length > 0 && (
                  <button
                    className={activeTab === 'atributos' ? 'active' : ''}
                    onClick={() => setActiveTab('atributos')}
                  >
                    Características
                  </button>
                )}
                {preguntas.length > 0 && (
                  <button
                    className={activeTab === 'preguntas' ? 'active' : ''}
                    onClick={() => setActiveTab('preguntas')}
                  >
                    Preguntas frecuentes
                  </button>
                )}
              </div>

              <div className="detail-tabs-content">
                {activeTab === 'especificaciones' && especificaciones.length > 0 && (
                  <dl className="detail-specs-list">
                    {especificaciones.map((spec, i) => (
                      <div className="detail-specs-row" key={i}>
                        <dt>{spec.titulo || spec.nombre || `Especificación ${i + 1}`}</dt>
                        <dd>{spec.descripcion || spec.valor || 'N/A'}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {activeTab === 'atributos' && atributos.length > 0 && (
                  <table className="detail-attributes-table">
                    <tbody>
                      {atributos.map((attr, i) => (
                        <tr key={i}>
                          <th>{attr.nombre || `Atributo ${i + 1}`}</th>
                          <td>{attr.valor || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'preguntas' && preguntas.length > 0 && (
                  <div className="detail-faq-list">
                    {preguntas.map((q, i) => (
                      <div className="detail-faq-item" key={i}>
                        <button
                          className="detail-faq-question"
                          onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                        >
                          {q.pregunta || q.textoPregunta || `Pregunta ${i + 1}`}
                          <span className="detail-faq-toggle">{openQuestion === i ? '−' : '+'}</span>
                        </button>
                        {openQuestion === i && (
                          <p className="detail-faq-answer">
                            {q.respuesta || q.textoRespuesta || 'Sin respuesta disponible'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Productos relacionados */}
          {relatedProducts.length > 0 && (
            <div className="detail-related-products">
              <h3>🛒 Productos relacionados</h3>
              <div className="detail-related-grid">
                {relatedProducts.slice(0, 4).map((relProduct) => (
                  <Link 
                    key={relProduct.id} 
                    to={`/productos/${createSlug(relProduct.nombre)}/${relProduct.id}`}
                    className="detail-related-card"
                  >
                    <img 
                      src={relProduct.imagenes?.[0]?.url || '/images/product-placeholder.webp'} 
                      alt={relProduct.nombre}
                      onError={(e) => { e.target.src = '/images/product-placeholder.webp'; }}
                    />
                    <span className="detail-related-name">{relProduct.nombre}</span>
                    <span className="detail-related-price">{formatPrice(relProduct.precio)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        productName={nombre}
        productUrl={window.location.href}
      />
    </div>
  );
}

export default ProductDetail;