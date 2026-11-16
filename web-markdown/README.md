# Editor de Markdown

Pliego es un editor de Markdown con vista previa en vivo, borrador local y un renderizador propio. No hay cuenta, servidor ni dependencias de runtime: el documento se compone en el navegador y nunca se sube.

## Qué incluye

- Panel de origen con numeración de líneas y galerada de papel actualizada al escribir.
- Barra de formato para encabezados, negrita, cursiva, código, enlaces, listas, citas y bloques de código.
- Estadísticas de palabras, caracteres, líneas y tiempo de lectura.
- Borrador guardado en `localStorage` bajo la clave `pliego:v1`, con aviso si el navegador bloquea el almacenamiento.
- Pestañas móviles Escribir/Vista previa y dos paneles simultáneos en escritorio.
- Atajos `Ctrl/Cmd+B`, `Ctrl/Cmd+I`, `Ctrl/Cmd+K` y `Ctrl/Cmd+S`.

## Markdown admitido

- Encabezados `#` a `######`, párrafos y reglas horizontales.
- Negrita, cursiva, tachado, código en línea y enlaces.
- Listas ordenadas y sin numerar, citas y bloques de código con lenguaje.
- Imágenes con URL segura y texto alternativo.

El HTML crudo no se inyecta: el parser produce un árbol de bloques y la interfaz lo construye con nodos del DOM. Los enlaces `javascript:`, `data:` y las rutas protocol-relative se descartan. Los enlaces externos se abren con `rel="noopener noreferrer"`.

## Estructura

```text
web-markdown/
├── assets/icons/favicon.svg
├── css/style.css
├── index.html
└── js/
    ├── app.js
    └── modules/markdown.js
```

## Dirección visual

**Pliego**: un banco de pruebas editorial. El origen es una consola oscura con reglas de imprenta y el resultado es una galerada de papel cálido; Archivo + Newsreader + IBM Plex Mono, bermellón, latón y salvia. Sin hero ni secciones apiladas.

## Comprobaciones

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-markdown
npx eslint web-markdown
npx prettier --check web-markdown
```
