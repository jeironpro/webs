import js from '@eslint/js'

// Configuración flat de ESLint (v9+) para JS vanilla.
// Removidos plugins y reglas de React - el app es vanilla JS puro.
export default [
  {
    ignores: [
      'dist',
      'coverage',
      'node_modules',
      'public',
      'exercises-dataset-main',
      '.agents',
      'test/fixtures',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...js.configs.browser.globals,
        ...js.configs.node.globals,
      },
    },
    rules: {
      'no-console': 'warn',
    },
  },
]