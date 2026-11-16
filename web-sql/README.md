# Taller SQL

Atlas formatea consultas SQL y convierte los `CREATE TABLE` del documento en un mapa entidad-relación. Todo ocurre en el navegador: no hay servidor, cuentas ni datos que salgan de la página.

## Qué incluye

- Formateador de sentencias con palabras clave en mayúsculas, una cláusula por línea y sangría de dos espacios.
- Soporte para `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE` y varias sentencias separadas por `;`.
- Mapa ER generado desde las tablas, columnas, claves primarias y claves foráneas declaradas.
- Relaciones inline y de tabla, incluidos esquemas entre comillas y claves compuestas.
- Lista textual de relaciones para no depender del diagrama.
- Botones para cargar un ejemplo, limpiar, formatear con `Ctrl` + `Enter` y copiar la salida.
- Contadores de tablas, columnas y relaciones actualizados mientras escribes.

El formateador es conservador: cambia espacios, saltos y mayúsculas de palabras clave, pero no altera cadenas, identificadores ni valores.

## Formato

El resultado coloca las cláusulas principales en líneas independientes y separa las condiciones `AND`/`OR` con sangría. Las columnas de `SELECT`, los campos de `SET` y las definiciones de una tabla se presentan una por línea. Cada sentencia termina en `;`.

## Esquema

`parseSchema` lee:

- `CREATE TABLE` y `CREATE TABLE IF NOT EXISTS`.
- `PRIMARY KEY` inline y de tabla, incluidas claves compuestas.
- `FOREIGN KEY (...) REFERENCES tabla(...)` y `REFERENCES` inline.
- Nombres entre comillas dobles, comillas invertidas o corchetes, y nombres cualificados con esquema.

La lógica pura vive en `js/modules/sql.js` y `js/modules/schema.js`; las pruebas están en `tests/web-sql/sql.test.js`.

## Estructura

```text
web-sql/
├── assets/icons/favicon.svg
├── css/style.css
├── index.html
└── js/
    ├── app.js
    └── modules/
        ├── schema.js
        └── sql.js
```

## Dirección visual

**Atlas**: taller cartográfico oscuro con el editor en tinta nocturna y el esquema sobre papel topográfico. Tablas como fichas de mapa, rutas coral para las claves foráneas y medidas en mono. Chivo + Fragment Mono; coral, verde teal y papel cálido; sin hero.

## Accesibilidad

El editor y la salida tienen etiquetas y foco visible. El resultado se anuncia con `aria-live`, el mapa expone sus tablas como artículos con nombre y las relaciones se repiten en una lista textual. Los estados no dependen solo del color: las claves se marcan con `PK` y `FK`.

## Comprobaciones

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-sql
npx eslint web-sql
npx prettier --check web-sql
```
