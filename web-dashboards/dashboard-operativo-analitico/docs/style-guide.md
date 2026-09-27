# Libro de estilo — Dashboard Operativo Analítico

> Este documento es el **libro de estilo** exigido por `GENERALS_RULES.md` y debe aprobarse antes de implementar componentes visuales. Define la paleta, la tipografía, los espaciados, los componentes base con sus estados y la iconografía del proyecto.
>
> El sistema de diseño es el tema **Hum** de la skill **hallmark** (género _playful_), con la referencia visual de `usehallmark.com/examples/hum-07`.

## 1. Principios

- **Cálido y vivo**: papel crema (nunca blanco puro), tinta casi negra con matiz frío (nunca negro puro), tres acentos que conviven (pera, cian, coral) y motion obligatorio.
- **Todo redondeado**: sin esquinas cuadradas en cards, píldoras, botones ni inputs.
- **Sin serif**: solo **Plus Jakarta Sans** (display + cuerpo) y **JetBrains Mono** (etiquetas, cifras).
- **Sin gradientes entre acentos**: cada acento es dueño de su propia superficie.
- **Sin emojis como iconos**: se usa la librería de iconos **lucide-react** (estándar de shadcn/ui). Los iconos Material Symbols (estándar dicresoft) quedan como alternativa si el proyecto migra fuera de shadcn/ui.
- **Sin métricas inventadas**: todos los datos son MOCK explícitamente etiquetados en la UI como "Datos de demostración".

## 2. Paleta

Valores en OKLCH, definidos como custom properties centralizadas en `src/index.css`.

| Token              | Valor                  | Uso                                             |
| ------------------ | ---------------------- | ----------------------------------------------- |
| `--color-paper`    | `oklch(97% 0.012 95)`  | Fondo base (crema)                              |
| `--color-paper-2`  | `oklch(94% 0.016 95)`  | Bandas teñidas, sidebar                         |
| `--color-paper-3`  | `oklch(91% 0.02 95)`   | Hover de superficies                            |
| `--color-ink`      | `oklch(20% 0.012 250)` | Texto principal (nunca negro puro)              |
| `--color-ink-2`    | `oklch(38% 0.016 250)` | Texto secundario                                |
| `--color-ink-3`    | `oklch(55% 0.018 250)` | Texto terciario, labels                         |
| `--color-pear`     | `oklch(86% 0.18 95)`   | **Acento primario** (pera): CTA, streak, marca  |
| `--color-cyan`     | `oklch(66% 0.18 235)`  | **Acento secundario** (cian): enlaces, hover    |
| `--color-coral`    | `oklch(68% 0.24 18)`   | **Acento pop** (coral): momento de alta energía |
| `--color-mint`     | `oklch(80% 0.16 150)`  | Estados de éxito, tags secundarios (ocasional)  |
| `--color-lavender` | `oklch(74% 0.16 305)`  | Tags decorativos (ocasional)                    |
| `--color-focus`    | `oklch(60% 0.17 235)`  | Anillos de foco (`:focus-visible`)              |

Regla de los tres acentos: **pera** = acción primaria · **cian** = enlace/tinte hover · **coral** = un único momento de alta energía por página. Mint y lavanda nunca más de uno por página.

### Mapeo a shadcn/ui

| Variable shadcn                              | Valor Hum                        |
| -------------------------------------------- | -------------------------------- |
| `--background` / `--card` / `--popover`      | papel / papel 98.5 %             |
| `--foreground` / `--card-foreground`         | tinta                            |
| `--primary` / `--primary-foreground`         | pera / tinta                     |
| `--secondary` / `--secondary-foreground`     | papel-2 / tinta                  |
| `--accent` / `--accent-foreground`           | tinte cian suave / tinta         |
| `--muted` / `--muted-foreground`             | papel-2 / gris tinta             |
| `--destructive` / `--destructive-foreground` | coral / papel                    |
| `--border` / `--input`                       | papel-3                          |
| `--ring`                                     | cian (foco)                      |
| `--chart-1..5`                               | pera, cian, coral, lavanda, mint |
| `--sidebar*`                                 | papel-2 con fg tinta             |

## 3. Tipografía

| Rol               | Familia           | Pesos                  | Tamaño               | Tracking                    |
| ----------------- | ----------------- | ---------------------- | -------------------- | --------------------------- |
| Display (títulos) | Plus Jakarta Sans | 600                    | escala 1.25, clamp() | `-0.025em`                  |
| Cuerpo            | Plus Jakarta Sans | 400 (500 para énfasis) | 16px base            | normal                      |
| Labels / cifras   | JetBrains Mono    | 400 / 500              | 11–13px              | `0.1em` uppercase en labels |

- Cifras y datos siempre con `font-variant-numeric: tabular-nums`.
- Sin itálicas en títulos (el énfasis se lleva con peso o color).
- Escala de tipografía base: `--text-sm 0.8rem · --text-base 1rem · --text-md 1.25rem · --text-lg 1.5625rem · --text-xl 1.9531rem` (mayor tercera 1.25).
- Numerales de KPI grandes: `clamp(2rem, 4vw + 0.75rem, 3.5rem)`.

