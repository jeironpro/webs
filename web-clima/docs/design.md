# Diseño del Tema Aurora

## Paleta de colores

- **Paper (oscuro)**: `oklch(15% 0.02 258)` → tonos nocturnos profundos.
- **Paper brillante**: `oklch(20-33% 0.024-0.03 258)` gradaciones.
- **Acento**: `oklch(85% 0.13 216)` cian-frío para Highlights.
- **Ink**: `oklch(62-94% 0.012-0.018 258)` neutros claros para texto.

## Tipografía

- **Display**: `Space Grotesk Variable` – geométrica, moderna.
- **Body**: `Inter Variable` – legible, varía pesos.
- **Mono**: `JetBrains Mono` – para labels y códigos.

## Espaciado

Escala de 4px: `--space-0` → `0`, `--space-1` → `.25rem`, ..., `--space-24` → `6rem`.

## Componentes UI

### Botón (geolocalización)

- Alto min-height 52px.
- Borde 1px, radio `pillar`.
- Transición de fondo, color, transform.
- Hover: `color-ink-0` sobre `color-accent-soft`.

### Nav pill (N5)

- Header sticky top.
- Pill con `backdrop-filter: blur(14px)`.
- Brand: "clima" + degree symbol.

### Artefactos

- `Hero` → `stat-led` style (título grande + valor numérico).
- `Grid` de métricas → 4 columnas, min-content labels.

## Responsividad

- `< 40rem`: todo scrollable vertical, botón ancho completo.
- `60rem+`: toolbar 2-columnas (buscador + botones).
- Grid de métricas 2 cols móvil.

## Interacciones

- Click en SearchBar → `handlePlace`.
- Click en geolocalizar → `geolocation.request()`.
- Hover en botones → cambio de color y borde.

## Accesibilidad

- `role="img"` + `aria-label` en WeatherIcon.
- `aria-hidden` en Skeleton.
- `role="alert"` en ErrorPanel.
- `aria-labelledby` en todas las secciones.
- Keyboard: Tab navigation, focus-visible styles.
