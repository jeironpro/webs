# Documentación técnica de exerciness

Este documento describe la arquitectura, el flujo de datos, el estado global,
las rutas, las pruebas y el flujo de trabajo de **exerciness**. Complementa al
[libro de estilo](style-guide.md), que es la fuente de verdad del diseño.

## 1. Visión general

**exerciness** es un frontend SPA (React + Vite) sin backend que presenta un
catálogo de ejercicios de gimnasio. El usuario puede buscar y filtrar ejercicios,
ver el detalle con instrucciones y multimedia, marcarlos como favoritos y
comparar hasta 4 lado a lado. Todo se ejecuta en el navegador; los datos provienen
de un dataset estático servido desde `public/`.

## 2. Stack y versiones

| Capa     | Tecnología                             | Versión |
| -------- | -------------------------------------- | ------- |
| Build    | Vite                                   | ^8.2.0  |
| UI       | React                                  | ^18     |
| Enrutado | React Router                           | ^6      |
| Estado   | Zustand                                | ^5      |
| Estilos  | Tailwind CSS                           | ^3      |
| Calidad  | ESLint 9 + Prettier 3 + jsx-a11y       | —       |
| Tests    | Vitest + React Testing Library + jsdom | ^4.1.10 |
| Gestor   | Yarn Berry (Corepack)                  | 4.9.2   |

Node: la versión usada en desarrollo es la 24 LTS.

## 3. Flujo de datos

```
exercises-dataset-main/  (gitignored, fuente de verdad)
        │
        │  yarn data:sync  (scripts/sync-data.mjs)
        ▼
public/
  ├── data/exercises.json
  ├── images/  (JPG 180x180)
  └── videos/  (GIF 180x180)
        │
        │  fetch('/data/exercises.json')
        ▼
services/exerciseService.js  (valida + normaliza rutas absolutas)
        │
        ▼
store/exerciseStore.js  (Zustand, carga una única vez y cachea)
        │
        ▼
Páginas y componentes
```

