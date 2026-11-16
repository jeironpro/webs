# Probador de regex

Herramienta web para **probar y depurar expresiones regulares** en el navegador: escribe un patrón, ajusta las banderas, pega un texto y obtén las coincidencias resaltadas, sus grupos de captura y el resultado de un reemplazo.

## Características

- Patrón con banderas `i`, `m`, `s` y `u`; la búsqueda es siempre global (`g`).
- Resaltado de todas las coincidencias sobre el texto original.
- Lista de coincidencias con índice, valor y grupos capturados (incluidos los grupos con nombre).
- Reemplazo con referencias `$1`, `$&` o `$<nombre>` y botón para copiar el resultado.
- Mensaje de error si el patrón no es válido, sin romper el resto de la interfaz.
- Ejemplo cargado al abrir y botones para recargarlo o limpiar todo.
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

Abre `http://localhost:8000/web-regex-tester/`.

## Estructura

```
web-regex-tester/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   └── tokens.css
├── js/
│   ├── app.js
│   ├── modules/
│   │   └── regex.js
│   └── utils/
│       └── dom.js
└── assets/
    └── icons/
        └── favicon.svg
```

La lógica de coincidencias, segmentos y reemplazos vive en `js/modules/regex.js` como funciones puras, cubiertas por `tests/web-regex-tester/regex.test.js`.

## Accesibilidad

- Controles nativos con `label` asociado y `fieldset`/`legend` para las banderas.
- Mensajes de error y resumen anunciados con `role="alert"` y `aria-live`.
- Foco visible, enlace para saltar al contenido y contraste conforme al libro de estilo.
- `prefers-reduced-motion` reduce las transiciones.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
