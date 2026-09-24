# Libro de Estilos — Generador de Clave Secreta

## Identidad visual
Fusion de cuatro conceptos: **elegancia banquera** (dorados, acabados premium), **tool funcional** (monospace, sin adornos superfluos), **moderno claro** (fondo beige, tarjetas blancas, sombras suaves) y **tarjeta fisica** (la clave se muestra como el numero de una tarjeta con chip).

---

## Paleta de colores

| Token | Color | Uso |
|---|---|---|
| `--color-bg` | `#f5f0ea` | Fondo general (beige calido) |
| `--color-surface` | `#ffffff` | Tarjetas de opciones |
| `--color-card-bg` | `#1b1b26` | Fondo de la tarjeta credito |
| `--color-card-border` | `#c9a03a` | Borde dorado de la tarjeta |
| `--color-accent` | `#c9a03a` | Dorado principal |
| `--color-accent-hover` | `#d4b15a` | Dorado hover |
| `--color-text-primary` | `#2c2418` | Texto principal |
| `--color-text-secondary` | `#8a7e70` | Texto secundario |
| `--color-success` | `#5b8c5a` | Verde seguro |
| `--color-warning` | `#c9953a` | Ambar moderado |
| `--color-danger` | `#b55a4a` | Rojo debil |

---

## Tipografia

- **Titulos y texto**: Inter (400–700)
- **Clave generada**: JetBrains Mono (400–600), agrupada de 4 en 4
- **Iconos**: Material Symbols Outlined

---

## Componentes clave

### Tarjeta credito (`card-credit`)
Fondo oscuro con gradiente sutil, borde dorado, esquinas redondeadas (14px), proporcion 1.586. Incluye chip dorado, grupos de clave en monospace, y pie con titular + vencimiento.

### Boton dorado (`btn-gold`)
Fondo gradiente dorado, texto blanco, hover con glow y elevacion.

### Boton outline (`btn-outline`)
Borde gris, fondo blanco, hover oscurece.

### Checkbox
Check nativo oculto, cuadrado con borde, check blanco sobre fondo dorado al activarse.

### Barra de fortaleza
4 segmentos, se iluminan progresivamente en rojo, amarillo o verde segun entropia.

---

## Estructura

```
Header (sticky, semitransparente)
Hero (titulo + subtitulo)
  Tarjeta credito (clave visual)
  Toolbar (Copiar + Regenerar)
  Barra fortaleza
  Grid 2 columnas:
    - Longitud (slider)
    - Caracteres (checkboxes)
    - Extras (checkboxes)
  Nota de seguridad
  3 tarjetas informativas
Footer
```

Max-width 580px, centrado. Responsive a 1 columna en movil.
