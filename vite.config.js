import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Dev server — proxy /api to local Spring Boot
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Production build optimisation
  build: {
    outDir: 'dist',
    sourcemap: false,          // do not expose source in production
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split large vendor chunks so the first load is faster
        manualChunks: {
          react:    ['react', 'react-dom'],
          router:   ['react-router-dom'],
          motion:   ['framer-motion'],
          i18n:     ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          icons:    ['lucide-react'],
          utils:    ['clsx', 'tailwind-merge'],
        },
      },
    },
  },
})
