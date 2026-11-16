# Formateador JSON y YAML

Herramienta web para **formatear, minificar y validar JSON y YAML** en el navegador. Si el documento no es válido, indica el mensaje, la línea y la columna del error, con un fragmento del texto señalado.

## Características

- Validación en vivo de JSON y YAML mientras escribes.
- Formateo con sangría de 2 o 4 espacios y opción de ordenar claves alfabéticamente en todos los niveles.
- Minificado de JSON cuando el formato de entrada es JSON.
- Errores con línea, columna y contexto visual (`^` bajo la columna).
- Botones para cargar un ejemplo del formato activo, limpiar y copiar el resultado.
- Todo se procesa en el navegador: ningún documento se envía a un servidor.

## Stack

- HTML5 semántico.
- CSS3 con custom properties, capas y diseño mobile-first.
- JavaScript como módulos ES nativos.
- [js-yaml 4.1.0](https://github.com/nodeca/js-yaml) vendorizado en `vendor/js-yaml.mjs` (licencia MIT) para el análisis y la serialización de YAML.

## Uso

Los módulos ES requieren servir el proyecto por HTTP, no abrir `index.html` con `file://`.

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-json-yaml/`.

## Estructura

```
web-json-yaml/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   ├── tokens.css
│   ├── components/
│   │   ├── controls.css
│   │   └── feedback.css
│   └── pages/
│       └── home.css
├── js/
│   ├── app.js
│   ├── modules/
│   │   └── format.js
│   └── utils/
│       └── dom.js
├── vendor/
│   └── js-yaml.mjs
└── assets/
    └── icons/
        └── favicon.svg
```

La validación y el formateo viven en `js/modules/format.js` como funciones puras que reciben el analizador YAML por parámetro; los tests están en `tests/web-json-yaml/format.test.js`.

## Accesibilidad

- Controles nativos con `label` asociado, `fieldset`/`legend` para el formato y `aria-describedby` en el documento.
- Estado y errores anunciados con `aria-live` y `role="alert"`; el campo inválido recibe `aria-invalid`.
- Foco visible, enlace para saltar al contenido y contraste conforme al libro de estilo.
- `prefers-reduced-motion` reduce las transiciones.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles. La copia vendorizada de js-yaml conserva su aviso de licencia MIT en la cabecera.
