# web-javarcises

## Descripción

Web estática (**HTML + CSS + JS vanilla**, sin frameworks) que muestra los ejercicios de programación en Java del proyecto:

- **81 ejercicios** de `triviales/` (de Básico I a Experto I).
- **30 problemas de diseño POO** de `problemas-diseno/` (de Modelado simple a Sistemas completos).

Incluye **listado paginado** (12 fichas por página), pestañas por colección, filtro por nivel, búsqueda por texto y una **vista de detalle** por ficha con enunciado, instrucciones, firma, ejemplos, casos límite y pistas ocultables.

El diseño adapta en **claro** el ejemplo lumen-01 de Hallmark: serif Instrument Serif + Geist + JetBrains Mono, acento latón, tarjetas con emisión radial, **estrellas de dificultad amarillas** y **badges de nivel con color distinto por nivel**. Los detalles viven en [`docs/style-guide.md`](docs/style-guide.md).

## Cómo ejecutar

Requiere **Node.js 20+** (para servir localmente y regenerar datos; el navegador no necesita nada más).

```bash
npm install   # instala las devDependencies (eslint, prettier)
npm run dev   # servidor local de cero dependencias
```

Abrir **http://localhost:4173** (si el puerto está ocupado, se usa el siguiente libre).

> Los ES Modules no cargan con `file://`, por eso el proyecto se sirve por HTTP. También funciona en GitHub Pages u otro host estático.

## Regenerar los datos

`data/ejercicios.js` se genera a partir de los markdown de `triviales/` y `problemas-diseno/`:

```bash
npm run generar   # parsea los .md y escribe data/ejercicios.js
```

## Calidad de código

```bash
npm test                    # node --test (parser + paginación)
npm run lint                # ESLint
npm run format              # Prettier (--write)
npm run format:check        # Prettier (solo verificación)
pre-commit run --all-files  # hooks de pre-commit
```

El CI (GitHub Actions) ejecuta lint y tests en cada push/PR a `main`.

## Estructura

| Ruta                              | Descripción                                    |
| --------------------------------- | ---------------------------------------------- |
| `index.html`                      | Página principal (semántica, accesible)        |
| `icons/favicon.svg`               | Favicon de la marca (taza de café de Java)     |
| `css/styles.css`                  | Estilos con tokens (tema Lumen claro)          |
| `js/app.js`                       | Estado, filtros, paginación y routing por hash |
| `js/render.js`                    | Renderizado seguro a DOM (sin `innerHTML`)     |
| `js/paginacion.js`                | Lógica pura de paginación                      |
| `data/ejercicios.js`              | Catálogo generado (no editar a mano)           |
| `scripts/extraer-datos.js`        | Parser markdown → datos estructurados          |
| `scripts/servir.js`               | Servidor estático de desarrollo                |
| `docs/style-guide.md`             | Libro de estilo                                |
| `triviales/`, `problemas-diseno/` | Contenido fuente (markdown)                    |

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
