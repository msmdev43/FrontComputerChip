// C:\xampp\htdocs\FrontComputerChip\src\App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import { CartProvider } from './context/CartContext' 
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductDetail from './pages/ProductDetail'
import Contacto from './pages/Contacto'
import Login from './pages/Login'      
import Register from './pages/Register'
import Cart from './pages/Cart'
import AdminRoutes from './routes/AdminRoutes'
import './App.css'

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
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
                      <Route path="/productos/:slug/:id" element={<ProductDetail />} />
                      <Route path="/productos/:id" element={<ProductDetail />} />
                      <Route path="/contacto" element={<Contacto />} />
                      <Route path="/login" element={<Login />} />      
                      <Route path="/registro" element={<Register />} />
                      <Route path="/carrito" element={<Cart />} />
                    </Routes>
                  </div>
                </div>
                <Footer />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AdminProvider>
  )
}

export default App