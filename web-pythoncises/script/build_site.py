#!/usr/bin/env python3
"""Genera el sitio web a partir de las carpetas de ejercicios.

Uso:  python3 script/build_site.py

Produce:
- index.html                  landing (hero, método, cifras, índice con tarjetas)
- html/<slug>.html            una página por ejercicio (código, copiar, descargar, salida)

El código de cada ejercicio vive solo en su propia página; el índice no
contiene código. Si existe data/salidas.json (slug -> transcripción de la
salida real del programa), cada página muestra además una sección
'Salida de ejemplo'. El diseño (tema Hum) se define en css/styles.css y
css/tokens.css; referencia visual: hum-07 de Hallmark.
"""

import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
EXERCISES = RAIZ / "exercises"
SALIDA_HTML = RAIZ / "html"

# Salidas de ejemplo capturadas ejecutando cada programa (ver data/salidas.json).
try:
    with open(RAIZ / "data" / "salidas.json", encoding="utf-8") as _f:
        SALIDAS = json.load(_f)
except (OSError, json.JSONDecodeError):
    SALIDAS = {}

# Resaltado de sintaxis (tokenizador propio, sin librerías)

PALABRAS_CLAVE = {
    "False", "None", "True", "and", "as", "assert", "async", "await", "break",
    "class", "continue", "def", "del", "elif", "else", "except", "finally",
    "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
    "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
}

BUILTINS = {
    "abs", "all", "any", "bool", "bytes", "bytearray", "callable", "chr", "classmethod",
    "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval",
    "exec", "filter", "float", "format", "frozenset", "getattr", "globals", "hasattr",
    "hash", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len",
    "list", "locals", "map", "max", "memoryview", "min", "next", "object", "oct",
    "open", "ord", "pow", "print", "property", "range", "repr", "reversed", "round",
    "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super",
    "tuple", "type", "vars", "zip",
}

TOKEN = re.compile(
    r"(?P<comentario>\#[^\n]*)"
    r"|(?P<cadena>[rRbBuUfF]{0,2}(?:\x22\x22\x22[\s\S]*?\x22\x22\x22|\x27\x27\x27[\s\S]*?\x27\x27\x27|\x22(?:\\.|[^\x22\\\n])*\x22|\x27(?:\\.|[^\x27\\\n])*\x27))"
    r"|(?P<numero>\b(?:0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|(?:\d[\d_]*\.?[\d_]*)(?:[eE][+-]?\d+)?[jJ]?|\.\d[\d_]*(?:[eE][+-]?\d+)?[jJ]?)\b)"
    r"|(?P<decorador>@[\w.]+)"
    r"|(?P<identificador>[A-Za-z_]\w*)",
)


def resalta_python(codigo):
    """Devuelve el código con <span class="tok-*"> para colorear la sintaxis."""
    salida = []
    pos = 0
    previo = None
    for coincidencia in TOKEN.finditer(codigo):
        salida.append(escapa_html(codigo[pos:coincidencia.start()]))
        clase = None
        if coincidencia.group("comentario"):
            clase = "tok-comentario"
        elif coincidencia.group("cadena"):
            clase = "tok-cadena"
        elif coincidencia.group("numero"):
            clase = "tok-numero"
        elif coincidencia.group("decorador"):
            clase = "tok-decorador"
        elif coincidencia.group("identificador"):
            nombre = coincidencia.group(0)
            if nombre in PALABRAS_CLAVE:
                clase = "tok-palabra"
            elif previo == "def":
                clase = "tok-funcion"
            elif previo == "class":
                clase = "tok-clase"
            elif nombre in BUILTINS:
                clase = "tok-builtin"
        token = escapa_html(coincidencia.group(0))
        salida.append(f'<span class="{clase}">{token}</span>' if clase else token)
        if coincidencia.group("identificador") or coincidencia.group("decorador"):
            previo = coincidencia.group(0)
        pos = coincidencia.end()
    salida.append(escapa_html(codigo[pos:]))
    return "".join(salida)

# Cada categoría lleva un acento Hum (pera, cian, coral, menta, lavanda).
ACENTOS = ["pear", "cyan", "coral", "mint", "lavender"]

