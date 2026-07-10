// C:\xampp\htdocs\FrontComputerChip\src\components\Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom'  
import { useCart } from '../context/CartContext'; 
import logoAbierto from '../assets/LogoComputerChip.png'
import logoCerrado from '../assets/LogoComputerChipOjosCerrados.png'
import searchGato from '../assets/SearchGato.png'
import ingresarEmoji from '../assets/IngresarEmojiBlanco.png'
import carritoEmoji from '../assets/CarritoEmojiBlanco.png' 
import ThemeToggle from './ThemeToggle';
import SideMenu from './SideMenu'; 
import '../styles/components/Navbar.css'

function Navbar() {
  const { getItemCount } = useCart(); 
  const itemCount = getItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="main-header">
        <div className="header-top">
          <Link to="/" className="logo-container">  
            <img src={logoAbierto} className="nav-logo logo-abierto" alt="ComputerChip Logo" />
            <img src={logoCerrado} className="nav-logo logo-cerrado" alt="ComputerChip Logo Hover" />
            <span className="brand-name">COMPUTER CHIP</span>
          </Link>

          {/* Barra de búsqueda central */}
          <div className="search-bar-container">
            <input type="text" placeholder="Buscar en ComputerChip..." className="search-input" />
            <button className="search-button">
              <img src={searchGato} className="search-icon-gato" alt="Buscar" />
            </button>
          </div>

          {/* Acciones de usuario */}
          <div className="user-actions">
            <Link to="/login" className="action-item">
              <img src={ingresarEmoji} className="action-icon-gato" alt="Ingresar" />
              <span>Ingresar</span>
            </Link>
            
            <Link to="/carrito" className="action-item cart">
              <img src={carritoEmoji} className="action-icon-gato" alt="Carrito" />
              <span>Carrito</span>
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>
            
            <div className="action-item theme-toggle-wrapper">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="header-bottom">
          <button className="products-btn" onClick={toggleMenu}>☰ Productos</button>
          <ul className="nav-links">
            <li><Link to="/">Inicio</Link></li> 
            <li><Link to="/productos">Productos</Link></li> 
            <li><Link to="/contacto">Contacto</Link></li> 
            <li><a href="#ofertas">Ofertas</a></li>
            <li><a href="#armapc">Armá tu PC</a></li>
            <li><a href="#computadoras">Computadoras</a></li>
            <li><a href="#placas">Placas de Video</a></li>
            <li><a href="#gabinete">Gabinetes</a></li>
          </ul>
        </nav>
      </header>

      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  )
}

export default Navbar