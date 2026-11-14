# Suma · Dashboard financiero

Dashboard financiero de portafolio con ingresos, facturación, suscripciones,
pagos y reportes fiscales y contables. Está implementado como sitio estático en
HTML, CSS y JavaScript vanilla, sin React ni runtime de framework.

## Vistas

- **Resumen**: KPIs, ingresos y gastos por concepto, MRR por plan y pagos recientes.
- **Facturas**: tabla con filtros por estado y actualización de datos.
- **Suscripciones**: planes y suscripciones activas.
- **Pagos**: desglose por estado y acción de cobro.
- **Reportes**: IVA, estado de resultados y balance general.
- **Perfil**: datos de la cuenta.

El menú de usuario y el drawer de navegación móvil están incluidos en todas las
vistas. Las pestañas de facturas filtran la tabla por estado.

## Archivos

- `index.html`: resumen financiero.
- `facturacion.html`, `suscripciones.html`, `pagos.html`, `reportes.html`,
  `perfil.html`: vistas restantes.
- `css/styles.css`: estilos compilados del diseño original.
- `css/app.css`: ajustes de overlays, drawer, filtros y avisos.
- `js/app.js`: navegación, menús, filtros, pestañas, actualización y exportación.
- `favicon.svg`: icono de la aplicación.

Los datos son un MOCK estático incluido en el HTML.
