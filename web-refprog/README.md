# RefProg

Referencia visual de programación: un compendio de estructuras de datos diagramadas y guías prácticas para desarrolladores.

## Secciones

- **Diagramas** — Diagramas SVG de estructuras de datos fundamentales (arrays, árboles, hash maps, pilas, colas, etc.).
- **Info Útil** — Guías de referencia rápida sobre herramientas y lenguajes (Bash, Git, SQL, Python, CSS, Java, redes, etc.).

## Estructura

```text
index.html                      portada
pages/diagramas.html            catálogo de diagramas
pages/info-util.html            guías desplegables
css/                            reset, tokens, layout, componentes y páginas
js/                             módulos de navegación, datos y páginas
assets/icons/favicon.svg        favicon
assets/images/diagrams/         diagramas SVG
data/info-util/                 guías YAML
```

## Uso local

El sitio usa módulos ES y `fetch`, así que necesita servirse por HTTP:

```bash
python3 -m http.server 8000
```

Después abre `http://localhost:8000/`.

## Tecnologías

- HTML5 semántico
- CSS3 con propiedades personalizadas
- JavaScript (módulos ES6)
- YAML para el contenido de Info Útil

## Licencia

MIT — consulta el archivo [LICENSE](../LICENSE).
