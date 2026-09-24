# webs

Monorepo que agrupa las webs estáticas de jeironpro. En la raíz vive un **catálogo** que indexa los 46 proyectos; cada proyecto ocupa su propio subdirectorio (`web-*`) y se sirve de forma independiente como página estática.

## Catálogo

El catálogo es vanilla HTML, CSS y JavaScript (sin frameworks), con diseño definido en [docs/style-guide.md](docs/style-guide.md):

- Tarjetas por proyecto con captura, categoría, stack y estado.
- Filtros por categoría y búsqueda por título, descripción, etiquetas o stack.
- Iconos Material Symbols, sin emojis; accesible y con `prefers-reduced-motion`.

Abre `index.html` de la raíz (o despliega el repositorio en GitHub Pages: el catálogo queda en `https://jeironpro.github.io/webs/` y cada web en su subruta `./<id>/`).

| Proyecto                                                        | Título                     | Categoría       | Stack                                |
| --------------------------------------------------------------- | -------------------------- | --------------- | ------------------------------------ |
| [web-algoritmos](./web-algoritmos/)                             | Algoritmos de repaso       | Educación       | html, css, javascript                |
| [web-biblia](./web-biblia/)                                     | Biblia                     | Educación       | html, css, javascript                |
| [web-calculadora](./web-calculadora/)                           | Calculadora                | Utilidades      | html, css, javascript                |
| [web-calculadora-edad](./web-calculadora-edad/)                 | Calculadora de edad        | Utilidades      | html, css, javascript                |
| [web-calendario](./web-calendario/)                             | Calendario                 | Utilidades      | html, css, javascript                |
| [web-calificaciones-escolares](./web-calificaciones-escolares/) | Calificaciones escolares   | Educación       | html, css, javascript                |
| [web-clima](./web-clima/)                                       | Clima                      | Utilidades      | react, vite, javascript, css         |
| [web-codi-wiki](./web-codi-wiki/)                               | Codi Wiki                  | Referencia      | html, css, javascript                |
| [web-codigos-http](./web-codigos-http/)                         | Codigos HTTP               | Referencia      | html, css, javascript                |
| [web-codingbat-solutions](./web-codingbat-solutions/)           | CodingBat solutions        | Educación       | html, css, javascript                |
| [web-color-picker](./web-color-picker/)                         | Color Picker               | Utilidades      | html, css, javascript, svg           |
| [web-contador-palabras](./web-contador-palabras/)               | Contador de palabras       | Utilidades      | html, css, javascript                |
| [web-continguts-daw](./web-continguts-daw/)                     | Continguts DAW             | Curricular      | html, css, javascript                |
| [web-conversor-universal](./web-conversor-universal/)           | Conversor universal        | Utilidades      | html, css, javascript                |
| [web-convertidor-moneda](./web-convertidor-moneda/)             | Convertidor de moneda      | Utilidades      | html, css, javascript                |
| [web-curso-dcs](./web-curso-dcs/)                               | Curso DCS                  | Curricular      | html, css, javascript                |
| [web-curso-git](./web-curso-git/)                               | Curso de Git               | Educación       | html, css, javascript                |
| [web-curso-sql](./web-curso-sql/)                               | Curso de SQL               | Educación       | html, css, javascript                |
| [web-cursos-cpnl](./web-cursos-cpnl/)                           | Cursos CPNL                | Curricular      | html, css, javascript                |
| [web-dados](./web-dados/)                                       | Dados                      | Entretenimiento | html, css, javascript                |
| [web-ejercicios-pyja](./web-ejercicios-pyja/)                   | Ejercicios PyJa            | Educación       | html, css, javascript                |
| [web-generador-cv](./web-generador-cv/)                         | Generador CV               | Productividad   | react, vite, tailwind, javascript    |
| [web-generador-clave-secreta](./web-generador-clave-secreta/)   | Generador de clave secreta | Generadores     | html, css, javascript                |
| [web-generador-contrasena](./web-generador-contrasena/)         | Generador de contrasenas   | Generadores     | html, css, javascript                |
| [web-generador-crucigramas](./web-generador-crucigramas/)       | Generador de crucigramas   | Generadores     | html, css, javascript                |
| [web-generador-codigo-qr](./web-generador-codigo-qr/)           | Generador de QR            | Generadores     | html, css, javascript                |
| [web-gestiona-presupuesto](./web-gestiona-presupuesto/)         | Gestiona presupuesto       | Productividad   | html, css, javascript                |
| [web-javarcises](./web-javarcises/)                             | Javarcises                 | Educación       | html, css, javascript                |
| [web-votacion](./web-votacion/)                                 | La Papeleta                | Entretenimiento | html, css, javascript                |
| [web-lector-arxiu](./web-lector-arxiu/)                         | Lector d'arxiu             | Utilidades      | html, css, javascript                |
| [web-lexaro](./web-lexaro/)                                     | Lexaro                     | Productividad   | html, css, javascript, svg           |
| [web-mandala](./web-mandala/)                                   | Mandala                    | Entretenimiento | html, css, javascript, svg           |
| [web-narcopedia](./web-narcopedia/)                             | Narcopedia                 | Entretenimiento | html, css, javascript                |
| [web-oracle-academy-dpsql](./web-oracle-academy-dpsql/)         | Oracle Academy DPSQL       | Curricular      | html, css, javascript                |
| [web-paises-visitados](./web-paises-visitados/)                 | Paises visitados           | Entretenimiento | html, css, javascript, svg           |
| [web-pomodoro](./web-pomodoro/)                                 | Pomodoro                   | Productividad   | react, vite, tailwind, javascript    |
| [web-porcentaje-anual](./web-porcentaje-anual/)                 | Porcentaje anual           | Utilidades      | html, css, javascript                |
| [web-daw](./web-daw/)                                           | Portal DAW                 | Curricular      | html, css, javascript                |
| [web-programmer-day](./web-programmer-day/)                     | Programmer Day             | Entretenimiento | react, vite, typescript, gsap, three |
| [web-pythoncises](./web-pythoncises/)                           | Pythoncises                | Educación       | html, css, javascript                |
| [web-redimensiona-imagen](./web-redimensiona-imagen/)           | Redimensiona imagen        | Utilidades      | html, css, javascript                |
| [web-refprog](./web-refprog/)                                   | RefProg                    | Referencia      | html, css, javascript, svg           |
| [web-reloj](./web-reloj/)                                       | Reloj                      | Entretenimiento | vite, typescript, three, javascript  |
| [web-reproductor-musica](./web-reproductor-musica/)             | Reproductor de musica      | Entretenimiento | html, css, javascript                |
| [web-ruleta](./web-ruleta/)                                     | Ruleta                     | Entretenimiento | html, css, javascript, svg           |
| [web-tests-daw](./web-tests-daw/)                               | Tests DAW                  | Curricular      | html, css, javascript                |

## Datos del catálogo

La fuente de verdad es `projects.yml` en la raíz. Los artefactos se regeneran con comandos npm:

- `npm run data:build` valida el esquema y genera `assets/projects.json` (datos ordenados que consume el catálogo).
- `npm run data:screenshots` captura las 46 webs en `assets/screenshots/*.webp` (Chrome headless sobre un servidor local).
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

`pre-commit` se instala con `pre-commit install`; las carpetas `web-*`, `vendor/` y `assets/` quedan excluidas de lint y formato.

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
