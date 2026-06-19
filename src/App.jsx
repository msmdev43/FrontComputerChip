import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Colocamos la barra arriba de todo */}
      <Navbar />

      <section id="center">
        <div>
          <h1>¡Bienvenido a ComputerChip!</h1>
          <p>
            Tu tienda de hardware de confianza. El logo del gato cerrará los ojos al interactuar con el menú superior.
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Productos seleccionados: {count}
        </button>
      </section>

      <div className="ticks"></div>
    </>
  )
}

export default App