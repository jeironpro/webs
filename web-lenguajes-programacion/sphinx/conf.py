# Configuración Sphinx de la web «Lenguajes de programación».
# Estructura: material/ = contenidos MyST + adjuntos; sphinx/ = configuración
# (este conf.py, plantillas, CSS propios y logo); _build/ = salida generada.
#
# Uso (desde la raíz de la web): la salida se genera en la propia raíz,
# de modo que la portada del build es la que abre el catálogo.
#   pip install -r sphinx/requirements.txt
#   python3 -m sphinx -b html material . -c sphinx -d .doctrees

project = "Lenguajes de programación"
author = "jeironpro"
copyright = "jeironpro"
language = "es"

master_doc = "index"

extensions = ["myst_parser"]

myst_enable_extensions = [
    "colon_fence",  # directivas con ``` (compatibilidad con el estilo del curso)
    "deflist",
]
myst_heading_anchors = 3

# Fuentes de contenidos (material/) y README del repo, que no es un documento.
exclude_patterns = ["README.md", "Thumbs.db", ".DS_Store", "_build"]

html_theme = "sphinx_rtd_theme"
# Logo y favicon (SVG propio en sphinx/), CSS de ajustes y estilo de la
# referencia introprg, y adjuntos del material (png, csv, bd, txt...).
html_logo = "logo.svg"
html_favicon = "logo.svg"
html_static_path = []  # la directiva image ya copia los adjuntos; evita avisos al construir en la raiz
templates_path = ["_templates"]
html_css_files = ["custom.css"]
# Pie propio (© año dinámico) y sin la línea «Compilado con Sphinx…».
html_show_sphinx = False
html_show_copyright = True

# Los enlaces relativos del tema hacen que el sitio funcione en cualquier
# subruta (GitHub Pages incluido) sin configurar base.
html_use_index = False
html_domain_indices = False

# ---------------------------------------------------------------- adjuntos
# Con html_static_path vacío (necesario para construir en la raíz sin
# avisos), este gancho copia al outdir el logo, el custom.css y todos los
# adjuntos del material que las páginas enlazan por /_static/....
import shutil
from pathlib import Path

_RAIZ_WEB = Path(__file__).resolve().parent.parent  # web-lenguajes-programacion/


def _copiar_adjuntos(app, exception):
    if exception is not None:
        return
    outdir = Path(app.outdir)
    for rel in ("logo.svg", "_static/custom.css"):
        src = _RAIZ_WEB / "sphinx" / rel
        if src.is_file():
            dst = outdir / "_static" / src.name
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
    adjuntos = _RAIZ_WEB / "material" / "_static"
    if adjuntos.is_dir():
        for src in adjuntos.rglob("*"):
            if not src.is_file():
                continue
            dst = outdir / "_static" / src.relative_to(adjuntos)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)


def setup(app):
    app.connect("build-finished", _copiar_adjuntos)
    return {"parallel_read_safe": True, "parallel_write_safe": True}
