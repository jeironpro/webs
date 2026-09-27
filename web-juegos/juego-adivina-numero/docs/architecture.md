# Arquitectura

## Vista general

El proyecto es un sitio web estático de una sola página construido con **HTML, CSS y JavaScript Vanilla**. No hay servidor de aplicaciones, base de datos ni build step: el navegador descarga los archivos y el juego corre íntegramente en el cliente.

```
┌────────────────────────────────────────────────────────────┐
│                        Navegador                          │
│                                                            │
│  index.html  →  estructura semántica (HTML5)               │
│     │                                                      │
│     ├── css/tokens.css       libro de estilo (custom props)│
│     ├── css/style.css        base + sistema de botones      │
│     │   └─ @import: reset.css, components/, pages/         │
│     ├── js/app.js            (módulo ES6, entrada)          │
│     │   ├── js/modules/game.js     lógica del juego          │
│     │   ├── js/modules/balloons.js globos de intentos        │
│     │   ├── js/modules/modal.js    diálogo de datos          │
│     │   ├── js/utils/dom.js        helpers de DOM            │
│     │   └── js/utils/storage.js    persistencia (localStorage)│
│     └── assets/favicon.svg    icono de la página            │
│                                                            │
│  Flujo: HTML estructura el DOM → CSS aplica estilos →       │
│  JS escucha eventos, actualiza el DOM y persiste el récord  │
└────────────────────────────────────────────────────────────┘
```

## Decisiones de arquitectura

- **Stack sin framework**: el proyecto es una aplicación web básica, por lo que se usa HTML + CSS + JS Vanilla según el estándar `HTML_CSS_JS_STACK.md`.
- **ES Modules**: la lógica se organiza en módulos (`import`/`export`). Esto requiere servirlo por HTTP (no funciona con `file://`).
- **Sin bundler**: la estructura es plana; el navegador resuelve los imports directamente.
- **Custom properties centralizadas**: todos los colores, tipografías, espaciados y movimientos viven en `css/tokens.css`. El resto de estilos solo referencian variables.
- **Persistencia local**: el mejor récord se guarda en `localStorage` del navegador; no se envía a ningún servidor.

## Piezas y responsabilidades

| Pieza | Responsabilidad |
|---|---|
| `index.html` | Estructura semántica de la página (header, main, secciones, footer) |
| `js/modules/game.js` | Número secreto, intentos (máximo 10), validación y evaluación de suposiciones |
| `js/modules/balloons.js` | Dibuja los 10 globos (SVG), reventón al fallar y vuelo al acertar |
| `js/modules/modal.js` | Ciclo de vida del modal informativo: apertura, cierre, foco y scroll |
| `js/utils/storage.js` | Lectura y escritura del mejor récord en `localStorage` |
| `js/utils/dom.js` | Helpers de selección y creación de elementos (sin inyección de HTML) |
| `js/app.js` | Orquesta el resto: eventos, feedback, animaciones y récord |
| `css/*` | Estilos por capas: tokens, base, componentes y layout de página |

## Diagrama de flujo entre piezas

El flujo completo (carga de la página, jugada, reinicio) se documenta en [flujos.md](flujos.md).
