# Libro de estilo — Javarcises

> Documento de referencia para toda la interfaz web del proyecto **web-javarcises**.
> La dirección de diseño se actualizó: adaptación en **claro** del ejemplo **lumen-01** de
> Hallmark ("Cinder"), con tarjetas rediseñadas, estrellas de dificultad amarillas y badges
> de nivel con color distinto por nivel.

## 1. Proyecto y audiencia

- **Producto**: web estática que muestra los ejercicios de programación en Java del repo (`triviales/` y `problemas-diseno/`), con listado paginado, filtros y vista de detalle.
- **Audiencia**: estudiantes de programación (hispanohablantes) que practican Java; el sitio es un portafolio personal.
- **Personalidad de marca**: técnica, sobria, cálida. Evoca una ficha de laboratorio de alta gama: serif clásica para el display, mono para los datos, acento "latón fundido" (ámbar) y tarjetas con emisión radial sutil.

## 2. Dirección de diseño

**Lumen claro** — adaptación en claro del tema _Lumen_ de Hallmark (eje dark / classical-serif / warm-brass invertido a luz):

- **Navegación**: píldora flotante fija (patrón N5) con marca (punto ámbar + serif), enlaces de colección y CTA.
- **Hero**: titular serif con **pivote de verbo** (`<em>` con color y subrayado, sin itálica), eyebrow numerado en mono, lista de especificación clave/valor en mono y fondo de rejilla de blueprint.
- **Estadísticas**: banda con valores serif grandes, subrayado de acento y separadores hairline.
- **Tarjetas (fichas)**: hairline + **emisión radial ámbar** en la esquina superior, línea de acento superior que se expande en hover, elevación al pasar el cursor. Eyebrow mono en minúsculas, título serif, badge de nivel **con color propio por nivel** y estrellas de dificultad **amarillas**.
- **Pie (Ft5)**: declaración serif grande con fondo de rejilla y columnas de metadatos en mono.

## 3. Paleta

Colores definidos como custom properties en `:root` (formato **OKLCH**). Neutros con tinte violeta frío; el acento es **latón/ámbar**.

| Token                 | Valor OKLCH                   | Uso                                                               |
| --------------------- | ----------------------------- | ----------------------------------------------------------------- |
| `--color-paper`       | `oklch(0.975 0.008 265)`      | Fondo de página (papel violeta frío)                              |
| `--color-paper-2`     | `oklch(0.995 0.004 265)`      | Superficies de tarjetas, barra, paneles                           |
| `--color-paper-3`     | `oklch(0.945 0.012 263)`      | Fondos de código inline, pestaña activa del nav                   |
| `--color-rule`        | `oklch(0.89 0.012 265)`       | Líneas hairline                                                   |
| `--color-rule-2`      | `oklch(0.78 0.016 263)`       | Líneas en hover / bordes de inputs                                |
| `--color-muted`       | `oklch(0.52 0.012 263)`       | Etiquetas mono, metadatos                                         |
| `--color-neutral`     | `oklch(0.4 0.01 263)`         | Títulos de columna del pie                                        |
| `--color-ink-2`       | `oklch(0.36 0.016 262)`       | Texto secundario                                                  |
| `--color-ink`         | `oklch(0.22 0.02 262)`        | Texto principal                                                   |
| `--color-accent`      | `oklch(0.55 0.15 50)`         | Latón: botones, punto de marca, línea de tarjeta                  |
| `--color-accent-deep` | `oklch(0.46 0.14 50)`         | Texto acento sobre claro (eyebrows, enlaces)                      |
| `--color-accent-2`    | `oklch(0.5 0.15 30)`          | Pivote de verbo (`em`)                                            |
| `--color-accent-ink`  | `oklch(0.985 0.006 60)`       | Texto sobre acento                                                |
| `--color-focus`       | `oklch(0.55 0.15 50)`         | Anillo de `:focus-visible`                                        |
| `--color-glow`        | `oklch(0.65 0.15 50 / 0.35)`  | Resplandor del punto de marca                                     |
| `--color-paper-emit`  | `oklch(0.55 0.15 50 / 0.06)`  | Emisión radial de tarjetas (hover: `--color-paper-emit-2` / 0.12) |
| `--rule-blueprint`    | `oklch(0.22 0.02 262 / 0.05)` | Rejilla de fondo (hero y pie)                                     |
| `--color-star`        | `oklch(0.76 0.16 80)`         | **Estrellas de dificultad rellenas (amarillas)**                  |
| `--color-star-vacia`  | `oklch(0.83 0.01 265)`        | Estrellas vacías                                                  |

