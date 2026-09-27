# Libro de estilo — Nexo · Consola de administración

Sistema de diseño **Cobalt** (género _modern-minimal_, tono _technical_): papel
frío de ingeniería, un único acento cobalto y hairlines en lugar de sombras.
Todos los valores viven en [`tokens.css`](../tokens.css) como custom properties
y se consumen por nombre (nunca se repiten valores sueltos en los componentes).

## Paleta

| Token                | OKLCH                    | Aprox. hex | Uso                      |
| -------------------- | ------------------------ | ---------- | ------------------------ |
| `--color-paper`      | `oklch(98.5% 0.004 250)` | `#fafafd`  | Superficie base          |
| `--color-paper-2`    | `oklch(96% 0.006 250)`   | `#f2f3f8`  | Superficie sutil / hover |
| `--color-paper-3`    | `oklch(93% 0.007 250)`   | `#e7e9f0`  | Secondary                |
| `--color-rule`       | `oklch(90% 0.006 250)`   | `#dcdde6`  | Hairline suave           |
| `--color-rule-2`     | `oklch(84% 0.008 250)`   | `#c6c9d6`  | Bordes de controles      |
| `--color-muted`      | `oklch(46% 0.012 255)`   | `#5b5e6e`  | Texto secundario         |
| `--color-ink-2`      | `oklch(34% 0.018 257)`   | `#33364a`  | Texto de cuerpo          |
| `--color-ink`        | `oklch(24% 0.020 258)`   | `#1c1e2b`  | Títulos                  |
| `--color-accent`     | `oklch(58% 0.20 256)`    | `#2f5bff`  | Acento cobalto (≤5 %)    |
| `--color-accent-ink` | `oklch(99% 0.002 250)`   | `#ffffff`  | Texto sobre acento       |
| `--color-graphite`   | `oklch(22% 0.016 260)`   | `#1a1b27`  | Banda oscura / código    |
| `--color-success`    | `oklch(62% 0.15 155)`    | `#2e9e5b`  | Éxito                    |
| `--color-warning`    | `oklch(66% 0.14 75)`     | `#c9922b`  | Advertencia              |
| `--color-error`      | `oklch(58% 0.20 25)`     | `#d43a3a`  | Error                    |

El acento es un **marcador**, no un bloque: item activo del menú, anillo de
focus, subrayado de enlaces al hover y el botón primario. Nunca como fondo de
una sección entera.

## Tipografía

Regla 2+1 (máximo tres familias):

- **Display** — Space Grotesk (500–700), tracking `-0.02em`. Títulos `h1`–`h5`.
- **Body** — Inter (400/500), `line-height 1.5`, medida ≤ 65ch.
- **Outlier** — JetBrains Mono (400–600). Solo dos roles: _etiquetas en mayúsculas_
  (`.mono-label`, `0.06em`) y _valores numéricos/código_ (`.tabular`).

Escala 1.25 desde 16 px: `--text-xs` … `--text-display` (clamp hasta 2.5rem).

## Espaciado y grilla

Escala 4 pt (`--space-1` = 4 px … `--space-16` = 64 px). Breakpoints
mobile-first en `rem`: 40rem (~640 px), 60rem (~960 px), 90rem (~1440 px).

## Componentes base (estados mínimos)

- **Botón primario**: acento cobalto, radio 6 px (`rounded-md`). Estados:
  default · hover (oscurece) · focus (`:focus-visible`, anillo 2 px) · active
  (presiona 1 px) · disabled (opacidad 0.5 + `not-allowed`).
- **Botón secundario**: borde `--color-rule-2`, fondo papel.
- **Input**: borde 1 px constante en **todos** los estados (sin cambio de
  geometría), foco por `outline` reservado de 2 px, error con texto de ayuda +
  `aria-invalid`.
- **Card**: hairline `--color-rule-2`, radio 10 px, sin sombras.
- **Badge/estado**: mono-label + tinte semántico suave (error/warning/success).
- **Tabla**: filas separadas por hairline; en móvil se colapsa a tarjetas.

## Iconografía

**lucide-react** (integrada con shadcn/ui). Sin emojis en la UI.

## Movimiento

animejs para tres momentos firmados: _contador de métricas_, _entrada escalonada
de secciones_ y _crecimiento de barras de gráficos_. Todo respeta
`prefers-reduced-motion: reduce`. Microinteracciones (hover, foco, modales)
viajan por transiciones CSS con `--ease-out` / `--ease-in` y duraciones
`--dur-micro` / `--dur-short` / `--dur-long`.

## Responsive

Verificación obligatoria en 320 / 375 / 414 / 768 px: sin scroll horizontal
(`overflow-x: clip`), sin texto clicable a dos líneas, tablas → tarjetas en
móvil, sidebar → panel deslizable con overlay.
