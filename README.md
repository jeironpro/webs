# webs

Monorepo que agrupa las webs estáticas de jeironpro. En la raíz vive un **catálogo** que indexa los 52 proyectos; cada proyecto ocupa su propio subdirectorio (`web-*`) y se sirve de forma independiente como página estática.

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
| [web-codelang-quiz](./web-codelang-quiz/)                       | Codelang Quiz              | Educación       | react, vite, javascript              |
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
| [web-exerciness](./web-exerciness/)                             | Exerciness                 | Productividad   | react, vite, tailwind, javascript    |
| [web-generador-cv](./web-generador-cv/)                         | Generador CV               | Productividad   | react, vite, tailwind, javascript    |
| [web-generador-clave-secreta](./web-generador-clave-secreta/)   | Generador de clave secreta | Generadores     | html, css, javascript                |
| [web-generador-contrasena](./web-generador-contrasena/)         | Generador de contrasenas   | Generadores     | html, css, javascript                |
| [web-generador-crucigramas](./web-generador-crucigramas/)       | Generador de crucigramas   | Generadores     | html, css, javascript                |
| [web-generador-codigo-qr](./web-generador-codigo-qr/)           | Generador de QR            | Generadores     | html, css, javascript                |
| [web-gestiona-presupuesto](./web-gestiona-presupuesto/)         | Gestiona presupuesto       | Productividad   | html, css, javascript                |
| [web-instruccion-login-google](./web-instruccion-login-google/) | Login con Google           | Educación       | html, css, javascript                |
| [web-javarcises](./web-javarcises/)                             | Javarcises                 | Educación       | html, css, javascript                |
| [web-votacion](./web-votacion/)                                 | La Papeleta                | Entretenimiento | html, css, javascript                |
| [web-lector-arxiu](./web-lector-arxiu/)                         | Lector d'arxiu             | Utilidades      | html, css, javascript                |
| [web-lexaro](./web-lexaro/)                                     | Lexaro                     | Productividad   | html, css, javascript, svg           |
| [web-lenguajes-programacion](./web-lenguajes-programacion/)     | Lenguajes de programacion  | Educación       | python, sphinx, myst, css            |
| [web-mandala](./web-mandala/)                                   | Mandala                    | Entretenimiento | html, css, javascript, svg           |
| [web-narcopedia](./web-narcopedia/)                             | Narcopedia                 | Entretenimiento | html, css, javascript                |
| [web-naruto](./web-naruto/)                                     | Naruto                     | Entretenimiento | react, vite, css, javascript         |
| [web-oracle-academy-dpsql](./web-oracle-academy-dpsql/)         | Oracle Academy DPSQL       | Curricular      | html, css, javascript                |
| [web-paises-visitados](./web-paises-visitados/)                 | Paises visitados           | Entretenimiento | html, css, javascript, svg           |
| [web-pokemon](./web-pokemon/)                                   | Pokemon                    | Entretenimiento | react, vite, css, javascript, yarn   |
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
- `npm run data:screenshots` captura las 52 webs en `assets/screenshots/*.webp` (Chrome headless sobre un servidor local).
- `npm test` valida integridad de datos, esquema y generador.

## Añadir una nueva web

1. **Crea la carpeta** en la raíz con el identificador `web-<slug>` (`web-*` es el prefijo convenido; solo minúsculas y guiones).

2. **Deja la web lista para servir**. Toda web del catálogo se sirve desde su subdirectorio, así que el `index.html` debe funcionar con rutas relativas (`./`):

   - Si es HTML/CSS/JS plano: basta con dejar `index.html` y sus assets en `web-<slug>/`.
   - Si usa un bundler (Vite, etc.): el repositorio guarda la **plantilla fuente** (`index.html` apuntando a `/src/main.jsx`) y el workflow de despliegue compila la app en CI (`yarn build`) y publica solo su `dist/`. Configura `base: './'` en el `vite.config` para que el build funcione en la subruta del monorepo.

   > Notas para apps SPA con `BrowserRouter`: GitHub Pages solo sirve archivos físicos, así que las subrutas (`/quiz`, `/ejercicios`) devuelven 404. El monorepo lo resuelve con el `404.html` raíz: si la URL cae dentro de una SPA registrada, redirige a su `index.html` con la subruta en la query (`?/subruta`) y un script en el `index.html` de la app la restaura con `history.replaceState`. Para dar de alta una SPA nueva, añade su id al patrón del `404.html` y copia ese script de restauración en su `index.html`. Si el código hace `fetch` o `<img>` con rutas absolutas (`/data/...`, `/videos/...`), deriva la base del subpath en tiempo de ejecución (p. ej. desde `document.querySelector('script[src*="assets/"]').src`) para que funcione bajo `https://jeironpro.github.io/webs/<id>/`.

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
   | `destacado`   | Booleano (`true` solo para piezas destacadas).                                                                       |

4. **Regenera datos y capturas**, y verifica que todo cuadra:

   ```sh
   npm run data:screenshots   # solo captura las webs nuevas (las existentes se omiten)
   npm run data:build
   npm test
   ```

   Comprueba además que la web responde en su subruta con un servidor local (`python3 -m http.server` sobre la raíz del monorepo) y que el catálogo la muestra.

5. **Confirma y publica**: todo se commitea en `main`; el workflow de CI valida formato, lint, tests y la sincronización de datos, y el workflow de `deploy` compila las SPAs y despliega el sitio a GitHub Pages. La web queda visible en `https://jeironpro.github.io/webs/<id>/`. Si la carpeta no tiene su entrada en `projects.yml`, las validaciones fallan: el dataset y las carpetas locales deben estar en sintonía.

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

Para desarrollar una SPA del monorepo (`web-exerciness`, `web-codelang-quiz`): entra en su carpeta, ejecuta `yarn install` y `yarn dev` (o `yarn build && yarn preview` para probar el build). El despliegue compila ambas apps automáticamente en cada push a `main` (`.github/workflows/deploy.yml`).

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
