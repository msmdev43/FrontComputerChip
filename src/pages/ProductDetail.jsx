// C:\xampp\htdocs\FrontComputerChip\src\pages\ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/sampleProducts';
import { useCart } from '../context/CartContext';
import ShareModal from '../components/ShareModal'; // 👈 IMPORTAR ShareModal
import Footer from '../components/Footer';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('especificaciones');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // 👈 NUEVO

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setActiveImage(0);
      setQuantity(1);
      setActiveTab('especificaciones');
      setAddedToCart(false);
      
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const foundProduct = getProductById(id);
      console.log('🔍 Buscando producto con ID:', id);
      console.log('📦 Producto encontrado:', foundProduct);
      
      if (foundProduct) {
        const expectedSlug = createSlug(foundProduct.nombre);
        if (slug && slug !== expectedSlug) {
          navigate(`/productos/${expectedSlug}/${id}`, { replace: true });
        }
      }
      
      setProduct(foundProduct);
      setLoading(false);
    };
    
    loadProduct();
  }, [id, slug, navigate]);

  const createSlug = (text) => {
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

  const handleAddToCart = () => {
    if (!product) return;
    
    const productForCart = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      marca: product.marca,
      categoria: product.categoria,
      stock: product.stock,
      envioGratis: product.envioGratis,
      imagen: product.imagenes.length > 0 ? product.imagenes[0].url : '/images/product-placeholder.webp',
      oferta: product.oferta ? {
        precioOriginal: product.oferta.precioOriginal,
        precioOferta: product.oferta.precioOferta,
        descuento: product.oferta.descuento
      } : null
    };
    
    addToCart(productForCart, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
    
    console.log(`🛒 Añadido al carrito: ${product.nombre} x${quantity}`);
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

  // 👈 ABRIR MODAL DE COMPARTIR
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // 👈 CERRAR MODAL DE COMPARTIR
  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  // 👈 COPIAR ENLACE (para el botón del breadcrumb)
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

  if (!product) {
    return (
      <div className="detail-wrapper">
        <div className="detail-not-found">
          <h2>No encontramos este producto</h2>
          <p>Puede que ya no esté disponible o el enlace sea incorrecto.</p>
          <Link to="/productos" className="detail-back-to-products">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const {
    id: productId,
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

  const hasOffer = oferta !== null && oferta !== undefined;
  const originalPrice = hasOffer ? oferta.precioOriginal : precio;
  const discountedPrice = hasOffer ? oferta.precioOferta : precio;
  const savings = hasOffer ? (originalPrice - discountedPrice) : 0;
  const discountPercent = hasOffer && originalPrice > 0
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const inStock = stock === 1;

  const sortedImages = [...imagenes].sort((a, b) => a.orden - b.orden);
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
              <span>{categoria}</span>
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
                      key={img.id}
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
              <div className="detail-brand">{marca}</div>
              <h1 className="detail-name">{nombre}</h1>

              <div className="detail-categories">
                <span className="detail-category-tag">{categoria}</span>
              </div>

              {/* Precios: original arriba, oferta + ahorro en la misma línea */}
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

              {/* Perks alineados a la izquierda */}
              <ul className="detail-perks">
                <li className={inStock ? 'detail-in-stock' : 'detail-no-stock'}>
                  {inStock ? '✅ En stock' : '❌ Sin stock'}
                </li>
                {envioGratis === 1 && <li>🚚 Envío gratis</li>}
                {garantia && <li>🛡️ Garantía: {garantia}</li>}
              </ul>

              {/* Selector de cantidad y botones */}
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

              {/* SKU abajo de los botones */}
              {codigoSerie && (
                <div className="detail-sku-container">
                  <span className="detail-sku">SKU: {codigoSerie}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs de información adicional */}
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
                        <dt>{spec.titulo}</dt>
                        <dd>{spec.descripcion}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {activeTab === 'atributos' && atributos.length > 0 && (
                  <table className="detail-attributes-table">
                    <tbody>
                      {atributos.map((attr, i) => (
                        <tr key={i}>
                          <th>{attr.nombre}</th>
                          <td>{attr.valor}</td>
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
                          {q.textoPregunta || q.pregunta}
                          <span className="detail-faq-toggle">{openQuestion === i ? '−' : '+'}</span>
                        </button>
                        {openQuestion === i && (
                          <p className="detail-faq-answer">{q.textoRespuesta || q.respuesta}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 👈 MODAL DE COMPARTIR */}
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