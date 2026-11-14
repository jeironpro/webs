# webs

Monorepo que agrupa las webs estáticas de jeironpro. En la raíz vive un **catálogo** que indexa los 55 proyectos; cada proyecto ocupa su propio subdirectorio (`web-*`) y se sirve de forma independiente como página estática. Cinco de ellas son además **sub-catálogos**: hubs con su propio índice de subproyectos (el catálogo raíz las distingue con el filtro y la insignia "Sub-catálogo").

## Estado actual

- **55 webs** y **5 sub-catálogos** publicados como sitios estáticos, sin paso de build por web.
- **80 capturas** mantenidas en el repositorio: 55 del catálogo raíz, 5 de dashboards y 20 de juegos.
- **25 webs adicionales** con auditoría técnica cerrada: HTML, CSS, JS, navegador, limpieza, favicon y README al 100 %.
- **162 pruebas** automatizadas y comprobaciones de formato, lint, enlaces internos, datos y capturas.
- Cuatro workflows: `ci`, `enlaces`, `capturas` y `deploy`; este último publica el repositorio tal cual en GitHub Pages.

## Catálogo

El catálogo es vanilla HTML, CSS y JavaScript (sin frameworks), con diseño definido en [docs/style-guide.md](docs/style-guide.md):

- Tarjetas por proyecto con captura, categoría, stack y estado.
- Filtros por categoría y búsqueda por título, descripción, etiquetas o stack.
- Iconos Material Symbols, sin emojis; accesible y con `prefers-reduced-motion`.

Abre `index.html` de la raíz (o despliega el repositorio en GitHub Pages: el catálogo queda en `https://jeironpro.github.io/webs/` y cada web en su subruta `./<id>/`).

