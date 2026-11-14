# Web Naruto

Enciclopedia estática de personajes de Naruto con fichas, sistema de puntuación, podio top 3, filtros y diseño oscuro temático.

## Stack

- HTML5, CSS y JavaScript vanilla
- Bangers (títulos) + Inter (cuerpo)
- Datos locales en JSON e imágenes WebP

## Desarrollo

Desde la raíz del repositorio, abre la web con un servidor estático:

```bash
python3 -m http.server 8000
```

Después visita `http://localhost:8000/web-naruto/`.

## Estructura

```
index.html              — Estructura de la interfaz
css/styles.css          — Estilos del diseño temático
js/app.js               — Filtros, orden, paginación y modales
data/naruto/            — JSON de personajes con stats, habilidades, fortalezas y debilidades
assets/images/          — Imágenes WebP de los personajes
assets/icons/favicon.png — Icono de la web
```

## Funcionalidad

- Búsqueda por nombre y filtros por aldea, clan, equipo y rango.
- Orden por puntuación o nombre.
- Paginación de 24 personajes por página.
- Fichas con estadísticas, habilidades, fortalezas y debilidades.
- Modal con la imagen ampliada y podio de los tres mejores personajes.

## Licencia

MIT. Consulta el archivo [`LICENSE`](../LICENSE) del repositorio.
