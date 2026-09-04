export const CURRENCY = {
  locale: 'es-AR',
  currency: 'ARS',
  symbol: '$',
  name: 'Peso Argentino'
};

export const formatPrice = (price) => {
  if (!price && price !== 0) return '$0';
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export default { CURRENCY, formatPrice };