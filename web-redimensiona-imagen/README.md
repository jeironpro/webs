# Redimensionar imagen

Herramienta para redimensionar imágenes en el navegador: se carga una imagen local, se ajusta su tamaño y se descarga el resultado.

## Características

- Carga de una imagen local mediante selector o arrastrando el archivo.
- Redimensionado proporcional en un canvas, respetando el ancho y alto máximos indicados.
- Previsualización de la imagen antes de descargar.
- Descarga del resultado en PNG.
- Validación del archivo y mensajes de error accesibles.
- Procesado completamente local, sin subir la imagen a ningún servidor.

## Stack

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- API FileReader y canvas para la lectura y el procesado.
- Google Fonts (Poppins).
- ESLint + Prettier.

## Uso

Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

Selecciona una imagen, indica el ancho y el alto máximos en píxeles y pulsa «Descargar imagen». Si dejas una dimensión vacía se usa la original; la imagen nunca se amplía por encima de su tamaño natural.

## Estructura

```text
web-redimensiona-imagen/
├── index.html
├── css/
│   ├── tokens.css
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
