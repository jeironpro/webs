# Generador de crucigramas

Generador de patrones de crucigramas que crea y descarga 100 plantillas de cuadrícula desde el navegador.

## Características

- Generación de 100 patrones distintos de 13×13 con 25 casillas negras.
- Simetría central (rotación de 180°) y comprobación de que todas las casillas blancas estén conectadas.
- Sin casillas blancas aisladas ni secuencias blancas de más de 10 casillas.
- Descarga de los patrones como `crosswords.json`, con la estructura `{ id, board }`.
- Generación local: no se envían datos a ningún servidor.

## Stack

- HTML5 semántico
- CSS3 (tokens, BEM, Grid y Flexbox)
- JavaScript ES6+ (módulo ES)
- Google Fonts (Space Grotesk e IBM Plex Mono)
- ESLint + Prettier

## Estructura

```
web-generador-crucigramas/
  index.html
  assets/
    icons/
      favicon.svg
  css/
    tokens.css
    styles.css
  js/
    generator.js
  README.md
```

## Uso

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-generador-crucigramas/>. Pulsa el botón para generar y descargar los 100 patrones.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
