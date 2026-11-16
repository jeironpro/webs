import js from "@eslint/js";
import globals from "globals";

const WEBS_CANONICAS = [
    "web-algoritmos",
    "web-apis",
    "web-biblia",
    "web-calificaciones-escolares",
    "web-calculadora",
    "web-calculadora-edad",
    "web-calendario",
    "web-clima",
    "web-codelang-quiz",
    "web-codingbat-solutions",
    "web-continguts-daw",
    "web-codi-wiki",
    "web-codigos-http",
    "web-codecs",
    "web-color-picker",
    "web-contador-palabras",
    "web-contraste-wcag",
    "web-csv",
    "web-conversor-universal",
    "web-convertidor-moneda",
    "web-curso-dcs",
    "web-curso-git",
    "web-curso-sql",
    "web-cursos-cpnl",
    "web-dados",
    "web-daw",
    "web-diff",
    "web-ejercicios-pyja",
    "web-exerciness",
    "web-flashcards",
    "web-frontend",
    "web-instruccion-login-google",
    "web-javarcises",
    "web-hashes-contrasenas",
    "web-http",
    "web-json-yaml",
    "web-juegos",
    "web-generador-clave-secreta",
    "web-generador-codigo-qr",
    "web-generador-contrasena",
    "web-generador-crucigramas",
    "web-gestiona-presupuesto",
    "web-lector-archivo",
    "web-lexaro",
    "web-mandala",
    "web-markdown",
    "web-mecanografia",
    "web-narcopedia",
    "web-naruto",
    "web-oracle-academy-dpsql",
    "web-paises-visitados",
    "web-pokemon",
    "web-pomodoro",
    "web-pythoncises",
    "web-tests-daw",
    "web-timestamp",
    "web-trigonometria",
    "web-porcentaje-anual",
    "web-redimensiona-imagen",
    "web-refprog",
    "web-regex-tester",
    "web-reproductor-musica",
    "web-ruleta",
    "web-sql",
    "web-votacion",
    "web-dashboards",
    "web-generador-cv",
    "web-programmer-day",
    "web-reloj",
];

const WEBS_PENDIENTES = [];

const ARCHIVOS_CANONICOS = WEBS_CANONICAS.flatMap((web) => [`${web}/**/*.js`, `${web}/**/*.mjs`]);

export default [
    {
        ignores: [
            "**/node_modules/**",
            ...WEBS_PENDIENTES.map((web) => `${web}/**`),
            "web-continguts-daw/moduls_*/**",
            "**/vendor/**",
            "**/.rea/**",
            "assets/**",
            "coverage/**",
            ".hallmark/**",
            "**/cpnl/**",
            "**/inventory.generated.js",
        ],
    },
    js.configs.recommended,
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ARCHIVOS_CANONICOS,
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        files: ["web-juegos/**/tools/**/*.{js,mjs}", "web-juegos/tools/**/*.{js,mjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["js/**/*.js", "tests/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        files: ["web-mandala/js/app.js"],
        languageOptions: {
            globals: {
                Mandala: "readonly",
                MandalaTemplates: "readonly",
            },
        },
    },
];
