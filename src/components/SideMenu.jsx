// C:\xampp\htdocs\FrontComputerChip\src\components\SideMenu.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/SideMenu.css';

const SideMenu = ({ isOpen, onClose }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');

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

  const categorias = [
    { id: 1, nombre: 'Gabinetes', icon: '🖥️' },
    { id: 2, nombre: 'Memorias Para Pc', icon: '💾' },
    { id: 3, nombre: 'Teclados', icon: '⌨️' },
    { id: 4, nombre: 'Placas De Video', icon: '🎮' },
    { id: 5, nombre: 'Mouse', icon: '🖱️' },
    { id: 6, nombre: 'Monitores', icon: '🖥️' },
    { id: 7, nombre: 'Fuentes', icon: '⚡' },
    { id: 8, nombre: 'Almacenamiento', icon: '💿' },
    { id: 9, nombre: 'Procesadores', icon: '🧠' },
    { id: 10, nombre: 'Placas Madre', icon: '🔌' },
    { id: 11, nombre: 'Auriculares', icon: '🎧' },
  ];

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
      <div className={`side-menu ${currentTheme === 'dark' ? 'dark' : 'light'}`}>
        <div className="side-menu-header">
          <h3>Categorías</h3>
          <button className="side-menu-close" onClick={handleClose}>✕</button>
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
            {categoriasFiltradas.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
                className="side-menu-category-item"
                onClick={handleClose}
              >
                <span className="side-menu-category-icon">{categoria.icon}</span>
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