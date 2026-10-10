import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productoService } from '../services/productoService';
import { normalizeProduct, normalizeText, categoryKey, selectProducts } from '../utils/productUtils';
import '../styles/Productos.css';

const PAGE_SIZE = 12;

export default function Productos() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    let cancelled = false;
    productoService.getAll().then(data => {
      if (!Array.isArray(data)) throw new Error('Listado de productos inválido');
      if (!cancelled) { setProducts(data.map(normalizeProduct)); setStatus('ready'); }
    }).catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [attempt]);

  const options = useMemo(() => {
    const active = products.filter(p => !p.deletedAt);
    const collect = (field, key) => [...new Map(active.flatMap(p => p[field])
      .map(name => [key(name), name])).values()].sort((a, b) => a.localeCompare(b, 'es'));
    return { categories: collect('categorias', categoryKey), brands: collect('marcas', normalizeText) };
  }, [products]);
  const filtered = useMemo(() => selectProducts(products, params), [products, params]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number(params.get('page'));
  const page = Math.min(totalPages, Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilters = ['q', 'categoria', 'marca', 'min', 'max', 'filter'].filter(key => params.get(key));
  const update = (changes, replace = false) => {
    const next = new URLSearchParams(params);
    next.delete('page');
    Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    setParams(next, { replace });
  };
  const submitFilters = event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.min && values.max && Number(values.min) > Number(values.max)) {
      event.currentTarget.elements.max.setCustomValidity('El máximo debe ser mayor o igual al mínimo.');
      event.currentTarget.elements.max.reportValidity();
      return;
    }
    update(values);
    setFiltersOpen(false);
  };
  const changePage = value => {
    const next = new URLSearchParams(params);
    next.set('page', value);
    setParams(next);
    document.getElementById('catalog-results')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  const category = options.categories.find(name => categoryKey(name) === categoryKey(params.get('categoria')))
    || params.get('categoria') || '';
  const brand = options.brands.find(name => normalizeText(name) === normalizeText(params.get('marca')))
    || params.get('marca') || '';

  return (
    <section className="catalog-page">
      <header className="catalog-heading">
        <div><p className="catalog-eyebrow">COMPUTER CHIP</p><h1>Encontrá tu próximo componente</h1>
          <p>Explorá el catálogo y elegí lo que necesita tu equipo.</p></div>
      </header>
      <form className="catalog-search" role="search" onSubmit={event => {
        event.preventDefault(); update({ q: new FormData(event.currentTarget).get('q').trim() });
      }}>
        <input key={params.get('q') || ''} name="q" type="search" defaultValue={params.get('q') || ''}
          aria-label="Buscar en el catálogo" placeholder="Producto, marca o modelo..." />
        <button type="submit">Buscar</button>
      </form>
      <button className="catalog-filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters"
        onClick={() => setFiltersOpen(!filtersOpen)}>Filtros {activeFilters.length ? `(${activeFilters.length})` : ''}</button>
      <div className="catalog-layout">
        <aside id="catalog-filters" className={`catalog-sidebar${filtersOpen ? ' is-open' : ''}`}>
          <form key={params.toString()} onSubmit={submitFilters} onInput={event => {
            if (['min', 'max'].includes(event.target.name)) event.currentTarget.elements.max.setCustomValidity('');
          }}>
            <h2>Filtrar productos</h2>
            <label>Categoría<select name="categoria" defaultValue={category}>
              <option value="">Todas las categorías</option>
              {category && !options.categories.includes(category) && <option value={category}>{category}</option>}
              {options.categories.map(name => <option key={name}>{name}</option>)}
            </select></label>
            <label>Marca<select name="marca" defaultValue={brand}>
              <option value="">Todas las marcas</option>
              {brand && !options.brands.includes(brand) && <option value={brand}>{brand}</option>}
              {options.brands.map(name => <option key={name}>{name}</option>)}
            </select></label>
            <label>Disponibilidad<select name="filter" defaultValue={params.get('filter') || ''}>
              <option value="">Todos los productos</option><option value="instock">En stock</option>
              <option value="outofstock">Sin stock</option><option value="on-sale">En oferta</option>
            </select></label>
            <fieldset><legend>Precio en pesos</legend><div className="catalog-price-range">
              <label>Desde<input name="min" type="number" min="0" step="any" placeholder="0" defaultValue={params.get('min') || ''} /></label>
              <label>Hasta<input name="max" type="number" min="0" step="any" placeholder="Sin límite" defaultValue={params.get('max') || ''} /></label>
            </div></fieldset>
            <button className="catalog-primary" type="submit">Aplicar filtros</button>
            <button className="catalog-clear" type="button" onClick={() => setParams({})}>Limpiar filtros</button>
          </form>
        </aside>
        <div className="catalog-results" id="catalog-results">
          <div className="catalog-toolbar">
            <p role="status">{status === 'ready' ? `${filtered.length} productos encontrados` : 'Catálogo'}</p>
            <label>Ordenar<select value={params.get('sort') || ''} onChange={event => update({ sort: event.target.value })}>
              <option value="">Orden predeterminado</option><option value="price-low">Menor precio</option>
              <option value="price-high">Mayor precio</option><option value="savings">Mayor ahorro</option>
              <option value="name">Nombre: A a Z</option>
            </select></label>
          </div>
          {activeFilters.length > 0 && <div className="catalog-chips">{activeFilters.map(key => (
            <button key={key} onClick={() => update({ [key]: '' })} aria-label={`Quitar filtro ${key}`}>
              {({ min: 'Desde $', max: 'Hasta $', categoria: '', marca: '', q: '', filter: '' })[key]}
              {key === 'filter' ? ({ instock: 'En stock', outofstock: 'Sin stock', 'on-sale': 'En oferta' })[params.get(key)] : params.get(key)} ×
            </button>
          ))}</div>}
          {status === 'loading' && <p className="catalog-message" role="status">Cargando productos...</p>}
          {status === 'error' && <div className="catalog-message" role="alert"><p>No pudimos cargar los productos.</p>
            <button onClick={() => { setStatus('loading'); setAttempt(value => value + 1); }}>Reintentar</button></div>}
          {status === 'ready' && (visible.length ? <>
            <div className="catalog-grid">{visible.map(product => <ProductCard key={product.id} product={product} />)}</div>
            {totalPages > 1 && <nav className="catalog-pagination" aria-label="Páginas del catálogo">
              <button disabled={page === 1} onClick={() => changePage(page - 1)}>Anterior</button>
              <span aria-live="polite">Página {page} de {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => changePage(page + 1)}>Siguiente</button>
            </nav>}
          </> : <div className="catalog-message"><h2>No encontramos productos</h2><p>Probá otra búsqueda o quitá algún filtro.</p>
            <button onClick={() => setParams({})}>Ver todo el catálogo</button></div>)}
        </div>
      </div>
    </section>
  );
}
