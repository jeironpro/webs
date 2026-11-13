# web-codigos-http

Página de referencia con los códigos de estado HTTP organizados por categorías, con el significado de cada uno.

## Características

- Listado de códigos de estado HTTP de las familias 1xx, 2xx, 3xx, 4xx y 5xx.
- Agrupación por categorías con una ficha por código.
- Descripción breve del significado de cada respuesta.
- Interfaz en español, responsive y con jerarquía semántica.

## Tecnologías

- HTML5 semántico.
- CSS3 con custom properties, mobile-first y nomenclatura BEM.
- JavaScript como módulo ES, sin dependencias de ejecución.

## Uso

1. Clona el repositorio.
2. Sirve la carpeta con un servidor estático local:

```bash
python3 -m http.server 8000
```

3. Abre `http://localhost:8000/web-codigos-http/`.

Los módulos ES requieren abrir la página mediante HTTP, no con `file://`.

## Estructura del proyecto

```
web-codigos-http/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── data.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
