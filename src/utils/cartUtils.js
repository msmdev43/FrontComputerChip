import { normalizeProduct, getProductPricing, getQuantityLimit } from './productUtils.js';

export const clampQuantity = (quantity, product) => Math.min(getQuantityLimit(product),
  Math.max(1, Math.floor(Number(quantity) || 1)));
export const sameProduct = (a, b) => String(a) === String(b);

export function addCartItem(items, rawProduct, quantity = 1) {
  const product = normalizeProduct(rawProduct);
  if (product.id == null || product.stock < 1 || product.deletedAt) return items;
  const existing = items.find(item => sameProduct(item.id, product.id));
  const requested = Math.max(1, Math.floor(Number(quantity) || 1));
  const cantidad = clampQuantity((existing?.cantidad || 0) + requested, product);
  return existing ? items.map(item => sameProduct(item.id, product.id) ? { ...product, cantidad } : item)
    : [...items, { ...product, cantidad }];
}

export function readStoredCart(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce((items, item) => item && typeof item === 'object'
      ? addCartItem(items, { ...item, stockQuantified: item.stockQuantified ?? false }, item.cantidad) : items, []);
  } catch { return []; }
}

export function cartTotals(items, shippingCost = null) {
  const subtotal = Math.round(items.reduce((sum, item) => sum + getProductPricing(item).price * item.cantidad, 0) * 100) / 100;
  const envio = items.length === 0 ? 0 : shippingCost;
  return { subtotal, envio, total: envio === null ? null : Math.round((subtotal + envio) * 100) / 100 };
}
