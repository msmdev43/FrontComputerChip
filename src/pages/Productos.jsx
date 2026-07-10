// C:\xampp\htdocs\FrontComputerChip\src\pages\Productos.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/Productos.css';
import Footer from '../components/Footer';
import { SAMPLE_PRODUCTS, getAllProducts } from '../data/sampleProducts';

function Productos() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const loadProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Usar getAllProducts para obtener la versión resumida para el listado
      const productsList = getAllProducts();
      setProducts(productsList);
      setLoading(false);
    };
    loadProducts();
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'instock') return matchesSearch && product.stock === 1;
    if (filter === 'outofstock') return matchesSearch && product.stock === 0;
    if (filter === 'on-sale') return matchesSearch && product.oferta !== null;
    return matchesSearch;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.oferta ? a.oferta.precioOferta : a.precio;
    const bPrice = b.oferta ? b.oferta.precioOferta : b.precio;
    const aSavings = a.oferta ? (a.oferta.precioOriginal - a.oferta.precioOferta) : 0;
    const bSavings = b.oferta ? (b.oferta.precioOriginal - b.oferta.precioOferta) : 0;
    
    if (sortBy === 'popular') return 0; // Sin rating en la BD, se puede implementar después
    if (sortBy === 'price-low') return aPrice - bPrice;
    if (sortBy === 'price-high') return bPrice - aPrice;
    if (sortBy === 'savings') return bSavings - aSavings;
    return 0;
  });

 const handleViewDetails = (productId) => {
  // Buscar el producto para obtener el nombre
  const product = products.find(p => p.id === productId);
  if (product) {
    const slug = createSlug(product.nombre);
    navigate(`/productos/${slug}/${productId}`);
  } else {
    navigate(`/productos/${productId}`);
  }
  };

  // Función para crear slug (puedes moverla a un archivo utils)
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  return (
    <div className="productos-wrapper">
      <section className="productos-page">
        <div className="page-container">
          <div className="productos-header">
            <h1>Productos</h1>
            
            <div className="productos-filters">
              <div className="filter-group">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos los productos</option>
                  <option value="instock">En stock</option>
                  <option value="outofstock">Sin stock</option>
                  <option value="on-sale">En oferta</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="popular">Más vendidos</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="savings">Mayor ahorro</option>
                </select>
              </div>
              
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          <div className="productos-stats">
            <span>{sortedProducts.length} productos encontrados</span>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="no-products">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="productos-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <div className="ticks"></div>
    </div>
  );
}

export default Productos;