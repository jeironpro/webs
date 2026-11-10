/**
 * Tailwind config - vanilla JS migration
 * Tokens now defined directly in assets/index-CUSTOMS.css
 * This config is kept minimal for reference but not used at runtime.
 */
export default {
  content: ['./index.html'],
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
    },
  },
  plugins: [],
}