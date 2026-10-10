import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../config/currency';
import { normalizeProduct, getProductPricing } from '../utils/productUtils';
import { getProductUrl } from '../utils/slugUtils';
import '../styles/components/ProductCard.css';

function CardImage({ src, name }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [placeholderFailed, setPlaceholderFailed] = useState(false);
  if (placeholderFailed) return <span className="pc-image-unavailable">Imagen no disponible</span>;
  return <>
    {!loaded && <div className="pc-image-skeleton"><div className="pc-skeleton-shimmer" /></div>}
    <img src={failed ? '/images/product-placeholder.webp' : src} alt={name}
      className={`pc-image ${loaded ? 'pc-loaded' : 'pc-loading'}`} loading="lazy" width="300" height="225"
      onLoad={() => setLoaded(true)} onError={() => {
        if (failed) setPlaceholderFailed(true); else { setFailed(true); setLoaded(false); }
      }} />
  </>;
}

export default function ProductCard({ product, onViewDetails }) {
  const item = normalizeProduct(product);
  const { hasOffer, price, originalPrice, savings, discountPercent } = getProductPricing(item);
  return (
    <Link className="pc-card pc-clickable" to={getProductUrl(item)} onClick={event => {
      if (onViewDetails && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
        event.preventDefault(); onViewDetails(item.id);
      }
    }}>
      {hasOffer && <div className="pc-discount-badge">-{discountPercent}%</div>}
      <div className="pc-image-container"><CardImage key={item.imagen} src={item.imagen} name={item.nombre} /></div>
      <div className="pc-info">
        <div className="pc-brand">{item.marca || 'ComputerChip'}</div>
        <h3 className="pc-name">{item.nombre}</h3>
        <div className="pc-categories">{item.categoria && <span className="pc-category-tag">{item.categoria}</span>}</div>
        <div className="pc-prices">{hasOffer && <span className="pc-original-price">{formatPrice(originalPrice)}</span>}
          <span className="pc-discounted-price">{formatPrice(price)}</span></div>
        {hasOffer && <p className="pc-savings-text">Ahorrás {formatPrice(savings)}</p>}
        <p className={`pc-stock ${item.stock > 0 ? 'pc-stock--available' : ''}`}>{item.stock > 0 ? 'Disponible' : 'Sin stock'}</p>
        <div className="pc-hint"><span>Ver producto →</span></div>
      </div>
    </Link>
  );
}
