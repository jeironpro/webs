# Visor CSV

Folio abre hojas CSV en el navegador y permite filtrarlas, ordenarlas y exportar solo lo que queda en pantalla. No hay servidor, cuentas ni subida de archivos.

## Qué incluye

- Carga por selector de archivo o arrastrando el CSV sobre la tabla.
- Detección automática de coma, punto y coma o tabulador.
- Lectura de campos entrecomillados, comillas escapadas, saltos de línea internos, CRLF y BOM.
- Búsqueda global y un filtro independiente por columna; ambos ignoran mayúsculas y acentos.
- Ordenación ascendente/descendente por cualquier columna, con números y texto natural.
- Paginación de 25, 50 o 100 filas.
- Exportación de todas las filas filtradas y ordenadas, no solo de la página visible, con BOM UTF-8 para conservar acentos en hojas de cálculo.
- Ejemplo incluido y límite de 8 MB por archivo.

## Formato de entrada

La primera fila se interpreta como cabecera. Las cabeceras vacías o duplicadas se renombran (`Columna 2`, `nombre (2)`), las filas cortas se rellenan y las columnas extra reciben un nombre. Las líneas en blanco se descartan.

La lógica pura vive en `js/modules/csv.js` y está cubierta por `tests/web-csv/csv.test.js`.

## Estructura

```text
web-csv/
├── assets/icons/favicon.svg
├── css/style.css
├── index.html
└── js/
    ├── app.js
    └── modules/csv.js
```

## Dirección visual

**Ledger**: hoja de registro sobre papel rayado, con margen de filtros, cabecera verde bosque, sellos y cifras tabulares. Fraunces + Courier Prime; verde, óxido y dorado; sin hero ni tarjetas redondeadas.

## Accesibilidad

La tabla conserva cabeceras reales y `aria-sort`; los filtros tienen etiqueta, el foco es visible y los resultados se anuncian con `aria-live`. La carga no depende del arrastre: siempre hay un selector de archivo nativo. Los botones de paginación tienen nombre accesible.

## Comprobaciones

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-csv
npx eslint web-csv
npx prettier --check web-csv
```
