# Test de mecanografía

Teletipo mide velocidad y precisión al teclear con métricas en vivo, una traza de velocidad y un récord local. No usa dependencias, cuentas ni servidor: el texto y las marcas se quedan en el navegador.

## Qué incluye

- Pruebas de 15, 30 y 60 segundos con textos originales en español.
- Marcador en vivo de PPM, precisión, errores acumulados y tiempo restante.
- Cinta de texto con caret, corrección con Retroceso y desplazamiento automático.
- Traza SVG de la velocidad durante la prueba.
- Resultado final con PPM, precisión, errores, tiempo y récord personal.
- Récord guardado en `localStorage` bajo la clave `teletipo:record`.

## Métricas

- **PPM**: caracteres correctos divididos entre cinco, normalizados por minuto.
- **Precisión**: pulsaciones correctas sobre todas las pulsaciones acumuladas, incluidos los errores corregidos.
- **Errores**: pulsaciones incorrectas acumuladas.
- **Tiempo**: cuenta atrás desde la primera tecla; el reloj no arranca hasta que empiezas a escribir.

La lógica pura vive en `js/modules/typing.js` y está cubierta por `tests/web-mecanografia/typing.test.js`.

## Estructura

```text
web-mecanografia/
├── assets/icons/favicon.svg
├── css/style.css
├── index.html
└── js/
    ├── app.js
    └── modules/typing.js
```

## Dirección visual

**Teletipo**: consola de fósforo lima sobre una rejilla oscura, marcador tipográfico grande, cinta mecánica y traza de velocidad. Bricolage Grotesque + JetBrains Mono; verde lima, ámbar y rojo de error.

## Accesibilidad

La prueba se puede iniciar con el botón visible o escribiendo, mantiene el foco en un campo real y anuncia el inicio y el resultado por una región `aria-live`. El texto de la cinta está en el DOM y el retroceso se puede usar sin ratón.

## Comprobaciones

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-mecanografia
npx eslint web-mecanografia
npx prettier --check web-mecanografia
```
