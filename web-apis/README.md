# apis

## Descripción

Monorepositorio que agrupa **5 APIs REST** desarrolladas con Python como parte de mi portafolio personal.
Cada API es un proyecto independiente con su propio README, requisitos y despliegue. El objetivo es
demostrar buenas prácticas de programación, organización y documentación en GitHub.

## APIs incluidas

| Proyecto | Stack | Descripción | Base de datos | Despliegue |
|----------|-------|-------------|---------------|------------|
| [api-biblia](catalogo/api-biblia/) | FastAPI + SQLModel | CRUD de la Biblia (biblias, testamentos, libros, capítulos, versículos) con patrón de servicios separados por verbo HTTP | MySQL | — |
| [api-pokemon](catalogo/api-pokemon/) | FastAPI + SQLModel | Colección de los 1025 Pokémon con tipos, estadísticas, imágenes y filtros | PostgreSQL | — |
| [api-naruto](catalogo/api-naruto/) | FastAPI + SQLModel | Personajes de Naruto con habilidades, debilidades, fortalezas, estadísticas y filtros | PostgreSQL | — |
| [api-juego-preguntas-respuestas](catalogo/api-juego-preguntas-respuestas/) | Flask + SQLAlchemy | Juego de trivia con 350 preguntas en 7 categorías: CRUD, pregunta aleatoria y validación de respuestas (Swagger incluido) | PostgreSQL | — |
| [api-correo-smtp-flask](catalogo/api-correo-smtp-flask/) | Flask + Flask-Mail | Envío de correos electrónicos por SMTP, en texto plano o con plantilla HTML | — | — |

## Portal web

El repositorio incluye un **portal web** construido solo con **HTML, CSS y JS puro**
(sin frameworks ni backend) que presenta el catálogo de las APIs y permite **descargar
cada API como `.zip`** — o todas a la vez — directamente desde el navegador.

El diseño sigue la referencia de Hallmark [`NAJM`](https://www.usehallmark.com/examples/najm/):
Bricolage Grotesque + Inter + JetBrains Mono, paleta cálida (crema + terracota) y
macrostructure *Marquee Hero*.

### Cómo funcionan las descargas

No hay servidor: el navegador obtiene el árbol de archivos del repositorio con la API de
GitHub, descarga cada archivo vía `raw.githubusercontent.com` y construye el `.zip` en
memoria con [`zip.js`](js/zip.js) (método STORE, sin dependencias). Todo corre en el
cliente. Para cambiar el origen (otro repo / rama), edita `REPO` al inicio de
[`app.js`](js/app.js).

### Ejecutar localmente

No requiere instalar nada. Abre `index.html` directamente, o sírvelo con cualquier
servidor estático:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

### Tests

```bash
node --test "test/*.test.js"
```

### Añadir una API

1. Añade su entrada al `CATALOG` de `js/app.js`.
2. Si quieres que sea descargable, su directorio debe estar en `catalogo/` (el árbol de
   GitHub se lee automáticamente; no hay que listar archivos a mano).

## Autenticación y seguridad

- **api-pokemon**, **api-naruto** y **api-juego-preguntas-respuestas** protegen sus endpoints con una API Key en el header `X-API-Key` (en el juego también como query param; en dev local puede desactivarse).
- **api-biblia** y **api-correo-smtp-flask** no implementan autenticación (están pensadas para uso local/demo).

## Uso

Cada proyecto es independiente. Entra al subdirectorio correspondiente y sigue las instrucciones de su README:

```bash
cd catalogo/api-pokemon
# Configura .env, instala dependencias y ejecuta la API
```

Tecnologías comunes en todo el repositorio:

- **Python 3.12**
- **FastAPI** y **Flask**
- **SQLModel** / **SQLAlchemy**
- **Pytest** para tests (pokemon y naruto)

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