CATEGORIAS = [
    ("Juegos", [
        "adivina-numero",
        "ahorcado",
        "piedra-papel-tijera",
        "dados-aleatorios",
    ]),
    ("Patrones", [
        "patron-triangulo",
        "patron-triangulo-invertido",
        "patron-rombo",
    ]),
    ("Calculadoras", [
        "calculadora",
        "calculadora-indice-masa-corporal",
        "calculadora-propina",
    ]),
    ("Web y API", [
        "convertidor-moneda",
        "corta-url",
    ]),
    ("Texto y cadenas", [
        "generador-contraseñas",
        "generador-chiste-random",
        "historias-divertidas",
        "partes-correo",
        "convertir-markdown-html",
    ]),
    ("Archivos y PDF", [
        "combinar-pdfs",
        "marca-agua",
        "extraer-texto-pdf-ocr",
        "herramienta-renombra-archivo",
        "organizador-archivos",
        "convertir-videos",
    ]),
    ("Tiempo y hábitos", [
        "cuenta-tiempo-atras",
        "pomodoro",
        "reloj-alarma",
        "reloj-digital",
        "rastreador-habitos-diarios",
        "lista-to-do",
    ]),
    ("Visión por computador", [
        "detector-cara-opencv",
        "sistema-reconocimiento-facial",
    ]),
    ("Correo", [
        "enviar-correo-csv",
    ]),
]

TITULOS = {
    "adivina-numero": "Adivina el número",
    "ahorcado": "El ahorcado",
    "piedra-papel-tijera": "Piedra, papel o tijera",
    "dados-aleatorios": "Dados aleatorios",
    "patron-triangulo": "Patrón triángulo",
    "patron-triangulo-invertido": "Patrón triángulo invertido",
    "patron-rombo": "Patrón rombo",
    "calculadora": "Calculadora",
    "calculadora-indice-masa-corporal": "Calculadora de IMC",
    "calculadora-propina": "Calculadora de propina",
    "convertidor-moneda": "Convertidor de moneda",
    "corta-url": "Acortador de URLs",
    "generador-contraseñas": "Generador de contraseñas",
    "generador-chiste-random": "Generador de chistes",
    "historias-divertidas": "Historias divertidas",
    "partes-correo": "Partes de un correo",
    "convertir-markdown-html": "Markdown a HTML",
    "combinar-pdfs": "Combinar PDFs",
    "marca-agua": "Marca de agua",
    "extraer-texto-pdf-ocr": "OCR sobre PDF",
    "herramienta-renombra-archivo": "Renombrador de archivos",
    "organizador-archivos": "Organizador de archivos",
    "convertir-videos": "Convertidor de vídeos",
    "cuenta-tiempo-atras": "Cuenta atrás",
    "pomodoro": "Pomodoro",
    "reloj-alarma": "Reloj alarma",
    "reloj-digital": "Reloj digital",
    "rastreador-habitos-diarios": "Rastreador de hábitos",
    "lista-to-do": "Lista de tareas",
    "detector-cara-opencv": "Detector de caras",
    "sistema-reconocimiento-facial": "Reconocimiento facial",
    "enviar-correo-csv": "Envío de correos desde CSV",
}

SERPIENTE_SVG = """<svg viewBox="0 0 64 64">
      <path class="snake__cuerpo" d="M14 22 C 26 22, 26 32, 32 32 C 38 32, 38 42, 50 42"
            fill="none" stroke-width="6.5" stroke-linecap="round"/>
      <circle class="snake__cabeza" cx="50" cy="42" r="4.8"/>
      <path class="snake__lengua" d="M54.5 42 L 58.5 40.5 M54.5 42 L 58.5 43.5"
            fill="none" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="48.6" cy="40.2" r="1.1" fill="var(--color-paper)"/>
    </svg>"""


def marca_snake():
    return f'<span class="snake-mark" aria-hidden="true">{SERPIENTE_SVG}</span>'


def archivo_principal(slug):
    """Devuelve el .py principal de la carpeta del ejercicio."""
    carpeta = EXERCISES / slug
    python = sorted(carpeta.glob("*.py"))
    if not python:
        raise SystemExit(f"Sin archivos .py en exercises/{slug}")
    esperado = slug.replace("-", "_") + ".py"
    for archivo in python:
        if archivo.name == esperado:
            return archivo
    return max(python, key=lambda p: len(p.read_text(encoding="utf-8")))


