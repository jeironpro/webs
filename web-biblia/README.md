# Biblia

Biblia web con los 73 libros de la edición católica (Antiguo y Nuevo
Testamento, incluidos los deuterocanónicos). Sitio estático sin servidor:
los versículos se cargan desde un dataset local y las páginas se generan a
partir de un catálogo único de libros.

## Características

- 73 libros y 1189 capítulos con texto completo de la Biblia Latinoamérica
- Sin servidor: contenido servido como sitio estático desde el dataset `js/data/verses.json`
- Navegación entre libros y capítulos con recuentos validados contra el catálogo
- Sistema editorial clásico (papel, tinta, encuadernación y oro) documentado en [design.md](design.md)
- Diseño responsive verificado en 320, 375, 414 y 768 px

## Estructura

- `js/data/catalog.js` — catálogo canónico de los 73 libros (id, nombre, capítulos y ruta)
- `js/data/verses.json` — texto completo de los versículos
- `js/generate_chapters.js` — generación de las grillas de capítulos desde el catálogo
- `js/book_pagination.js` y `js/chapter_pagination.js` — navegación entre libros y capítulos
- `js/testament_pages.js` — índice de libros del Antiguo y Nuevo Testamento
- `js/footer.js` — año del pie de página
- `js/verses.js` — carga y renderizado de los versículos desde el dataset
- `css/tokens.css` — tokens del sistema editorial; el resto de los CSS lo consumen
- `scripts/import_bible.mjs` — conversión y validación del dataset contra el catálogo
- `design.md` — sistema editorial y decisiones visuales

## Sistema editorial

La interfaz aplica un sistema editorial clásico. El documento de diseño
(principios, paleta, tipografía y componentes) está en
[design.md](design.md).

## Contenido bíblico

El texto corresponde a la **Biblia Latinoamérica** (traducción pastoral de
Bernardo Hurault). Los derechos del texto pertenecen a su traductor y
editorial; consúltese la licencia de uso antes de una distribución pública.

El dataset se valida y se genera con el pipeline `scripts/import_bible.mjs`,
que comprueba los recuentos de capítulos contra el catálogo.

## Atribuciones

- Tipografía: Cormorant Garamond y EB Garamond, distribuidas por Google Fonts bajo la SIL Open Font License 1.1
- Iconografía: SVG propia (favorito `assets/icons/favicon.svg` e iconos de navegación)
- Texto bíblico: Biblia Latinoamérica, de Bernardo Hurault

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
