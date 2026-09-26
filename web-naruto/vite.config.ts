import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite: la app es 100% estática (los personajes se procesan en el navegador)
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['localhost', '127.0.0.1'],
    },
});
