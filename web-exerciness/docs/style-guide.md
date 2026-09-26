# Libro de estilo de exerciness — Hum

Locked design system. Generado desde `design.md`. Every page uses this system.

## 1. Identidad y marca

- **Nombre**: exerciness
- **Concepto**: energía cálida, amable, viva. Multi-accento Hum: pear + cyan + coral.
- **Idioma**: español.
- **Iconografía**: Material Symbols Rounded. Prohibido el uso de emojis en el código.
- **Display**: Plus Jakarta Sans 600, tracking -0.025em.
- **Body**: Plus Jakarta Sans 400.
- **Mono**: JetBrains Mono (etiquetas, badges, stats en uppercase).

## 2. Paleta de colores (OKLCH)

Ver `src/styles/tokens.css` para los valores completos. Claro y oscuro se definen
con OKLCH, mapeados en Tailwind vía `oklch(var(--color-*) / <alpha-value>)`.

| Token              | Claro (L C H) | Oscuro (L C H) | Uso                     |
| ------------------ | ------------- | -------------- | ----------------------- |
| `--color-paper`    | 97% 0.012 95  | 22% 0.010 250  | Fondo de página         |
| `--color-paper-2`  | 94% 0.016 95  | 26% 0.012 250  | Fondos alternos         |
| `--color-ink`      | 20% 0.012 250 | 92% 0.010 95   | Texto principal         |
| `--color-ink-2`    | 35% 0.016 250 | 80% 0.015 95   | Texto secundario        |
| `--color-rule`     | 85% 0.025 95  | 30% 0.012 250  | Bordes y separadores    |
| `--color-accent`   | 86% 0.18 95   | 86% 0.18 95    | Acción primaria (pear)  |
| `--color-accent-2` | 66% 0.18 235  | 66% 0.18 235   | Enlaces, hover (cyan)   |
| `--color-accent-3` | 68% 0.24 18   | 68% 0.24 18    | Momento de alta energía |
| `--color-mint`     | 80% 0.16 150  | 80% 0.16 150   | Éxito                   |
| `--color-lavender` | 74% 0.16 305  | 74% 0.16 305   | Decoración ocasional    |
| `--color-focus`    | 66% 0.18 235  | 70% 0.22 235   | Foco visible            |

### Reglas de acentos

1. Cada acento tiene su superficie: pear = acción primaria, cyan = hover/enlaces, coral = un único momento de alta energía por página.
2. Sin gradientes entre acentos.
3. Mint y lavender son ocasionales (máximo uno de cada por página).
4. Sin blanco puro (paper siempre cream: 97% 0.012 95).
5. Sin negro puro (ink siempre 20% 0.012 250 como mínimo).

## 3. Tipografía

- **Display / Body**: Plus Jakarta Sans (400/500/600/700). Rounded humanist sans.
- **Mono**: JetBrains Mono (400/500) para labels en uppercase.
- Sin serif en ninguna parte.

| Rol                   | Tamaño / clamp                  | Peso | Familia |
| --------------------- | ------------------------------- | ---- | ------- |
| Hero (Marquee)        | clamp(2.5rem, 6vw+1rem, 5.5rem) | 600  | Display |
| Título de página (h1) | 2.25rem (text-3xl)              | 600  | Display |
| Sección (h2)          | 1.5rem (text-2xl)               | 600  | Display |
| Cuerpo                | 1rem (text-base)                | 400  | Body    |
| Texto secundario      | 0.875rem (text-sm)              | 400  | Body    |
| Etiqueta/caption      | 0.75rem (text-xs) + uppercase   | 400  | Mono    |

## 4. Espaciado

Escala 4-point nombrada. Usar tokens CSS (`var(--space-md)`) o clases Tailwind equivalences.

`--space-3xs: 0.25rem` · `--space-2xs: 0.5rem` · `--space-xs: 0.75rem` ·
`--space-sm: 1rem` · `--space-md: 1.5rem` · `--space-lg: 2rem` ·
`--space-xl: 3rem` · `--space-2xl: 4.5rem` · `--space-3xl: 7rem`

- Tarjetas: padding `p-4`.
- Separación entre secciones: `py-12` / `py-16`.
- Contenedor: `max-w-7xl` con padding lateral `px-4 sm:px-6 lg:px-8`.

## 5. Radios y sombras

| Token            | Valor | Uso                    |
| ---------------- | ----- | ---------------------- |
| `--radius-card`  | 20px  | Tarjetas, contenedores |
| `--radius-pill`  | 999px | Botones, badges        |
| `--radius-input` | 12px  | Inputs, selects        |

| Sombra        | Valor                                           |
| ------------- | ----------------------------------------------- |
| `shadow-soft` | `0 12px 32px -16px oklch(20% 0.012 250 / 0.12)` |
| `shadow-lift` | `0 16px 40px -12px oklch(20% 0.012 250 / 0.18)` |

## 6. Botones (sistema Hum)

Ver `src/styles/components/button.css`. Tres variantes:

- **Push (`.btn`)**: fondo pear, color edge en la base, sombra de tierra. Lift 2px hover, press 3px active.
- **Soft (`.btn--soft`)**: fondo cyan 12%, sin edge. Para acciones secundarias.
- **Outline (`.btn--outline`)**: borde rule, hover se llena pear 8%.

## 7. Iconografía

- Fuente: Material Symbols Rounded.
- Componente `<Icon name="..." size={...} />`.
- Tamaños: 20px (acciones), 22px (nav), 24px (hero), 40px (estados vacíos).

## 8. Inventario de componentes UI

| Componente     | Variantes                                                  | Uso                        |
| -------------- | ---------------------------------------------------------- | -------------------------- |
| `Button`       | primary, secondary, outline, ghost · sm/md/lg/xl · loading | Acciones                   |
| `Card`         | —                                                          | Contenedores (radius 20px) |
| `Badge`        | default, primary, secondary, pop, mint, lavender           | Etiquetas (uppercase mono) |
| `Spinner`      | —                                                          | Cargas                     |
| `EmptyState`   | icon, title, description, action                           | Estados vacíos             |
| `SearchInput`  | value, onChange                                            | Búsqueda                   |
| `FilterSelect` | label, value, onChange, options                            | Filtros                    |
| `ThemeToggle`  | —                                                          | Cambio de tema             |

## 9. Macroestructuras por página

| Ruta             | Página         | Macroestructura | Notas                    |
| ---------------- | -------------- | --------------- | ------------------------ |
| `/`              | Home           | Marquee Hero    | Character moment CSS     |
| `/ejercicios`    | Exercises      | Catalogue       | Color-shift card grid    |
| `/favoritos`     | Favorites      | Catalogue       | Mismo que Exercises      |
| `/ejercicio/:id` | ExerciseDetail | Long Document   | Prosa single-column 65ch |
| `/comparar`      | Compare        | Spec-sheet      | Tabla de comparación     |
| `*`              | NotFound       | Statement       | Mínimo, sin adornos      |

## 10. Reglas de uso

1. **Siempre tokens OKLCH**, nunca colores hardcodeados.
2. **Sistema bloqueado**: toda página nueva lee `design.md` primero.
3. **Sin serif** en ninguna parte. Sin blanco puro. Sin negro puro.
4. **Sin emojis** en el código; se usa `<Icon />`.
5. **Accesibilidad**: foco visible (`focus-visible` con outline de 3px), contraste AA.
6. **Motion**: prefers-reduced-motion: reduce → opacity-only, ≤ 150ms.
