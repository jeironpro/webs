# Codecs de texto

Mesa de conversión para **Base64, URL y entidades HTML**, con entrada y salida enfrentadas. Todo se procesa en el navegador: el texto no se envía a ningún servidor.

## Características

- Tres canales independientes: Base64, URL y entidades HTML.
- Conversión en ambos sentidos con un selector de dirección y resultado en vivo al escribir.
- Base64 estándar (RFC 4648) sobre texto UTF-8, con acentos y emojis; la decodificación ignora espacios y saltos de línea.
- URL como componente (`encodeURIComponent`) o como URI completa (`encodeURI`).
- Entidades HTML: escape de los cinco caracteres esenciales o de todo lo no ASCII, y decodificación de entidades nombradas y numéricas.
- Avisos claros ante Base64 inválido, escapes de URL incompletos o bytes que no son UTF-8.
- Contadores de caracteres y bytes, copia al portapapeles, limpieza y reutilización de la salida como entrada.
- Un borrador por canal: cambiar de códec no pierde el texto que estabas trabajando.

## Stack

- HTML5 semántico.
- CSS3 con custom properties, capas lógicas y diseño mobile-first.
- JavaScript como módulos ES nativos, sin dependencias de ejecución.
- Google Fonts (Archivo y Space Mono).

## Uso

Los módulos ES requieren servir el proyecto por HTTP, no abrir `index.html` con `file://`.

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-codecs/`.

## Estructura

```
web-codecs/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── modules/
│       └── codecs.js
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

La lógica pura (`encodeBase64`, `decodeBase64`, `encodeUrl`, `decodeUrl`, `encodeHtmlEntities`, `decodeHtmlEntities` y `transformText`) vive en `js/modules/codecs.js`; sus pruebas están en `tests/web-codecs/codecs.test.js`.

## Accesibilidad

- Canales y sentido de la conversión con `aria-pressed`; los ajustes usan radios nativos con `label`.
- Entrada y salida etiquetadas, con contadores asociados y errores anunciados con `role="alert"`.
- Foco visible, enlace para saltar al codificador y contraste conforme al libro de estilo.
- `prefers-reduced-motion` desactiva las transiciones.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
