# Lexaro

Tablero de tareas (kanban) en el navegador con columnas por estado, prioridades, arrastrar y soltar y persistencia local.

## Características

- Tablero kanban con las columnas To Do, En Progreso, En Revisión y Completado.
- Creación de tareas con título, descripción, prioridad, etiquetas y fechas.
- Arrastrar y soltar para mover las tareas entre columnas.
- Filtros por prioridad (Todas, Alta, Media y Baja).
- Edición y eliminación de tareas con confirmación.
- Persistencia de las tareas en `localStorage`, previo consentimiento, para conservarlas entre sesiones.
- Notificaciones del navegador para tareas próximas a vencer.

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
  README.md
```

## Uso

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-lexaro/>. Crea tareas, asígnales prioridad y arrástralas entre columnas según su estado.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
