# Lector de archivos

Lector de archivos locales en el navegador que muestra el contenido del archivo seleccionado sin subirlo a ningún servidor.

## Características

- Selección de un archivo local mediante el selector del navegador.
- Lectura del contenido con la API `FileReader`.
- Visualización del texto leído en pantalla, con opción de vaciarlo.
- Interfaz en español; los identificadores del código están en inglés.
- Todo el procesamiento ocurre de forma local.

## Stack

- HTML5 semántico
- CSS3 (tokens, BEM, Flexbox)
- JavaScript ES6+ (módulo ES)
- Google Fonts (Inter e IBM Plex Mono)
- Material Symbols
- ESLint + Prettier

## Estructura

```
web-lector-archivo/
  index.html
  assets/
    icons/
      favicon.svg
  css/
    tokens.css
    styles.css
  js/
    app.js
  README.md
```

## Uso

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-lector-archivo/>. Selecciona un archivo de texto y su contenido se mostrará en pantalla.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
