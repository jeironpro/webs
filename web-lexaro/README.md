# web-lexaro

Tablero de tareas (kanban) en el navegador con columnas por estado, prioridades, arrastrar y soltar y persistencia local.

## Características

- Tablero kanban con las columnas To Do, En Progreso, En Revision y Completado.
- Creación de tareas con título y prioridad (alta, media o baja).
- Arrastrar y soltar para mover las tareas entre columnas.
- Filtros por prioridad (Todas, Alta, Media y Baja).
- Edición y eliminación de tareas con confirmación.
- Persistencia de las tareas en `localStorage` para conservarlas entre sesiones.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+), sin dependencias externas.
- API localStorage para la persistencia.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local.
3. Crea tareas, asignales prioridad y arrastralas entre columnas segun su estado.

## Estructura del proyecto

```
web-lexaro/
├── index.html
├── css/                   # estilos del tablero
├── js/                    # lógica del kanban
└── LICENSE
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
