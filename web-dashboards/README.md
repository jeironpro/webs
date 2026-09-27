# dashboards

Monorepo que agrupa los dashboards de jeironpro como una **sala de control**. En la raíz vive un **catálogo** que indexa los 5 dashboards; cada dashboard ocupa su propio subdirectorio (`dashboard-*`) y se sirve de forma independiente como página estática.

## Catálogo

El catálogo es vanilla HTML, CSS y JavaScript (sin frameworks), con la identidad de consola de control sobre panel claro definida en [docs/style-guide.md](docs/style-guide.md):

- Tarjetas (paneles) por dashboard con captura, dominio, stack y estado.
- Filtros por dominio, destacados y búsqueda por título, descripción, etiquetas o stack.
- Iconos Material Symbols, sin emojis; accesible y con `prefers-reduced-motion`.

Abre `index.html` de la raíz (o despliega el repositorio en GitHub Pages: el catálogo queda en `https://jeironpro.github.io/dashboards/` y cada dashboard en su subruta `./<id>/`).

| Dashboard                                                         | Título  | Dominio   | Stack                   |
| ----------------------------------------------------------------- | ------- | --------- | ----------------------- |
| [dashboard-administrador](./dashboard-administrador/)             | Nexo    | Admin     | react, vite, typescript |
| [dashboard-financiero](./dashboard-financiero/)                   | Suma    | Finanzas  | react, vite, typescript |
| [dashboard-monitoreo](./dashboard-monitoreo/)                     | Vigia   | Monitoreo | react, vite, typescript |
| [dashboard-operativo-analitico](./dashboard-operativo-analitico/) | Pulso   | Analítica | react, vite, typescript |
| [dashboard-soporte](./dashboard-soporte/)                         | Soporte | Soporte   | react, vite, typescript |

## Datos del catálogo

La fuente de verdad es `projects.yml` en la raíz. Los artefactos se regeneran con comandos npm:

- `npm run data:build` valida el esquema y genera `assets/projects.json` (datos ordenados que consume el catálogo).
- `npm run data:screenshots` captura los 5 dashboards en `assets/screenshots/*.webp` (Chrome headless sobre un servidor local).
- `npm test` valida integridad de datos, esquema y generador.

## Desarrollo

Requisito: Node 24 (ver `.nvmrc`).

```sh
npm install
npm run data:build
npm test
npm run lint
npm run format:check
```

`pre-commit` se instala con `pre-commit install`; las carpetas `dashboard-*`, `vendor/` y `assets/` quedan excluidas de lint y formato.

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
