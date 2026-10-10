// Releer relaciones antes de cada intento permite retomar un guardado parcial.
export async function syncProductRelations(id, previous, next, api) {
  for (const [key, add, remove, individual] of [
    ['categoriaIds', api.addCategories, api.removeCategories, false],
    ['marcaIds', api.addBrands, api.removeBrands, false],
    ['especificacionIds', api.addSpecification, api.removeSpecification, true],
  ]) {
    if (!Array.isArray(next[key])) continue;
    const before = new Set((previous[key] || []).map(Number));
    const after = new Set(next[key].map(Number));
    const added = [...after].filter(value => !before.has(value));
    const removed = [...before].filter(value => !after.has(value));
    // Agregar antes de quitar para no dejar vacía la relación si falla el alta.
    for (const [values, action] of [[added, add], [removed, remove]]) {
      if (individual) { for (const value of values) await action(id, value); }
      else if (values.length) await action(id, values);
    }
  }
}
