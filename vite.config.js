// vite.config.js (KODE BARU YANG BENAR)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Aturan ini akan mem-proxy /api/profile, /api/projects, dll.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // Aturan ini akan mem-proxy SEMUA gambar
      // (baik /media/projects/ DAN /media/projects/images/)
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
})