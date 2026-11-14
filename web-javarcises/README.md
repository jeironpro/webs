# web-javarcises

## Descripción

Web estática de HTML, CSS y JavaScript vanilla que reúne los ejercicios de programación en Java del proyecto:

- **81 ejercicios** de `triviales/`, desde Básico I hasta Experto I.
- **30 problemas de diseño POO** de `problemas-diseno/`, desde Modelado simple hasta Sistemas completos.

Incluye listado paginado de 12 fichas por página, pestañas por colección, filtro por nivel, búsqueda por texto y una vista de detalle con enunciado, instrucciones, firma, ejemplos, casos límite y pistas ocultables.

La interfaz usa Instrument Serif, Geist y JetBrains Mono, con acento latón, estrellas de dificultad y badges de color por nivel.

## Cómo ejecutar

Requiere Node.js 20 o superior. Desde esta carpeta:

```bash
node tools/serve.js
```

Abrir **http://localhost:4173**. Si el puerto está ocupado, se prueba el siguiente libre. También se puede servir la carpeta con cualquier servidor HTTP estático:

```bash
python3 -m http.server 8000
```

El catálogo se carga con `fetch`, así que los ES Modules y el JSON no funcionan abriendo `index.html` con `file://`.

## Regenerar el catálogo

`data/exercises.json` se genera a partir de los markdown de `triviales/` y `problemas-diseno/`:

```bash
node tools/extract-data.js
```

No editar `data/exercises.json` a mano.

## Calidad de código

Desde la raíz del repositorio:

```bash
npm test -- tests/web-javarcises
npx eslint web-javarcises
npx prettier --check web-javarcises
```

## Estructura

```text
web-javarcises/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── pagination.js
│   ├── render.js
│   └── syntax-highlight.js
├── data/
│   └── exercises.json
├── assets/
│   └── icons/
│       └── favicon.svg
├── tools/
│   ├── extract-data.js
│   └── serve.js
├── triviales/
├── problemas-diseno/
└── README.md
```

`triviales/` y `problemas-diseno/` conservan los enunciados fuente en Markdown. Los tests del parser y de la paginación viven en `tests/web-javarcises/`.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