### Badges de nivel: paleta por nivel

Cada nivel (1–14) tiene su propio par fondo/tinta (`--nivel-N-bg` / `--nivel-N-ink`), fondos pastel con tinta legible. El badge se aplica con `badge--nivel-N`.

| Nivel | Fondo                  | Tinta                  |
| ----- | ---------------------- | ---------------------- |
| 1     | `oklch(0.93 0.09 70)`  | `oklch(0.42 0.13 50)`  |
| 2     | `oklch(0.93 0.09 110)` | `oklch(0.41 0.12 115)` |
| 3     | `oklch(0.93 0.08 150)` | `oklch(0.4 0.11 155)`  |
| 4     | `oklch(0.92 0.07 180)` | `oklch(0.39 0.09 185)` |
| 5     | `oklch(0.92 0.07 215)` | `oklch(0.39 0.09 220)` |
| 6     | `oklch(0.92 0.07 245)` | `oklch(0.39 0.1 250)`  |
| 7     | `oklch(0.92 0.07 265)` | `oklch(0.39 0.11 265)` |
| 8     | `oklch(0.92 0.08 290)` | `oklch(0.4 0.11 290)`  |
| 9     | `oklch(0.92 0.08 315)` | `oklch(0.4 0.11 315)`  |
| 10    | `oklch(0.93 0.08 340)` | `oklch(0.41 0.1 340)`  |
| 11    | `oklch(0.93 0.09 20)`  | `oklch(0.42 0.12 15)`  |
| 12    | `oklch(0.93 0.1 45)`   | `oklch(0.42 0.13 40)`  |
| 13    | `oklch(0.94 0.09 85)`  | `oklch(0.42 0.12 75)`  |
| 14    | `oklch(0.92 0.07 205)` | `oklch(0.39 0.09 210)` |

### Contraste

- Texto principal (`--color-ink`) sobre papel: **≥ 7:1**.
- Texto secundario (`--color-ink-2`): **≥ 4.5:1**.
- Texto sobre `--color-accent`: **≥ 4.5:1**.
- Tinta de badge sobre su fondo: **≥ 4.5:1**.
- El color nunca es el único canal de información (el nivel también se lee en el texto del badge y el número de la ficha).

## 4. Tipografía

Fuentes de Google Fonts (las del ejemplo lumen-01):

