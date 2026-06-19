// C:\xampp\htdocs\FrontComputerChip\src\pages\Home.jsx
import { useState } from 'react'
import '../styles/Home.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <section className="home-container">
      <div className="hero-content">
        <h1>¡Bienvenido a ComputerChip!</h1>
        <p>
          Tu tienda de hardware de confianza. El logo del gato cerrará los ojos 
          al interactuar con el menú superior.
        </p>
        <button
          type="button"
          className="counter-button"
          onClick={() => setCount((count) => count + 1)}
        >
          Productos seleccionados: {count}
        </button>
      </div>
    </section>
  )
}

export default Home