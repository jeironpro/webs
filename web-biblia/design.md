# Sistema editorial clásico

Documento de diseño del rediseño editorial de la Biblia web. El sistema
sustituye el lenguaje visual anterior (tipografía redondeada y degradados
vivos) por una puesta en página cercana al libro impreso clásico: papel,
tinta, encuadernación y oro.

Sello de autoría: `/* Hallmark · designed-as-app */`. Todo archivo CSS del
sistema lleva este sello en su primera línea de comentario y el registro de
aplicación se mantiene en `.hallmark/log.json`.

## Principios

1. **Papel, no pantalla.** Fondo cálido de papel antiguo (`--paper`) y
   superficies apenas más claras (`--paper-raised`). Nada de negro puro ni
   blancos fríos.
2. **Tinta, no color de marca.** El texto es tinta oscura (`--ink`); el
   acento cromático se reserva al granate de encuadernación y al oro, usados
   con moderación (reglas, numerales, hover).
3. **Serif, no grotesca.** Tipografía editorial serif en todos los niveles:
   títulos en Cormorant Garamond y cuerpo en EB Garamond.
4. **Reglas en lugar de sombras.** La estructura se dibuja con filetes finos
   (`--rule`, `--line`) y ornamentos, no con sombras grandes ni degradados.
5. **Jerarquía por versalitas y espaciado.** Las cabeceras usan versalitas
   con interletraje; la separación entre secciones se logra con aire y
   filetes, no con cajas de color.
6. **Legible como lectura continua.** El texto de los versículos se compone
   a un ancho de columna cómodo (~68 caracteres), con interlineado generoso
   y capitular en el primer versículo.

## Paleta

| Token            | Valor      | Uso                                   |
| ---------------- | ---------- | ------------------------------------- |
| `--paper`        | `#f6efe3`  | Fondo general (papel antiguo)         |
| `--paper-raised`   | `#fffdf7`  | Superficies (cabeceras, tarjetas)     |
| `--ink`        | `#2b211a`  | Texto principal (tinta)               |
| `--ink-muted`  | `#7a6a5a`  | Texto secundario y pies               |
| `--maroon`      | `#7d2a24`  | Acento principal (encuadernación)     |
| `--gold`          | `#a8843c`  | Acento secundario (detalles)          |
| `--line`        | `#e0d5c2`  | Filetes y bordes                      |
| `--line-strong` | `#c9b99b`  | Filetes en estados destacados         |

## Tipografía

- **Títulos** — Cormorant Garamond (500–700): cabeceras, títulos de libro,
  numerales destacados. Interletraje `0.04em`, versalitas en las cabeceras.
- **Cuerpo** — EB Garamond (400–500, cursiva 400): textos, listas, versículos.
- Escala base de 18px con interlineado 1.9 para el cuerpo.

## Componentes

- **Cabecera fija**: papel alto, filete inferior, título centrado en
  versalitas e iconos SVG de trazo fino a ambos lados.
- **Portada (index)**: título de portada con filetes dobles y dos láminas
  (Antiguo y Nuevo testamento) a modo de placa editorial.
- **Catálogo de libros**: rejilla de rótulos serif con filete; cada sección
  canónica (Pentateuco, Históricos, …) encabeza su grupo.
- **Índice de capítulos**: rejilla de numerales romanos/arábigos en caja con
  filete; el numeral se tiñe de granate al pasar el cursor.
- **Página de lectura**: columna estrecha, capitular en el primer versículo
  y versículos separados por aire.

## Iconos

Iconos SVG de trazo fino (1.6px), tamaño 22px, heredan `currentColor`.
Favicon: `icons/biblia.svg` (libro abierto en granate y oro).

## Responsive

Puntos de interrupción: 768px (tablet/portátil pequeño) y 480px (móvil);
diseñado y verificado en 320, 375, 414 y 768. En móvil las rejillas reducen
el tamaño mínimo de celda y los botones de capítulo se muestran como flechas.