- **Display (serif)**: [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) (400, romana; la itálica solo como recurso puntual, no en titulares).
- **Cuerpo**: [Geist](https://fonts.google.com/specimen/Geist) (400, 500, 600).
- **Mono (etiquetas, números, código)**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (400, 500).

| Jerarquía           | Familia          | Tamaño                                   | Peso | Caso                                |
| ------------------- | ---------------- | ---------------------------------------- | ---- | ----------------------------------- |
| Título de hero      | Instrument Serif | `clamp(2.5rem, 5vw + 1rem, 4.5rem)`      | 400  | Normal                              |
| Título de sección   | Instrument Serif | `clamp(2.25rem, 3.75vw + 1rem, 3.75rem)` | 400  | Normal                              |
| Título de ficha     | Instrument Serif | `1.375rem`                               | 400  | Normal                              |
| Eyebrow             | JetBrains Mono   | `11px`                                   | 400  | Mayúsculas, `letter-spacing: 0.1em` |
| Etiqueta de sección | JetBrains Mono   | `11px`                                   | 500  | Mayúsculas                          |
| Cuerpo              | Geist            | `1rem`                                   | 400  | Normal                              |
| Código              | JetBrains Mono   | `0.875rem`                               | 400  | —                                   |

Reglas: los titulares serif van en **romana**; el énfasis se lleva con el **pivote de verbo** (`em` con color `--color-accent-2` y subrayado dibujado, `font-style: normal`), nunca con itálica en encabezados.

## 5. Espaciados, grilla y radios

- **Escala Lumen**: `--space-2xs: 0.25rem` … `--space-3xl: 6.5rem` (0.25 / 0.5 / 0.75 / 1 / 1.5 / 2.5 / 4 / 6.5 rem).
- **Ancho máximo**: `--page-max: 80rem`; gutter `clamp(1.25rem, 4vw, 3rem)`; medida de lectura `60ch`.
- **Grilla de fichas**: `grid-template-columns: minmax(0, 1fr)` con `gap: 1rem`; 2 columnas desde 720px y 3 desde 960px.
- **Radios**: `--radius-card: 10px` (tarjetas, paneles), `--radius-pill: 999px` (botones, badges, pestañas, paginación), `--radius-input: 8px`.
- **Elevación**: hairline por defecto; `--shadow-card` solo en hover de tarjetas y en la píldora del nav.

## 6. Iconografía

- **Material Symbols** (Google), estilo _outlined_, tamaño base `1.25rem`.
- Cada icono es un `<span class="material-symbols-outlined icono" aria-hidden="true">` con el nombre del glifo como texto.
- **Prohibido incrustar emojis** en la UI o el código. Las estrellas de dificultad se dibujan con el glifo `star` **relleno en amarillo** (`--color-star`, `FILL 1`) y vacío en `--color-star-vacia` (`FILL 0`).

## 7. Componentes base y estados

### Píldora de navegación (N5)

Fija arriba al centro, `backdrop-filter: blur(22px)`, borde hairline, radio píldora. Marca = punto ámbar con resplandor + wordmark serif. Enlaces de colección con estado activo (fondo `--color-paper-3`); en ≤ 920px se ocultan los enlaces.

### Botones

- **Primario** (`btn btn--acento`, fondo latón, texto `--color-accent-ink`): hover con elevación de 1 px y aclarado; `:focus-visible` con anillo.
- **Fantasma** (`btn btn--fantasma`): transparente, borde `--color-rule-2`; hover aclara el borde.
- Área táctil mínima 44 px; el texto nunca ocupa dos líneas.

### Badge de nivel

Píldora mono en mayúsculas con **color propio por nivel** (`badge--nivel-N`); se usa en tarjetas y en la especificación del detalle.

### Ficha (tarjeta de ejercicio)

- Hairline + radio 10 px; fondo con **emisión radial ámbar** en la esquina superior (`--color-paper-emit`).
- Línea de acento superior de 32 px que se **expande al 100 % en hover**; hover eleva la tarjeta 4 px y refuerza la emisión (`--color-paper-emit-2`).
- Estructura: eyebrow (`ejercicio 001` / `problema 001`, mono minúscula ámbar) → título serif → categoría (solo problemas) → fila de metadatos (badge de nivel + estrellas a la derecha) → chips de temas → "ver ficha" al pie (anclado abajo con `margin-top: auto`).
- Dificultad: **estrellas amarillas** (`FILL 1`), vacías en gris.

### Paginación

Botones píldora; página activa con fondo latón y texto claro; anterior/siguiente se deshabilitan en los extremos; elipsis en mono. Texto auxiliar "Mostrando X–Y de N" como etiqueta mono.

### Inputs (nivel y búsqueda)

`label` asociado (`for`/`id`), radio 8 px, borde `--color-rule-2`; foco con anillo `--color-focus`. El placeholder nunca es la única indicación.

### Bloques de código

Panel claro `--color-paper-2` con hairline, radio 10 px y emisión radial; **cabecera opcional** con etiqueta en mono (lenguaje, p. ej. `java`) sin chrome falso; cuerpo en `--color-ink-2` con scroll horizontal si excede.

### Pistas (detalle)

`<details>`/`<summary>` nativos estilizados como tarjeta; el summary usa mono en mayúsculas con icono de bombilla.

## 8. Accesibilidad y responsive

- Landmarks semánticos (`header`, `nav`, `main`, `section`, `footer`), enlace "Saltar al contenido", `lang="es"`.
- Foco visible en todos los elementos interactivos (`:focus-visible`).
- `overflow-x: clip` en `html` y `body`; sin scroll horizontal a 320 / 375 / 414 / 768 px.
- Rejillas con `minmax(0, 1fr)`; los títulos largos envuelven con `overflow-wrap: anywhere`.
- `prefers-reduced-motion: reduce` desactiva transiciones, animaciones y el desplazamiento suave.
- El orden del DOM respeta el orden de lectura/tabulación.

## 9. Tokens de referencia (CSS)

```css
:root,
[data-theme="lumen"] {
    /* paleta (ver tabla §3), badges por nivel, estrellas amarillas */
    --font-display: "Instrument Serif", ui-serif, Georgia, serif;
    --font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
    --font-label: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
    --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
    --text-display: clamp(2.5rem, 5vw + 1rem, 4.5rem);
    --space-2xs: 0.25rem;
    --space-md: 1rem;
    --space-xl: 2.5rem;
    --space-3xl: 6.5rem;
    --radius-card: 10px;
    --radius-pill: 999px;
    --radius-input: 8px;
    --page-max: 80rem;
}
```

Todos los colores y fuentes del CSS deben referenciar estos tokens; no se permiten valores hex/OKLCH sueltos fuera de `:root`.
