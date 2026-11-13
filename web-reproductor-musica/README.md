# Reproductor de música

Reproductor de música en el navegador con 18 canciones incluidas y controles de reproducción.

## Características

- Lista de canciones con artista y título.
- Controles accesibles de reproducir, pausar, anterior y siguiente.
- Portada genérica para las pistas, que gira mientras suena la música.
- Barra de progreso con búsqueda dentro de la canción.
- Avance automático al terminar cada pista.
- Reproducción local sin subir archivos ni depender de servicios externos.

## Stack

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- Elemento de audio HTML5 con archivos MP3 incluidos.
- Google Fonts (Montserrat).
- ESLint + Prettier.

## Uso

Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

Pulsa el botón de lista para elegir una canción y usa los controles inferiores para reproducir, pausar o cambiar de pista. La barra permite saltar a cualquier punto de la canción.

## Estructura

```text
web-reproductor-musica/
├── index.html
├── css/
│   ├── tokens.css
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    ├── icons/
    │   └── favicon.svg
    ├── images/
    │   └── music.png
    └── media/
        └── 18 pistas MP3
```

## Créditos

Las canciones pertenecen a sus respectivos artistas y sellos. Este proyecto es una demostración local sin ánimo de lucro.

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
