import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite para la app React del quiz.
// La base se inyecta en el despliegue (VITE_BASE) para que los assets del
// build resuelvan siempre bien, incluso al abrir la SPA en una subruta.
// Por defecto es relativa: yarn dev y yarn build funcionan en cualquier sitio.
export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react()],
  // Configuración de Vitest: entorno jsdom, APIs globales y setup compartido.
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