El dataset fuente vive fuera del repo en `exercises-dataset-main/` (ignorado) y
procede de [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
de [@hasaneyldrm](https://github.com/hasaneyldrm).
El script `yarn data:sync` copia `data/exercises.json`, `images/` y `videos/` a
`public/`, que sí está versionado para que el build de CI no dependa del dataset
local.

Los GIFs se optimizan con `yarn media:optimize` (`scripts/optimize-media.py`):
calcula el bounding box del contenido animado (los lienzos de origen son 180×180
con grandes márgenes muertos) y lo recorta con ImageMagick conservando la
animación y su delta-coding. Esto permite mostrarlos a un tamaño mayor sin
escalado excesivo y reduce el peso de `public/videos`. Es idempotente (solo
procesa lienzos 180×180) y deja el dataset fuente intacto. Requiere
Python 3 + Pillow e ImageMagick.

### 3.1 Estructura del dataset

1.324 registros. Los campos relevantes de cada ejercicio:

| Campo               | Tipo     | Descripción                                 |
| ------------------- | -------- | ------------------------------------------- |
| `id`                | string   | Identificador de 4 dígitos                  |
| `name`              | string   | Nombre en inglés                            |
| `category`          | string   | Categoría (strength, stretching, ...)       |
| `body_part`         | string   | Grupo corporal (10 valores)                 |
| `equipment`         | string   | Equipo (28 valores)                         |
| `target`            | string   | Músculo objetivo (19 valores)               |
| `muscle_group`      | string   | Músculo principal (28 valores)              |
| `secondary_muscles` | string[] | Músculos secundarios                        |
| `instructions`      | object   | Instrucciones por idioma (`es`, `en`, ...)  |
| `instruction_steps` | object   | Pasos por idioma                            |
| `image` / `gif_url` | string   | Rutas de media (se normalizan a absolutas)  |
| `attribution`       | string   | **`© Gym visual`** — atribución obligatoria |

Nota: el dataset **no incluye un campo de dificultad**, por lo que los filtros
disponibles son grupo corporal, equipo, objetivo y músculo principal.

### 3.2 Idioma

La interfaz está en español. El detalle usa `instructions.es` e
`instruction_steps.es`. Las etiquetas de los valores del dataset se traducen en
`src/utils/constants.js`.

## 4. Arquitectura y estructura

```
src/
├── components/
│   ├── common/    ExerciseCard, ExerciseFilters, FavoriteButton, CompareButton, CompareBar...
│   ├── layout/    Layout, Navbar, Footer
│   └── ui/        Kit de diseño: Button, Card, Badge, Icon, ...
├── hooks/         useExercises (carga del catálogo)
├── pages/         Home, Exercises, ExerciseDetail, Favorites, Compare, NotFound
├── routes/        Definición central de rutas
├── services/      exerciseService (acceso a datos)
├── store/         Stores de Zustand
├── styles/        tokens.css (tokens RGB), globals.css, componentes CSS
├── test/          utils.jsx (renderWithRouter) y fixtures.js
└── utils/         constants, helpers, validators
```

Los alias de importación usan `@` → `src/`. Los componentes de UI son
presentacionales (sin lógica de negocio); la lógica vive en stores y utils.

## 5. Estado global (Zustand)

| Store            | Persistencia (localStorage) | Responsabilidad                               |
| ---------------- | --------------------------- | --------------------------------------------- |
| `exerciseStore`  | No                          | Catálogo completo, estado de carga y error    |
| `filterStore`    | No                          | Búsqueda, filtros y orden del catálogo        |
| `favoritesStore` | `exerciness-favorites`      | Ids de favoritos                              |
| `compareStore`   | `exerciness-compare`        | Ids del comparador (máx. 4)                   |
| `themeStore`     | `exerciness-theme`          | Tema claro/oscuro + clase `.dark` en `<html>` |

Patrones: selectores reutilizables (`selectFavoritesCount`, `selectIsComparing`,
`selectTheme`, ...) y acciones puras vía `set`. `exerciseStore.load()` es idéntico:
las páginas comprueban si el catálogo ya está cargado antes de llamarlo, evitando
descargar las 17 MB del JSON más de una vez.

## 6. Rutas

| Ruta             | Página         | Descripción                        |
| ---------------- | -------------- | ---------------------------------- |
| `/`              | Home           | Hero con acceso al catálogo        |
| `/ejercicios`    | Exercises      | Catálogo con búsqueda y filtros    |
| `/ejercicio/:id` | ExerciseDetail | Detalle, media, pasos, favorito    |
| `/favoritos`     | Favorites      | Ejercicios guardados               |
| `/comparar`      | Compare        | Tabla lado a lado de seleccionados |
| `*`              | NotFound       | 404                                |

El Layout envuelve todas las rutas (navbar, footer y barra de comparación).
`ErrorBoundary` actúa como `errorElement` del router.

## 7. Tema claro/oscuro

Los colores son tokens CSS RGB en `tokens.css`. El tema oscuro se activa con la
clase `.dark` sobre `<html>` (`darkMode: 'class'` en Tailwind). `themeStore`
persiste la elección, parte de `prefers-color-scheme` como valor inicial y un
script inline en `index.html` aplica el tema antes del primer render para evitar
parpadeos.

## 8. Pruebas

- Runner: Vitest, entorno jsdom, setup con `@testing-library/jest-dom`.
- `src/test/utils.jsx`: `renderWithRouter(ui, { route, path, routes })`, con
  soporte para rutas con parámetros (`/ejercicio/:id`).
- `src/test/fixtures.js`: `exerciseFixture(overrides)` y `exercisesFixture()`
  con la misma forma que el dataset real.
- Cobertura: servicios, utils, hooks, stores, kit de UI, componentes comunes,
  layout y páginas. 98 tests.
- Los tests de página prellenan los stores (`setState`) en vez de depender del
  fetch del dataset.

## 9. Calidad y CI

`.github/workflows/ci.yml` ejecuta en cada PR contra `main`:

1. `corepack enable` (antes de setup-node para que Yarn Berry sea el gestor).
2. `yarn install --immutable`
3. `yarn lint`
4. `yarn format:check`
5. `yarn test`
6. `yarn build`

Un PR no se fusiona hasta que `quality` está en verde. Las ramas y los commits
siguen el flujo por tickets del apartado siguiente.

## 10. Flujo de trabajo

- **Ramas**: `<prefijo>/<categoria>`, p. ej. `feature/compare`, `docs/technical`,
  `chore/setup`. El prefijo indica el tipo de cambio (feature, bugfix, docs, chore).
- **Commits y títulos de PR**: `<prefijo>/<categoria>: <mensaje>` en imperativo,
  minúsculas, sin punto final.
- **Merge**: `gh pr create --base main` + revisión de `gh pr checks` y
  `gh pr merge --squash` al pasar la CI. El PR mantiene la narrativa del trabajo.
- **Historial en main** queda limpio, un commit por ticket (los squashes).

## 11. Scripts

| Script                | Descripción                       |
| --------------------- | --------------------------------- |
| `yarn dev`            | Servidor de desarrollo            |
| `yarn build`          | Build de producción en `dist/`    |
| `yarn preview`        | Sirve el build localmente         |
| `yarn data:sync`      | Sincroniza el dataset a `public/` |
| `yarn media:optimize` | Recorta los GIFs a su contenido   |
| `yarn lint`           | ESLint sobre todo el repo         |
| `yarn format`         | Prettier --write                  |
| `yarn format:check`   | Verifica el formato               |
| `yarn test`           | Vitest run                        |
| `yarn test:coverage`  | Vitest con cobertura              |
