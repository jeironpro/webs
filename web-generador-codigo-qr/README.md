# Generador de código QR

Generador de códigos QR a partir de una URL mediante la API pública de QRcode Monkey.

## Características

- Campo para introducir la URL que se quiere codificar.
- Generación del QR con la API de QRcode Monkey (`api.qrcode-monkey.com`).
- Inserción de la imagen generada en la propia página.
- Validación de entrada con mensaje si el campo está vacío.
- Manejo de errores si la API no puede cargar la imagen.
- Interfaz responsive y accesible.

## Stack

- HTML5 semántico
- CSS3 (tokens, BEM, Flexbox)
- JavaScript ES6+ (módulo ES)
- API externa de QRcode Monkey; la generación requiere conexión a internet
- Google Fonts (Fredoka)
- ESLint + Prettier

## Estructura

```
web-generador-codigo-qr/
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

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-generador-codigo-qr/>. Introduce una URL y pulsa **Generar**.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
