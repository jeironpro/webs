# Lexaro

Tablero de tareas (kanban) en el navegador con columnas por estado, prioridades, arrastrar y soltar y persistencia local.

## Características

- Tablero kanban con las columnas To Do, En Progreso, En Revisión y Completado.
- Tablero de ejemplo en la primera visita para probar el flujo sin crear datos desde cero.
- Creación de tareas con título, descripción, prioridad, etiquetas y fechas.
- Arrastrar y soltar y botones de columna anterior/siguiente para mover tareas, también con teclado.
- Búsqueda por título, descripción, etiqueta o ID y filtros por prioridad.
- Edición y eliminación de tareas con confirmación, estados vacíos por columna y contadores.
- Importación y exportación del tablero en JSON.
- Persistencia de las tareas en `localStorage`, previo consentimiento revocable desde «Privacidad», para conservarlas entre sesiones.
- Señales visuales de vencimiento en las tarjetas.

## Stack

- HTML5 semántico
- CSS3 (tokens, BEM, Grid y Flexbox)
- JavaScript ES6+ (módulo ES)
- Google Fonts (Inter)
- Font Awesome
- APIs `localStorage` y Notification
- ESLint + Prettier

## Estructura

```
web-lexaro/
  index.html
  assets/
    icons/
      favicon.svg
  css/
    tokens.css
    styles.css
  js/
    app.js
    consent.js
    modules/
      board.js
  README.md
```

## Uso

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-lexaro/>. La primera visita carga un tablero de ejemplo; crea tareas, asígnales prioridad, búscalas y muévelas entre columnas con arrastre o con los botones de la tarjeta. Si aceptas el guardado local, el tablero se conserva al recargar.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
