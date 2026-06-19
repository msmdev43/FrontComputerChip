// C:\xampp\htdocs\FrontComputerChip\src\pages\Productos.jsx
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Productos.css';

// Datos de ejemplo (simulación de backend)
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Gabinete Gamer Zer01 Gaming Centauri 3 Fan Fixed Rgb',
    brand: 'Zer01 Gaming',
    category: 'Gabinetes',
    subcategory: 'Mid Tower',
    originalPrice: 38250,
    discountedPrice: 25900,
    savings: 12350,
    rating: 4.9,
    reviews: 9,
    image: '/images/gabinete-centauri.webp',
    inStock: true,
    isNew: false,
    tags: ['RGB', 'Gamer', 'Mid Tower']
  },
  {
    id: 2,
    name: 'Memoria Ram American Telekinesis 8gb 3200 Mhz Ddr4',
    brand: 'American Telekinesis',
    category: 'Memorias Para Pc',
    subcategory: 'DDR4',
    originalPrice: 142113,
    discountedPrice: 109900,
    savings: 32213,
    rating: 4.5,
    reviews: 15,
    image: '/images/memoria-ram.webp',
    inStock: true,
    isNew: false,
    tags: ['8GB', '3200MHz', 'DDR4']
  },
  {
    id: 3,
    name: 'Teclado Mecanico Redragon K552 Kumara 2 Rainbow Red Switches',
    brand: 'Redragon',
    category: 'Teclados',
    subcategory: 'Mecanico',
    originalPrice: 60075,
    discountedPrice: 46600,
    savings: 19475,
    rating: 4.7,
    reviews: 23,
    image: '/images/teclado-redragon.webp', 
    inStock: true,
    isNew: false,
    tags: ['Mecanico', 'Rainbow', 'Gamer']
  },
  {
    id: 4,
    name: 'Gabinete Gamer Zer01 Gaming Orion 4 Fan Argb',
    brand: 'Zer01 Gaming',
    category: 'Gabinetes',
    subcategory: 'Mid Tower',
    originalPrice: 72960,
    discountedPrice: 50100,
    savings: 22860,
    rating: 5.0,
    reviews: 1,
    image: '/images/gabinete-orion.webp', 
    inStock: true,
    isNew: true,
    tags: ['ARGB', '4 Fans', 'Gamer']
  },
  {
    id: 5,
    name: 'Placa de Video RTX 4060 8GB GDDR6',
    brand: 'NVIDIA',
    category: 'Placas De Video',
    subcategory: 'Placas De Video Nvidia',
    originalPrice: 450000,
    discountedPrice: 429356,
    savings: 20644,
    rating: 4.8,
    reviews: 12,
    image: '/images/rtx-4060.webp',
    inStock: true,
    isNew: true,
    tags: ['RTX', '8GB', 'GDDR6']
  },
  {
    id: 6,
    name: 'Mouse Gamer Logitech G203 Lightsync',
    brand: 'Logitech',
    category: 'Mouse',
    subcategory: 'Gamer',
    originalPrice: 29900,
    discountedPrice: 25000,
    savings: 4900,
    rating: 4.6,
    reviews: 8,
    image: '/images/mouse-logitech.webp', 
    inStock: false,
    isNew: false,
    tags: ['Lightsync', 'RGB', 'Gamer']
  },
  {
    id: 7,
    name: 'Monitor Gamer 24" 144Hz Full HD',
    brand: 'ViewSonic',
    category: 'Monitores',
    subcategory: 'Gamer',
    originalPrice: 189990,
    discountedPrice: 178440,
    savings: 11550,
    rating: 4.4,
    reviews: 6,
    image: '/images/monitor-viewsonic.webp', 
    inStock: true,
    isNew: false,
    tags: ['144Hz', 'Full HD', 'Gamer']
  },
  {
    id: 8,
    name: 'Fuente de Poder 750W 80 Plus Gold',
    brand: 'Corsair',
    category: 'Fuentes',
    subcategory: 'Modular',
    originalPrice: 128900,
    discountedPrice: 105143,
    savings: 23757,
    rating: 4.9,
    reviews: 11,
    image: '/images/fuente-corsair.webp', 
    inStock: true,
    isNew: false,
    tags: ['750W', '80 Plus Gold', 'Modular']
  }
];

function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Simular carga de datos
  useEffect(() => {
    const loadProducts = async () => {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(SAMPLE_PRODUCTS);
      setLoading(false);
    };
    loadProducts();
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'instock') return matchesSearch && product.inStock;
    if (filter === 'outofstock') return matchesSearch && !product.inStock;
    if (filter === 'on-sale') return matchesSearch && product.savings > 0;
    return matchesSearch;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice;
    if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice;
    if (sortBy === 'savings') return b.savings - a.savings;
    return 0;
  });

  // Manejadores de eventos
  const handleAddToCart = (productId) => {
    console.log(`Añadir al carrito producto ID: ${productId}`);
    // Aquí iría la lógica para añadir al carrito
  };

  const handleViewDetails = (productId) => {
    console.log(`Ver detalles del producto ID: ${productId}`);
    // Aquí iría la navegación a la página de detalles
  };

  return (
    <section className="productos-page">
      <div className="page-container">
        {/* Encabezado */}
        <div className="productos-header">
          <h1>Productos</h1>
          
          {/* Filtros y búsqueda */}
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

        {/* Resultados */}
        <div className="productos-stats">
          <span>{sortedProducts.length} productos encontrados</span>
        </div>

        {/* Grid de productos */}
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
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Productos;