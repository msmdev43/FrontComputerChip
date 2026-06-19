import '../styles/Productos.css'

function Productos() {
  return (
    <section className="page-container">
      <div className="productos-grid">
        <div className="producto-card">
          <h3>Placa de Video RTX 4060</h3>
          <p>$450.000</p>
        </div>
        <div className="producto-card">
          <h3>Procesador Ryzen 7</h3>
          <p>$320.000</p>
        </div>
        <div className="producto-card">
          <h3>Gabinete Gamer</h3>
          <p>$85.000</p>
        </div>
        <div className="producto-card">
          <h3>Fuente 750W</h3>
          <p>$65.000</p>
        </div>
      </div>
    </section>
  )
}

export default Productos