## 4. Espaciados y grilla

- Escala de 4 pt: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`.
- `--space-sm 8px · --space-md 16px · --space-lg 24px · --space-xl 32px · --space-2xl 48px · --space-3xl 64px`.
- Breakpoints (mobile-first, en `rem`): `40rem` (640px) · `64rem` (1024px) · `90rem` (1440px).
- Un solo shell de contenido: `max-width: var(--shell)` con gutter interno en las bandas teñidas (las bandas solo aportan fondo y padding vertical).
- Todos los bordes de contenido de las secciones alineados al mismo eje vertical.

## 5. Radios y sombras

| Token                                       | Valor                          | Uso                       |
| ------------------------------------------- | ------------------------------ | ------------------------- |
| `--radius-card`                             | 20px                           | Cards                     |
| `--radius-input`                            | 12px                           | Inputs, selects           |
| `--radius-pill`                             | 999px                          | Botones, badges, píldoras |
| `--shadow-card`                             | `0 12px 32px -16px tinta/16 %` | Sombra base de cards      |
| `--shadow-lift`                             | `0 22px 44px -22px tinta/24 %` | Sombra al elevar          |
| `--shadow-push-edge` + `--shadow-push-cast` | borde sólido + sombra de suelo | Botón push (Hum)          |

## 6. Componentes base y estados

### Botón (shadcn `Button` + clase `btn--push`)

| Estado        | Comportamiento                                                          |
| ------------- | ----------------------------------------------------------------------- |
| default       | Fondo pera, texto tinta, borde sólido inferior (push) + sombra de suelo |
| hover         | Eleva `translateY(-2px)`, el borde crece a 6px, 140ms `--ease-out`      |
| active        | Presiona `translateY(3px)`, borde a 1px, 70ms                           |
| focus-visible | Anillo cian ≥ 3:1, aparece al instante (sin animar)                     |
| disabled      | Opacidad 50 %, `pointer-events: none`                                   |
| loading       | Spinner + label, min 300ms visibles                                     |
| error/success | Variantes según contexto (destructive coral / mint)                     |

Variantes: `default` (push pera, primario) · `secondary` (soft papel-2) · `outline` (hairline) · `ghost` · `destructive` (coral suave) · `link`. Un solo push por momento primario.

### Card (shadcn `Card`)

- Fondo papel, radio 20px, sombra `--shadow-card`.
- Hover: eleva 4px con `--shadow-lift` (solo en cards interactivas, con `@media (hover: hover)`).
- Tint de acento por card (color-shift): ~6 % del acento en reposo, ~12 % en hover.

### Input / Select / Calendar

- Radio 12px, borde papel-3, foco con anillo cian.
- Estados: default · hover · focus-visible · disabled · error (coral + mensaje + icono, nunca solo color) · success (mint).

### Tabs

- Subrayado deslizante `translateX`, 250ms `--ease-out`; el contenido hace crossfade, nunca anima altura.

### Badge

- Píldora, mono label 11px uppercase; variantes por acento (pera, cian, coral, mint, lavanda).

## 7. Iconografía

- **lucide-react** (bundled con shadcn/ui). Todos los iconos a 16–20px, stroke 2.
- Prohibido: emojis como iconos, iconos de stock genéricos en filas de features (se usan formas abstractas CSS/SVG por tarjeta).

## 8. Motion

| Elemento            | Movimiento                                                                       | Duración | Easing          |
| ------------------- | -------------------------------------------------------------------------------- | -------- | --------------- |
| Contadores KPI      | tick-up 0 → valor al entrar en viewport (animejs) + pulso de escala al completar | 1200ms   | `--ease-snap`   |
| Cards               | lift 4px + sombra (hover)                                                        | 220ms    | `--ease-spring` |
| Botón primario      | push/press (ver §6)                                                              | 140/70ms | `--ease-out`    |
| Secciones           | reveal translateY(12→0) + opacity, una vez                                       | 420ms    | `--ease-out`    |
| Star-burst          | microcelebración al exportar                                                     | 420ms    | ease-out        |
| Marquee (footer)    | scroll infinito, pausa en hover                                                  | 42s      | linear          |
| Personaje (mascota) | pulso suave en reposo                                                            | 4s       | `--ease-in-out` |

- `prefers-reduced-motion: reduce` → todo colapsa a crossfade ≤ 150ms; contadores muestran el valor final.
- Máximo 3 primitivas de animación por página; se anima solo `transform` y `opacity`.

## 9. Accesibilidad

- Hit targets ≥ 44×44px en táctil.
- Contraste: cuerpo ≥ 4.5:1, texto grande ≥ 3:1, bordes de UI ≥ 3:1.
- Estados nunca solo por color (icono + texto + patrón).
- `aria-live="polite"` en valores que cambian asíncronamente.
- `overflow-x: clip` en `html` y `body`; cero scroll horizontal a 320 / 375 / 414 / 768px.
