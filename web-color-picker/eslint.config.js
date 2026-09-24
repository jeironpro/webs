import js from '@eslint/js';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				document: 'readonly',
				navigator: 'readonly',
				window: 'readonly',
				console: 'readonly',
				setTimeout: 'readonly',
			},
		},
		rules: {
			indent: ['error', 'tab'],
			'no-tabs': 'off',
			'no-var': 'error',
			'prefer-const': 'error',
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	},
];
