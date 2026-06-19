import { useState } from 'react'
import notFoundImg from '../assets/NotFound.jpg'
import notFoundHoverImg from '../assets/NotFoundHover.jpg' // Importamos la nueva imagen
import '../styles/components/NotFound.css'

function NotFound() {
  // Estado para controlar qué imagen se muestra
  const [currentImg, setCurrentImg] = useState(notFoundImg)

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* La imagen ahora cambia dinámicamente gracias al estado */}
        <img 
          src={currentImg} 
          className="not-found-img" 
          alt="Gato ComputerChip" 
        />
        
        <h1 className="not-found-title">Error 404</h1>
        <p className="not-found-text">
          ¡Ups! Parece que el michi de <strong>ComputerChip</strong> desconectó el cable equivocado y esta página no existe.
        </p>

        {/* Añadimos los escuchadores de eventos para detectar el hover */}
        <button 
          className="back-home-btn"
          onClick={() => window.location.href = '/'}
          onMouseEnter={() => setCurrentImg(notFoundHoverImg)} // Cambia al reparado
          onMouseLeave={() => setCurrentImg(notFoundImg)}      // Vuelve al roto
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}

export default NotFound