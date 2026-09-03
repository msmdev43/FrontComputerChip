# 🖥️ Computer Chip 

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite)](https://vitejs.dev/)
[![Axios](https://img.shields.io/badge/Axios-1.7-cyan?logo=axios)](https://axios-http.com/)

> Panel de administración para Computer Chip - Casa de computación

## 🏪 Sobre el Proyecto

**Computer Chip** es una casa de computación ubicada en **Calle 23 1099, Miramar, Buenos Aires**, dedicada a:

- 🔧 **Venta y reparación** de PC, Notebooks, Consolas y Celulares
- 🛠️ **Servicio técnico** especializado en electrónica
- 📱 **Reparación** de teléfonos, PC y consolas

### 📱 Redes Sociales
- **Instagram:** [@computer_ch1p](https://instagram.com/computer_ch1p)
- **Kick:** [computer-chip](https://kick.com/computer-chip)

---

## 🚀 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.3 | Framework UI |
| Vite | 8.0 | Build tool |
| React Router DOM | 7.19 | Enrutamiento |
| Axios | 1.7 | Cliente HTTP |
| React Compiler | - | Optimización |

---

## 📋 Funcionalidades Implementadas

### ✅ Módulos del Panel Admin

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| 🔐 **Login** | Autenticación con JWT | ✅ Completado |
| 📊 **Dashboard** | Estadísticas en tiempo real | ✅ Completado |
| 📦 **Productos** | CRUD de productos | ✅ Completado |
| 📋 **Pedidos** | Gestión y estados | ✅ Completado |
| 👥 **Usuarios** | Gestión de usuarios | ⏳ Pendiente |
| ⚙️ **Configuración** | Ajustes del sistema | ⏳ Pendiente |

### 🛠️ Backend
- **API REST** con autenticación JWT
- **Endpoints:** Admin, Auth, Productos, Pedidos, Categorías, Marcas

---

## 📦 Instalación

### Prerrequisitos
- Node.js (v18+)
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone

# 2. Entrar al directorio
cd frontcomputerchip

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API

# 5. Iniciar en modo desarrollo
npm run dev
