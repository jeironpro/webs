# Web Pokémon

Aplicación web para consultar información de Pokémon por generación.

## Stack

- React + Vite
- Yarn
- Cloudflare Pages + Functions

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

El build copia las imágenes de `data/pokemon-images/` a `public/pokemon-images/`.

El deploy se realiza en Cloudflare Pages. La Cloudflare Function en `functions/api/pokemones.js` sirve los datos combinando los archivos JSON de `data/pokemon/` y agregando colores de tipo e `imagen_url`.

## Estructura de datos

```
data/
├── pokemon/
│   ├── pokemons_{generacion}_generacion.json
│   └── tipos_colores.json
└── pokemon-images/
    └── {generacion}_generacion/
        └── {Nombre}.png
functions/
└── api/
    └── pokemones.js
```
