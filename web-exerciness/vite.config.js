import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Configuración principal de Vite + Vitest.
// El alias @/ apunta a src/ para imports limpios.
// La base se inyecta en el despliegue (VITE_BASE) para que los assets del
// build resuelvan siempre bien, incluso al abrir la SPA en una subruta.
// Por defecto es relativa: yarn dev y yarn build funcionan en cualquier sitio.
export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/routes/**', 'src/test/**'],
    },
  },
})
