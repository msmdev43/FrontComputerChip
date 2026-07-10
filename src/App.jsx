// C:\xampp\htdocs\FrontComputerChip\src\App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductDetail from './pages/ProductDetail'
import Contacto from './pages/Contacto'
import AdminRoutes from './routes/AdminRoutes'
import './App.css'

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          <Route path="/*" element={
            <div className="app-container">
              <Navbar />
              <div className="main-content">
                <div className="content-wrapper">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Productos />} />
                    {/* Ruta con slug y ID */}
                    <Route path="/productos/:slug/:id" element={<ProductDetail />} />
                    {/* Fallback para compatibilidad */}
                    <Route path="/productos/:id" element={<ProductDetail />} />
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