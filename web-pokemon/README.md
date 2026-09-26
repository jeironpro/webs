# Web Pokémon

Aplicación web para consultar información de Pokémon por generación.

## Stack

- React + Vite
- Yarn
- Sitio 100% estático (sin backend)

## Instalación

```bash
yarn install
```

## Desarrollo

```bash
yarn dev
```

La API local se sirve mediante un middleware de Vite que transforma los datos JSON de `data/pokemon/` y los expone en `/api/pokemones`.

## Producción

```bash
yarn build
```

El build copia las imágenes de `data/pokemon-images/` a `public/pokemon-images/` y genera `public/api/pokemones.json` (script `scripts/build-dataset.mjs`) con el dataset completo enriquecido: colores de tipo e `imagen_url`.

En el sitio estático, `src/services/api.js` detecta que no hay backend y filtra/pagina ese JSON en el navegador con la misma forma de respuesta que la API de desarrollo.

## Estructura de datos

```
data/
├── pokemon/
│   ├── pokemons_{generacion}_generacion.json
│   └── tipos_colores.json
└── pokemon-images/
    └── {generacion}_generacion/
        └── {Nombre}.png
public/
└── api/
    └── pokemones.json   (generado en el build)
```
