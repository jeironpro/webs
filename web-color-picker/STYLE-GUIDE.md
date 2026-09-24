# Style Guide — Color Picker

## Identidad Visual

Color picker web con estética neutra, limpia y funcional. Sin dependencias visuales externas.

## Paleta de Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#d4d4d4` | Fondo de página |
| `--color-surface` | `#e6e6e6` | Superficies (panel picker, floating bar bg) |
| `--color-surface-hover` | `#d8d8d8` | Hover de superficies |
| `--color-text` | `#1e1e1e` | Texto principal |
| `--color-text-secondary` | `rgba(0,0,0,0.45)` | Texto secundario (etiquetas) |
| `--color-border` | `rgba(0,0,0,0.08)` | Bordes y separadores |
| `--color-focus` | `#2563eb` | Outline de foco (accesibilidad) |

El color display usa texto dinámico: blanco (`#ffffff`) sobre colores oscuros, gris oscuro (`#1a1a1a`) sobre colores claros. Determinado por `getLuminance()`.

## Tipografía

### Fuentes

| Uso | Fuente | Fallbacks |
|-----|--------|-----------|
| Texto general | `DM Sans` | `system-ui, -apple-system, sans-serif` |
| Números y valores | `JetBrains Mono` | `Fira Code, monospace` |

### Tamaños

Texto general: `16px` base. Monospace: `0.8125rem` (13px) en inputs de valores, `0.9375rem` (15px) en input HEX.

## Espaciado

| Token | Valor |
|-------|-------|
| `--spacing-xs` | `0.25rem` (4px) |
| `--spacing-sm` | `0.5rem` (8px) |
| `--spacing-md` | `1rem` (16px) |
| `--spacing-lg` | `2rem` (32px) |
| `--spacing-xl` | `4rem` (64px) |

## Bordes

| Token | Valor |
|-------|-------|
| `--border-radius-sm` | `4px` |
| `--border-radius-md` | `8px` |
| `--border-radius-lg` | `12px` |

## Layout

### Desktop (>768px)
- Grid de dos columnas: 40fr (color display) / 60fr (color picker)
- Floating bar fija al bottom: 68px de alto, 4 valores en fila
- Color picker padding: `var(--spacing-xl)` bottom extendido por floating bar

### Móvil (≤768px)
- Grid apilado: 1fr (color display) / 3fr (color picker)
- Floating bar: 2 filas × 2 columnas, wrap, altura automática
- Canvas SV limitado a `max-width: 320px`
- Padding reducido a `var(--spacing-md)`

### Móvil muy pequeño (≤480px)
- Canvas SV limitado a `max-width: 240px`
- Hue canvas a 20px de alto
- Iconos de copia ocultos en floating bar (`display: none`)

## Componentes

### Color Display (panel izquierdo)
- Fondo dinámico: `background-color` se actualiza con el color seleccionado
- Overlay con `backdrop-filter: blur(6px)` sobre fondo semitransparente
- Muestra valor HEX (blanco sobre colores oscuros, gris sobre claros)
- Click: copia HEX al portapapeles
- Micro-interacción: escala 1.05 en hover, 0.95 en active

### Canvas SV (selector saturación/valor)
- Cuadrado responsivo: aspect-ratio 1, max-width 480px
- Generado por píxel con `createImageData` para cada matiz
- Indicador circular: blanco con borde semitransparente

### Canvas Hue (selector de matiz)
- Gradiente horizontal: rojo → amarillo → verde → cian → azul → magenta → rojo
- 28px de alto (24px móvil, 20px muy pequeño)
- Indicador triangular apuntando hacia abajo

### Sliders RGB
- Grid de 3 columnas: label (32px) | slider (1fr) | valor (40px)
- Colores de fondo dinámicos según el canal
- Thumb circular con sombra y escala en hover

### Input HEX
- Label "HEX" + input de texto (max 7 chars)
- Placeholder `#RRGGBB`
- Se actualiza al perder el foco o presionar Enter

### Floating Bar (valores inferiores)
- Fixed al bottom, 68px de alto en desktop
- 4 grupos (RGB, CMYK, HSV, HSL) en fila con separadores
- Cada grupo: label + fila con botón de copia + input editable
- Inputs con fuente monospace, sin borde, focus con borde visible
- En móvil: 2×2 grid, altura auto, iconos ocultos en ≤480px

## Animaciones y Transiciones

| Elemento | Propiedad | Duración | Timing |
|----------|-----------|----------|--------|
| Color display background | `background-color` | `250ms` | `ease` |
| Color display info hover | `transform` | `150ms` | `ease` |
| Icono copia active | `transform` | `100ms` | `ease` |
| Tooltip opacidad | `opacity` | `150ms` | `ease` |
| Input focus/hover | `background` | `150ms` | `ease` |

## Responsive Breakpoints

| Breakpoint | Tipo |
|------------|------|
| 1024px | Tableta (padding reducido, layout 35/65) |
| 768px | Móvil vertical (layout apilado, floating bar 2×2) |
| 480px | Móvil muy pequeño (canvas reducido, sin iconos) |
| 500px height+landscape | Móvil horizontal (layout filas) |

## Modo de Movimiento Reducido

Si `prefers-reduced-motion: reduce` está activo:
- Todas las animaciones y transiciones se reducen a `0.01ms`
- Scroll-behavior: auto

## Accesibilidad

- Skip link para saltar navegación
- `:focus-visible` con outline azul `#2563eb` + offset 2px
- Roles y aria-labels en todos los controles
- `visually-hidden` para contenido accesible
- Tooltip con `role="status"` y `aria-live="polite"`
- Contraste suficiente en todos los estados
- Inputs editables con `aria-label` descriptivo

## Convenciones de Código

- Sin `innerHTML`/`innerText`/`outerHTML`
- Comentarios en español
- Sin emojis inline (usar SVGs)
- ES modules sin bundler
- CSS con Custom Properties y media queries
- HTML semántico con landmarks

## Rendimiento

- Canvas generados con ImageData para evitar reflows
- Módulos JS sin dependencias externas pesadas
- Google Fonts con preconnect y display=swap
- Sin librerías CSS ni JS de terceros
