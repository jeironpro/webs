# Web Naruto

Aplicación web de personajes de Naruto con fichas, sistema de puntuación, podio top 3, filtros y diseño oscuro temático.

## Stack

- React 19 + Vite 8 + TypeScript
- CSS puro (sin frameworks)
- Bangers (títulos) + Inter (cuerpo)
- Cloudflare Functions (API serverless)

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

## Producción

```bash
pnpm build
```

## Estructura

```
src/
  components/    — Componentes React (Card, FilterBar, Modal, Podium, etc.)
  hooks/         — Custom hooks (useNarutoData)
  services/      — Cliente API (api.ts)
  utils/         — Tipos TypeScript compartidos
data/naruto/     — JSON de personajes con stats, habilidades, fortalezas y debilidades
functions/       — Cloudflare Functions (API serverless)
public/images/   — Imágenes de personajes (PNG)
```

## API

La API sirve personajes con filtros, orden y paginación. Parámetros de query:

| Parámetro   | Tipo   | Descripción                          |
|-------------|--------|--------------------------------------|
| `pagina`    | number | Página actual (default: 1)           |
| `por_pagina`| number | Resultados por página (default: 24)  |
| `busqueda`  | string | Búsqueda por nombre                   |
| `aldea`     | string | Filtrar por aldea                     |
| `clan`      | string | Filtrar por clan                      |
| `equipo`    | string | Filtrar por equipo                    |
| `rango`     | string | Filtrar por rango                     |
| `ordenar`   | string | `score-desc`, `score-asc`, `nombre-asc`, `nombre-desc` |
