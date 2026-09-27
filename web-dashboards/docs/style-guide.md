# Guia de estilo

Documento de diseno del catalogo de dashboards. Este libro de estilo es el contrato de diseno que consumira el catalogo: toda variable visual vive en tokens (CSS custom properties) definidos en `tokens.css`, y la implementacion referencia los tokens por nombre, nunca valores sueltos.

Principio general: identidad de **consola de control sobre panel claro** con las virtudes del modern-minimal: superficies limpias, jerarquia tipografica fuerte, acento de datos contenido y microinteracciones precisas. El catalogo debe leerse como una sala de monitoreo en la que cada panel es una tarjeta, no como una plantilla de catalogo generica. Sin emojis en la interfaz; la iconografia se resuelve con Material Symbols (Google) y la tipografia (Sora + JetBrains Mono) aporta el tono de lectura de telemetria.

## 1. Paleta de colores

Fondo claro de consola con acentos de datos. Los valores se definen en OKLCH en `tokens.css`; aqui se documentan con su uso previsto.

| Token                  | Valor (aprox.) | Uso previsto                                         |
| ---------------------- | -------------- | ---------------------------------------------------- |
| `--color-paper`        | `#f4f6f9`      | Fondo general, sala de monitoreo                     |
| `--color-surface`      | `#ffffff`      | Tarjetas (paneles) y superficies principales         |
| `--color-surface-soft` | `#edf0f5`      | Superficies intermedias, chips y metadatos           |
| `--color-ink`          | `#141b2b`      | Texto principal (azul grafito)                       |
| `--color-ink-soft`     | `#5a6478`      | Texto secundario, pies y captions                    |
| `--color-line`         | `#dde2ec`      | Bordes y separadores (feit, no sombras)              |
| `--color-primary`      | `#2563eb`      | Acciones principales, enlaces, foco, dominio `admin` |
| `--color-primary-deep` | `#1d4ed8`      | Hover del primario y elementos activos               |
| `--color-accent`       | `#0891b2`      | Detalle de metricas y dominio `analitica` (cian)     |
| `--color-success`      | `#16a34a`      | Estado en vivo y dominio `finanzas` (verde)          |
| `--color-warning`      | `#d97706`      | Estado pendiente y dominio `monitoreo` (ambar)       |
| `--color-error`        | `#dc2626`      | Errores y dominio `soporte` (rojo incidente)         |

Uso: el color se aplica con intencion. El acento primario se reserva a acciones y estado activo; el texto usa unicamente `ink` e `ink-soft`. No se mezclan mas de dos acentos por vista. Los dominios mapean colores estables (seccion 5) para que el chip de dominio sea reconocible de un vistazo en toda la coleccion.

## 2. Tipografia

Pareja display/cuerpo con monocromo de HUD. Toda cabecera en romana (sin italicas en titulos; el enfasis se logra con peso o color). `font-variant-numeric: tabular-nums` para numeros de metricas y contadores.

| Rol        | Familia        | Tamanos (jerarquia)                | Pesos         |
| ---------- | -------------- | ---------------------------------- | ------------- |
| Display    | Sora           | `48 / 40 / 32 / 24 / 20 px`        | 500, 700      |
| Cuerpo     | Inter          | `16 px` base, `14 px` secundario   | 400, 500, 600 |
| Mono (HUD) | JetBrains Mono | `12 / 13 px` labels, tags, estados | 400, 600      |

- Titulos de seccion: display, 500-700, interletraje ligeramente negativo.
- Cuerpo: 16 px, altura de linea 1.6, medida maxima de columna ~68 caracteres.
- Etiquetas, chips, contadores y estados: JetBrains Mono 12-13 px en mayusculas (HUD).

## 3. Espaciados y grilla

Sistema de spacing de 4 pt con nombres semanticos; mobile-first con media queries de `min-width`.

| Token        | Valor | Uso                                    |
| ------------ | ----- | -------------------------------------- |
| `--space-1`  | 4 px  | Detalle interno                        |
| `--space-2`  | 8 px  | Espaciado compacto entre primos        |
| `--space-3`  | 12 px | Espaciado interno de chips y controles |
| `--space-4`  | 16 px | Espaciado por defecto de paneles       |
| `--space-6`  | 24 px | Separacion entre secciones menores     |
| `--space-8`  | 32 px | Separacion entre bloques               |
| `--space-12` | 48 px | Separacion entre secciones             |

