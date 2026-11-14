# Soporte · Mesa de ayuda

Panel de gestión de soporte técnico para e-commerce implementado como sitio
estático en HTML, CSS y JavaScript vanilla. No usa React ni runtime de framework.

## Vistas

- **Panel**: tickets abiertos, en progreso y cerrados, CSAT y tiempo de respuesta.
- **Tickets**: listado con búsqueda, filtros por estado, prioridad y categoría.
- **Detalle de ticket**: conversación, mensajes y datos de la solicitud para los
  22 tickets.
- **Perfil**: datos del agente.

El listado enlaza a una página propia por ticket. El botón **Nuevo ticket** abre
el diálogo original y el formulario de respuesta cierra el panel con confirmación.

## Archivos

- `index.html`: panel de soporte.
- `tickets.html`: listado completo.
- `ticket-TK-1021.html` a `ticket-TK-1042.html`: detalle de cada ticket.
- `perfil.html`: datos del agente.
- `css/styles.css`: estilos compilados del diseño original.
- `css/app.css`: ajustes de overlays, filtros y avisos.
- `js/app.js`: navegación, menús, filtros, diálogos y exportaciones.
- `assets/fonts/`: fuentes locales del diseño original.
- `favicon.svg`: icono de la aplicación.

Los datos son un MOCK estático incluido en el HTML.
