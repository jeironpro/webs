/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './app.js',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'oklch(98% 0 0)',
        'paper-2': 'oklch(95% 0 0)',
        ink: 'oklch(20% 0 0)',
        'ink-2': 'oklch(40% 0 0)',
        rule: 'oklch(85% 0 0)',
        accent: 'oklch(58% 0.25 245)',
        'accent-2': 'oklch(62% 0.25 240)',
        'accent-3': 'oklch(65% 0.25 235)',
        focus: 'oklch(58% 0.25 245)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        pill: '999px',
        input: '10px',
      },
    },
  },
  plugins: [],
}
