import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  
  // ============================================
  // OPTIMIZACIONES DE BUILD
  // ============================================
  build: {
    // Tamaño máximo de chunk antes de warning (1000 kB)
    chunkSizeWarningLimit: 1000,
    
    // Minificar el código
    minify: 'esbuild',
    
    // Generar sourcemaps (false para producción)
    sourcemap: false,
    
    // Configuración de chunks (CORREGIDO)
    rollupOptions: {
      output: {
        // manualChunks ahora es una FUNCIÓN
        manualChunks(id) {
          // React y React DOM
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor'
          }
          
          // Axios
          if (id.includes('node_modules/axios/')) {
            return 'axios-vendor'
          }
          
          // Otras librerías grandes
          if (id.includes('node_modules/lodash/') || 
              id.includes('node_modules/moment/')) {
            return 'vendor-large'
          }
          
          // Todo lo demás va a vendor común
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
          
          // No devolver nada para código propio
          return null
        },
        
        // Nombres de archivos más legibles
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Reportar tamaño comprimido
    reportCompressedSize: true
  },
  
  // ============================================
  // OPTIMIZACIONES DE SERVIDOR DE DESARROLLO
  // ============================================
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5200',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // ============================================
  // OPTIMIZACIONES DE DEPENDENCIAS
  // ============================================
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios'
    ]
  },
  
  // ============================================
  // RESOLUCIÓN DE MÓDULOS
  // ============================================
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@context': '/src/context',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@config': '/src/config'
    }
  }
})