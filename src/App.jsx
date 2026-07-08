import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Contacto from './pages/Contacto'
import AdminRoutes from './routes/AdminRoutes'
import './App.css'

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta para el panel de administración (sin layout) */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Rutas públicas con layout - SIN FOOTER */}
          <Route path="/*" element={
            <div className="app-container">
              <Navbar />
              <div className="main-content">
                <div className="content-wrapper">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/contacto" element={<Contacto />} />
                  </Routes>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}

export default App