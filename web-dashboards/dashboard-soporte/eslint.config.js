import js from '@eslint/js'
import globals from 'globals'

// Configuración flat de ESLint (v9+) para JS vanilla.
export default [
    {
        ignores: ['dist', 'coverage', 'node_modules', 'public'],
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
        rules: {
            'no-console': 'warn',
        },
    },
]
