# Pulso · Dashboard operativo analítico

Dashboard operativo para seguir KPIs de negocio, tendencias, pedidos y reportes.
Está implementado como sitio estático en HTML, CSS y JavaScript vanilla, sin
React ni runtime de framework.

## Vistas

- **Resumen**: KPIs, ventas del periodo, tendencias y comparativas.
- **Tendencias**: evolución diaria, semanal y mensual con gráficos propios.
- **Pedidos**: búsqueda por id, cliente o categoría y filtros por estado.
- **Reportes**: desglose por categoría y exportación a CSV, Excel y PDF.
- **Perfil**: datos, estadísticas y actividad de la persona.

Las tres vistas de tendencias están incluidas en el documento y se alternan sin
recargar. Los filtros de la tabla y la exportación están conectados.

## Archivos

- `index.html`: panel principal con todas las secciones.
- `perfil.html`: datos de la persona.
- `css/styles.css`: estilos compilados del diseño original.
- `css/app.css`: ajustes de overlays, drawer, filtros y avisos.
- `js/app.js`: navegación, menús, pestañas, filtros, búsqueda y exportaciones.
- `assets/fonts/`: fuentes locales del diseño original.
- `favicon.svg`: icono de la aplicación.

Los datos son un MOCK estático incluido en el HTML.
