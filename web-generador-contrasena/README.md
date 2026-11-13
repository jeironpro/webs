# Generador de Contraseñas

Generador de contraseñas seguras y aleatorias al instante, directamente en el navegador.

## Características

- Generación de una contraseña aleatoria con un solo clic.
- Contraseñas de entre 12 y 16 caracteres con letras, números y símbolos.
- Generación con `crypto.getRandomValues()` y rejection sampling.
- Campo de solo lectura donde se muestra el resultado.
- Mensajes de estado accesibles sobre la última acción.

## Stack

- HTML5 semántico
- CSS3 (tokens, BEM, Flexbox)
- JavaScript ES6+ (módulo ES)
- Google Fonts (Poppins)
- ESLint + Prettier

## Estructura

```
web-generador-contrasena/
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

Sirve la carpeta con un servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-generador-contrasena/>. Pulsa **Generar** para obtener una contraseña nueva.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
