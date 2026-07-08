import Footer from "../components/Footer"
import '../styles/Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="hero-content">
          <h1>Bienvenido a ComputerChip</h1>
          <p>Tu tienda de confianza para componentes de computadora</p>
        </div>
      </div>
      <Footer />
      <div className="ticks"></div>
    </div>
  )
}

export default Home