const list = value => Array.isArray(value) ? value : value == null ? [] : [value];
const key = value => String(value ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const validId = value => value != null && value !== '' && Number.isSafeInteger(Number(value)) && Number(value) > 0;

// Acepta IDs, objetos, nombres y relaciones EF sin elegir coincidencias ambiguas.
export function relationIds(product, kind, catalog) {
  const category = kind === 'categoria';
  const plural = category ? 'categorias' : 'marcas';
  const joins = category ? 'categoriasProductos' : 'productosMarcas';
  const candidates = [
    ...list(product[`${kind}Ids`]).map(id => ({ id })),
    ...list(product[`${kind}Id`]).map(id => ({ id })),
    ...list(product[plural]), ...list(product[kind]),
    ...list(product[joins]).map(row => ({
      id: row[`${kind}Id`] ?? row[plural]?.id ?? row[kind]?.id,
      nombre: row[plural]?.nombre ?? row[kind]?.nombre,
    })),
  ];
  const ids = candidates.flatMap(value => {
    if (typeof value === 'object' && validId(value?.id)) return [Number(value.id)];
    if (typeof value === 'number' && validId(value)) return [value];
    const name = typeof value === 'string' ? value : value?.nombre;
    if (!name) return [];
    const matches = catalog.filter(item => key(item.nombre) === key(name));
    return matches.length === 1 && validId(matches[0].id) ? [Number(matches[0].id)] : [];
  });
  return [...new Set(ids)];
}

export function serverError(error) {
  const data = error.response?.data;
  const validation = data?.errors && typeof data.errors === 'object'
    ? Object.entries(data.errors).flatMap(([field, values]) => list(values).map(value => `${field}: ${value}`)) : [];
  return validation.length ? validation.join('\n') :
    data?.Error || data?.error || data?.message || data?.detail || data?.title ||
    (typeof data === 'string' ? data : '') || 'No se pudo guardar. Revisá la conexión con el servidor.';
}

export function formValues(product, categories, brands) {
  return {
    nombre: product.nombre || '',
    precio: product.precio ?? '', precioOferta: product.precioOferta ?? '',
    stock: ![false, 0, '0', null, undefined].includes(product.stock),
    garantia: product.garantia || '12 meses',
    envioGratis: ![false, 0, '0', null, undefined].includes(product.envioGratis),
    codigoSerie: product.codigoSerie || '',
    categoriaIds: relationIds(product, 'categoria', categories),
    marcaIds: relationIds(product, 'marca', brands),
    especificacionIds: product.especificacionIds || [],
  };
}

// No descartar silenciosamente relaciones si el servidor devuelve un formato incompleto.
export function specificationIds(rows, catalog) {
  if (!Array.isArray(rows)) throw new Error('No se pudieron leer las especificaciones del producto.');
  return [...new Set(rows.map(row => {
    const spec = row?.especificaciones || row?.especificacion || row;
    const id = row?.especificacionId ?? spec?.id ?? (typeof row === 'number' ? row : null);
    if (validId(id)) return Number(id);
    const matches = catalog.filter(item => key(item.titulo) === key(spec?.titulo) &&
      key(item.descripcion) === key(spec?.descripcion));
    if (spec?.titulo && matches.length === 1 && validId(matches[0].id)) return Number(matches[0].id);
    throw new Error('Una especificación del producto no tiene un ID reconocible. Revisá la respuesta de la API antes de guardar.');
  }))];
}
