import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Router vendor chunk
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor'
          }
          // Charts vendor chunk
          if (id.includes('node_modules/highcharts')) {
            return 'charts-vendor'
          }
          // Forms vendor chunk
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform') ||
            id.includes('node_modules/joi')
          ) {
            return 'forms-vendor'
          }
          // Utils vendor chunk
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/zustand')) {
            return 'utils-vendor'
          }
          // Other node_modules go into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
})