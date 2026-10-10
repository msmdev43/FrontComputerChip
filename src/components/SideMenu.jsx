// C:\xampp\htdocs\FrontComputerChip\src\components\SideMenu.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/SideMenu.css';
import { categoriaService } from '../services/categoriaService';

const SideMenu = ({ isOpen, onClose }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoryStatus, setCategoryStatus] = useState('loading');
  const [currentTheme, setCurrentTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    categoriaService.getAll().then(data => {
      if (!Array.isArray(data)) throw new Error('Categorías inválidas');
      if (!cancelled) { setCategorias(data.filter(cat => !cat.deletedAt)); setCategoryStatus('ready'); }
    }).catch(() => { if (!cancelled) setCategoryStatus('error'); });
    return () => { cancelled = true; };
  }, [isOpen]);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  // Detectar tema claro/oscuro
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme === 'dark' ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    onClose();
    setSearchTerm('');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSearchTerm('');
    }
  };

  return (
    <div className="side-menu-overlay" onClick={handleOverlayClick}>
      <div id="category-menu" className={`side-menu ${currentTheme === 'dark' ? 'dark' : 'light'}`}>
        <div className="side-menu-header">
          <h3>Categorías</h3>
          <button className="side-menu-close" aria-label="Cerrar categorías" onClick={handleClose}>✕</button>
        </div>

        <div className="side-menu-body">
          <div className="side-menu-search">
            <input 
              type="text" 
              placeholder="Buscar categoría..." 
              className="side-menu-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="side-menu-categories">
            {categoryStatus === 'loading' && <p role="status">Cargando categorías...</p>}
            {categoryStatus === 'error' && <p role="status">No se pudieron cargar las categorías. Podés abrir el catálogo completo.</p>}
            {categoryStatus === 'ready' && categoriasFiltradas.length === 0 && <p>No hay categorías para esta búsqueda.</p>}
            {categoriasFiltradas.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
                className="side-menu-category-item"
                onClick={handleClose}
              >
                <span className="side-menu-category-icon">{'▦'}</span>
                <span className="side-menu-category-name">{categoria.nombre}</span>
              </Link>
            ))}
          </div>

          <div className="side-menu-footer">
            <Link to="/productos" className="side-menu-all-products" onClick={handleClose}>
              Ver todos los productos 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;