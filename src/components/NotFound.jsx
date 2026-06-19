import notFoundImg from '../assets/NotFound.jpg'
import '../styles/components/NotFound.css'

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Imagen del gato rompiendo el cable */}
        <img 
          src={notFoundImg} 
          className="not-found-img" 
          alt="Gato ComputerChip rompiendo un cable" 
        />
        
        <h1 className="not-found-title">Error 404</h1>
        <p className="not-found-text">
          ¡Ups! Parece que el michi de <strong>ComputerChip</strong> desconectó el cable equivocado y esta página no existe.
        </p>

        {/* Botón para regresar a la tienda */}
        <button 
          className="back-home-btn"
          onClick={() => window.location.href = '/'}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}

export default NotFound