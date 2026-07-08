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



  // Obtener URL de la imagen con fallback a tu placeholder
  const getImageUrl = () => {
    // Si hay error o no hay imagen, usar tu placeholder
    if (imageError || !image) {
      return '/images/product-placeholder.webp';
    }
    return image;
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