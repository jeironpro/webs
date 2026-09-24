# Diseño UI/UX y libro de estilo

## Principios

- **Editorial austero**: la página se lee como una hoja impresa, no como un panel de control.
- **Una tarea por pantalla**: escribir/pegar o subir; las métricas son el resultado principal.
- **Tipo sobre decoración**: hairlines, no sombras pesadas; el acento se usa en menos del 3 % del viewport.
- **Todo local**: nada del texto sale del navegador.

## Tipografía (2+1)

| Rol | Familia |
|---|---|
| Display | **Newsreader** (serif, 600/700) — títulos |
| Cuerpo | **Source Serif 4** (serif, 400/600) — texto e interfaz |
| Outlier | **JetBrains Mono** (mono, 400/500) — etiquetas y números de métricas |

Escala (mayor tercera, 1.25): `--text-xs` 0.7rem · `--text-base` 1rem · `--text-md` 1.25rem · `--text-lg` 1.5625rem · `--text-2xl` 2.4414rem · `--text-display` `clamp(2rem, 4vw + 0.75rem, 3.75rem)`.

## Color (OKLCH)

| Token | Valor | Uso |
|---|---|---|
| `--color-paper` | `oklch(96.5% 0.012 75)` | Fondo principal (crema cálida) |
| `--color-paper-2` | `oklch(93% 0.014 75)` | Superficies al pasar el cursor |
| `--color-ink` | `oklch(19% 0.012 55)` | Texto principal |
| `--color-ink-2` | `oklch(42% 0.012 65)` | Texto secundario |
| `--color-rule` | `oklch(84% 0.012 75)` | Bordes y separadores |
| `--color-accent` | `oklch(48% 0.12 35)` | Acento (enlaces, estado de arrastre) |
| `--color-accent-deep` | `oklch(38% 0.11 35)` | Acento en hover |
| `--color-focus` | `oklch(50% 0.13 300)` | Anillo de foco |

## Espaciado

Escala de 4 pt: `--space-2xs` 0.25rem · `--space-xs` 0.5rem · `--space-sm` 0.75rem · `--space-md` 1rem · `--space-lg` 1.5rem · `--space-xl` 2.5rem · `--space-3xl` 6rem.

## Movimiento

Quieto: una única secuencia de entrada, sin rebotes. Con `prefers-reduced-motion: reduce` toda animación espacial se reduce a cambios de opacidad o se elimina.

## Estados de interacción

- **Área de texto**: normal, `:focus-visible` con anillo de foco y borde.
- **Zona de subida**: normal, `:hover`, `:focus-visible`, y estado `is-dragover` al arrastrar un archivo encima.
- **Botones**: normal, `:hover`, `:active`, `:focus-visible` y deshabilitado (opacidad 0.5).