import { useState, useEffect, useMemo } from 'react';
import { categoriaService } from '../services/categoriaService';
import { marcaService } from '../services/marcaService';
import { productoService } from '../services/productoService';
import CategoriaSelector from '../components/UI/CategoriaSelector';
import BarraProgreso from '../components/UI/BarraProgreso';
import ResumenBuild from '../components/UI/ResumenBuild';
import { getCategoriaMeta } from '../components/UI/categoriasMeta';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/armaTuPc.css';

const formatPrecio = (v) =>
  v != null ? `$${Number(v).toLocaleString('es-AR')}` : '—';

const PROXIMAMENTE = true;

export default function ArmaTuPc() {
  // -------- Estado --------
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categoriaActivaId, setCategoriaActivaId] = useState(null);
  const [marcaActivaId, setMarcaActivaId] = useState(null);
  const [productosCategoria, setProductosCategoria] = useState([]);
  const [seleccion, setSeleccion] = useState({});
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(false);
  const [error, setError] = useState(null);

  // -------- 1) Categorías + marcas --------
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoadingCats(true);
        const [cats, mrcs] = await Promise.all([
          categoriaService.getAll(),
          marcaService.getAll(),
        ]);
        setCategorias(cats);
        setMarcas(mrcs);
        if (cats.length > 0) setCategoriaActivaId(cats[0].id);
      } catch (err) {
        setError('No se pudieron cargar los datos iniciales');
        console.error('[ArmaTuPc]', err);
      } finally {
        setLoadingCats(false);
      }
    };
    cargar();
  }, []);

  // -------- 2) Productos de la categoría activa --------
  useEffect(() => {
    if (!categoriaActivaId) return;
    const cargarProductos = async () => {
      try {
        setLoadingProds(true);
        setError(null);
        const data = await productoService.getByCategoria(categoriaActivaId);
        setProductosCategoria(data);
      } catch (err) {
        setError('No se pudieron cargar los productos');
        console.error('[ArmaTuPc]', err);
      } finally {
        setLoadingProds(false);
      }
    };
    cargarProductos();
  }, [categoriaActivaId]);

  // -------- Derivados --------
  const categoriaActiva = categorias.find((c) => c.id === categoriaActivaId);
  const meta = getCategoriaMeta(categoriaActiva?.nombre);

  const marcasDisponibles = useMemo(() => {
    const nombres = new Set();
    productosCategoria.forEach((p) =>
      p.marcas?.forEach((n) => nombres.add(n))
    );
    return marcas.filter((m) => nombres.has(m.nombre));
  }, [productosCategoria, marcas]);

  const productosMostrados = useMemo(() => {
    if (!marcaActivaId) return productosCategoria;
    const marca = marcas.find((m) => m.id === marcaActivaId);
    if (!marca) return productosCategoria;
    return productosCategoria.filter((p) => p.marcas?.includes(marca.nombre));
  }, [productosCategoria, marcaActivaId, marcas]);

  const completados = Object.values(seleccion).filter(Boolean).length;

  // -------- Handlers --------
  const handleActivarCategoria = (catId) => {
    setCategoriaActivaId(catId);
    setMarcaActivaId(null);
  };

  const handleSeleccionar = (producto) => {
    setSeleccion((prev) => ({
      ...prev,
      [categoriaActivaId]: producto,
    }));
  };

  const handleQuitar = (catId) => {
    setSeleccion((prev) => {
      const copia = { ...prev };
      delete copia[catId];
      return copia;
    });
  };

  const handleAgregarAlCarrito = () => {
    // TODO: conectar a tu servicio de pedidos
    console.log('Build lista para agregar:', seleccion);
  };

  // -------- Render --------
  if (loadingCats) return <p className="atp__estado">Cargando...</p>;
  if (error && categorias.length === 0)
    return <p className="atp__estado atp__estado--error">{error}</p>;

  if (PROXIMAMENTE) {
    return (
      <section className="atp-proximamente">
        <div className="atp-proximamente__card">
          <span className="atp-proximamente__icono" aria-hidden>🚧</span>
          <h1>Armá tu PC</h1>
          <p className="atp-proximamente__badge">Próximamente</p>
          <p className="atp-proximamente__texto">
            Estamos trabajando para que puedas armar tu equipo componente por
            componente con validación de compatibilidad en tiempo real.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="atp">
      {/* HEADER */}
      <header className="atp__header">
        <div className="atp__header-top">
          <h1>Armá tu PC</h1>
          <ThemeToggle />
        </div>
        <div className="atp__header-progreso">
          <BarraProgreso actual={completados} total={categorias.length} />
        </div>
      </header>

      {/* LAYOUT: sidebar iconos | contenido | resumen */}
      <div className="atp__layout">
        {/* ===== SIDEBAR ===== */}
        <aside className="atp__sidebar-iconos">
          {categorias.map((cat) => {
            const catMeta = getCategoriaMeta(cat.nombre);
            return (
              <CategoriaSelector
                key={cat.id}
                categoria={{ ...cat, ...catMeta }}
                activa={categoriaActivaId === cat.id}
                productoSeleccionado={seleccion[cat.id] || null}
                onActivar={() => handleActivarCategoria(cat.id)}
              />
            );
          })}
        </aside>

        {/* ===== CONTENIDO ===== */}
        <main className="atp__contenido">
          <header className="atp__cat-header">
            <h2>Elegí tu {categoriaActiva?.nombre}</h2>
          </header>

          {meta.descripcion && (
            <p className="atp__cat-descripcion">{meta.descripcion}</p>
          )}

          {/* Filtros de marca */}
          {marcasDisponibles.length > 0 && (
            <div className="atp__filtros-marca">
              <button
                type="button"
                className={!marcaActivaId ? 'activo' : ''}
                onClick={() => setMarcaActivaId(null)}
              >
                Todas
              </button>
              {marcasDisponibles.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={marcaActivaId === m.id ? 'activo' : ''}
                  onClick={() =>
                    setMarcaActivaId(marcaActivaId === m.id ? null : m.id)
                  }
                >
                  {m.nombre}
                </button>
              ))}
            </div>
          )}

          {/* Grilla de productos */}
          {loadingProds ? (
            <p className="atp__estado">Cargando productos...</p>
          ) : productosMostrados.length === 0 ? (
            <p className="atp__estado">
              No hay productos disponibles
              {marcaActivaId ? ' para esta marca' : ''}.
            </p>
          ) : (
            <div className="atp__grid">
              {productosMostrados.map((prod) => {
                const esSeleccionado =
                  seleccion[categoriaActivaId]?.id === prod.id;
                const imagen =
                  prod.imagenes?.[0] || '/placeholder-producto.png';
                const precioFinal = prod.precioOferta ?? prod.precio;

                return (
                  <article
                    key={prod.id}
                    className={`producto-card ${
                      esSeleccionado ? 'producto-card--sel' : ''
                    } ${!prod.stock ? 'producto-card--no-stock' : ''}`}
                    onClick={() => prod.stock && handleSeleccionar(prod)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && prod.stock) {
                        e.preventDefault();
                        handleSeleccionar(prod);
                      }
                    }}
                  >
                    {/* Badge descuento */}
                    {prod.isOnSale && prod.descuentoPorcentaje > 0 && (
                      <span className="producto-card__badge">
                        -{prod.descuentoPorcentaje}%
                      </span>
                    )}

                    {/* Imagen */}
                    <div className="producto-card__imagen">
                      <img src={imagen} alt={prod.nombre} loading="lazy" />
                    </div>

                    {/* Info */}
                    <div className="producto-card__body">
                      <div className="producto-card__titulo">
                        <h3>{prod.nombre}</h3>
                        <button
                          type="button"
                          className="producto-card__info"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Más información"
                        >
                          ⓘ
                        </button>
                      </div>

                      {prod.marcas?.length > 0 && (
                        <p className="producto-card__marcas">
                          {prod.marcas.join(' · ')}
                        </p>
                      )}

                      <div className="producto-card__precios">
                        {prod.isOnSale ? (
                          <>
                            <span className="producto-card__precio-tachado">
                              {formatPrecio(prod.precio)}
                            </span>
                            <span className="producto-card__precio">
                              {formatPrecio(precioFinal)}
                            </span>
                          </>
                        ) : (
                          <span className="producto-card__precio">
                            {formatPrecio(precioFinal)}
                          </span>
                        )}
                      </div>

                      <div className="producto-card__meta">
                        {prod.stock ? (
                          <span className="producto-card__ok">✓ Compatible</span>
                        ) : (
                          <span className="producto-card__no">Sin stock</span>
                        )}
                        {prod.envioGratis && (
                          <span className="producto-card__envio">
                            🚚 Envío gratis
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {/* ===== RESUMEN ===== */}
        <ResumenBuild
          categorias={categorias}
          seleccion={seleccion}
          getIcono={(nombre) => getCategoriaMeta(nombre).icono}
          onQuitar={handleQuitar}
          onAgregarAlCarrito={handleAgregarAlCarrito}
        />
      </div>
    </section>
  );
}