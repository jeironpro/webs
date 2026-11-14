# oracle-academy-dpsql

Web estática con todo el contenido del curso **Programación de Base de
Datos SQL** de Oracle Academy (DPSQL 47–50): 106 PDF de lecciones y
prácticas, 29 DOCX de prácticas, el esquema SQL del curso y los recursos
del proyecto Oracle Flix.

El sitio organiza el temario por temas (0–20), permite buscar y filtrar
los materiales, ver los PDF directamente en el navegador y descargar
cualquier archivo. No requiere servidor ni dependencias de runtime: se
despliega como sitio estático en GitHub Pages.

## Características

- **Índice completo del curso** con panel lateral de temas y vista
  agregada de todos los materiales.
- **Búsqueda en vivo** con normalización de acentos y **filtros por
  tipo** (PDF, DOCX, ZIP).
- **Visor de PDF** en el navegador con navegación anterior/siguiente
  entre los documentos de cada tema.
- **Descarga de todos los archivos**, incluido el instalador de Oracle
  Data Modeler (324 MB, gestionado con Git LFS).
- **Enrutado por hash**: cada tema tiene su propia URL compartible.
- Diseño responsive: el panel lateral se colapsa a pestañas
  horizontales en móvil.

## Stack

| Capa     | Tecnología                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------- |
| Frontend | HTML5 semántico + CSS3 (custom properties, Grid/Flexbox, media queries) + JavaScript ES6+ (módulos) |
| Tooling  | ESLint + Prettier + Vitest (dependencias del repositorio)                                           |
| CI/CD    | GitHub Actions (lint + test en PR; despliegue en GitHub Pages en `main`)                            |
| Hosting  | GitHub Pages                                                                                        |

Sitio estático sin interactividad de backend, por lo que no se necesita
un framework: HTML + CSS + JavaScript vanilla mantienen el sitio rápido
y sin pasos de build.

## Diseño

Sistema de diseño unificado con tokens centralizados en
[`css/tokens.css`](css/tokens.css). El tema visual **Hum** (rail lateral
numerado, números grandes, acentos múltiples y botones con efecto push)
se aplica de forma consistente al catálogo, al visor y a todos los
estados de la interfaz.

Tipografía: Plus Jakarta Sans (interfaz) + JetBrains Mono (datos y
etiquetas). Iconografía: Material Symbols.

## Estructura

```text
.
├── index.html                    # Catálogo del curso (índice + búsqueda + filtros)
├── 404.html                      # Página de error
├── html/visor.html               # Visor de PDF en el navegador
├── assets/icons/favicon.svg
├── css/
│   ├── tokens.css                # Design tokens
│   ├── base.css                  # Reset y estilos base
│   ├── layout.css                # Shell de aplicación
│   ├── components.css            # Botones, búsqueda, chips, tarjetas
│   └── pages/
│       ├── catalog.css
│       ├── viewer.css
│       └── error.css
├── js/
│   ├── app.js                    # Entrada del catálogo (enrutado por hash)
│   ├── visor.js                  # Entrada del visor
│   ├── modules/                  # catalog.js, search.js, viewer.js
│   ├── services/                 # manifest.js (carga y consulta del manifiesto)
│   └── utils/                    # dom.js, format.js
├── data/manifest.json            # Manifiesto generado del contenido (fuente de la UI)
├── tools/generate-manifest.js    # Genera data/manifest.json desde oracle_academy/
└── oracle_academy/               # Contenido del curso (PDF, DOCX, ZIP)
```

Los tests del sitio viven en `tests/web-oracle-academy-dpsql/`, dentro de
la suite del repositorio.

## Desarrollo

Desde la raíz del repositorio:

```bash
node web-oracle-academy-dpsql/tools/generate-manifest.js   # regenera el manifiesto
npx eslint web-oracle-academy-dpsql tests/web-oracle-academy-dpsql
npx prettier --check web-oracle-academy-dpsql tests/web-oracle-academy-dpsql
npx vitest run tests/web-oracle-academy-dpsql
```

Para desarrollo local, sirve la raíz del repositorio con cualquier
servidor estático y abre `/web-oracle-academy-dpsql/`:

```bash
python3 -m http.server 8099
```

## Despliegue

El workflow de CI (GitHub Actions) ejecuta lint y tests en cada pull
request y despliega en **GitHub Pages** al hacer merge en `main`.

> El instalador `datamodeler_24_3_1_351_0831_x64.zip` (324 MB) supera el
> límite de 100 MB por archivo de GitHub y se gestiona con **Git LFS**
> (`.gitattributes`). Como GitHub Pages no sirve archivos LFS, el sitio
> enlaza su descarga a la URL `raw` de GitHub.

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
