// C:\xampp\htdocs\FrontComputerChip\src\components\ProductCard.jsx
import { useState } from 'react';
import '../styles/components/ProductCard.css';

const ProductCard = ({ 
  product,
  onAddToCart,
  onViewDetails
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const {
    id,
    name,
    brand,
    category,
    subcategory,
    originalPrice,
    discountedPrice,
    savings,
    rating,
    reviews,
    image,
    inStock,
    isNew,
    tags = []
  } = product;

  // Formatear precios en pesos chilenos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Renderizar estrellas de calificación
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="product-rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star filled">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">★</span>
        ))}
      </div>
    );
  };

  // Obtener URL de la imagen con fallback a tu placeholder
  const getImageUrl = () => {
    // Si hay error o no hay imagen, usar tu placeholder
    if (imageError || !image) {
      return '/images/product-placeholder.webp';
    }
    return image;
  };

  // Generar colores de tags según categoría
  const getTagColor = (tag) => {
    const colors = {
      'RGB': '#ff6b6b',
      'Gamer': '#4ecdc4',
      'Mid Tower': '#45b7d1',
      'ARGB': '#a29bfe',
      '4 Fans': '#fd79a8',
      'RTX': '#6c5ce7',
      '8GB': '#00b894',
      'GDDR6': '#fdcb6e',
      'Lightsync': '#00cec9',
      'Mecanico': '#e17055',
      'Rainbow': '#fd79a8',
      '144Hz': '#0984e3',
      'Full HD': '#00b894',
      '750W': '#fdcb6e',
      '80 Plus Gold': '#fdcb6e',
      'Modular': '#a29bfe',
      'DDR4': '#6c5ce7',
      '3200MHz': '#00b894'
    };
    return colors[tag] || '#b2bec3';
  };

  return (
    <div className="product-card">
      {/* Badge de ahorro */}
      {savings > 0 && (
        <div className="product-savings-badge">
          AHORRA ${savings.toLocaleString('es-CL')}
        </div>
      )}
      
      {/* Badge de nuevo */}
      {isNew && (
        <div className="product-new-badge">NUEVO</div>
      )}
      
      {/* Imagen del producto */}
      <div className="product-image-container">
        {/* Skeleton loading mientras carga */}
        {!imageLoaded && !imageError && (
          <div className="product-image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        
        <img 
          src={getImageUrl()} 
          alt={name}
          className={`product-image ${imageLoaded ? 'loaded' : 'loading'}`}
          loading="lazy"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          width="300"
          height="225"
        />
        
        {/* Mensaje de sin stock */}
        {!inStock && (
          <div className="product-out-of-stock">Sin Stock</div>
        )}
      </div>
      
      {/* Información del producto */}
      <div className="product-info">
        <div className="product-brand">{brand}</div>
        <h3 className="product-name">{name}</h3>
        
        {/* Categoría/Subcategoría */}
        <div className="product-categories">
          <span className="category-tag">{category}</span>
          {subcategory && (
            <span className="subcategory-tag">{subcategory}</span>
          )}
        </div>
        
        {/* Calificación */}
        {rating > 0 && (
          <div className="product-rating">
            {renderStars(rating)}
            <span className="rating-value">★ {rating.toFixed(1)}</span>
            <span className="reviews-count">({reviews} reviews)</span>
          </div>
        )}
        
        {/* Precios */}
        <div className="product-prices">
          {originalPrice > discountedPrice ? (
            <>
              <span className="original-price">{formatPrice(originalPrice)}</span>
              <span className="discounted-price">{formatPrice(discountedPrice)}</span>
            </>
          ) : (
            <span className="discounted-price">{formatPrice(discountedPrice)}</span>
          )}
        </div>
        
        {/* Tags adicionales */}
        {tags.length > 0 && (
          <div className="product-tags">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="product-tag"
                style={{ 
                  borderColor: getTagColor(tag),
                  color: getTagColor(tag)
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="product-actions">
          <button 
            className="btn-add-to-cart"
            onClick={() => onAddToCart?.(id)}
            disabled={!inStock}
          >
            {inStock ? 'Agregar al Carrito' : 'Sin Stock'}
          </button>
          <button 
            className="btn-view-details"
            onClick={() => onViewDetails?.(id)}
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;