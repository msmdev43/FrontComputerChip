// C:\xampp\htdocs\FrontComputerChip\src\components\ProductCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/ProductCard.css';

const ProductCard = ({ 
  product,
  onViewDetails
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Datos del producto en estructura BD
  const {
    id,
    nombre,
    precio,
    stock,
    envioGratis,
    marca,
    categoria,
    imagen,
    oferta
  } = product;

  // Crear slug a partir del nombre del producto
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Generar URL amigable: /productos/nombre-del-producto/id
  const getProductUrl = () => {
    const slug = createSlug(nombre);
    return `/productos/${slug}/${id}`;
  };

  // Calcular precios con valores por defecto
  const hasOffer = oferta !== null && oferta !== undefined;
  const originalPrice = hasOffer ? (oferta.precioOriginal || precio) : precio;
  const discountedPrice = hasOffer ? (oferta.precioOferta || precio) : precio;
  const savings = hasOffer ? (originalPrice - discountedPrice) : 0;
  const discountPercent = hasOffer && originalPrice > 0
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

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

  const getImageUrl = () => {
    if (imageError || !imagen) {
      return '/images/product-placeholder.webp';
    }
    return imagen;
  };

  // Manejar el clic en la card
  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      navigate(getProductUrl());
    }
  };

  return (
    <div 
      className="pc-card pc-clickable"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Badges */}
      {hasOffer && savings > 0 && (
        <div className="pc-savings-badge">
          AHORRA ${savings.toLocaleString('es-CL')}
        </div>
      )}
      
      {hasOffer && discountPercent > 0 && (
        <div className="pc-discount-badge">
          -{discountPercent}%
        </div>
      )}
      
      {stock === 0 && (
        <div className="pc-out-of-stock-badge">Sin Stock</div>
      )}
      
      <div className="pc-image-container">
        {!imageLoaded && !imageError && (
          <div className="pc-image-skeleton">
            <div className="pc-skeleton-shimmer"></div>
          </div>
        )}
        
        <img 
          src={getImageUrl()} 
          alt={nombre}
          className={`pc-image ${imageLoaded ? 'pc-loaded' : 'pc-loading'}`}
          loading="lazy"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          width="300"
          height="225"
        />
        
        {stock === 0 && (
          <div className="pc-out-of-stock-overlay">Sin Stock</div>
        )}
      </div>
      
      <div className="pc-info">
        <div className="pc-brand">{marca}</div>
        <h3 className="pc-name">{nombre}</h3>
        
        <div className="pc-categories">
          <span className="pc-category-tag">{categoria}</span>
          {envioGratis === 1 && (
            <span className="pc-free-shipping">🚚 Envío gratis</span>
          )}
        </div>
        
        <div className="pc-prices">
          {hasOffer && originalPrice !== discountedPrice ? (
            <>
              <span className="pc-original-price">{formatPrice(originalPrice)}</span>
              <span className="pc-discounted-price">{formatPrice(discountedPrice)}</span>
            </>
          ) : (
            <span className="pc-discounted-price">{formatPrice(precio)}</span>
          )}
        </div>
        
        <div className="pc-hint">
          <span>Ver detalles</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;