# Conversor de marcas de tiempo

Herramienta web para **convertir marcas de tiempo Unix** en segundos o milisegundos a ISO 8601, UTC, hora local y tiempo relativo. Incluye un reloj en vivo con el epoch actual y conversión inversa desde una fecha local.

## Características

- Reloj en vivo con el epoch actual, la hora UTC y la hora local.
- Detección automática de segundos o milisegundos por el tamaño del número.
- Conversión bidireccional entre marca de tiempo y `datetime-local`.
- Lecturas de ISO 8601, UTC completa, hora local con zona, tiempo relativo y epoch en ambas unidades.
- Botón **Ahora** para volver al instante actual y reanudar el reloj.
- Copia de cada lectura con confirmación anunciada.
- Errores de formato y de rango señalados en el campo correspondiente.
- Todo se procesa en el navegador: no se envía ninguna fecha a un servidor.

## Stack

- HTML5 semántico.
- CSS3 con custom properties, capas y diseño mobile-first.
- JavaScript como módulos ES nativos, sin dependencias de ejecución.

## Uso

Los módulos ES requieren servir el proyecto por HTTP, no abrir `index.html` con `file://`.

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-timestamp/`.

## Estructura

```
web-timestamp/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   └── tokens.css
├── js/
│   ├── app.js
│   └── modules/
│       └── timestamp.js
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

La lógica pura (`parseTimestamp`, `parseDateInput`, `relativeTime`, `toDatetimeLocal`, `buildOutputs` y `offsetLabel`) vive en `js/modules/timestamp.js`; sus pruebas están en `tests/web-timestamp/timestamp.test.js`.

## Accesibilidad

- Controles nativos con `label` asociado y pistas enlazadas con `aria-describedby`.
- Errores anunciados con `role="alert"` y `aria-invalid` en el campo afectado.
- Reloj decorativo oculto a lectores de pantalla; las lecturas equivalentes están disponibles como texto.
- Foco visible, enlace para saltar al conversor y `prefers-reduced-motion` para detener el pulso.
- Contraste conforme al libro de estilo.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
