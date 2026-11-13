# web-calendario

Calendario anual que muestra los doce meses del año actual, con la semana de lunes a domingo y el día de hoy destacado.

## Características

- Vista anual con los doce meses generados a partir de la fecha del sistema.
- Semana de lunes a domingo con los días en su columna correcta.
- Día actual destacado y fines de semana resaltados.
- Celdas de día semánticas mediante elementos `time` con `datetime`.
- Diseño responsive de una a cuatro columnas.
- Año del pie actualizado automáticamente.

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

3. Abre `http://localhost:8000/web-calendario/`.

El JavaScript se carga como módulo, por lo que la página debe abrirse mediante HTTP, no con `file://`.

## Estructura del proyecto

```
web-calendario/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
