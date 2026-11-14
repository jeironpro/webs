# Nexo · Consola de administración

Consola de administración de una plataforma SaaS ficticia, implementada como
sitio estático en HTML, CSS y JavaScript vanilla. No usa React ni ningún runtime
de framework: cada vista es un documento HTML propio y la interacción vive en
`js/app.js`.

## Secciones

- **Resumen**: métricas, actividad, alertas, pedidos y usuarios recientes.
- **Usuarios**: búsqueda, filtros por rol y estado, paginación de 30 registros y
  diálogo de alta.
- **Contenido**: productos y artículos con estados de publicación.
- **Auditoría**: acciones, errores y accesos fallidos.
- **Salud**: bases de datos, recursos, servicios y colas.
- **Reportes**: generación y exportación de datos.
- **Configuración**: variables, integraciones y feature flags.
- **Perfil**: datos de la cuenta.

La barra superior incluye menú de usuario, notificaciones y paleta de búsqueda
con `Ctrl+K` o `Cmd+K`. El menú lateral se convierte en drawer en pantallas
pequeñas.

## Archivos

- `index.html`: resumen general.
- `usuarios.html`, `contenido.html`, `auditoria.html`, `configuracion.html`,
  `salud.html`, `reportes.html`, `perfil.html`: vistas restantes.
- `css/styles.css`: estilos compilados del diseño original.
- `css/app.css`: ajustes de overlays, drawer y componentes interactivos.
- `js/app.js`: navegación, pestañas, filtros, búsqueda, paginación, menús,
  diálogos, notificaciones y exportaciones.
- `favicon.svg`: icono de la aplicación.

Los datos son un MOCK estático incluido en el HTML.
