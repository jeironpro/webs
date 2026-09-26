# Design — exerciness

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre

playful

## Macrostructure family

- Marketing page (Home): Marquee Hero — big statement fills the fold, no CTA in fold.
- App pages (Ejercicios, Favoritos): Catalogue — uniform grid of identical-sized cards, each a variant of the core product.
- Content page (Detalle): Long Document — single-column prose, inline headings, measure 60–65ch.
- Utility pages (Comparador): spec-sheet table — no macrostructure from catalog; data-driven comparison grid.
- Fallback (NotFound): Statement — minimal single-line message.

## Theme

- `--color-paper` oklch(97% 0.012 95)
- `--color-paper-2` oklch(94% 0.016 95)
- `--color-paper-3` oklch(91% 0.020 95)
- `--color-ink` oklch(20% 0.012 250)
- `--color-ink-2` oklch(35% 0.016 250)
- `--color-rule` oklch(85% 0.025 95)
- `--color-accent` oklch(86% 0.18 95)
- `--color-accent-2` oklch(66% 0.18 235)
- `--color-accent-3` oklch(68% 0.24 18)
- `--color-mint` oklch(80% 0.16 150)
- `--color-lavender` oklch(74% 0.16 305)
- `--color-focus` oklch(66% 0.18 235)

- `--color-surface` var(--color-paper)
- `--color-surface-alt` var(--color-paper-2)
- `--color-text` var(--color-ink)
- `--color-text-muted` var(--color-ink-2)
- `--color-border` var(--color-rule)
- `--color-primary` var(--color-accent)
- `--color-primary-alt` var(--color-accent-2)
- `--color-pop` var(--color-accent-3)

## Typography

- Display: "Plus Jakarta Sans", weight 600, style normal, tracking -0.025em
- Body: "Plus Jakarta Sans", weight 400, style normal
- Mono: "JetBrains Mono", weight 400, uppercase for labels
- Type scale anchor: `clamp(2.5rem, 6vw + 1rem, 5.5rem)` for display hero

## Spacing

4-point named scale. Pages must use named tokens, never raw values.

- `--space-3xs: 0.25rem; --space-2xs: 0.5rem; --space-xs: 0.75rem;`
- `--space-sm:  1rem;    --space-md:  1.5rem;  --space-lg:  2rem;`
- `--space-xl:  3rem;    --space-2xl: 4.5rem;  --space-3xl: 7rem;`

## Motion

- Easings: `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy overshoot),
  `--ease-snap: cubic-bezier(0.22, 1, 0.36, 1)` (snappy arrival),
  `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` (standard)
- Reveal pattern: fade + slide (translateY(12px → 0), 600ms, 80ms stagger)
- Reduced-motion fallback: opacity-only, ≤ 150 ms

## Microinteractions stance

- Cards lift 4px + shadow brighten on hover (220ms ease-spring).
- Primary CTA: chunky push button — lifts 2px on hover, presses DOWN 3px on active.
- Hover delay 800 ms for decorative reveals; focus delay 0 ms.
- Star-burst micro-celebration on primary action complete (coral-red, 420ms).

## CTA voice

- Primary CTA: pill-shaped push button with colour edge (pear-yellow), text in ink.
- Secondary CTA: soft flat button (no colour edge), cyan tint.
- Tertiary CTA: outline hairline with fill sweep on hover.

## Per-page allowances

- Home (Marquee Hero) MAY use enrichment: a character moment (CSS-only reacting mark).
- Ejercicios / Favoritos (Catalogue) MUST NOT use enrichment — the grid carries the page.
- Detalle (Long Document) MUST NOT use enrichment — typography only.
- Comparador: data table carries the page — no enrichment.
- NotFound: no enrichment.

## What pages MUST share

- The wordmark / logotype.
- The accent colour and its placement (≤ 5 % per viewport).
- The display + body fonts (Plus Jakarta Sans).
- The CTA voice (pill shape, press-as-feedback).
- Section heading rhythm (mono-label + heading pattern).

## What pages MAY differ on

- Macrostructure within the page-type family.
- Hero archetype (Marquee on Home; none on Catalogue pages).
- Colour accent distribution — pear on action surfaces, cyan on navigation, coral on high-energy moments.

## Exports

### tokens.css

```css
:root {
  --color-paper: oklch(97% 0.012 95);
  --color-paper-2: oklch(94% 0.016 95);
  --color-paper-3: oklch(91% 0.02 95);
  --color-ink: oklch(20% 0.012 250);
  --color-ink-2: oklch(35% 0.016 250);
  --color-rule: oklch(85% 0.025 95);
  --color-accent: oklch(86% 0.18 95);
  --color-accent-2: oklch(66% 0.18 235);
  --color-accent-3: oklch(68% 0.24 18);
  --color-mint: oklch(80% 0.16 150);
  --color-lavender: oklch(74% 0.16 305);
  --color-focus: oklch(66% 0.18 235);

  --color-surface: var(--color-paper);
  --color-surface-alt: var(--color-paper-2);
  --color-text: var(--color-ink);
  --color-text-muted: var(--color-ink-2);
  --color-border: var(--color-rule);
  --color-primary: var(--color-accent);
  --color-primary-alt: var(--color-accent-2);
  --color-pop: var(--color-accent-3);

  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4.5rem;
  --space-3xl: 7rem;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-md: 1.125rem;
  --text-lg: 1.375rem;
  --text-xl: 1.75rem;
  --text-2xl: 2.25rem;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-snap: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-short: 140ms;
  --dur-med: 220ms;

  --radius-card: 20px;
  --radius-pill: 999px;
  --radius-input: 12px;
}
```

### Tailwind config

```js
colors: {
  paper:      'oklch(var(--color-paper) / <alpha-value>)',
  'paper-2':  'oklch(var(--color-paper-2) / <alpha-value>)',
  ink:        'oklch(var(--color-ink) / <alpha-value>)',
  'ink-2':    'oklch(var(--color-ink-2) / <alpha-value>)',
  rule:       'oklch(var(--color-rule) / <alpha-value>)',
  accent:     'oklch(var(--color-accent) / <alpha-value>)',
  'accent-2': 'oklch(var(--color-accent-2) / <alpha-value>)',
  'accent-3': 'oklch(var(--color-accent-3) / <alpha-value>)',
  focus:      'oklch(var(--color-focus) / <alpha-value>)',
},
fontFamily: {
  display: ['"Plus Jakarta Sans"', 'sans-serif'],
  body:    ['"Plus Jakarta Sans"', 'sans-serif'],
  mono:    ['"JetBrains Mono"', 'monospace'],
},
```
