# web-continguts-daw

Visor web estático para los materiales docentes del CFGS de Desarrollo de Aplicaciones Web (1r y 2n curs). La interfaz se inspira en el estilo visual de depobudget (neobrutalismo): fondo crema, tinta casi negra, bordes marcados y sombras duras.

## Descripción

La aplicación presenta un inventario de los ficheros de los materiales (organizados por curso, módulo y formato) en una cuadrícula de tarjetas. Permite navegar desde un panel lateral, buscar por nombre, módulo o formato, filtrar por tipo de fichero y previsualizar cada archivo en un modal (PDF, imágenes, audio, Markdown, código, texto y fichas para formatos de Office).

Está construida con HTML, CSS y JavaScript en módulos ES, sin dependencias externas ni paso de compilación.

## Características

- Navegación por cursos, módulos y formatos desde el panel lateral.
- Tarjetas cuadradas uniformes con el módulo y el nombre del fichero.
- Buscador con resaltado de coincidencias y atajo de teclado.
- Filtros combinables por formato (chips de color).
- Visor de ficheros en modal con navegación entre resultados.
- Interfaz en catalán, español e inglés con selector de idioma.
- Diseño responsive (mobile-first): en móvil el panel lateral se oculta
  tras un cajón animado con botón de menú, fondo oscuro y cierre con
  Escape o al elegir una opción.

## Idiomas de la interfaz

El selector de idioma del panel lateral (CA / ES / EN) cambia todos los textos de la interfaz. La preferencia se guarda en el navegador y, si no existe, se detecta el idioma del navegador.

Los textos se cargan desde archivos JSON separados por idioma en la carpeta `lang/`:

- `lang/ca.json` (catalán)
- `lang/es.json` (español)
- `lang/en.json` (inglés)

Para traducir o ajustar un texto solo hay que editar el JSON correspondiente; no hace falta tocar el código. Los nombres de los ficheros y de los módulos del material se mantienen intactos.

## Uso

La web usa módulos ES (import/export), por lo que hay que servirla por HTTP y no se puede abrir `index.html` directamente con doble clic.

Los materiales docentes completos (`moduls_1er_curs_24_25/` y `moduls_2n_curs_25_26/`) están incluidos en el repositorio, de modo que la web es autocontenida: basta con servir la carpeta del proyecto.

1. Ejecuta un servidor estático en la carpeta del proyecto:

   ```bash
   cd web-continguts-daw && python3 -m http.server 8000
   ```

2. Abre `http://localhost:8000/` en el navegador.

Las tarjetas abren los ficheros reales desde la propia carpeta del proyecto. Si en alguna instalación los materiales estuvieran en otra ubicación, se puede ajustar la constante `MATERIAL_DIRS` de `app.js` para indicar la ruta.

### Regenerar el inventario

El inventario se genera desde la propia raíz del repositorio (contiene las carpetas de materiales):

```bash
python3 tools/generate_inventory.py --materials .
```

Los volcados SQL muy grandes se almacenan comprimidos (`.sql.gz`) para aligerar las clonaciones del repositorio; el visor los descomprime por streaming al abrirlos. Si regeneras desde la carpeta original de materiales (donde el volcado sigue en `.sql`), comprime ese fichero igual que en el repositorio antes de regenerar:

```bash
gzip -9 moduls_1er_curs_24_25/0484_bases_dades/activitats/ra3/dml_segona_part/practiques/fase_3/fase3_inserts.sql
```

El generador no copia los ficheros: solo crea el catálogo con sus metadatos.

## Estructura del proyecto

| Ruta | Descripción |
| --- | --- |
| `index.html` | Estructura de la página (panel lateral, buscador, cuadrícula y modal). |
| `styles.css` | Hoja de estilos con el sistema de diseño depobudget. |
| `app.js` | Lógica de la aplicación (navegación, filtros, visor). |
| `i18n.js` | Carga de diccionarios y helpers de traducción. |
| `lang/` | Diccionarios JSON de textos por idioma (ca, es, en). |
| `data/files.js` | Inventario generado de ficheros de los materiales. |
| `tools/generate_inventory.py` | Generador del inventario a partir de la carpeta de materiales. |
| `moduls_1er_curs_24_25/` | Materiales docentes completos del primer curso. |
| `moduls_2n_curs_25_26/` | Materiales docentes completos del segundo curso. |
| `favicon.svg` | Icono de la página y de la marca del panel lateral. |

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
