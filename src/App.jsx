// C:\xampp\htdocs\FrontComputerChip\src\App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Contacto from './pages/Contacto'
import NotFound from './components/NotFound'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          {/* 🔥 Wrapper para limitar el ancho del contenido */}
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/contacto" element={<Contacto />} />
            </Routes>
          </div>
        </main>
        <div className="ticks"></div>
        <NotFound />
      </div>
    </BrowserRouter>
  )
}

export default App