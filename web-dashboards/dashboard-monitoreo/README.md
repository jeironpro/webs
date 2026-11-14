# Vigía · Dashboard de monitoreo

Dashboard de observabilidad de infraestructura implementado como sitio estático
en HTML, CSS y JavaScript vanilla. No usa React ni runtime de framework.

## Vistas

- **Resumen**: estado de la flota, latencia, disponibilidad y alertas.
- **Servidores**: uptime, latencia y uso de CPU, RAM y disco.
- **Métricas**: bases de datos, APIs y colas de trabajo.
- **Logs**: registro de errores y excepciones agrupadas, filtrable por nivel.
- **Seguridad**: alertas ordenadas por severidad.
- **Perfil**: datos de la cuenta.

La navegación lateral se transforma en drawer en móvil. El botón de refresco
actualiza el estado visual y las pestañas de logs filtran los registros.

## Archivos

- `index.html`: panel principal con todas las secciones.
- `perfil.html`: datos de la cuenta.
- `css/styles.css`: estilos compilados del diseño original.
- `css/app.css`: ajustes de overlays, drawer y avisos.
- `js/app.js`: navegación, menús, pestañas, filtros y actualización.
- `favicon.svg`: icono de la aplicación.

Los datos son un MOCK estático incluido en el HTML.