| Proyecto                                                        | Título                      | Categoría       | Stack                        |
| --------------------------------------------------------------- | --------------------------- | --------------- | ---------------------------- |
| [web-algoritmos](./web-algoritmos/)                             | Algoritmos de repaso        | Educación       | html, css, javascript        |
| [web-apis](./web-apis/)                                         | Apis _(sub-catálogo)_       | Referencia      | html, css, javascript        |
| [web-biblia](./web-biblia/)                                     | Biblia                      | Educación       | html, css, javascript        |
| [web-calculadora](./web-calculadora/)                           | Calculadora                 | Utilidades      | html, css, javascript        |
| [web-calculadora-edad](./web-calculadora-edad/)                 | Calculadora de edad         | Utilidades      | html, css, javascript        |
| [web-calendario](./web-calendario/)                             | Calendario                  | Utilidades      | html, css, javascript        |
| [web-calificaciones-escolares](./web-calificaciones-escolares/) | Calificaciones escolares    | Educación       | html, css, javascript        |
| [web-clima](./web-clima/)                                       | Clima                       | Utilidades      | html, css, javascript        |
| [web-codelang-quiz](./web-codelang-quiz/)                       | Codelang Quiz               | Educación       | html, css, javascript        |
| [web-codi-wiki](./web-codi-wiki/)                               | Codi Wiki                   | Referencia      | html, css, javascript        |
| [web-codigos-http](./web-codigos-http/)                         | Codigos HTTP                | Referencia      | html, css, javascript        |
| [web-codingbat-solutions](./web-codingbat-solutions/)           | CodingBat solutions         | Educación       | html, css, javascript        |
| [web-color-picker](./web-color-picker/)                         | Color Picker                | Utilidades      | html, css, javascript, svg   |
| [web-contador-palabras](./web-contador-palabras/)               | Contador de palabras        | Utilidades      | html, css, javascript        |
| [web-continguts-daw](./web-continguts-daw/)                     | Continguts DAW              | Curricular      | html, css, javascript        |
| [web-conversor-universal](./web-conversor-universal/)           | Conversor universal         | Utilidades      | html, css, javascript        |
| [web-convertidor-moneda](./web-convertidor-moneda/)             | Convertidor de moneda       | Utilidades      | html, css, javascript        |
| [web-curso-dcs](./web-curso-dcs/)                               | Curso DCS                   | Curricular      | html, css, javascript        |
| [web-curso-git](./web-curso-git/)                               | Curso de Git                | Educación       | html, css, javascript        |
| [web-curso-sql](./web-curso-sql/)                               | Curso de SQL                | Educación       | html, css, javascript        |
| [web-cursos-cpnl](./web-cursos-cpnl/)                           | Cursos CPNL                 | Curricular      | html, css, javascript        |
| [web-dashboards](./web-dashboards/)                             | Dashboards _(sub-catálogo)_ | Productividad   | html, css, javascript        |
| [web-dados](./web-dados/)                                       | Dados                       | Entretenimiento | html, css, javascript        |
| [web-ejercicios-pyja](./web-ejercicios-pyja/)                   | Ejercicios PyJa             | Educación       | html, css, javascript        |
| [web-exerciness](./web-exerciness/)                             | Exerciness                  | Productividad   | html, css, javascript        |
| [web-frontend](./web-frontend/)                                 | Frontend _(sub-catálogo)_   | Referencia      | html, css, javascript        |
| [web-generador-cv](./web-generador-cv/)                         | Generador CV                | Productividad   | html, css, javascript        |
| [web-generador-clave-secreta](./web-generador-clave-secreta/)   | Generador de clave secreta  | Generadores     | html, css, javascript        |
| [web-generador-contrasena](./web-generador-contrasena/)         | Generador de contrasenas    | Generadores     | html, css, javascript        |
| [web-generador-crucigramas](./web-generador-crucigramas/)       | Generador de crucigramas    | Generadores     | html, css, javascript        |
| [web-generador-codigo-qr](./web-generador-codigo-qr/)           | Generador de QR             | Generadores     | html, css, javascript        |
| [web-gestiona-presupuesto](./web-gestiona-presupuesto/)         | Gestiona presupuesto        | Productividad   | html, css, javascript        |
| [web-instruccion-login-google](./web-instruccion-login-google/) | Login con Google            | Educación       | html, css, javascript        |
| [web-javarcises](./web-javarcises/)                             | Javarcises                  | Educación       | html, css, javascript        |
| [web-juegos](./web-juegos/)                                     | Juegos _(sub-catálogo)_     | Entretenimiento | html, css, javascript, three |
| [web-votacion](./web-votacion/)                                 | La Papeleta                 | Entretenimiento | html, css, javascript        |
| [web-lector-archivo](./web-lector-archivo/)                     | Lector de archivos          | Utilidades      | html, css, javascript        |
| [web-lexaro](./web-lexaro/)                                     | Lexaro                      | Productividad   | html, css, javascript, svg   |
| [web-mandala](./web-mandala/)                                   | Mandala                     | Entretenimiento | html, css, javascript, svg   |
| [web-narcopedia](./web-narcopedia/)                             | Narcopedia                  | Entretenimiento | html, css, javascript        |
| [web-naruto](./web-naruto/)                                     | Naruto                      | Entretenimiento | html, css, javascript        |
| [web-oracle-academy-dpsql](./web-oracle-academy-dpsql/)         | Oracle Academy DPSQL        | Curricular      | html, css, javascript        |
| [web-paises-visitados](./web-paises-visitados/)                 | Paises visitados            | Entretenimiento | html, css, javascript, svg   |
| [web-pokemon](./web-pokemon/)                                   | Pokemon                     | Entretenimiento | html, css, javascript        |
| [web-pomodoro](./web-pomodoro/)                                 | Pomodoro                    | Productividad   | html, css, javascript        |
| [web-porcentaje-anual](./web-porcentaje-anual/)                 | Porcentaje anual            | Utilidades      | html, css, javascript        |
| [web-daw](./web-daw/)                                           | Portal DAW _(sub-catálogo)_ | Curricular      | html, css, javascript        |
| [web-programmer-day](./web-programmer-day/)                     | Programmer Day              | Entretenimiento | html, css, javascript, three |
| [web-pythoncises](./web-pythoncises/)                           | Pythoncises                 | Educación       | html, css, javascript        |
| [web-redimensiona-imagen](./web-redimensiona-imagen/)           | Redimensiona imagen         | Utilidades      | html, css, javascript        |
| [web-refprog](./web-refprog/)                                   | RefProg                     | Referencia      | html, css, javascript, svg   |
| [web-reloj](./web-reloj/)                                       | Reloj                       | Entretenimiento | html, css, javascript, three |
| [web-reproductor-musica](./web-reproductor-musica/)             | Reproductor de musica       | Entretenimiento | html, css, javascript        |
| [web-ruleta](./web-ruleta/)                                     | Ruleta                      | Entretenimiento | html, css, javascript, svg   |
| [web-tests-daw](./web-tests-daw/)                               | Tests DAW                   | Curricular      | html, css, javascript        |

Las 5 webs marcadas _(sub-catálogo)_ son hubs con catálogo propio: `web-apis` (5 APIs Python descargables), `web-dashboards` (5 dashboards), `web-daw` (7 sub-webs de DAW1 y DAW2), `web-frontend` (componentes) y `web-juegos` (20 juegos). Se filtran con el botón "Sub-catálogo" del catálogo raíz.

