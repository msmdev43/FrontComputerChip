import "../../styles/components/UI/resumenBuild.css";

const formatPrecio = (v) =>
  v != null ? `$${Number(v).toLocaleString('es-AR')}` : '—';

export default function ResumenBuild({
  categorias = [],
  seleccion = {},
  getIcono,
  onQuitar,
  onAgregarAlCarrito,
  disabled = false,
}) {
  // Totales derivados
  const { total, ahorro, cantidad } = Object.entries(seleccion).reduce(
    (acc, [, prod]) => {
      if (!prod) return acc;
      const precio = Number(prod.precioOferta ?? prod.precio ?? 0);
      const precioBase = Number(prod.precio ?? 0);
      acc.total += precio;
      if (prod.isOnSale) acc.ahorro += precioBase - precio;
      acc.cantidad += 1;
      return acc;
    },
    { total: 0, ahorro: 0, cantidad: 0 }
  );

  const totalCategorias = categorias.length;
  const completo = cantidad === totalCategorias && totalCategorias > 0;

  return (
    <aside className="resumen-build">
      <header className="resumen-build__header">
        <h3>Tu build</h3>
        <span className="resumen-build__contador">
          {cantidad}/{totalCategorias}
        </span>
      </header>

      <ul className="resumen-build__lista">
        {categorias.map((cat) => {
          const prod = seleccion[cat.id];
          return (
            <li key={cat.id} className="resumen-build__item">
              <div className="resumen-build__cat">
                <span className="resumen-build__cat-icono" aria-hidden>
                  {getIcono?.(cat.nombre) ?? '📦'}
                </span>
                <span className="resumen-build__cat-nombre">{cat.nombre}</span>
              </div>

              {prod ? (
                <div className="resumen-build__prod">
                  <div className="resumen-build__prod-texto">
                    <span className="resumen-build__prod-nombre" title={prod.nombre}>
                      {prod.nombre}
                    </span>
                    <span className="resumen-build__prod-precio">
                      {formatPrecio(prod.precioOferta ?? prod.precio)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="resumen-build__quitar"
                    onClick={() => onQuitar(cat.id)}
                    aria-label={`Quitar ${prod.nombre}`}
                    title="Quitar"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="resumen-build__vacio">Sin seleccionar</span>
              )}
            </li>
          );
        })}
      </ul>

      <footer className="resumen-build__footer">
        {ahorro > 0 && (
          <div className="resumen-build__ahorro">
            <span>Ahorrás</span>
            <strong>{formatPrecio(ahorro)}</strong>
          </div>
        )}

        <div className="resumen-build__total">
          <span>Total</span>
          <strong>{formatPrecio(total)}</strong>
        </div>

        <button
          type="button"
          className="resumen-build__btn"
          onClick={onAgregarAlCarrito}
          disabled={disabled || cantidad === 0}
        >
          {completo ? 'Agregar al carrito' : `Agregar (${cantidad})`}
        </button>

        {!completo && cantidad > 0 && (
          <p className="resumen-build__hint">
            Faltan {totalCategorias - cantidad} componente
            {totalCategorias - cantidad > 1 ? 's' : ''}
          </p>
        )}
      </footer>
    </aside>
  );
}