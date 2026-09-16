import { useState, useMemo } from 'react';
import { useCategorias } from '../hooks/useCategorias';
import { useProductos, formatPrecio } from '../hooks/useProductos';
import CategoriaSelector from '../components/UI/CategoriaSelector';
import '../styles/armaTuPc.css';

// Iconos por nombre de categoría (fallback al genérico)
const ICONOS_CATEGORIA = {
  procesador: '🧠',
  cpu: '🧠',
  motherboard: '🔌',
  mother: '🔌',
  ram: '💾',
  memoria: '💾',
  'placa de video': '🎮',
  gpu: '🎮',
  almacenamiento: '💿',
  disco: '💿',
  ssd: '💿',
  fuente: '⚡',
  gabinete: '📦',
  cooler: '❄️',
  refrigeracion: '❄️',
};

const getIconoCategoria = (nombre = '') => {
  const key = nombre.toLowerCase().trim();
  return ICONOS_CATEGORIA[key] || '📦';
};

export default function ArmaTuPc() {
  // 1) Categorías
  const {
    categorias,
    loading: loadingCats,
    error: errorCats,
  } = useCategorias();

  // 2) Estado local
  const [categoriaActivaId, setCategoriaActivaId] = useState(null);
  const [seleccion, setSeleccion] = useState({}); // { [categoriaId]: producto }
  const categoriaActivaIdActual = categoriaActivaId ?? categorias[0]?.id;

  // 3) Productos de la categoría activa
  const {
    productos,
    loading: loadingProds,
    error: errorProds,
  } = useProductos({
    categoriaId: categoriaActivaIdActual,
    autoLoad: Boolean(categoriaActivaIdActual),
  });

  // 5) Handlers
  const handleSeleccionar = (producto) => {
    setSeleccion((prev) => ({
      ...prev,
      [categoriaActivaIdActual]: producto,
    }));
  };

  const handleQuitar = (categoriaId) => {
    setSeleccion((prev) => {
      const copia = { ...prev };
      delete copia[categoriaId];
      return copia;
    });
  };

  // 6) Totales derivados
  const { total, ahorro } = useMemo(() => {
    let t = 0;
    let a = 0;
    Object.values(seleccion).forEach((p) => {
      if (!p) return;
      t += p.precioOferta ?? p.precio;
      if (p.isOnSale) a += p.precio - p.precioOferta;
    });
    return { total: t, ahorro: a };
  }, [seleccion]);

  const completados = Object.keys(seleccion).filter(Boolean).length;

  // 7) Render
  if (loadingCats) return <p className="atp__estado">Cargando categorías...</p>;
  if (errorCats) return <p className="atp__estado atp__estado--error">Error: {errorCats}</p>;

  return (
    <section className="atp">
      <header className="atp__header">
        <h1>Armá tu PC</h1>
        <p className="atp__progreso">
          {completados} / {categorias.length} componentes seleccionados
        </p>
      </header>

      <div className="atp__body">
        {/* ============ SIDEBAR CATEGORÍAS ============ */}
        <aside className="atp__sidebar">
          {categorias.map((cat) => (
            <CategoriaSelector
              key={cat.id}
              categoria={{
                ...cat,
                icono: getIconoCategoria(cat.nombre),
                obligatorio: true, // ajustá si tenés categorías opcionales
              }}
              activa={categoriaActivaIdActual === cat.id}
              productoSeleccionado={seleccion[cat.id] || null}
              onActivar={() => setCategoriaActivaId(cat.id)}
              onQuitar={() => handleQuitar(cat.id)}
            />
          ))}
        </aside>

        {/* ============ GRILLA DE PRODUCTOS ============ */}
        <main className="atp__productos">
          {loadingProds && (
            <p className="atp__estado">Cargando productos...</p>
          )}

          {errorProds && (
            <p className="atp__estado atp__estado--error">
              Error: {errorProds}
            </p>
          )}

          {!loadingProds && !errorProds && productos.length === 0 && (
            <p className="atp__estado">
              No hay productos disponibles en esta categoría.
            </p>
          )}

          {!loadingProds && productos.length > 0 && (
            <div className="atp__grid">
              {productos.map((prod) => {
                const esSeleccionado =
                  seleccion[categoriaActivaIdActual]?.id === prod.id;

                const imagen =
                  prod.imagenes?.[0] || '/placeholder-producto.png';

                return (
                  <article
                    key={prod.id}
                    className={`producto-card ${
                      esSeleccionado ? 'producto-card--seleccionado' : ''
                    } ${!prod.stock ? 'producto-card--sin-stock' : ''}`}
                  >
                    {/* Badge de oferta */}
                    {prod.isOnSale && (
                      <span className="producto-card__badge-oferta">
                        -{prod.descuentoPorcentaje}%
                      </span>
                    )}

                    {/* Imagen */}
                    <div className="producto-card__imagen">
                      <img src={imagen} alt={prod.nombre} loading="lazy" />
                    </div>

                    {/* Info */}
                    <div className="producto-card__body">
                      <h3 className="producto-card__nombre">{prod.nombre}</h3>

                      {/* Marcas */}
                      {prod.marcas?.length > 0 && (
                        <p className="producto-card__marca">
                          {prod.marcas.join(' · ')}
                        </p>
                      )}

                      {/* Precios */}
                      <div className="producto-card__precios">
                        {prod.isOnSale ? (
                          <>
                            <span className="producto-card__precio-tachado">
                              {formatPrecio(prod.precio)}
                            </span>
                            <span className="producto-card__precio">
                              {formatPrecio(prod.precioOferta)}
                            </span>
                          </>
                        ) : (
                          <span className="producto-card__precio">
                            {formatPrecio(prod.precio)}
                          </span>
                        )}
                      </div>

                      {/* Stock + envío */}
                      <div className="producto-card__meta">
                        <span
                          className={`producto-card__stock ${
                            prod.stock
                              ? 'producto-card__stock--ok'
                              : 'producto-card__stock--no'
                          }`}
                        >
                          {prod.stockText ?? (prod.stock ? 'Disponible' : 'No disponible')}
                        </span>
                        {prod.envioGratis && (
                          <span className="producto-card__envio">
                            🚚 Envío gratis
                          </span>
                        )}
                      </div>

                      {/* Botón */}
                      <button
                        type="button"
                        className="producto-card__btn"
                        onClick={() => handleSeleccionar(prod)}
                        disabled={!prod.stock}
                      >
                        {esSeleccionado
                          ? '✓ Seleccionado'
                          : prod.stock
                          ? 'Seleccionar'
                          : 'Sin stock'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {/* ============ RESUMEN STICKY ============ */}
        <aside className="atp__resumen">
          <h3>Tu build</h3>

          <ul className="atp__resumen-lista">
            {categorias.map((cat) => {
              const p = seleccion[cat.id];
              return (
                <li key={cat.id} className="atp__resumen-item">
                  <div className="atp__resumen-cat">
                    <span>{getIconoCategoria(cat.nombre)}</span>
                    <span className="atp__resumen-cat-nombre">{cat.nombre}</span>
                  </div>
                  {p ? (
                    <div className="atp__resumen-prod">
                      <span className="atp__resumen-prod-nombre">
                        {p.nombre}
                      </span>
                      <span className="atp__resumen-prod-precio">
                        {formatPrecio(p.precioOferta ?? p.precio)}
                      </span>
                      <button
                        type="button"
                        className="atp__resumen-quitar"
                        onClick={() => handleQuitar(cat.id)}
                        aria-label={`Quitar ${p.nombre}`}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="atp__resumen-vacio">—</span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="atp__resumen-footer">
            {ahorro > 0 && (
              <p className="atp__resumen-ahorro">
                Ahorrás: <strong>{formatPrecio(ahorro)}</strong>
              </p>
            )}
            <p className="atp__resumen-total">
              Total: <strong>{formatPrecio(total)}</strong>
            </p>
            <button
              type="button"
              className="atp__btn-carrito"
              disabled={total === 0}
            >
              Agregar al carrito
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}