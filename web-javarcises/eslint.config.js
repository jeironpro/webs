import js from "@eslint/js";

// Configuración de ESLint (flat config) para el proyecto web-javarcises.
// El archivo generado data/ejercicios.js se excluye: lo produce scripts/extraer-datos.js.
export default [
    {
        ignores: ["node_modules/**", "data/ejercicios.js"],
    },
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                // Navegador (js/*.js)
                window: "readonly",
                document: "readonly",
                location: "readonly",
                URL: "readonly",
                console: "readonly",
                // Node (scripts/*.js)
                process: "readonly",
                // node:test (archivos *.test.js)
                test: "readonly",
            },
        },
        rules: {
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
    },
];
