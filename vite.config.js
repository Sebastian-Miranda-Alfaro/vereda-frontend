import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- 1. Importamos Tailwind
import { VitePWA } from 'vite-plugin-pwa' // <--- 1. Importamos el plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // --- 2. Configuramos la PWA ---
    VitePWA({
      registerType: 'autoUpdate', // Se actualiza sola cuando haces cambios
      manifest: {
        name: 'Faithful Circle',
        short_name: 'Faithful Circle',
        description: 'Tu espacio, tu comunidad.',
        theme_color: '#FF5359', // Tu color primario (Rojo coral)
        background_color: '#F4F5F7', // Tu color de fondo claro
        display: 'standalone', // Esto oculta la barra de direcciones del navegador
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})