import { getQuantityLimit } from '../utils/productUtils';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addCartItem, clampQuantity, sameProduct, readStoredCart, cartTotals } from '../utils/cartUtils';

const CartContext = createContext();
export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const [cartItems, setCartItems] = useState(() => {
    try { return readStoredCart(localStorage.getItem('cart')); }
    catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cartItems)); }
    catch { /* El carrito sigue funcionando en memoria si el navegador bloquea el almacenamiento. */ }
  }, [cartItems]);
  const addToCart = (product, quantity = 1, { openDrawer = true } = {}) => {
    const existing = cartItems.find(item => sameProduct(item.id, product?.id));
    if (!product || product.id == null || product.deletedAt ||
        getQuantityLimit(product) <= (existing?.cantidad || 0)) return false;
    setCartItems(items => addCartItem(items, product, quantity));
    if (openDrawer) openCart();
    return true;
  };
  const addManyToCart = products => {
    setCartItems(items => products.reduce((next, product) => addCartItem(next, product, 1), items));
    openCart();
  };
  const removeFromCart = id => setCartItems(items => items.filter(item => !sameProduct(item.id, id)));
  const updateQuantity = (id, quantity) => {
    if (!Number.isFinite(Number(quantity)) || Number(quantity) < 1) return;
    setCartItems(items => items.map(item => sameProduct(item.id, id)
      ? { ...item, cantidad: clampQuantity(quantity, item) } : item));
  };
  const clearCart = () => setCartItems([]);
  return <CartContext.Provider value={{ isCartOpen, openCart, closeCart, cartItems, addToCart, addManyToCart, removeFromCart, updateQuantity, clearCart,
    getCartTotal: shippingCost => cartTotals(cartItems, shippingCost),
    getItemCount: () => cartItems.reduce((sum, item) => sum + item.cantidad, 0),
  }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
