# Gestión de presupuesto

Gestor de presupuesto personal en el navegador: registra ingresos y gastos y consulta el balance neto resultante.

## Características

- Registro de ingresos y gastos con importe, acumulando cada movimiento.
- Totales parciales de ingresos y de gastos.
- Cálculo automático del balance neto, incluso cuando es negativo.
- Interfaz en español con formularios separados para cada tipo de movimiento.
- Formato monetario localizado para `es-ES`.
- Guardado opcional de los totales en `localStorage`, con banner de privacidad, botón para volver a abrirlo y revocación que borra los datos.

## Persistencia

Sin consentimiento, el presupuesto funciona solo en memoria. Al elegir «Guardar en este navegador», los totales se conservan entre visitas; el botón «Privacidad» permite revisar el estado, retirar el permiso o borrar los importes guardados. No se envían datos a ningún servidor.

La lógica de almacenamiento vive en `js/storage.js` y está cubierta por `tests/web-gestiona-presupuesto/storage.test.js`.

## Stack

- HTML5 semántico
- CSS3 (tokens, BEM, Flexbox)
- JavaScript ES6+ (módulo ES)
- Google Fonts (Arvo y Outfit)
- ESLint + Prettier

## Estructura

```
web-gestiona-presupuesto/
  index.html
  assets/
    icons/
      favicon.svg
  css/
    tokens.css
    styles.css
  js/
    app.js
    storage.js
  README.md
```

## Uso

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-gestiona-presupuesto/>. Añade importes en cualquiera de los dos formularios para actualizar el resumen. La primera visita muestra el aviso de privacidad; acepta el guardado para conservar los totales al recargar.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
