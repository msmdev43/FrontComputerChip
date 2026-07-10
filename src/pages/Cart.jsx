// C:\xampp\htdocs\FrontComputerChip\src\pages\Cart.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import carritoBlanco from '../assets/CarritoEmojiBlanco.png';
import carritoNegro from '../assets/CarritoEmojiNegro.png';
import '../styles/Cart.css';

function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal 
  } = useCart();

  const [currentTheme, setCurrentTheme] = useState('light');

  // Detectar el tema actual
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme === 'dark' ? 'dark' : 'light');
    };

    // Verificar al cargar
    checkTheme();

    // Observar cambios en el atributo data-theme
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

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

  const { subtotal, envio, total } = getCartTotal();

  // Elegir la imagen según el tema
  const carritoIcon = currentTheme === 'dark' ? carritoBlanco : carritoNegro;

  if (cartItems.length === 0) {
    return (
      <>
        <div className="cart-wrapper">
          <div className="cart-empty">
            <img 
              src={carritoIcon} 
              alt="Carrito vacío" 
              className="cart-empty-icon-img"
            />
            <h2>Tu carrito está vacío</h2>
            <p>Parece que aún no has agregado productos a tu carrito.</p>
            <Link to="/productos" className="btn-continuar-comprando">
              Explorar Productos
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="cart-wrapper">
        <div className="cart-container">
          <h1 className="cart-title">Mi Carrito</h1>
          
          <div className="cart-grid">
            {/* Lista de productos */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.imagen || '/images/product-placeholder.webp'} 
                      alt={item.nombre} 
                    />
                  </div>
                  
                  <div className="cart-item-info">
                    <div className="cart-item-brand">{item.marca}</div>
                    <h3 className="cart-item-name">{item.nombre}</h3>
                    
                    <div className="cart-item-prices">
                      {item.oferta ? (
                        <>
                          <span className="cart-item-original">{formatPrice(item.oferta.precioOriginal)}</span>
                          <span className="cart-item-discounted">{formatPrice(item.oferta.precioOferta)}</span>
                        </>
                      ) : (
                        <span className="cart-item-discounted">{formatPrice(item.precio)}</span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="cart-item-subtotal">
                      {formatPrice(
                        (item.oferta ? item.oferta.precioOferta : item.precio) * item.cantidad
                      )}
                    </div>

                    <button 
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="cart-summary">
              <h3>Resumen del Pedido</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="summary-row">
                <span>Envío</span>
                <span>{envio === 0 ? 'Gratis' : formatPrice(envio)}</span>
              </div>
              
              {envio === 0 && subtotal > 0 && (
                <div className="summary-free-shipping">
                  🎉 ¡Envío gratis por compras sobre $100.000!
                </div>
              )}

              <div className="summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="summary-actions">
                <button className="btn-checkout">
                  Ir a Pagar
                </button>
                <button className="btn-clear-cart" onClick={clearCart}>
                  Vaciar Carrito
                </button>
                <Link to="/productos" className="btn-continuar-comprando-summary">
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;