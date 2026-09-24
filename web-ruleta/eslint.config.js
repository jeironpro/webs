import htmlPlugin from 'eslint-plugin-html';

const commons = {
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		globals: {
			document: 'readonly',
			window: 'readonly',
			console: 'readonly',
			requestAnimationFrame: 'readonly',
			cancelAnimationFrame: 'readonly',
			fetch: 'readonly',
			setTimeout: 'readonly',
			clearTimeout: 'readonly',
			setInterval: 'readonly',
			clearInterval: 'readonly',
			MouseEvent: 'readonly',
			CustomEvent: 'readonly',
			KeyboardEvent: 'readonly',
			HTMLCanvasElement: 'readonly',
			CanvasRenderingContext2D: 'readonly',
			InputEvent: 'readonly',
		},
	},
	rules: {
		indent: ['error', 'tab', { SwitchCase: 1 }],
		semi: ['error', 'always'],
		quotes: ['error', 'single', { avoidEscape: true }],
		'comma-dangle': ['error', 'always-multiline'],
		'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'no-console': 'off',
		'no-var': 'error',
		'prefer-const': 'error',
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],
		'computed-property-spacing': ['error', 'never'],
		'space-infix-ops': 'error',
		'keyword-spacing': ['error', { before: true, after: true }],
		'space-before-blocks': 'error',
		'brace-style': ['error', '1tbs', { allowSingleLine: true }],
		eqeqeq: ['error', 'always'],
		curly: ['error', 'multi-line'],
	},
};

export default [
	{
		...commons,
		files: ['**/*.js', '**/*.html'],
		plugins: {
			html: htmlPlugin,
		},
	},
	{
		ignores: ['node_modules/', 'assets/', 'favicon.ico'],
	},
];
