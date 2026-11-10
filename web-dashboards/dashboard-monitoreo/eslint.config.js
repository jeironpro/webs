import js from '@eslint/js'

export default [
  {
    ignores: [
      'dist',
      'coverage',
      'node_modules',
      'public',
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
