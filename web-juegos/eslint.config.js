import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: [
            "**/node_modules/**",
            "juego-*/**",
            "vendor/**",
            "assets/**",
            "coverage/**",
            ".hallmark/**",
        ],
    },
    js.configs.recommended,
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
];
