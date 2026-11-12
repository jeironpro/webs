# Sphinx configuration for the "Lenguajes de programación" web.
# Layout: material/ = MyST content + assets; sphinx/ = configuration
# (this conf.py, templates, custom CSS and logo); the rest of the root is
# the generated output.
#
# Usage (from the web root): the output is generated in the root itself,
# so the build's index page is the one opened by the catalog.
#   pip install -r sphinx/requirements.txt
#   python3 -m sphinx -b html material . -c sphinx -d .doctrees

project = "Lenguajes de programación"
author = "jeironpro"
copyright = "jeironpro"
language = "es"

master_doc = "index"

extensions = ["myst_parser"]

myst_enable_extensions = [
    "colon_fence",  # ``` directives (compatible with the course style)
    "deflist",
]
myst_heading_anchors = 3

# Content sources (material/) and the repo README, which is not a document.
exclude_patterns = ["README.md", "Thumbs.db", ".DS_Store", "_build"]

html_theme = "sphinx_rtd_theme"
# Logo and favicon (custom SVG in sphinx/), the override CSS and the
# introprg reference style, plus the material assets (png, csv, bd, txt...).
html_logo = "logo.svg"
html_favicon = "logo.svg"
html_static_path = []  # the image directive already copies assets; avoids warnings when building in the root
templates_path = ["_templates"]
html_css_files = ["custom.css"]
# Custom footer (dynamic © year) without the "Built with Sphinx..." line.
html_show_sphinx = False
html_show_copyright = True

# Relative theme links make the site work under any subpath
# (GitHub Pages included) without configuring a base.
html_use_index = False
html_domain_indices = False

# ---------------------------------------------------------------- assets
# With html_static_path empty (needed to build in the root without
# warnings), this hook copies the logo, custom.css and all material
# assets linked by pages via /_static/... into the output directory.
import shutil
from pathlib import Path

_WEB_ROOT = Path(__file__).resolve().parent.parent  # web-lenguajes-programacion/


def _copy_assets(app, exception):
    if exception is not None:
        return
    outdir = Path(app.outdir)
    for rel in ("logo.svg", "_static/custom.css"):
        src = _WEB_ROOT / "sphinx" / rel
        if src.is_file():
            dst = outdir / "_static" / src.name
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
    assets = _WEB_ROOT / "material" / "_static"
    if assets.is_dir():
        for src in assets.rglob("*"):
            if not src.is_file():
                continue
            dst = outdir / "_static" / src.relative_to(assets)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)


def setup(app):
    app.connect("build-finished", _copy_assets)
    return {"parallel_read_safe": True, "parallel_write_safe": True}
