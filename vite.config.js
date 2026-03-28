import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/CV-Generator/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],

      manifest: {
        name: 'CV Generator',
        short_name: 'CVGen',
        description: 'Application de génération de CV',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/CV-Generator/',

        icons: [
          {
            src: '/CV-Generator/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/CV-Generator/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}']
      }
    })
  ]
})