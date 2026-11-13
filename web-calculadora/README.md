# web-calculadora

Calculadora web para operaciones aritméticas básicas, pensada para usarse directamente desde el navegador.

## Características

- Suma, resta, multiplicación y división.
- Porcentaje y raíz cuadrada.
- Operaciones encadenadas y resultado con precisión controlada.
- Botones de borrado de carácter y limpieza total.
- Entrada por ratón, pantalla táctil o teclado.
- Interfaz responsive y foco visible para navegación con teclado.

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

3. Abre `http://localhost:8000/web-calculadora/`.

El JavaScript se carga como módulo, por lo que la página debe abrirse mediante HTTP, no con `file://`.

## Estructura del proyecto

```
web-calculadora/
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
