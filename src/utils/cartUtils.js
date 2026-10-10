import { normalizeProduct, getProductPricing, getStock } from './productUtils.js';

export const clampQuantity = (quantity, stock) => Math.min(getStock({ stock }),
  Math.max(1, Math.floor(Number(quantity) || 1)));
export const sameProduct = (a, b) => String(a) === String(b);

export function addCartItem(items, rawProduct, quantity = 1) {
  const product = normalizeProduct(rawProduct);
  if (product.id == null || product.stock < 1 || product.deletedAt) return items;
  const existing = items.find(item => sameProduct(item.id, product.id));
  const requested = Math.max(1, Math.floor(Number(quantity) || 1));
  const cantidad = clampQuantity((existing?.cantidad || 0) + requested, product.stock);
  return existing ? items.map(item => sameProduct(item.id, product.id) ? { ...product, cantidad } : item)
    : [...items, { ...product, cantidad }];
}

export function readStoredCart(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce((items, item) => item && typeof item === 'object'
      ? addCartItem(items, item, item.cantidad) : items, []);
  } catch { return []; }
}

export function cartTotals(items) {
  const subtotal = Math.round(items.reduce((sum, item) => sum + getProductPricing(item).price * item.cantidad, 0) * 100) / 100;
  // Mantiene la regla existente. Reemplazar por la cotización del backend al implementar checkout.
  const envio = items.length === 0 || subtotal > 100000 ? 0 : 5000;
  return { subtotal, envio, total: Math.round((subtotal + envio) * 100) / 100 };
}
