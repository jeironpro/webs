# Puntos y Cajas

Juego de puntos y cajas (grilla de 6x6 puntos, 25 cajas) implementado como aplicación
web. Se puede jugar de dos maneras:

- **Contra el bot** (implementado en JavaScript puro) en tres niveles: Fácil, Medio y
  Difícil.
- **Dos jugadores en el mismo tablero** (hot-seat), con turno alternado.

La interfaz incluye un marcador superior con los contadores de cajas de cada jugador
(`|TÚ| |BOT|` y `|0| vs |0|`), un badge con el modo o la dificultad, botones para
reiniciar la partida o volver al menú durante el juego y una pantalla de fin de
partida con el ganador. Al completar una caja, el jugador que la completó suma un
punto y vuelve a jugar (turno extra).

## Reglas del juego

- Tablero de 6x6 puntos que forman 25 cajas (5x5) y 60 aristas posibles.
- Los jugadores alternan turnos colocando una arista por turno.
- Al completar una caja se suma 1 punto al jugador que la cerró y este vuelve a
  jugar; así puede encadenar varias cajas seguidas.
- La partida termina cuando se colocan todas las aristas: gana quien complete más
  cajas (es posible el empate).

## Stack

| Tecnología               | Uso                                                |
| ------------------------ | -------------------------------------------------- |
| React 19                 | Interfaz de usuario (SPA)                          |
| Vite 8                   | Bundler y dev server                               |
| Yarn 4                   | Gestor de paquetes (fijado en `packageManager`)    |
| Vitest + Testing Library | Tests unitarios y de componentes                   |
| ESLint + Prettier        | Lint y formato (Husky + lint-staged en pre-commit) |
| GitHub Actions           | CI: lint, tests y build por PR                     |

## Cómo correr

Requisitos: Node.js 24 (ver `.nvmrc`) y Yarn 4.

```bash
yarn install   # instala dependencias
yarn dev       # servidor de desarrollo (http://localhost:5173)
yarn build     # build de producción en dist/
yarn preview   # sirve el build localmente
yarn test      # ejecuta los tests (Vitest)
yarn lint      # ejecuta ESLint
yarn format    # formatea el código con Prettier
```

## Estructura del proyecto

```
src/
  components/ui/        # componentes genéricos (Button, Icon)
  features/game/        # motor de reglas en JS puro (constants, edges, board, game) + tests
  features/bot/         # bot en JS puro (minimax + alfa-beta) y dificultades
  features/board/       # tablero interactivo (Board, EdgeButton, BoxCell)
  features/scoreboard/  # marcador superior con contadores
  features/menu/        # pantalla de inicio y fin de partida
  hooks/                # useGame (estado de partida y turno del bot)
  styles/               # tokens de diseño y estilos base
docs/
  style-guide.md        # libro de estilo (colores, tipografía, componentes)
```

## Diseño

La dirección visual es editorial y minimalista, inspirada en la estética del estudio
de diseño [dsgn-dept.com](https://www.dsgn-dept.com/): paleta de papel y tinta con un
acento bermellón, tipografía serif editorial (Fraunces) para títulos y etiquetas en
mayúsculas. Todos los valores visuales (paleta, tipografía, espaciados, radios,
sombras) están definidos en el libro de estilo y materializados como custom properties
en `src/styles/tokens.css`. Los iconos usan la librería Material Symbols de Google.

## Calidad

- Tests: 58 tests entre el motor de reglas, el bot, hooks y componentes (`yarn test`).
- CI: pipeline en `.github/workflows/ci.yml` que ejecuta lint, tests y build en cada
  pull request y push a `main`.
- Pre-commit: Husky + lint-staged aplican ESLint y Prettier sobre los archivos
  modificados.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para
más detalles.
