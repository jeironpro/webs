import js from '@eslint/js'
import globals from 'globals'

// ESLint plano (v9) para JS vanilla con Three.js
export default [
  {
    ignores: ['dist/', 'node_modules/', '.yarn/', '.vite/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]
