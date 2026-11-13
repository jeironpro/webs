# Color Picker

Selector de color interactivo con visualización en RGB, CMYK, HSV y HSL. Construido con HTML, CSS y JavaScript vanilla, sin dependencias externas.

## Características

- Selección por canvas SV (saturación/valor) y barra de matiz.
- Sliders RGB con valores numéricos.
- Selector de formato pulsable: HEX → RGB → CMYK → HSV → HSL.
- Entrada editable en el formato seleccionado con parseo automático.
- Barra flotante con los valores en RGB, CMYK, HSV y HSL.
- Copia al portapapeles de cualquier valor con tooltip de confirmación.
- Diseño responsive para escritorio, tablet y móvil.
- Accesibilidad: skip link, botones nativos, `:focus-visible` y `prefers-reduced-motion`.

## Stack

- HTML5 semántico.
- CSS3 con Flexbox, Grid, custom properties y media queries.
- JavaScript como módulos ES nativos, sin bundler.

## Estructura

```
web-color-picker/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   ├── variables.css
│   ├── layout/grid.css
│   ├── components/
│   │   ├── color-display.css
│   │   ├── color-picker.css
│   │   └── floating-bar.css
│   └── pages/home.css
├── js/
│   ├── app.js
│   ├── modules/
│   │   ├── colorPicker.js
│   │   └── colorConverter.js
│   └── utils/
│       ├── dom.js
│       └── format.js
├── assets/
│   └── icons/favicon.svg
└── STYLE-GUIDE.md
```

## Uso

Sirve la carpeta con un servidor HTTP estático; los módulos ES no funcionan con `file://`:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080/web-color-picker/`.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
