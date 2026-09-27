# Libro de estilo — Puntos y Cajas

## Propósito

Este documento define el sistema de diseño del juego Puntos y Cajas. Es la única
fuente de verdad para colores, tipografía, espaciados y componentes base: cualquier
valor visual nuevo debe derivarse de aquí y materializarse como _custom property_ de
CSS en `src/styles/tokens.css`.

## Referencia visual

La dirección visual toma como referencia la estética del estudio de diseño
[dsgn-dept.com](https://www.dsgn-dept.com/): una estética **editorial y de imprenta**,
limpia y silenciosa, con mucho aire blanco, tipografía serif de carácter para los
títulos, etiquetas en mayúsculas con tracking, líneas finas (hairlines) y un único
acento de color contenido. Se evita todo lo decorativo: cada elemento visual cumple
una función.

## 1. Paleta de colores

### Papel y tinta

| Token                    | Hex       | Uso                                   |
| ------------------------ | --------- | ------------------------------------- |
| `--color-bg`             | `#FAF8F5` | Fondo general: tono de papel cálido   |
| `--color-surface`        | `#FFFFFF` | Superficies elevadas (cards, paneles) |
| `--color-text-primary`   | `#1A1A1A` | Texto principal: tinta                |
| `--color-text-secondary` | `#6E6A63` | Texto secundario (subtítulos, ayudas) |
| `--color-border`         | `#E5E1DA` | Hairlines: bordes y divisores         |

### Acento editorial

| Token                   | Hex       | Uso                                            |
| ----------------------- | --------- | ---------------------------------------------- |
| `--color-accent`        | `#E4572E` | Acento bermellón: hover, resaltados, jugador 2 |
| `--color-accent-hover`  | `#C93F1D` | Hover de elementos de acento                   |
| `--color-accent-subtle` | `#FDF0EB` | Fondos suaves de acento (badges, selección)    |

### Jugadores

| Token              | Hex       | Uso                   |
| ------------------ | --------- | --------------------- |
| `--color-player-1` | `#2E51D4` | Jugador 1 (TÚ): azul  |
| `--color-player-2` | `#D4362A` | Jugador 2 (BOT): rojo |

### Estados de feedback

| Token             | Hex       | Uso                                   |
| ----------------- | --------- | ------------------------------------- |
| `--color-success` | `#2E7D4F` | Éxito (victorias, mensajes positivos) |
| `--color-error`   | `#C02F1D` | Error (jugadas inválidas)             |
| `--color-warning` | `#A66A13` | Advertencia (avisos)                  |

### Tablero

| Token                | Hex       | Uso                                |
| -------------------- | --------- | ---------------------------------- |
| `--color-dot`        | `#1A1A1A` | Puntos de la grilla                |
| `--color-edge-empty` | `#D8D3CA` | Aristas sin jugar (hairline tenue) |
| `--color-edge-hover` | `#E4572E` | Arista bajo el cursor              |

Las aristas colocadas se pintan con el color del jugador; cuando una de las cajas
que delimitan se completa, la arista pasa a tinta (negra). Las cajas completadas se
rellenan por completo con el color del jugador que las completó.

## 2. Tipografía

- **Display**: `Fraunces` (Google Fonts), serif editorial con _optical sizing_.
  Se usa para el título del juego y encabezados. Token: `--font-family-display`.
- **Base**: `Inter` (Google Fonts) con fallback `system-ui, -apple-system, sans-serif`.
  Se usa para el resto de la interfaz. Token: `--font-family-base`.
- **Etiquetas**: en mayúsculas con tracking `0.08em`, peso semibold: es la firma
  tipográfica del estilo editorial.

| Nivel     | Token                  | Tamaño | Peso | Uso                            |
| --------- | ---------------------- | ------ | ---- | ------------------------------ |
| Display   | `--font-size-display`  | 40px   | 500  | Título del juego               |
| Título    | `--font-size-title`    | 24px   | 500  | Títulos de pantalla            |
| Subtítulo | `--font-size-subtitle` | 18px   | 600  | Subtítulos, nombres de jugador |
| Cuerpo    | `--font-size-body`     | 16px   | 400  | Texto general                  |
| Label     | `--font-size-label`    | 13px   | 600  | Etiquetas, botones, marcador   |
| Caption   | `--font-size-caption`  | 12px   | 400  | Ayudas, metadatos              |

- Interlineado de títulos: 1.2; de cuerpo: 1.5.

## 3. Espaciado y grilla

- **Escala de espaciado** (base 4px): `xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24,
  `xxl` 32, `xxxl` 48, `xxxxl` 64.
- **Grilla**: la interfaz se compone en una columna central estrecha (contenido
  centrado, ancho máximo ~480px) que enmarca el tablero; el tablero usa su propia
  grilla interna (6x6 puntos, 5x5 cajas).
- **Breakpoints** (mobile-first, `min-width`):

| Breakpoint | Valor  |
| ---------- | ------ |
| `sm`       | 640px  |
| `md`       | 768px  |
| `lg`       | 1024px |

> Nota: los breakpoints se documentan como referencia, pero las media queries usan el
> valor literal (`@media (min-width: 768px)`), porque CSS no permite `var()` dentro
> de media queries.

## 4. Radios, sombras y elevación

| Token           | Valor                          | Uso                                |
| --------------- | ------------------------------ | ---------------------------------- |
| `--radius-sm`   | 4px                            | Inputs, badges, elementos pequeños |
| `--radius-md`   | 8px                            | Botones                            |
| `--radius-lg`   | 12px                           | Cards, paneles                     |
| `--radius-full` | 9999px                         | Píldoras, avatares                 |
| `--shadow-sm`   | `0 1px 2px rgb(0 0 0 / 4%)`    | Bordes suaves                      |
| `--shadow-md`   | `0 2px 8px rgb(0 0 0 / 6%)`    | Cards en reposo                    |
| `--shadow-lg`   | `0 12px 32px rgb(0 0 0 / 10%)` | Modales y elementos flotantes      |

La estética editorial tiende a lo plano: las sombras se usan con mesura.

## 5. Componentes base

### Botones

- **Primario**: fondo `--color-text-primary` (tinta), texto `--color-bg`, label en
  mayúsculas. _hover_: fondo `--color-accent`. _active_: fondo `--color-accent-hover`.
- **Secundario**: fondo transparente, borde `--color-border`, texto
  `--color-text-primary`. _hover_: borde `--color-text-primary`.
- **Ghost**: sin fondo ni borde, texto `--color-text-primary`. _hover_: texto
  `--color-accent`.
- _disabled_: opacidad 0.4, sin sombra, cursor `not-allowed`.
- Todos los botones muestran anillo de foco `--focus-ring` en `:focus-visible` y un
  área táctil mínima de 44x44px.

### Cards

- Fondo `--color-surface`, borde `--color-border`, radio `--radius-lg`, sombra
  `--shadow-md`, padding `--spacing-xxl`. Se usan para el menú y paneles.

### Badges

- Fondo `--color-accent-subtle`, texto `--color-accent`, radio `--radius-full`,
  padding `--spacing-xs` `--spacing-md`, peso semibold, label en mayúsculas.

### Marcador

- Nombres y contadores en label mayúsculas; separador `VS` con hairlines a ambos
  lados; el jugador en turno se resalta con el color del jugador correspondiente.

## 6. Iconografía

- Se usa la librería **Material Symbols** (Google), variante _Rounded_.
- No se incrustan emojis en la interfaz ni en el código: cualquier icono se renderiza
  como glifo de Material Symbols.

## 7. Accesibilidad

- Contraste: los textos cumplen WCAG AA sobre su fondo.
- Foco visible: todos los elementos interactivos muestran `--focus-ring`.
- Área táctil mínima: 44x44px en controles táctiles.
- Los elementos interactivos usan etiquetas nativas (`button`, `a`, `label`) y
  `aria-label` descriptivos; las imágenes informativas llevan `alt` y las decorativas
  `alt=""`.
- Las aristas del tablero son botones nativos con `aria-label` que describe su
  posición (fila/columna).

## 8. Implementación

Los tokens se definen como _custom properties_ en `src/styles/tokens.css` y se
consumen en todo el proyecto; no se repiten valores hex ni píxeles sueltos fuera de
ese archivo. La nomenclatura de clases CSS sigue **BEM**
(`bloque__elemento--modificador`).
