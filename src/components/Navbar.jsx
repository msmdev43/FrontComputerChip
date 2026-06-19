import { useState } from 'react'
import logoAbierto from '../assets/LogoComputerChip.png'
import logoCerrado from '../assets/LogoComputerChipOjosCerrados.png'
import '../styles/components/Navbar.css'
function Navbar() {
  return (
    <header className="main-header">
      {/* Barra principal superior */}
      <div className="header-top">
        {/* Contenedor del Logo con el efecto Hover del gato */}
        <div className="logo-container">
          <img src={logoAbierto} className="nav-logo logo-abierto" alt="ComputerChip Logo" />
          <img src={logoCerrado} className="nav-logo logo-cerrado" alt="ComputerChip Logo Hover" />
          <span className="brand-name">COMPUTER CHIP</span>
        </div>

        {/* Barra de búsqueda central */}
        <div className="search-bar-container">
          <input type="text" placeholder="Buscar en ComputerChip..." className="search-input" />
          <button className="search-button">
            🔍
          </button>
        </div>

        {/* Acciones de usuario a la derecha */}
        <div className="user-actions">
          <div className="action-item">
            <span>👤 Ingresar</span>
          </div>
          <div className="action-item cart">
            <span>🛒 Carrito</span>
          </div>
        </div>
      </div>

      {/* Barra secundaria de navegación / Categorías */}
      <nav className="header-bottom">
        <button className="products-btn">☰ Productos</button>
        <ul className="nav-links">
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