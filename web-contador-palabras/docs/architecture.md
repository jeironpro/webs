# Arquitectura

## Vista general

El proyecto es un sitio web estático de una sola página construido con **HTML, CSS y JavaScript Vanilla**. No hay servidor de aplicaciones, base de datos ni build step: el navegador descarga los archivos y el conteo corre íntegramente en el cliente.

```
┌────────────────────────────────────────────────────────────┐
│                        Navegador                          │
│                                                            │
│  index.html  →  estructura semántica (HTML5)               │
│     │                                                      │
│     ├── css/tokens.css       libro de estilo (custom props)│
│     ├── css/style.css        base + sistema de control      │
│     │   └─ @import: reset.css, components/, pages/         │
│     ├── js/app.js            (módulo ES6, entrada)          │
│     │   ├── js/modules/counter.js   lógica de conteo        │
│     │   ├── js/modules/uploader.js  lectura de archivos     │
│     │   └── js/utils/dom.js         helpers de DOM          │
│     └── assets/favicon.svg    icono de la página            │
│                                                            │
│  Flujo: HTML estructura el DOM → CSS aplica estilos →       │
│  JS escucha eventos, recalcula las métricas y lee archivos  │
└────────────────────────────────────────────────────────────┘
```

## Decisiones de arquitectura

- **Stack sin framework**: el proyecto es una aplicación web básica, por lo que se usa HTML + CSS + JS Vanilla.
- **ES Modules**: la lógica se organiza en módulos (`import`/`export`). Esto requiere servirlo por HTTP (no funciona con `file://`).
- **Sin bundler**: la estructura es plana; el navegador resuelve los imports directamente.
- **Custom properties centralizadas**: todos los colores, tipografías, espaciados y movimientos viven en `css/tokens.css`. El resto de estilos solo referencian variables.
- **Procesamiento en cliente**: el texto nunca sale de la máquina del usuario; no hay servidor ni persistencia.
- **Funciones puras de conteo**: `counter.js` recibe texto y devuelve números, sin estado ni DOM, lo que facilita pruebas.

## Piezas y responsabilidades

| Pieza | Responsabilidad |
|---|---|
| `index.html` | Estructura semántica de la página (header, título, área de texto, métricas, subida, footer) |
| `js/modules/counter.js` | Palabras, caracteres y caracteres sin espacios de un texto dado |
| `js/modules/uploader.js` | Lee archivos de texto plano como UTF-8 vía `FileReader` |
| `js/utils/dom.js` | Helper de selección de elementos |
| `js/app.js` | Orquesta el resto: eventos, render de métricas y subida |
| `css/*` | Estilos por capas: tokens, base, componentes y layout de página |

## Diagrama de flujo entre piezas

El flujo completo (carga de la página, conteo en vivo, subida de archivos) se documenta en [flujos.md](flujos.md).