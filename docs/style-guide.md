# Guia de estilo

Documento de diseno del catalogo de webs. Este libro de estilo es el contrato de diseno que consumira el catalogo: toda variable visual vive en tokens (CSS custom properties) definidos en `tokens.css`, y la implementacion referencia los tokens por nombre, nunca valores sueltos.

Principio general: estetica **modern-minimal** de referencia (Stripe, Arc, Framer, Calendly, Webflow): superficies limpias, jerarquia tipografica fuerte, acento cromatico contenido y microinteracciones precisas. Sin emojis en la interfaz; la iconografia se resuelve con Material Symbols (Google).

## 1. Paleta de colores

Los valores se definen en OKLCH en `tokens.css`; aqui se documentan con su uso previsto.

| Token                  | Valor (aprox.) | Uso previsto                               |
| ---------------------- | -------------- | ------------------------------------------ |
| `--color-paper`        | `#f7f8fa`      | Fondo general de la pagina                 |
| `--color-surface`      | `#ffffff`      | Tarjetas y superficies elevadas            |
| `--color-surface-soft` | `#eef0f4`      | Superficies intermedias, metadatos         |
| `--color-ink`          | `#0c1222`      | Texto principal (casi negro azulado)       |
| `--color-ink-soft`     | `#5a6478`      | Texto secundario, pies y captions          |
| `--color-line`         | `#e3e6ee`      | Bordes y separadores (feit, no sombras)    |
| `--color-primary`      | `#4f46e5`      | Acciones principales, links, foco          |
| `--color-primary-deep` | `#4338ca`      | Hover del primario y elementos activos     |
| `--color-accent`       | `#0891b2`      | Detalle tecnico: chips de stack, etiquetas |
| `--color-success`      | `#16a34a`      | Estado en vivo, confirmaciones             |
| `--color-warning`      | `#d97706`      | Estado pendiente, avisos                   |
| `--color-error`        | `#dc2626`      | Errores y estados rotos                    |

Uso: el color se aplica con intencion. El acento primario se reserva a acciones y estado activo; el texto usa unicamente `ink` y `ink-soft`. No se mezclan mas de dos acentos por vista.

## 2. Tipografia

Pareja display/cuerpo con monocromo tecnico. Toda cabecera en romana (sin italicas en titulos; el enfasis se logra con peso o color).

| Rol            | Familia        | Tamanos (jerarquia)                | Pesos         |
| -------------- | -------------- | ---------------------------------- | ------------- |
| Display        | Space Grotesk  | `48 / 40 / 32 / 24 / 20 px`        | 500, 700      |
| Cuerpo         | Inter          | `16 px` base, `14 px` secundario   | 400, 500, 600 |
| Mono (tecnico) | JetBrains Mono | `12 / 13 px` labels, tags, numeros | 400, 600      |

- Titulos de seccion: display, 500-700, interletraje ligeramente negativo.
- Cuerpo: 16 px, altura de linea 1.6, medida maxima de columna ~68 caracteres.
- Etiquetas, chips y numeros tecnicos: JetBrains Mono 12-13 px.

## 3. Espaciados y grilla

Sistema de spacing de 4 pt con nombres semanticos; mobile-first con media queries de `min-width`.

| Token        | Valor | Uso                                    |
| ------------ | ----- | -------------------------------------- |
| `--space-1`  | 4 px  | Detalle interno                        |
| `--space-2`  | 8 px  | Espaciado compacto entre primos        |
| `--space-3`  | 12 px | Espaciado interno de chips y controles |
| `--space-4`  | 16 px | Espaciado por defecto de tarjetas      |
| `--space-6`  | 24 px | Separacion entre secciones menores     |
| `--space-8`  | 32 px | Separacion entre bloques               |
| `--space-12` | 48 px | Separacion entre secciones             |

Breakpoints: `640 / 768 / 1024 / 1280 px`. En moviles (320-414) el contenido ocupa una columna; a partir de 768 como minimo dos columnas.

## 4. Componentes base

### Boton primario

Fondo `primary`, texto blanco, radio 8 px, padding 10-16 px, altura 40 px.
Estados: `hover` = `primary-deep`; `focus-visible` = anillo 2 px `primary` con offset; `active` = traslacion 1 px; `disabled` = fondo `surface-soft` y texto `ink-soft`. Transiciones de 150-250 ms solo en `transform` y `opacity`.

### Boton secundario

Borde 1 px `line`, texto `ink`, fondo `surface`. Mismos estados de interaccion que el primario pero solo el borde y el texto cambian.

### Tarjeta

Fondo `surface`, borde 1 px `line`, radio 12 px, padding 16 px. Hover: elevacion sutil (sombra 0 8 px 24 px negro al 6 %) y borde `primary` tenue; imagen de preview en cabecera con ratio 16:10 y `object-fit: cover`.

### Chip / etiqueta

Fondo `surface-soft`, texto `ink-soft` 12-13 px mono, radio 999 px, padding 2-8 px. Variante de stack: texto `accent` sobre fondo tenue de acento.

### Campo de texto (filtros/busqueda)

Borde 1 px `line`, radio 8 px, altura 40 px. `focus-visible`: anillo 2 px `primary`. `placeholder` en `ink-soft`. Estado de error: borde `error` con mensaje asociado por `aria`.

## 5. Iconografia

Se usa **Material Symbols** (Google) como unica fuente de iconos; variable de fuente con `font-variation-settings` para peso `FILL 0 700`, tamano 18-24 px segun el contexto. Prohibido incrustar emojis como iconos o decoracion.

## 6. Movimiento

- Microinteracciones de 150-250 ms con easing suave (`cubic-bezier(0.2, 0.8, 0.2, 1)`).
- Solo se animan `transform` y `opacity`; nunca propiedades de layout.
- Reareas (hover/reveal) de maximo 400 ms; el reconocimiento de elementos interactivos es inmediato (`focus-visible` sin animacion).
- `prefers-reduced-motion: reduce` colapsa todo a fundidos de 150 ms o a ningun movimiento si no aporta informacion.

## 7. Accesibilidad

- Contraste minimo 4.5:1 para texto normal y 3:1 para texto grande y componentes.
- Todo elemento interactivo es un elemento nativo (`button`, `a`, `input`) con estados `focus-visible` visibles.
- Las imagenes con informacion llevan `alt`; las decorativas, `alt=""`.
- Orden de lectura del DOM respeta la tabulacion.
