import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE || './',
  test: {
    // El único test cubre scripts/optimize-media.py, que solo usa Node.
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['assets/index-CUSTOMS.css', 'app.js'],
      exclude: [],
    },
  },
})
