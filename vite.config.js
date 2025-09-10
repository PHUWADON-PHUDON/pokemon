import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            // จับ API JSON ของ pokeapi
            urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+$/,
            handler: 'NetworkFirst', // ใช้ API ใหม่ก่อน แต่ถ้า offline จะใช้ cache
            options: {
              cacheName: 'pokeapi-json',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7 // เก็บ 7 วัน
              }
            }
          },
          {
            // จับไฟล์รูปที่มาจาก GitHub raw (pokeapi sprites)
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.*\.(png|jpg|jpeg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokeapi-images',
              expiration: {
                maxEntries: 200, // เก็บได้สูงสุด 200 รูป
                maxAgeSeconds: 60 * 60 * 24 * 30 // เก็บ 30 วัน
              }
            }
          }
        ]
      },
      manifest: {
        name: 'My React PWA',
        short_name: 'ReactPWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#317EFB',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
