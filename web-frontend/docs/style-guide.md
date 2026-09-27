# Libro de estilo — Catálogo Frontend

Libro de estilo del sitio (tema **Hum** de Hallmark, adaptado). Fuente única de los valores: `css/tokens.css`.

## Paleta de colores

| Token | OKLCH | Hex aprox. | Uso |
| --- | --- | --- | --- |
| `--color-paper` | `oklch(97% 0.012 95)` | `#F7F4E8` | Fondo principal (crema, nunca blanco puro) |
| `--color-paper-2` | `oklch(94% 0.016 95)` | `#EFEBD8` | Banda teñida |
| `--color-paper-3` | `oklch(91% 0.020 95)` | `#E6E1C8` | Hover profundo |
| `--color-ink` | `oklch(22% 0.012 250)` | `#1F2430` | Texto principal (nunca negro puro) |
| `--color-ink-2` | `oklch(38% 0.02 250)` | `#4A5468` | Texto secundario |
| `--color-ink-3` | `oklch(52% 0.02 250)` | `#6B7689` | Metadatos / captions |
| `--color-accent` | `oklch(86% 0.18 95)` | `#F0C94A` | Pera — acción primaria |
| `--color-accent-2` | `oklch(66% 0.18 235)` | `#4FA8D8` | Cian — bandas y enlaces |
| `--color-accent-3` | `oklch(68% 0.24 18)` | `#F0734F` | Coral — momento único (contador, estrella) |
| `--color-mint` | `oklch(80% 0.16 150)` | `#A8E0C0` | Éxito (ocasional) |
| `--color-lavender` | `oklch(74% 0.16 305)` | `#B8A6E0` | Decorativo (ocasional) |

Regla de acentos: cada acento tiene su propia superficie. Pera = acción primaria, cian = bandas/enlaces, coral = un solo momento por página. No se mezclan acentos en degradados.

## Tipografía

- **Display y cuerpo:** Plus Jakarta Sans (400 / 500 / 600 / 700). Sin serifas.
- **Etiquetas / números:** JetBrains Mono (400 / 500), en mayúsculas con tracking.
- Títulos: peso 600, `letter-spacing: -0.025em`, siempre romanos (nunca cursiva).
- Escala: `--text-4xl` (hero) → `--text-xs` (metadatos), en `css/tokens.css`.

## Espaciado y grilla

- Escala de 4 pt: `--space-2xs` (0.25rem) → `--space-4xl` (6rem).
- Una sola caja de contenido (`--shell: 76rem`) con gutter `--page-gutter`; todos los bordes de sección coinciden.
- Cuadrícula del catálogo: 1 columna (móvil) → 2 (≥40rem) → 3 (≥60rem). Tracks con `minmax(0, 1fr)`.

## Componentes base

### Botón (`.btn`)

Tres variantes: **push** (borde de color sólido + sombra), **soft** (elevación plana) y **outline** (hairline). Estados:

- default · hover (sube 2 px) · `:focus-visible` (anillo ≥3:1) · `:active` (presiona 3 px) · disabled.
- Radios: pill (`--radius-pill`). Sin `scale()`, sin rebote.

### Filtro (`.filter-chip`)

Píldora mono en mayúsculas. Estado activo: fondo pera + borde profundo + sombra. Estados: default · hover · focus-visible · activo.

### Tarjeta de proyecto (`.project-card`)

Galería de cambio de color: cada tarjeta usa un acento distinto (pera · cian · coral · menta · lavanda, en ciclo). Reposo al ~8% del acento; hover profundiza al ~14% y eleva 4 px. Radio `--radius-card` (20 px).

## Iconografía

- **Material Symbols Rounded** (Google) para todos los iconos de interfaz.
- Sin emojis en la UI ni en el código.
- Marcas decorativas (personaje `</>`, estrella coral) dibujadas en CSS/SVG.

## Movimiento

- `--ease-spring` (rebote suave, solo para tarjetas), `--ease-snap` (contadores), `--ease-out` / `--ease-in-out`.
- Solo se anima `transform` y `opacity`.
- `prefers-reduced-motion: reduce`: sin contadores animados, sin marquesina, sin estrella.