def extrae_descripcion(texto):
    """Primer docstring del archivo, como párrafo limpio."""
    match = re.search(r'"""\s*(.*?)\s*"""', texto, re.S)
    if not match:
        return ""
    lineas = [linea.strip() for linea in match.group(1).splitlines() if linea.strip()]
    return " ".join(lineas)


def escapa_html(texto):
    return (
        texto.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def lee_ejercicios():
    """Devuelve (categorias, plana): categorias con sus ejercicios y la
    lista plana (para navegación anterior/siguiente)."""
    categorias = []
    plana = []
    numero = 0
    for idx_cat, (nombre_cat, slogs) in enumerate(CATEGORIAS):
        items = []
        for slug in slogs:
            numero += 1
            archivo = archivo_principal(slug)
            codigo = archivo.read_text(encoding="utf-8")
            ejercicio = {
                "numero": numero,
                "slug": slug,
                "titulo": TITULOS.get(slug, slug.replace("-", " ").title()),
                "archivo": f"exercises/{slug}/{archivo.name}",
                "nombre": archivo.name,
                "descripcion": extrae_descripcion(codigo),
                "codigo": codigo,
                "salida": SALIDAS.get(slug),
                "categoria": nombre_cat,
                "cat_key": nombre_cat.lower(),
                "accent": ACENTOS[idx_cat % len(ACENTOS)],
            }
            items.append(ejercicio)
            plana.append(ejercicio)
        categorias.append((nombre_cat, items))
    return categorias, plana


def cabecera(rel, titulo, descripcion):
    return f"""<!doctype html>
<html lang="es" data-theme="hum">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="{escapa_html(descripcion)}">
  <meta name="theme-color" content="#faf6ee">
  <title>{escapa_html(titulo)}</title>
  <link rel="icon" type="image/svg+xml" href="{rel}icons/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="{rel}icons/favicon-32.png">
  <link rel="apple-touch-icon" href="{rel}icons/favicon-180.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{rel}css/styles.css">
  <script>document.documentElement.classList.add("js");</script>
  <script src="{rel}js/app.js" defer></script>
</head>
<body>"""


def nav(rel):
    return f"""  <header class="nav" id="nav">
    <div class="nav__inner">
      <a class="nav__brand" href="{rel}index.html" aria-label="Pythoncises — inicio">
        {marca_snake()}
        Pythoncises
      </a>
    </div>
  </header>"""


def pie(compacto=False):
    if compacto:
        return f"""  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__meta">
        <a class="footer__brand" href="../index.html">{marca_snake()} Pythoncises</a>
        <p class="footer__copy">© Pythoncises - 2026<br><span class="footer__hash">ver · copiar · descargar</span></p>
      </div>
    </div>
  </footer>
</body>
</html>
"""
    return f"""  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__statement">Python se aprende haciendo.</p>
      <div class="footer__meta">
        <a class="footer__brand" href="index.html">{marca_snake()} Pythoncises</a>
        <p class="footer__copy">© Pythoncises - 2026<br><span class="footer__hash">ver · copiar · descargar</span></p>
      </div>
    </div>
  </footer>
</body>
</html>
"""


def etapa(label, accent, titulo, texto, chips, arte):
    return f"""        <article class="stage stage--{accent}">
          <div class="stage__rail" aria-hidden="true">
            <div class="stage__node"><b>{escapa_html(label)}</b></div>
            <div class="stage__line"></div>
          </div>
          <div class="stage__panel">
            <div class="stage__copy">
              <p class="stage__label">{escapa_html(titulo[0])}</p>
              <h3 class="stage__title">{escapa_html(titulo[1])}</h3>
              <p class="stage__text">{texto}</p>
              <div class="stage__chips">
                {chips}
              </div>
            </div>
            <div class="stage__art" aria-hidden="true">
              {arte}
            </div>
          </div>
        </article>"""


def bignum(valor, texto):
    return f"""        <div class="bignum">
          <span class="bignum__v"><span class="count" data-to="{valor}">0</span></span>
          <p class="bignum__k">{escapa_html(texto)}</p>
        </div>"""


def tarjeta_ejercicio(ejercicio):
    num = f"{ejercicio['numero']:02d}"
    busqueda = " ".join([
        ejercicio["titulo"],
        ejercicio["descripcion"],
        ejercicio["slug"],
        ejercicio["archivo"],
    ]).lower()
    return f"""        <article class="tarjeta" data-accent="{ejercicio['accent']}" data-cat="{escapa_html(ejercicio['cat_key'])}" data-busqueda="{escapa_html(busqueda)}">
          <span class="tarjeta-num" aria-hidden="true">{num}</span>
          <h3 class="tarjeta-titulo"><a href="html/{escapa_html(ejercicio['slug'])}.html">{escapa_html(ejercicio['titulo'])}</a></h3>
          <p class="tarjeta-desc">{escapa_html(ejercicio['descripcion'])}</p>
          <p class="tarjeta-archivo">{escapa_html(ejercicio['archivo'])}</p>
        </article>"""


def genera_indice(categorias, plana, primer_slug):
    total = len(plana)
    con_salida = sum(1 for e in plana if e["salida"])

    proceso = "".join([
        '<span class="process__step"><span class="process__dot" style="background:var(--color-accent)"></span><span class="num">01</span> ver</span>',
        '<span class="process__link"></span>',
        '<span class="process__step"><span class="process__dot" style="background:var(--color-accent-2)"></span><span class="num">02</span> copiar</span>',
        '<span class="process__link"></span>',
        '<span class="process__step"><span class="process__dot" style="background:var(--color-accent-3)"></span><span class="num">03</span> descargar</span>',
    ])

    etapas = "\n".join([
        etapa("1", "mint",
              ("1.0 · Ver · En su página", "Cada ejercicio en su propia página"),
              "El código abre en su página: coloreado, con la salida de ejemplo debajo si el programa es interactivo. Nada de scroll infinito: un ejercicio, una página.",
              '<span class="chip"><span class="chip__dot"></span> 32 ejercicios</span><span class="chip chip--hands"><span class="chip__dot"></span> Sin registro</span>',
              '<div class="art-code"><span class="art-code__bar"><span class="art-code__dot"></span><span class="art-code__dot"></span><span class="art-code__dot"></span></span><span class="art-code__line"></span><span class="art-code__line"></span><span class="art-code__line"></span><span class="art-code__line"></span><span class="art-code__line"></span></div>'),
        etapa("2", "cyan",
              ("2.0 · Copiar · Un clic", "Copia el código con un clic"),
              "El botón Copiar manda el código exacto al portapapeles, con el resaltado de sintaxis intacto. Lo pegas en tu editor y a probar.",
              '<span class="chip"><span class="chip__dot"></span> Un clic</span><span class="chip chip--hands"><span class="chip__dot"></span> Sin pegatinas</span>',
              '<div class="art-clip" aria-hidden="true"></div>'),
        etapa("3", "coral",
              ("3.0 · Descargar · El .py real", "Descarga el archivo original"),
              "Cada página guarda el .py tal cual vive en el repositorio, con su nombre real. Úsalo, modifícalo, rómpelo: es tuyo.",
              '<span class="chip"><span class="chip__dot"></span> El .py original</span><span class="chip chip--hands"><span class="chip__dot"></span> Listo para ejecutar</span>',
              '<div class="art-dl" aria-hidden="true"><span class="art-dl__arrow"></span><span class="art-dl__tray"></span></div>'),
        etapa("4", "pear",
              ("4.0 · Practicar · A tu ritmo", "Y después, a practicar"),
              "Los ejercicios van de lo básico a lo avanzado, ordenados por categoría. Empieza por el que quieras: no hay exámenes aquí.",
              '<span class="chip"><span class="chip__dot"></span> 9 categorías</span><span class="chip chip--hands"><span class="chip__dot"></span> 17 con salida de ejemplo</span>',
              '<div class="art-term"><span class="art-term__bar"><span class="art-term__dot"></span><span class="art-term__dot"></span><span class="art-term__dot"></span></span><span class="prompt">python main.py</span><span class="out">▸ ejercicio listo</span><span class="ok">✓ sin errores</span></div>'),
    ])

    cifras = "\n".join([
        bignum(total, "ejercicios de Python listos para ver, copiar y descargar."),
        bignum(len(categorias), "categorías: juegos, patrones, calculadoras, PDFs, visión…"),
        bignum(con_salida, "con salida de ejemplo capturada ejecutando el programa de verdad."),
    ])

    chips = (
        '<button class="filtro chip-activo" type="button" data-cat="todos" data-accent="pear">Todos</button>'
        + "\n".join(
            f'<button class="filtro" type="button" data-cat="{escapa_html(nombre.lower())}" data-accent="{ACENTOS[i % len(ACENTOS)]}">{escapa_html(nombre)}</button>'
            for i, (nombre, _items) in enumerate(categorias)
        )
    )

    secciones = []
    for i, (nombre_cat, items) in enumerate(categorias):
        accent = ACENTOS[i % len(ACENTOS)]
        tarjetas = "\n".join(tarjeta_ejercicio(e) for e in items)
        secciones.append(f"""    <section class="categoria" data-cat="{escapa_html(nombre_cat.lower())}" aria-labelledby="cat-{escapa_html(nombre_cat.lower().replace(' ', '-'))}">
      <div class="categoria-cabecera" data-accent="{accent}">
        <h2 class="categoria-nombre" id="cat-{escapa_html(nombre_cat.lower().replace(' ', '-'))}">{escapa_html(nombre_cat)}</h2>
        <span class="categoria-conteo">{len(items)}</span>
      </div>
      <div class="tarjetas">
{tarjetas}
      </div>
    </section>""")

    return f"""{cabecera("", "Pythoncises", "Índice de ejercicios de Python: verlos, copiarlos y descargarlos.")}
{nav("")}
  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__grid">
        <div class="hero__lead">
          <div class="process" aria-label="Las tres acciones del sitio">
            {proceso}
          </div>
          <h1 class="hero__title" id="hero-title">Aprende Python con <em class="hl--pear">32 ejercicios</em>, uno a la vez.</h1>
          <p class="hero__lede">Estudiantes de programación y entusiastas de Python: aquí están los ejercicios para verlos, copiarlos y descargarlos. Cada uno en su propia página, con el código coloreado y su salida de ejemplo.</p>
          <div class="hero__cta">
            <a class="btn btn--mint btn--lg" href="#indice" data-burst>Explorar ejercicios <span class="btn__arrow" aria-hidden="true">→</span></a>
            <a class="btn btn--outline btn--lg btn--pear" href="#metodo">Cómo funciona</a>
          </div>
          <p class="hero__note">Gratis · sin registro · funciona offline</p>
        </div>
        <div class="hero__stage">
          <div class="snake" id="snake" aria-hidden="true">
            <span class="snake__pulse"></span>
            {SERPIENTE_SVG}
          </div>
          <div class="remind" role="status">
            <span class="remind__icon" aria-hidden="true"></span>
            <div>
              <p class="remind__head"><b>Pythoncises</b> · listo para copiar</p>
              <p class="remind__body">El código de cada ejercicio espera en su página.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="metodo" aria-labelledby="metodo-title">
      <header class="section__head">
        <p class="eyebrow"><span class="eyebrow__dot eyebrow__dot--mint"></span> El método</p>
        <h2 class="section__title" id="metodo-title">Ver, copiar, descargar. Y practicar.</h2>
        <p class="section__lede">Tres clics, sin fricción. El sitio no te explica cómo programar: te pone el código delante y te deja hacer.</p>
      </header>
      <div class="stages">
{etapas}
      </div>
    </section>

    <section class="section section--band section--mint" id="cifras" aria-labelledby="cifras-title">
      <header class="section__head section__head--center">
        <p class="eyebrow"><span class="eyebrow__dot eyebrow__dot--pear"></span> Las cifras</p>
        <h2 class="section__title" id="cifras-title">Mucho material, cero humo.</h2>
      </header>
      <div class="numbers">
{cifras}
      </div>
    </section>

    <section class="section" id="indice" aria-labelledby="indice-title">
      <header class="section__head">
        <p class="eyebrow"><span class="eyebrow__dot eyebrow__dot--cyan"></span> El índice</p>
        <h2 class="section__title" id="indice-title">Los 32 ejercicios.</h2>
        <p class="section__lede">Filtra por categoría o busca por nombre. Cada tarjeta abre la página del ejercicio.</p>
      </header>
      <div class="buscar">
        <label for="buscar">Buscar</label>
        <input id="buscar" type="search" placeholder="ahorcado, pdf, rombo…" autocomplete="off" spellcheck="false">
      </div>
      <div class="chips" id="chips" aria-label="Filtrar por categoría">
        {chips}
      </div>
      <div class="categorias">
{chr(10).join(secciones)}
      </div>
      <p class="sin-resultados" id="sin-resultados" hidden>Ningún ejercicio coincide con la búsqueda.</p>
    </section>

    <section class="section closer" aria-labelledby="closer-title">
      <h2 class="closer__title" id="closer-title">Empieza por el primero.</h2>
      <p class="closer__lede">Abre un ejercicio, copia el código, ejecútalo en tu máquina. Veinte minutos y ya estás aprendiendo Python de verdad.</p>
      <div class="hero__cta" style="justify-content:center">
        <a class="btn btn--pear btn--lg" href="html/{escapa_html(primer_slug)}.html" data-burst>Empezar a practicar <span class="btn__arrow" aria-hidden="true">→</span></a>
        <a class="btn btn--outline btn--lg btn--pear" href="#metodo">Volver al método</a>
      </div>
    </section>
  </main>
{pie(compacto=False)}"""


def pagina_ejercicio(ejercicio, anterior, siguiente):
    meta = " · ".join([
        ejercicio["categoria"],
        f"{ejercicio['numero']:02d}",
        ejercicio["nombre"],
    ])
    accent = ejercicio["accent"]
    nav_previo = (f'<a class="nav-ej nav-previo" href="{anterior["slug"]}.html">← {escapa_html(anterior["titulo"])}</a>'
                  if anterior else "")
    nav_siguiente = (f'<a class="nav-ej nav-siguiente" href="{siguiente["slug"]}.html">{escapa_html(siguiente["titulo"])} →</a>'
                     if siguiente else "")
    salida = ""
    if ejercicio["salida"]:
        salida = f"""    <section class="salida" aria-labelledby="salida-{escapa_html(ejercicio['slug'])}">
      <h2 class="salida-titulo" id="salida-{escapa_html(ejercicio['slug'])}">Salida de ejemplo</h2>
      <pre class="salida-cuerpo">{escapa_html(ejercicio['salida'])}</pre>
    </section>
"""
    return f"""{cabecera("../", f"Pythoncises · {ejercicio['titulo']}", ejercicio['descripcion'])}
{nav("../")}
  <main class="detalle" data-accent="{accent}">
    <a class="btn btn--outline btn--pear btn--sm detalle-volver" href="../index.html#indice">← Índice</a>
    <p class="detalle-meta">
      <span class="eyebrow__dot eyebrow__dot--{accent}" style="display:inline-block;margin-right:0.45em;vertical-align:middle"></span>
      {escapa_html(meta)}
    </p>
    <h1 class="detalle-titulo">{escapa_html(ejercicio['titulo'])}</h1>
    <p class="detalle-desc">{escapa_html(ejercicio['descripcion'])}</p>
    <div class="detalle-acciones">
      <button class="btn btn--pear" type="button" data-accion="copiar" data-burst>Copiar</button>
      <button class="btn btn--outline btn--pear" type="button" data-accion="descargar" data-nombre="{escapa_html(ejercicio['nombre'])}">Descargar</button>
    </div>
    <div class="codigo-tarjeta">
      <div class="codigo-barra">
        <span class="codigo-punto" aria-hidden="true"></span>
        <span class="codigo-punto" aria-hidden="true"></span>
        <span class="codigo-punto" aria-hidden="true"></span>
        <span class="codigo-archivo">{escapa_html(ejercicio['archivo'])}</span>
      </div>
      <pre><code>{resalta_python(ejercicio['codigo'])}</code></pre>
    </div>
{salida}    <nav class="detalle-nav" aria-label="Navegación entre ejercicios">
      {nav_previo}
      {nav_siguiente}
    </nav>
  </main>
{pie(compacto=True)}"""


def main():
    categorias, plana = lee_ejercicios()
    primer_slug = plana[0]["slug"] if plana else ""

    (RAIZ / "index.html").write_text(genera_indice(categorias, plana, primer_slug), encoding="utf-8")

    SALIDA_HTML.mkdir(exist_ok=True)
    for indice, ejercicio in enumerate(plana):
        anterior = plana[indice - 1] if indice > 0 else None
        siguiente = plana[indice + 1] if indice < len(plana) - 1 else None
        (SALIDA_HTML / f"{ejercicio['slug']}.html").write_text(
            pagina_ejercicio(ejercicio, anterior, siguiente), encoding="utf-8"
        )

    print(f"index.html + {len(plana)} páginas en html/ generados.")


if __name__ == "__main__":
    main()
