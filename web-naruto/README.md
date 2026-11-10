# Web Naruto

Enciclopedia estática de personajes de Naruto con fichas, sistema de puntuación, podio top 3, filtros y diseño oscuro temático.

## Stack

- HTML5, CSS y JavaScript vanilla
- Bangers (títulos) + Inter (cuerpo)
- Datos locales en JSON e imágenes WebP

## Desarrollo

Abre `index.html` desde un servidor estático, por ejemplo:

```bash
python3 -m http.server 8000
```

## Estructura

```
index.html       — Estructura de la interfaz
styles.css       — Estilos compilados del diseño original
app.js           — Filtros, orden, paginación y modales
data/naruto/     — JSON de personajes con stats, habilidades, fortalezas y debilidades
images/          — Imágenes WebP de los personajes
```

## Funcionalidad

- Búsqueda por nombre y filtros por aldea, clan, equipo y rango.
- Orden por puntuación o nombre.
- Paginación de 24 personajes por página.
- Fichas con estadísticas, habilidades, fortalezas y debilidades.
- Modal con la imagen ampliada y podio de los tres mejores personajes.
