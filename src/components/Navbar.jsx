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
      <header className="cc-header">
        <div className="cc-header-top">
          <Link to="/" className="cc-logo-container">  
            <img src={logoAbierto} className="cc-logo cc-logo-open" alt="ComputerChip Logo" />
            <img src={logoCerrado} className="cc-logo cc-logo-closed" alt="ComputerChip Logo Hover" />
            <span className="cc-brand">COMPUTER CHIP</span>
          </Link>

          {/* Barra de búsqueda central */}
          <div className="cc-search-wrap">
            <input type="text" placeholder="Buscar en ComputerChip..." className="cc-search-input" />
            <button className="cc-search-btn">
              <img src={searchGato} className="cc-search-icon" alt="Buscar" />
            </button>
          </div>

          {/* Acciones de usuario */}
          <div className="cc-user-actions">
            <Link to="/login" className="cc-action">
              <img src={ingresarEmoji} className="cc-action-icon" alt="Ingresar" />
              <span>Ingresar</span>
            </Link>
            
            <Link to="/carrito" className="cc-action cc-action-cart">
              <img src={carritoEmoji} className="cc-action-icon" alt="Carrito" />
              <span>Carrito</span>
              {itemCount > 0 && (
                <span className="cc-cart-badge">{itemCount}</span>
              )}
            </Link>
            
            <div className="cc-action cc-theme-wrap">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="cc-header-bottom">
          <button className="cc-products-btn" onClick={toggleMenu}>☰ Productos</button>
          <ul className="cc-nav-links">
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