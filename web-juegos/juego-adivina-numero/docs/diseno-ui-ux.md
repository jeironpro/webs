# Diseño UI/UX

Este documento resume las decisiones de diseño e interacción. Los valores concretos (colores, tipografías, espaciados) viven en `css/tokens.css` y se resumen en el [libro de estilo](#libro-de-estilo).

## Principios

- **Tono**: *playful* — amigable, cálido y directo, sin infantilismo. El objetivo es que el juego se sienta vivo.
- **Mobile-first**: los estilos base son para el móvil y las media queries (`min-width`) amplían el layout.
- **Movimiento con propósito**: cada animación comunica un cambio de estado (acierto, fallo, presión de botón). Nunca decoración sin sentido.
- **Accesibilidad**: contraste, anillos de foco, `aria-live` y soporte de `prefers-reduced-motion`.

## Estructura de la página

- **Marquee Hero**: el juego es el héroe; un titular grande a la izquierda y la tarjeta del juego a la derecha (apilado en móvil).
- **Reglas**: una secuencia numerada de tres pasos.
- **Pie**: marquee horizontal con el nombre del juego (infinito, con respeto a `prefers-reduced-motion`).

## Microinteracciones

| Interacción | Comportamiento |
|---|---|
| Botón primario (push) | Se eleva 2 px al pasar el cursor y se "hunde" 3 px al presionar; el borde inferior simula el grosor del botón |
| Botón secundario (soft) | Elevación suave con sombra |
| Tarjeta del juego | Se eleva 4 px con sombra al pasar el cursor |
| Suposición incorrecta | La marca "?" se agita brevemente |
| Acierto | La marca "?" rebota y suelta una estrella coral; el mensaje de victoria se resalta |
| Contador de intentos | Cuenta hacia arriba con easing durante 400 ms |
| Cambio de foco | Anillo de foco visible al instante (nunca animado) |

## Personaje

La marca "?" en la esquina de la tarjeta es el único elemento decorativo animado. Pulso suave en reposo (4 s), se agita en los fallos y celebra los aciertos. Es un detalle que da carácter sin distraer.

## Decisiones de color

- Papel crema (nunca blanco puro) y tinta casi negra con tinte frío (nunca negro puro).
- Paleta multicolor: **pera** (amarillo) para acciones primarias, **cian** para vínculos y números de paso, **coral** reservado al momento único de victoria, y lavanda/menta en usos muy puntuales.
- El éxito usa texto coral profundo; los errores usan un rojo más oscuro para garantizar contraste.

## Decisiones de tipografía

- **Display y cuerpo**: Plus Jakarta Sans (600 display, 400 cuerpo).
- **Etiquetas y números**: JetBrains Mono (mayúsculas con espaciado).
- Sin serifas, sin cursivas en titulares, sin texto en mayúsculas en párrafos.

## Libro de estilo

### Color (OKLCH)

| Token | Valor | Uso |
|---|---|---|
| `--color-paper` | `oklch(97% 0.012 95)` | Fondo principal (crema) |
| `--color-paper-2` | `oklch(94% 0.016 95)` | Bandas y tarjeta |
| `--color-ink` | `oklch(20% 0.012 250)` | Texto principal |
| `--color-ink-2` | `oklch(42% 0.012 250)` | Texto secundario |
| `--color-rule` | `oklch(86% 0.015 95)` | Bordes y separadores |
| `--color-accent` | `oklch(86% 0.18 95)` | Acción primaria (pera) |
| `--color-accent-deep` | `oklch(74% 0.19 95)` | Borde del botón primario |
| `--color-accent-2` | `oklch(66% 0.18 235)` | Vínculos, números de paso (cian) |
| `--color-accent-3` | `oklch(68% 0.24 18)` | Momento de victoria (coral) |
| `--color-mint` | `oklch(80% 0.16 150)` | Estados de éxito (uso puntual) |
| `--color-lavender` | `oklch(74% 0.16 305)` | Etiquetas (uso puntual) |
| `--color-error` | `oklch(45% 0.20 20)` | Mensajes de error |
| `--color-focus` | `oklch(50% 0.19 235)` | Anillo de foco |

### Tipografía

| Token | Valor | Uso |
|---|---|---|
| `--font-display` | Plus Jakarta Sans 600 | Titulares |
| `--font-body` | Plus Jakarta Sans 400/500 | Cuerpo e interfaz |
| `--font-label` | JetBrains Mono | Etiquetas y números |

Escala tipográfica (mayor tercera, 1.25): `--text-xs` 0.64rem · `--text-sm` 0.8rem · `--text-base` 1rem · `--text-md` 1.25rem · `--text-lg` 1.5625rem · `--text-xl` 1.9531rem · `--text-2xl` 2.4414rem · `--text-display` `clamp(2.25rem, 5vw + 1rem, 5.25rem)`.

### Espaciado (escala de 4 pt)

`--space-3xs` 0.125rem · `--space-2xs` 0.25rem · `--space-xs` 0.5rem · `--space-sm` 0.75rem · `--space-md` 1rem · `--space-lg` 1.5rem · `--space-xl` 2.5rem · `--space-2xl` 4rem · `--space-3xl` 6rem.

### Radio

| Token | Valor | Uso |
|---|---|---|
| `--radius-input` | 12px | Campos y paneles pequeños |
| `--radius-card` | 20px | Tarjetas |
| `--radius-pill` | 999px | Botones y píldoras |

### Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Salidas |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Cambios de estado |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Elevación de tarjetas |
| `--dur-short` | 220 ms | Hover |

Con `prefers-reduced-motion: reduce` toda animación espacial se reduce a cambios de opacidad o se elimina.
