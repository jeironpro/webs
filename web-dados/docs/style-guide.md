# Libro de estilo - web-dados

## Identidad visual

### Paleta de colores

| Token | Color | Hex | Uso |
|-------|-------|-----|-----|
| `--color-bg` | Naranja | `#cf5e19` | Fondo principal |
| `--color-bg-secondary` | Naranja oscuro | `#b04e12` | Fondo secundario / degradado |
| `--color-primary` | Naranja claro | `#e07020` | Elementos interactivos |
| `--color-accent` | Naranja oscuro | `#b04e12` | Hover, estados activos |
| `--color-text` | Blanco | `#fff` | Texto principal |
| `--color-text-muted` | Blanco semitransparente | `rgba(255, 255, 255, 0.6)` | Texto secundario |
| `--color-dice-bg` | Blanco | `#fff` | Fondo de la cara del dado |
| `--color-dice-pip` | Naranja | `#cf5e19` | Puntos del dado |
| `--color-dice-border` | Gris claro | `#e0e0e0` | Borde del dado |
| `--color-slider-track` | Blanco semitransparente | `rgba(255, 255, 255, 0.85)` | Barra del slider |
| `--color-slider-thumb` | Blanco | `#fff` | Thumb del slider |

### Tipografia

- **Familia:** `'Sora', sans-serif` (Google Fonts)
- **Jerarquia:**
  - `--font-size-xs: 0.75rem` - Texto auxiliar
  - `--font-size-sm: 0.875rem` - Etiquetas
  - `--font-size-base: 1rem` - Cuerpo
  - `--font-size-lg: 1.25rem` - Contador de dados
  - `--font-size-xl: 2rem` - (reservado)

### Espaciado

| Token | Valor |
|-------|-------|
| `--spacing-xs` | 0.25rem |
| `--spacing-sm` | 0.5rem |
| `--spacing-md` | 1rem |
| `--spacing-lg` | 1.5rem |
| `--spacing-xl` | 2rem |

### Sombras

| Token | Valor |
|-------|-------|
| `--shadow-dice` | `0 4px 16px rgba(0, 0, 0, 0.2)` |
| `--shadow-controls` | `0 2px 8px rgba(0, 0, 0, 0.3)` |

---

## Componentes

### Dado

- Cuadro blanco con bordes redondeados (`--border-radius: 12px`)
- Gradiente radial sutil en la cara para dar profundidad
- Cuadricula interna 3x3 para posicionar los puntos
- Puntos naranja con degradado radial y sombra interna (efecto 3D)
- Animacion de agitado al lanzar (duracion: 600ms)
- Hover: escala 1.05

### Controles

- Barra flotante fija en la parte superior, centrada
- Fondo semitransparente con efecto blur (backdrop-filter)
- Slider personalizado:
  - Barra: blanco semitransparente (`rgba(255, 255, 255, 0.85)`)
  - Thumb: blanco, 24x24px, con sombra
- Contador numerico en blanco
- Minimo 1 dado, maximo 12

---

## Responsive

### Escritorio (> 768px)

- Layout normal con cuadricula de dados
- Cursor hover activo en dados
- Click o Enter/Space para lanzar

### Tablet (481-768px)

- Espaciado reducido en la cuadricula y app

### Movil (< 480px)

- Controles compactos
- Slider mas corto
- Touch para lanzar
- Gaps entre dados reducidos

---

## Accesibilidad

- Skip link para saltar al contenido principal
- Atajo de teclado: Enter/Space para lanzar dados
- `:focus-visible` con outline blanco en todos los elementos interactivos
- `aria-live="polite"` para anunciar resultados a lectores de pantalla
- `prefers-reduced-motion` respetado (desactiva animaciones)
- Etiquetas ARIA en controles (`aria-label`, `aria-describedby`)
- Contraste de color: texto blanco sobre fondo naranja (~7.5:1, nivel AAA)

---

## Interaccion

| Accion | Desktop | Movil | Teclado |
|--------|---------|-------|---------|
| Lanzar dados | Click | Touch | Enter / Space |
| Cambiar cantidad | Slider | Slider | Slider (navegacion) |
| Feedback visual | Animacion shake | Animacion shake | Animacion shake |
