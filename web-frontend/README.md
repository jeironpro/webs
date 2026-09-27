# Frontend

Repositorio personal que recoge una colección de componentes y prototipos de interfaz de usuario creados con HTML, CSS y JavaScript, sin frameworks ni librerías externas. Cada carpeta contiene un componente o demo independiente, pensados como material de consulta y referencia para el desarrollo frontend. Están escritos en español.

El repositorio incluye además una **web de catálogo** (`index.html`, en la raíz) que muestra cada proyecto con una vista previa en vivo y permite descargar su código en un ZIP.

## Catálogo web

Abre `index.html` (o sírvelo con cualquier servidor estático) para ver la galería:

```bash
python3 -m http.server
# Abre http://localhost:8000
```

Cada tarjeta ofrece:

- **Demo** — abre el proyecto en una pestaña nueva.
- **Descargar** — descarga el código del proyecto como ZIP (`catalog/<nombre>.zip`).

También puedes clonar el repositorio completo:

```bash
git clone git@github.com:jeironpro/frontend.git
```

## Estructura

```
.
├── index.html              # Web de catálogo
├── css/
│   ├── tokens.css          # Tokens de diseño (libro de estilo)
│   └── styles.css          # Estilos del catálogo (BEM)
├── js/
│   ├── app.js              # Lógica del catálogo
│   └── catalog.js          # Datos de los proyectos
├── icons/                  # Favicon (SVG + PNG + ICO)
├── docs/
│   └── style-guide.md      # Libro de estilo
└── catalog/                # Los 17 proyectos + sus ZIPs
```

## Proyectos

| Carpeta | Contenido |
| --- | --- |
| `catalog/calificacion-estrellas` | Componente de valoración con estrellas interactivas. |
| `catalog/drop-down` | Menú desplegable. |
| `catalog/error-http-403` | Página de error 403 (acceso denegado). |
| `catalog/error-http-404` | Página de error 404 (página no encontrada). |
| `catalog/error-http-405` | Página de error 405 (método no permitido). |
| `catalog/footer` | Componente de pie de página. |
| `catalog/fryfly-prototipo` | Prototipo de una aplicación de pedidos de comida rápida con varias pantallas. |
| `catalog/gestor-archivos-demo` | Demo de un gestor de archivos con navegación, secciones y búsqueda. |
| `catalog/inicio-sesion-registro` | Formulario de inicio de sesión y registro. |
| `catalog/inicio-sesion-verificacion` | Inicio de sesión con verificación mediante captcha. |
| `catalog/lista-tareas` | Aplicación de lista de tareas. |
| `catalog/menu-acordeon` | Menú tipo acordeón. |
| `catalog/modal` | Ventana modal. |
| `catalog/modo-claro-oscuro` | Alternancia entre modo claro y oscuro. |
| `catalog/pagina-responsive` | Página de ejemplo con diseño responsive. |
| `catalog/panel-control` | Panel de control. |
| `catalog/side-bar` | Barra lateral de navegación. |

## Tecnologías

- HTML5
- CSS3 (custom properties, BEM, mobile-first)
- JavaScript (ES modules, sin librerías)
- Material Symbols (iconos)
- Google Fonts (Plus Jakarta Sans · JetBrains Mono)

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.
