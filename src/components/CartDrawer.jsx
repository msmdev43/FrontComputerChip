import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../config/currency';
import { getProductPricing } from '../utils/productUtils';
import { getProductUrl } from '../utils/slugUtils';
import '../styles/components/CartDrawer.css';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, getItemCount, getCartTotal } = useCart();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const location = useLocation();
  const lastLocation = useRef(location.key);
  const { subtotal } = getCartTotal();

  useEffect(() => {
    if (lastLocation.current !== location.key) closeCart();
    lastLocation.current = location.key;
  }, [location.key, closeCart]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isCartOpen || !dialog) return;
    const opener = document.activeElement;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      if (opener?.isConnected && !opener.disabled) opener.focus({ preventScroll: true });
      else document.querySelector('.cc-action-cart')?.focus({ preventScroll: true });
    };
  }, [isCartOpen]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <dialog ref={dialogRef} className="cart-drawer" aria-labelledby="cart-drawer-title"
      onCancel={event => { event.preventDefault(); closeCart(); }}
      onClick={event => { if (event.target === event.currentTarget) closeCart(); }}>
      <div className="cart-drawer__panel">
        <header className="cart-drawer__header">
          <div><p className="cart-drawer__eyebrow">COMPUTER CHIP</p>
            <h2 id="cart-drawer-title">Tu carrito <span>{getItemCount()}</span></h2></div>
          <button ref={closeRef} type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Cerrar carrito">×</button>
        </header>
        {cartItems.length > 0 ? <>
          <p className="cart-drawer__notice" role="status">Tus productos, en un solo lugar.</p>
          <ul className="cart-drawer__items">
            {cartItems.map(item => {
              const { price } = getProductPricing(item);
              return <li className="cart-drawer__item" key={item.id}>
                <Link className="cart-drawer__image" to={getProductUrl(item)} onClick={closeCart} tabIndex={-1} aria-hidden="true">
                  <img src={item.imagen || '/images/product-placeholder.webp'} alt="" onError={event => {
                    if (!event.currentTarget.dataset.fallback) {
                      event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = '/images/product-placeholder.webp';
                    }
                  }} />
                </Link>
                <div className="cart-drawer__info">
                  <Link className="cart-drawer__name" to={getProductUrl(item)} onClick={closeCart}>{item.nombre}</Link>
                  <p className="cart-drawer__unit">{formatPrice(price)} por unidad</p>
                  <div className="cart-drawer__item-bottom">
                    <div className="cart-drawer__quantity" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                      <button type="button" disabled={item.cantidad <= 1} aria-label={`Reducir cantidad de ${item.nombre}`}
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}>−</button>
                      <span aria-live="polite">{item.cantidad}</span>
                      <button type="button" disabled={item.cantidad >= item.stock} aria-label={`Aumentar cantidad de ${item.nombre}`}
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
                    </div>
                    <strong>{formatPrice(price * item.cantidad)}</strong>
                  </div>
                  <button className="cart-drawer__remove" type="button" aria-label={`Quitar ${item.nombre}`} onClick={() => {
                    closeRef.current?.focus({ preventScroll: true }); removeFromCart(item.id);
                  }}>Quitar</button>
                </div>
              </li>;
            })}
          </ul>
          <footer className="cart-drawer__footer">
            <div className="cart-drawer__subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <p>Podés revisar el detalle y el envío estimado en el carrito.</p>
            <Link to="/carrito" className="cart-drawer__view" onClick={closeCart}>Ver carrito completo →</Link>
            <button className="cart-drawer__continue" type="button" onClick={closeCart}>Seguir comprando</button>
          </footer>
        </> : <div className="cart-drawer__empty">
          <span aria-hidden="true">🛒</span><h3>Tu carrito está vacío</h3><p>Encontrá lo que necesita tu próximo equipo.</p>
          <Link to="/productos" className="cart-drawer__view" onClick={closeCart}>Explorar productos</Link>
        </div>}
      </div>
    </dialog>, document.body,
  );
}
