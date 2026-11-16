# Comparador de texto

Herramienta web para **comparar dos textos línea a línea** en el navegador. La cinta superior resume la composición del cambio y el diff alinea original y versión nueva, con líneas añadidas, eliminadas y modificadas.

## Características

- Diff por líneas con algoritmo de subsecuencia común más larga (LCS).
- Filas alineadas lado a lado; las eliminaciones y adiciones contiguas se emparejan como líneas modificadas.
- Resaltado del fragmento exacto que cambia dentro de cada línea modificada.
- Cinta proporcional al número de líneas de cada tipo y contadores de iguales, añadidas, eliminadas y modificadas.
- Opciones para ignorar mayúsculas y espacios (se colapsan y se recortan).
- Ejemplo, intercambio de versiones, limpieza y copia del diff unificado.
- Límite de 2000 líneas por lado para acotar el coste de la matriz.
- Todo se procesa en el navegador: ningún texto se envía a un servidor.

## Stack

- HTML5 semántico.
- CSS3 con custom properties, capas y diseño mobile-first.
- JavaScript como módulos ES nativos, sin dependencias de ejecución.

## Uso

Los módulos ES requieren servir el proyecto por HTTP, no abrir `index.html` con `file://`.

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-diff/`.

## Estructura

```
web-diff/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   └── tokens.css
├── js/
│   ├── app.js
│   └── modules/
│       └── diff.js
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

La lógica pura (`splitLines`, `diffLines`, `computeStats`, `toUnified` y `diffInline`) vive en `js/modules/diff.js`; sus pruebas están en `tests/web-diff/diff.test.js`.

## Accesibilidad

- Controles nativos con `label` asociado, textos alternativos y regiones con título.
- Contadores y estado de copia anunciados con `aria-live`; el diff no se anuncia en cada pulsación.
- Foco visible, enlace para saltar al comparador y contraste conforme al libro de estilo.
- `prefers-reduced-motion` reduce las transiciones.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
