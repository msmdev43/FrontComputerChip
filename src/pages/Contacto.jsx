import Footer from '../components/Footer'
import '../styles/Contacto.css'

function Contacto() {
  return (
    <div className="contacto-wrapper">
      <section className="page-container contacto-container">
        <h1>Contacto</h1>
        <p className="contacto-subtitle">¿Tienes alguna pregunta? Contáctanos</p>
        
        <form className="contact-form">
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
          
          <button type="submit" className="submit-btn">Enviar mensaje</button>
        </form>
      </section>
    </div>
  )
}

export default Contacto