import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite: la app es 100% estática (los personajes se procesan en el navegador).
// La base se inyecta en el despliegue (VITE_BASE) para que los assets del build
// resuelvan en la subruta del monorepo; por defecto es relativa.
export default defineConfig({
    base: process.env.VITE_BASE || './',
    plugins: [react()],
    server: {
        allowedHosts: ['localhost', '127.0.0.1'],
    },
});
