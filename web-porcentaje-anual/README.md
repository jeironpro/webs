# Porcentaje del año

Indicador del porcentaje del año transcurrido, con barra de progreso y días restantes, teniendo en cuenta los años bisiestos.

## Características

- Cálculo del porcentaje del año transcurrido en tiempo real.
- Barra de progreso nativa actualizada automáticamente.
- Indicación de los días restantes.
- Gestión correcta de los años bisiestos.
- Rejilla de 365 o 366 puntos con el día correspondiente al pasar el cursor.

## Stack

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- Sin frameworks ni dependencias de ejecución.
- Google Fonts (Inter).
- ESLint + Prettier.

## Uso

Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

El progreso se calcula al cargar la página a partir de la fecha local del navegador y se expresa en UTC para evitar desfases por el horario de verano.

## Estructura

```text
web-porcentaje-anual/
├── index.html
├── css/
│   ├── tokens.css
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
