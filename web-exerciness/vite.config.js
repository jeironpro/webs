import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE || './',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['assets/index-CUSTOMS.css', 'app.js'],
      exclude: [],
    },
  },
})
