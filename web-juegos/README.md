# juegos

Catálogo estático de los 20 juegos de jeironpro. La raíz contiene la sala de máquinas y cada juego vive en su propia carpeta `juego-*`, servido como página independiente.

## Catálogo

HTML, CSS y JavaScript sin frameworks. Incluye tarjetas con captura, género, stack y estado, filtros por género y búsqueda, iconos Material Symbols y soporte de `prefers-reduced-motion`.

Abre `index.html` en la raíz o publica el repositorio en GitHub Pages: el catálogo queda en `https://jeironpro.github.io/webs/web-juegos/` y cada juego en `./<id>/`.

| Proyecto                                        | Título            | Género   | Stack                 |
| ----------------------------------------------- | ----------------- | -------- | --------------------- |
| [juego-4-rayas](./juego-4-rayas/)               | 4 en Raya         | Tablero  | html, css, javascript |
| [juego-7-letras](./juego-7-letras/)             | 7 Letras          | Palabras | html, css, javascript |
| [juego-adivina-numero](./juego-adivina-numero/) | Adivina el numero | Lógica   | html, css, javascript |
| [juego-ajedrez](./juego-ajedrez/)               | Ajedrez           | Tablero  | html, css, javascript |
| [juego-carreras](./juego-carreras/)             | Circuito Neon     | Carreras | html, css, javascript |
| [juego-damas](./juego-damas/)                   | Damas             | Tablero  | html, css, javascript |
| [juego-farsante](./juego-farsante/)             | Farsante          | Lógica   | html, css, javascript |
| [juego-memoriza-carta](./juego-memoriza-carta/) | Memoriza cartas   | Memoria  | html, css, javascript |
| [juego-palabra-oculta](./juego-palabra-oculta/) | Palabra oculta    | Palabras | html, css, javascript |
| [juego-patches](./juego-patches/)               | Patches           | Lógica   | html, css, javascript |
| [juego-puntos-cajas](./juego-puntos-cajas/)     | Puntos y Cajas    | Lógica   | html, css, javascript |
| [juego-queens](./juego-queens/)                 | Queens            | Lógica   | html, css, javascript |
| [juego-serpiente](./juego-serpiente/)           | Serpiente         | Reflejos | html, css, javascript |
| [juego-sopa-letras](./juego-sopa-letras/)       | Sopa de letras    | Palabras | html, css, javascript |
| [juego-sudoku](./juego-sudoku/)                 | Sudoku            | Lógica   | html, css, javascript |
| [juego-tango](./juego-tango/)                   | Tango             | Lógica   | html, css, javascript |
| [juego-tic-tac-toe](./juego-tic-tac-toe/)       | Tres en Raya      | Tablero  | html, css, javascript |
| [juego-wend](./juego-wend/)                     | Wend              | Palabras | html, css, javascript |
| [juego-yatzy](./juego-yatzy/)                   | Yatzy             | Lógica   | html, css, javascript |
| [juego-zip](./juego-zip/)                       | Zip               | Lógica   | html, css, javascript |

## Estructura

```text
web-juegos/
├── assets/            iconos y capturas del catálogo
├── css/               estilos del catálogo
├── data/              projects.yml, projects.json y datos de juego
├── js/                lógica del catálogo
├── juego-*/           cada juego
│   ├── assets/        iconos e imágenes
│   ├── css/           estilos
│   ├── data/          tableros, palabras y diccionarios
│   ├── js/            lógica del juego
│   └── tools/         generadores reproducibles
├── tools/             generación de datos y capturas
└── index.html
```

Las carpetas opcionales solo existen cuando el juego las necesita. `juego-carreras` conserva su propio `package.json` para compilar el núcleo AssemblyScript.

## Datos

`projects.yml` es la fuente de verdad del catálogo. `data/projects.json` es el artefacto ordenado que consume la interfaz.

```sh
node tools/build-data.mjs
node tools/captura-screenshots.mjs
```

La captura de pantallas requiere Google Chrome y ImageMagick, y sirve el catálogo en `127.0.0.1:8941`.

## Desarrollo

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-juegos
npx eslint web-juegos
npx prettier --check web-juegos
```

Los tests de los juegos viven en `tests/web-juegos` y comprueban los tableros, los generadores y el esquema del catálogo.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta [LICENSE](../LICENSE) para más detalles.
