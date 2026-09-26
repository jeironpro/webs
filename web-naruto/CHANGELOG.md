# Changelog

## [2.0.0] - 2026-06-23

### Añadido

- Aplicación de una sola página con tarjetas de personajes de Naruto.
- Barra de filtros con búsqueda por nombre, aldeas, equipos, rangos y ordenamiento.
- Paginación de 24 personajes por página.
- Tarjetas de personaje con imagen, estadísticas, habilidades, fortalezas y debilidades.
- ScoreBadge circular con color según rango de puntuación.
- Modal para ver el podio top 3 (oro, plata, bronce).
- Modal de imagen a pantalla completa.
- Diseño responsive.
- Animación kunai en el fondo.

### Migración a datos locales

- Se eliminó la dependencia de la API externa.
- Los datos de personajes residen en `data/naruto/personajes.json` (129 personajes).
- Las imágenes se sirven desde `public/images/`.
- Cloudflare Function `functions/api/personajes.js` para servir datos con filtrado, ordenamiento y paginación server-side.
- Middleware equivalente en `vite.config.ts` para desarrollo local (`/api/personajes`).
- Cálculo de `scoreTotal` ahora se realiza en el servidor.
- Se eliminaron `src/hooks/useFilters.ts` y `src/utils/scoring.ts` (lógica cliente-side ya no necesaria).
- Se eliminó `.env` con API key (ya no requerida).
- Se eliminó `data/naruto-images/` (duplicado de `public/images/`).
