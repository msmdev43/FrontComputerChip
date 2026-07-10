// C:\xampp\htdocs\FrontComputerChip\src\context\CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Cargar carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, actualizar cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      } else {
        // Si no existe, agregar nuevo
        return [...prevItems, { ...product, cantidad: quantity }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular totales
  const getCartTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.oferta ? item.oferta.precioOferta : item.precio;
      return sum + (price * item.cantidad);
    }, 0);
    
    const envio = subtotal > 100000 ? 0 : 5000;
    const total = subtotal + envio;
    
    return { subtotal, envio, total };
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}