# Generador de Clave Secreta

Generador de claves criptográficamente seguras con opciones personalizables. Diseño inspirado en tarjetas físicas premium, con acabados dorados y estética clásica de bóveda.

## Características

- **Longitud**: de 8 a 128 caracteres
- **Tipos**: mayúsculas, minúsculas, números y símbolos
- **Excluir ambiguos**: evita caracteres confundibles (O0Il1)
- **Auto-copia**: copia al portapapeles al generar
- **Fortaleza**: indicador visual con bits de entropía
- **Seguridad**: usa `crypto.getRandomValues()` con rejection sampling
- **100 % local**: sin servidores, sin seguimiento y sin conexión necesaria

## Stack

- HTML5 semántico
- CSS3 (custom properties, Flexbox, Grid)
- JavaScript ES6+ (módulos ES, servido por HTTP)
- Google Fonts (Inter + JetBrains Mono)
- Material Symbols
- ESLint + Prettier

## Estructura

```
web-generador-clave-secreta/
  index.html
  assets/
    icons/
      favicon.svg
  css/
    tokens.css
    reset.css
    components.css
    style.css
  js/
    app.js
  README.md
```

## Uso

Sirve la carpeta con cualquier servidor HTTP, por ejemplo `python3 -m http.server 8000`, y abre <http://localhost:8000/web-generador-clave-secreta/>. Al usar módulos ES, abrir `index.html` directamente desde el sistema de archivos puede fallar en algunos navegadores.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
