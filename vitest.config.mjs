import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/**/*.{test,spec}.{js,mjs}"],
        exclude: [
            "**/node_modules/**",
            "web-*/**",
            "**/vendor/**",
            "**/assets/**",
            "**/dist/**",
            "**/coverage/**",
        ],
    },
});
