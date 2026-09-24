# Color Picker

Selector de color interactivo con visualización en RGB, CMYK, HSV y HSL. Construido con HTML, CSS y JavaScript vanilla, sin dependencias externas.

## Características

- Selección por canvas SV (saturación/valor) y barra de matiz
- Sliders RGB con valores numéricos
- Selector de formato clickeable: HEX → RGB → CMYK → HSV → HSL
- Entrada editable en el formato seleccionado con parseo automático
- Visualización en floating bar con valores en RGB, CMYK, HSV y HSL
- Copia al portapapeles de cualquier valor con tooltip de feedback
- Diseño responsivo: desktop (40/60), tablet, móvil, móvil pequeño
- Accesibilidad: skip link, `:focus-visible`, `prefers-reduced-motion`, roles ARIA
- SEO: meta tags, canonical, structured data (WebApplication)
- Tema neutro medio con backdrop-filter

## Stack

- **HTML5** semántico
- **CSS3** (Flexbox, Grid, Custom Properties, Media Queries)
- **JavaScript ES6+** (módulos nativos, sin bundler)

## Estructura

```
web-color-picker/
├── index.html
├── css/
│   ├── style.css           # Entry point (imports)
│   ├── reset.css           # Reset + accesibilidad
│   ├── variables.css       # Variables de diseño
│   ├── layout/grid.css     # Grid responsivo 40/60
│   ├── components/         # color-display, color-picker, floating-bar
│   └── pages/home.css      # Tooltip y animaciones
├── js/
│   ├── app.js              # Entry point
│   ├── modules/            # colorPicker.js, colorConverter.js
│   └── utils/              # dom.js, format.js
├── assets/images/          # favicon.svg
├── package.json            # type: module + devDependencies
├── eslint.config.js        # ESLint flat config (4 tab width)
├── .gitignore              # node_modules, .DS_Store, logs
├── ARQUITECTURA.md         # Documentación técnica
└── STYLE-GUIDE.md          # Libro de estilo
```

## Uso

Servir con cualquier servidor HTTP estático (no funciona con file:// por los módulos ES6):

```bash
npx serve .
# o
python3 -m http.server 8080
```

## Licencia

MIT
