# juegos

Monorepo que agrupa los juegos de jeironpro como una **sala de máquinas**. En la raíz vive un **catálogo** que indexa los 13 juegos; cada juego ocupa su propio subdirectorio (`juego-*`) y se sirve de forma independiente como página estática.

## Catálogo

El catálogo es vanilla HTML, CSS y JavaScript (sin frameworks), con la identidad arcade-neon definida en [docs/style-guide.md](docs/style-guide.md):

- Tarjetas (cartuchos) por juego con captura, género, stack y estado.
- Filtros por género, destacados y búsqueda por título, descripción, etiquetas o stack.
- Iconos Material Symbols, sin emojis; accesible y con `prefers-reduced-motion`.

Abre `index.html` de la raíz (o despliega el repositorio en GitHub Pages: el catálogo queda en `https://jeironpro.github.io/juegos/` y cada juego en su subruta `./<id>/`).

| Proyecto                                        | Título            | Género   | Stack                   |
| ----------------------------------------------- | ----------------- | -------- | ----------------------- |
| [juego-4-rayas](./juego-4-rayas/)               | 4 en Raya         | Tablero  | react, vite, javascript |
| [juego-7-letras](./juego-7-letras/)             | 7 Letras          | Palabras | html, css, javascript   |
| [juego-adivina-numero](./juego-adivina-numero/) | Adivina el numero | Lógica   | html, css, javascript   |
| [juego-ajedrez](./juego-ajedrez/)               | Ajedrez           | Tablero  | react, vite, javascript |
| [juego-damas](./juego-damas/)                   | Damas             | Tablero  | react, vite, javascript |
| [juego-memoriza-carta](./juego-memoriza-carta/) | Memoriza cartas   | Memoria  | html, css, javascript   |
| [juego-palabra-oculta](./juego-palabra-oculta/) | Palabra oculta    | Palabras | html, css, javascript   |
| [juego-puntos-cajas](./juego-puntos-cajas/)     | Puntos y Cajas    | Lógica   | react, vite, javascript |
| [juego-serpiente](./juego-serpiente/)           | Serpiente         | Reflejos | html, css, javascript   |
| [juego-sopa-letras](./juego-sopa-letras/)       | Sopa de letras    | Palabras | html, css, javascript   |
| [juego-sudoku](./juego-sudoku/)                 | Sudoku            | Lógica   | html, css, javascript   |
| [juego-tic-tac-toe](./juego-tic-tac-toe/)       | Tres en Raya      | Tablero  | html, css, javascript   |
| [juego-yatzy](./juego-yatzy/)                   | Yatzy             | Lógica   | react, vite, javascript |

## Datos del catálogo

La fuente de verdad es `projects.yml` en la raíz. Los artefactos se regeneran con comandos npm:

- `npm run data:build` valida el esquema y genera `assets/projects.json` (datos ordenados que consume el catálogo).
- `npm run data:screenshots` captura los 13 juegos en `assets/screenshots/*.webp` (Chrome headless sobre un servidor local).
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

`pre-commit` se instala con `pre-commit install`; las carpetas `juego-*`, `vendor/` y `assets/` quedan excluidas de lint y formato.

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
