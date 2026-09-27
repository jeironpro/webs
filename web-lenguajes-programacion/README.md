# Web Lenguajes Programación

Apuntes y ejercicios de los lenguajes de programación aprendidos en distintas
instituciones, publicados como **documentación navegable con Sphinx** (tema
`sphinx-rtd-theme`, como la guía
[Introducció a la programació amb Java](https://github.com/jeironpro/web-introprg)).

## Contenido

- **Java** — ciclo DAW, ITIC Barcelona: elementos básicos, módulos y
  funciones, POO, bibliotecas, ficheros, persistencia con bases de datos y
  validación de aplicaciones (teoría y ejercicios con soluciones).
- **Python** — programa DCS de INFOTEP: elementos básicos del lenguaje,
  introducción a la POO y frameworks (Flask y Django, con sus proyectos de
  ejemplo).
- **JavaScript** — programa DCS de INFOTEP: variables, operadores,
  estructuras de control, arrays, funciones, objetos, DOM, eventos y
  formularios, con ejercicios interactivos.

Cada lección incluye la teoría y el código de ejemplo; en los ejercicios, la
solución se muestra siempre a la vista para poder consultarla. El material se
validó línea a línea contra los repositorios originales antes de consolidarlo;
los temarios estáticos (`temari.html`, `temario.html`) no forman parte del
sitio.

## Estructura

```
web-lenguajes-programacion/
├── material/           # contenidos MyST (index, java/, python/, javascript/)
│   └── _static/        # adjuntos del material (png, csv, bd, txt...)
├── sphinx/             # configuración y recursos del generador
│   ├── conf.py         # configuración Sphinx (tema rtd)
│   ├── requirements.txt
│   ├── logo.svg        # logo y favicon (colores de los 3 lenguajes)
│   ├── _static/        # custom.css y moistyle.css (estilo propio/introprg)
│   └── _templates/     # footer propio (© con año dinámico por JS)
(la salida se genera en la propia raíz de la web, ver más abajo)
```

## Cómo construir la web

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r sphinx/requirements.txt
python3 -m sphinx -b html material . -c sphinx -d .doctrees
```

El sitio se genera **directamente en la raíz de esta carpeta**
(`index.html`, `java/`, `python/`, `javascript/`, `_images/`, `_static/`,
`_sources/`, buscador incluido), de modo que la portada del build es también
la página que abre la tarjeta del catálogo. En el monorepo `webs`, el
workflow de GitHub Pages lo compila en CI y publica solo lo generado
(excluyendo `material/`, `sphinx/` y las carpetas de fuentes originales);
el build nunca se versiona (patrones en `.gitignore` del monorepo).

## Licencia

Este proyecto está bajo la licencia **MIT**.
