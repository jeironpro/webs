// Configuración de Tailwind: los colores y radios mapean a las variables
// CSS definidas en src/styles/tokens.css (sistema Hum). Así los utilitarios
// de Tailwind y los tokens CSS comparten la misma paleta.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'oklch(var(--color-paper) / <alpha-value>)',
        'paper-2': 'oklch(var(--color-paper-2) / <alpha-value>)',
        ink: 'oklch(var(--color-ink) / <alpha-value>)',
        'ink-2': 'oklch(var(--color-ink-2) / <alpha-value>)',
        rule: 'oklch(var(--color-rule) / <alpha-value>)',
        accent: 'oklch(var(--color-accent) / <alpha-value>)',
        'accent-2': 'oklch(var(--color-accent-2) / <alpha-value>)',
        'accent-3': 'oklch(var(--color-accent-3) / <alpha-value>)',
        focus: 'oklch(var(--color-focus) / <alpha-value>)',
        surface: {
          DEFAULT: 'oklch(var(--color-paper) / <alpha-value>)',
          alt: 'oklch(var(--color-paper-2) / <alpha-value>)',
        },
        text: {
          DEFAULT: 'oklch(var(--color-ink) / <alpha-value>)',
          muted: 'oklch(var(--color-ink-2) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'oklch(var(--color-rule) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'oklch(var(--color-accent) / <alpha-value>)',
          alt: 'oklch(var(--color-accent-2) / <alpha-value>)',
        },
        success: 'oklch(var(--color-mint) / <alpha-value>)',
        error: 'oklch(var(--color-accent-3) / <alpha-value>)',
        info: 'oklch(var(--color-focus) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
        input: '12px',
      },
      boxShadow: {
        soft: '0 12px 32px -16px oklch(20% 0.012 250 / 0.12)',
        lift: '0 16px 40px -12px oklch(20% 0.012 250 / 0.18)',
      },
    },
  },
  plugins: [],
}