## Datos del catálogo

La fuente de verdad es `projects.yml` en la raíz. Los artefactos se regeneran con comandos npm:

- `npm run data:build` valida el esquema y genera `assets/projects.json` (datos ordenados que consume el catálogo).
- `npm run data:screenshots` captura las 55 webs en `assets/screenshots/*.webp` (Chrome headless sobre un servidor local); con ids detrás (`npm run data:screenshots -- web-apis`) regenera solo esas.
- `npm run capturas:check` falla si una captura está desfasada o falta, usando el manifiesto y las fechas de git; el workflow `capturas` lo trata como bloqueante.
- `npm test` valida integridad de datos, esquema y generador.

## Añadir una nueva web

1. **Crea la carpeta** en la raíz con el identificador `web-<slug>` (`web-*` es el prefijo convenido; solo minúsculas y guiones).

2. **Deja la web lista para servir**. Todo se publica tal cual desde su subdirectorio, sin compilación en CI:

   - HTML/CSS/JS plano: `index.html` y sus assets en `web-<slug>/`, con rutas relativas.
   - Subproyectos de un hub: el HTML, CSS, JS y assets ya compilados viven en su carpeta; no se usan `index.src.html` ni builds por web.
   - Dependencias de terceros: se vendorizan dentro de la web (Three.js, jsPDF, etc.) y se referencian con rutas relativas.

   GitHub Pages no reescribe rutas internas: si una web necesita navegación propia, debe resolverla con archivos reales o con su propio fallback.

3. **Añade la entrada en `projects.yml`** respetando el orden alfabético por `id` y el esquema de las webs existentes:

   | Campo         | Regla                                                                                                                |
   | ------------- | -------------------------------------------------------------------------------------------------------------------- |
   | `id`          | Igual al nombre de la carpeta (`web-<slug>`).                                                                        |
   | `titulo`      | Título visible en el catálogo.                                                                                       |
   | `descripcion` | Entre 10 y 240 caracteres, descriptiva y sin acentos.                                                                |
   | `url`         | El subpath relativo `./<id>/`.                                                                                       |
   | `repo`        | Enlace a la carpeta en `main` del monorepo.                                                                          |
   | `screenshot`  | Ruta de la captura en `assets/screenshots/<id>.webp`.                                                                |
   | `stack`       | Raíces permitidas: html, css, javascript, typescript, react, vite, tailwind, gsap, three, svg, python, sphinx, myst. |
   | `categorias`  | Una o más de: utilidades, generadores, educacion, entretenimiento, productividad, referencia, curricular.            |
   | `tags`        | Lista de etiquetas en minúsculas y espacios (sin acentos ni guiones).                                                |
   | `estado`      | `live`, `pendiente` o `externo`.                                                                                     |
   | `subcatalogo` | Booleano opcional (`true` solo si la web es un hub con sub-catálogo propio).                                         |
   | `destacado`   | Booleano (`true` solo para piezas destacadas).                                                                       |

4. **Regenera datos y capturas**, y verifica que todo cuadra:

   ```sh
   npm run data:screenshots -- --force  # regenera las 55 capturas del catálogo
   npm run data:screenshots -- web-apis # regenera solo una
   npm run capturas:check               # falla si hay capturas desfasadas o ausentes
   npm run data:build
   npm test
   ```

   Comprueba además que la web responde en su subruta con un servidor local (`python3 -m http.server` sobre la raíz del monorepo) y que el catálogo la muestra.

5. **Confirma y publica**: todo se commitea en `main`; el workflow de CI valida formato, lint, auditoría de reglas, tests y la sincronización de datos, y el workflow de `deploy` copia el repositorio y despliega el sitio a GitHub Pages. La web queda visible en `https://jeironpro.github.io/webs/<id>/`. Si la carpeta no tiene su entrada en `projects.yml`, las validaciones fallan: el dataset y las carpetas locales deben estar en sintonía.

## Desarrollo

Requisito: Node 24 (ver `.nvmrc`).

```sh
npm install
npm run data:build
npm test
npm run lint
npm run format:check
npm run audit:rules -- --fail
npm run links:check
npm run capturas:check
```

`pre-commit` se instala con `pre-commit install`; todas las webs `web-*` se lintan y formatean. Solo quedan fuera las dependencias de terceros en `vendor/` y los binarios de `assets/`.

Todas las webs son estáticas: no hay `yarn dev` ni build por app. Para probar una web, sirve la raíz con `python3 -m http.server` y abre `http://127.0.0.1:8000/<id>/`; el despliegue copia el árbol a GitHub Pages en cada push a `main` (`.github/workflows/deploy.yml`).

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
