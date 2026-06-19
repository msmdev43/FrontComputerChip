// C:\xampp\htdocs\FrontComputerChip\src\components\Navbar.jsx
import { Link } from 'react-router-dom'  
import logoAbierto from '../assets/LogoComputerChip.png'
import logoCerrado from '../assets/LogoComputerChipOjosCerrados.png'
import searchGato from '../assets/SearchGato.png'
import ingresarEmoji from '../assets/IngresarEmojiBlanco.png'
import carritoEmoji from '../assets/CarritoEmojiBlanco.png' 
import ThemeToggle from './ThemeToggle';
import '../styles/components/Navbar.css'

function Navbar() {
  return (
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
          <div className="action-item">
            <img src={ingresarEmoji} className="action-icon-gato" alt="Ingresar" />
            <span>Ingresar</span>
          </div>
          <div className="action-item cart">
            <img src={carritoEmoji} className="action-icon-gato" alt="Carrito" />
            <span>Carrito</span>
          </div>
          {/* ✅ Agregamos el ThemeToggle aquí */}
          <div className="action-item theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="header-bottom">
        <button className="products-btn">☰ Productos</button>
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
  )
}

export default Navbar