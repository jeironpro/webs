# web-calculadora-edad

Calculadora de edad que indica los años, meses y días transcurridos desde una fecha de nacimiento.

## Características

- Selección de la fecha de nacimiento mediante un campo de fecha.
- Cálculo de la edad exacta en años, meses y días.
- Validación de fechas vacías o futuras con mensajes accesibles.
- Resultado anunciado mediante una región viva.
- Interfaz en español, responsive y con foco visible para teclado.

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

3. Abre `http://localhost:8000/web-calculadora-edad/`.

El JavaScript se carga como módulo, por lo que la página debe abrirse mediante HTTP, no con `file://`.

## Estructura del proyecto

```
web-calculadora-edad/
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