Breakpoints: `640 / 768 / 1024 / 1280 px`. En moviles (320-414) el contenido ocupa una columna; a partir de 768 como minimo dos columnas.

## 4. Componentes base

### Boton primario

Fondo `primary`, texto `surface` (blanco), radio 8 px, padding 10-16 px, altura 40 px, mono en 13 px mayusculas. Estados: `hover` = `primary-deep`; `focus-visible` = anillo 2 px `primary` con offset; `active` = traslacion 1 px; `disabled` = fondo `surface-soft` y texto `ink-soft`. Transiciones de 150-250 ms solo en `transform` y `opacity`.

### Boton secundario

Borde 1 px `line`, texto `ink`, fondo `surface`. Mismos estados de interaccion que el primario pero solo cambian borde y texto.

### Tarjeta (panel)

Fondo `surface`, borde 1 px `line`, radio 12 px, padding 16 px. Hover: elevacion sutil y borde del dominio (sombra 0 8 px 24 px neutra al 8 %; borde del color de dominio al 60 %). Imagen de preview en cabecera con ratio 16:10 y `object-fit: cover`.

### Chip / etiqueta

Fondo `surface-soft`, texto `ink-soft` 12-13 px mono, radio 999 px, padding 2-8 px. Variante de **dominio**: ver seccion 5. Los chips de estado heredan el color semantico correspondiente (`en vivo` verde, `pendiente` ambar, `externo` neutro).

### Campo de texto (filtros/busqueda)

Borde 1 px `line`, radio 8 px, altura 40 px, fondo `surface`, texto `ink`. `focus-visible`: anillo 2 px `primary`. `placeholder` en `ink-soft`. Estado de error: borde `error` con mensaje asociado por `aria`.

### Selector de orden

Mismo contrato visual que el campo de texto (40 px, borde `line`), con icono `swap_vert` a la izquierda y `expand_more` a la derecha; tipografia mono HUD.

## 5. Dominios de dashboard

El catalogo se organiza por **dominio** (categorias de dashboards). Cada dominio tiene un color estable (seccion 1) y una etiqueta HUD en mayusculas:

| Dominio          | Etiqueta  | Color   | Dashboards esperados |
| ---------------- | --------- | ------- | -------------------- |
| `administracion` | ADMIN     | primary | administrador        |
| `finanzas`       | FINANZAS  | success | financiero           |
| `monitoreo`      | MONITOREO | warning | monitoreo            |
| `analitica`      | ANALITICA | accent  | operativo-analitico  |
| `soporte`        | SOPORTE   | error   | soporte              |

El chip de dominio usa el color del dominio sobre un fondo tenue del mismo color; el icono de la marca es `monitoring`.

## 6. Iconografia

Se usa **Material Symbols** (Google) como unica fuente de iconos; variable de fuente con `font-variation-settings` para peso `FILL 0 700`, tamano 18-24 px segun el contexto. Prohibido incrustar emojis como iconos o decoracion.

## 7. Movimiento

- Microinteracciones de 150-250 ms con easing suave (`cubic-bezier(0.2, 0.8, 0.2, 1)`).
- Solo se animan `transform` y `opacity`; nunca propiedades de layout.
- Reareas (hover/reveal) de maximo 400 ms; el reconocimiento de elementos interactivos es inmediato (`focus-visible` sin animacion).
- `prefers-reduced-motion: reduce` colapsa todo a fundidos de 150 ms o a ningun movimiento si no aporta informacion.
- Sin vendor de animacion (no se venden GSAP/Three/etc. para el catalogo); el brillo lo pone la precision de datos, no la coreografia.

## 8. Accesibilidad

- Contraste minimo 4.5:1 para texto normal (sobre fondo claro) y 3:1 para texto grande y componentes; los textos oscuros sobre `paper` lo garantizan.
- Todo elemento interactivo es un elemento nativo (`button`, `a`, `input`, `select`) con estados `focus-visible` visibles.
- Las imagenes con informacion llevan `alt`; las decorativas, `alt=""`.
- Orden de lectura del DOM respeta la tabulacion.
