# Web Exerciness

Catálogo de ejercicios de gimnasio con búsqueda, filtros, detalle, favoritos y
comparador. Frontend SPA en React + Vite, sin backend.

## Características

- Catálogo de 1.324 ejercicios con búsqueda por nombre y filtros por grupo
  corporal, equipo, objetivo y músculo principal.
- Detalle con media (imagen y animación), instrucciones en español paso a paso y
  atribución obligatoria (© Gym visual).
- Favoritos persistidos en `localStorage` con contador en el navbar.
- Comparador de hasta 4 ejercicios con tabla lado a lado y barra flotante.
- Tema claro/oscuro con detección de la preferencia del sistema y persistencia.

## Requisitos

- Node.js 24 LTS
- Yarn Berry 4.x (habilitado vía Corepack)

## Puesta en marcha

```bash
corepack enable
yarn install
yarn dev
```

## Sincronizar el dataset

El dataset (fuera del repo, en `exercises-dataset-main/`) se copia a `public/`
con:

```bash
yarn data:sync
```

## Pre-commit

Los hooks de `pre-commit` ejecutan `yarn lint`, `yarn format:check` y
comprobaciones básicas sobre los archivos staged antes de cada commit.

```bash
python3 -m pip install --user pre-commit
pre-commit install            # activa el hook en .git/hooks/
pre-commit run --all-files    # ejecuta todos los hooks manualmente
```

## Docker

Sirve la aplicación con Nginx sin necesitar Node en la máquina local:

```bash
docker compose up --build    # http://localhost:8080
```

O manualmente:

```bash
docker build -t exerciness .
docker run -p 8080:80 exerciness
```

El puerto se cambia con `PORT=9090 docker compose up --build`.

## Scripts

| Script                | Descripción                           |
| --------------------- | ------------------------------------- |
| `yarn dev`            | Servidor de desarrollo                |
| `yarn build`          | Build de producción                   |
| `yarn preview`        | Sirve el build localmente             |
| `yarn data:sync`      | Sincroniza el dataset a `public/`     |
| `yarn media:optimize` | Optimiza los GIFs de `public/videos/` |
| `yarn lint`           | ESLint                                |
| `yarn format:check`   | Verifica el formato con Prettier      |
| `yarn test`           | Vitest (100 tests)                    |

## Documentación

- [Documentación técnica](docs/technical.md) — arquitectura, datos, estado, rutas, pruebas y CI.
- [Libro de estilo](docs/style-guide.md) — tokens de diseño, paleta y kit de componentes.

## Créditos

Los datos y la media (1.324 ejercicios con imágenes y animaciones) provienen de
[exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) de
[@hasaneyldrm](https://github.com/hasaneyldrm). La media se muestra con la
atribución obligatoria © Gym visual en cada detalle.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
