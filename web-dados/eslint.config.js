import js from '@eslint/js';

export default [
    {
        ignores: ['node_modules/**', 'coverage/**'],
    },
    js.configs.recommended,
    {
        files: ['js/**/*.js', 'tests/**/*.js', 'vitest.config.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: 'readonly',
                window: 'readonly',
                console: 'readonly',
                requestAnimationFrame: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
            },
        },
        rules: {
            indent: ['error', 4],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-restricted-properties': [
                'error',
                {
                    property: 'innerHTML',
                    message:
                        'No se permite innerHTML por seguridad. Usa metodos DOM como createElement y textContent.',
                },
                {
                    property: 'outerHTML',
                    message:
                        'No se permite outerHTML por seguridad. Usa metodos DOM.',
                },
                {
                    property: 'insertAdjacentHTML',
                    message:
                        'No se permite insertAdjacentHTML por seguridad. Usa metodos DOM.',
                },
            ],
        },
    },
];
