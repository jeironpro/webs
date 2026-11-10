import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, '.'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.ts',
    },
})
