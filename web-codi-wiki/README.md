# web-codi-wiki

Wiki de lenguajes de programación y paradigmas: consulta la historia, las ventajas y desventajas, los usos y ejemplos de código de cada tema.

## Características

- Contenido organizado por lenguajes de programación y paradigmas (programación orientada a objetos, funcional e imperativa).
- Fichas con descripción, historia, ventajas y desventajas, usos habituales y ejemplos de código.
- Menú lateral para navegar entre los temas.
- Vista de detalle generada dinámicamente desde los datos.
- Jerarquía de encabezados y navegación accesible por teclado.

## Tecnologías

- HTML5 semántico.
- CSS3 con custom properties, mobile-first y nomenclatura BEM.
- JavaScript como módulos ES, sin dependencias de ejecución.

## Uso

1. Clona el repositorio.
2. Sirve la carpeta con un servidor estático local:

```bash
python3 -m http.server 8000
```

3. Abre `http://localhost:8000/web-codi-wiki/`.

Los módulos ES requieren abrir la página mediante HTTP, no con `file://`.

## Estructura del proyecto

```
web-codi-wiki/
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
