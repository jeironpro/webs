# Países visitados

Página web para registrar y consultar los países visitados, organizados por continente, con buscador y una animación de avión de fondo.

## Características

- Catálogo de países del mundo agrupados por continente con su código ISO.
- Buscador por país o continente, insensible a mayúsculas y tildes.
- Selección de los países visitados para llevar el registro personal.
- Persistencia de la selección en `localStorage`.
- Animación de avión con estela y nubes de fondo, respetuosa con `prefers-reduced-motion`.

## Tecnologías

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- Datos de países y continentes definidos en JavaScript.
- Web Animations API para el vuelo del avión.
- Google Fonts (Fredoka).
- ESLint + Prettier.

## Uso

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-paises-visitados/>. Busca y marca los países que has visitado.

## Estructura

```
web-paises-visitados/
  index.html
  assets/
    icons/
      favicon.svg
    images/
  css/
    tokens.css
    styles.css
    animation.css
  js/
    script.js
    animation.js
    consent.js
  README.md
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
