// C:\xampp\htdocs\FrontComputerChip\src\utils\slugUtils.js

/**
 * Convierte un texto en un slug para URL
 * Ejemplo: "Gabinete Gamer Zer01" -> "gabinete-gamer-zer01"
 */
export const createSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-') // Eliminar guiones duplicados
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
};

/**
 * Genera la URL amigable para un producto
 */
export const getProductUrl = (product) => {
  if (!product) return '/productos';
  const slug = createSlug(product.nombre);
  return `/productos/${slug}/${product.id}`;
};

/**
 * Extrae el ID de una URL amigable
 */
export const getIdFromUrl = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};