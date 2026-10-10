import '../styles/Contacto.css'

function Contacto() {
  return (
    <div className="contacto-wrapper">
      <section className="page-container contacto-container">
        <h1>Contacto</h1>
        <p className="contacto-subtitle">¿Tienes alguna pregunta? Contáctanos</p>
        
        <p role="status">El envío de consultas desde este formulario estará disponible próximamente.</p>
        <form className="contact-form" onSubmit={event => event.preventDefault()}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" placeholder="Tu nombre" />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="tu@email.com" />
          </div>
          
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" rows="5" placeholder="¿En qué podemos ayudarte?"></textarea>
          </div>
          
          <button type="submit" className="submit-btn" disabled>Próximamente</button>
        </form>
      </section>
    </div>
  )
}

export default Contacto