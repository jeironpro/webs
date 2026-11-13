# Ruleta

Ruleta interactiva de una sola página. Configura números o nombres personalizados desde el panel lateral y haz girar la ruleta.

## Características

- Dos modos de configuración: rango numérico, con opción de incluir el 0, o lista de nombres.
- Panel lateral accesible con pestañas, cierre con Escape y foco controlado.
- Ruleta dibujada con Canvas y animación de desaceleración.
- Resultado anunciado mediante región `aria-live`.
- Diseño responsive para móvil, tablet y escritorio.
- Procesado local, sin dependencias de ejecución ni servicios externos.

## Stack

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- Canvas API.
- Google Fonts (Inter).
- ESLint + Prettier.

## Uso

Sirve la carpeta con un servidor estático, necesario para los módulos ES:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`, pulsa el botón de configuración y elige el modo Números o Nombres. Aplica la configuración y pulsa «Girar». El resultado aparece bajo la ruleta.

## Estructura

```text
web-ruleta/
├── index.html
├── css/
│   ├── tokens.css
│   └── style.css
├── js/
│   ├── app.js
│   ├── modules/
│   │   ├── roulette.js
│   │   └── sidebar.js
│   └── utils/
│       └── dom.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
