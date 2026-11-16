# Círculo trigonométrico

Instrumento web para **explorar el círculo unitario** en el navegador. Arrastra el punto sobre la circunferencia o mueve el ángulo y lee al instante seno, coseno, tangente, radianes, coordenadas y cuadrante.

## Características

- Círculo unitario interactivo con proyecciones de seno y coseno y arco del ángulo.
- Arrastre del punto sobre la circunferencia, deslizador de 0° a 360° y entrada numérica de −360° a 720°.
- Ángulos frecuentes con un clic: 0°, 30°, 45°, 60°, 90°, 180° y 270°.
- Lecturas de seno, coseno y tangente con tres decimales; la tangente indica «no definida» en 90° y 270°.
- Normalización del ángulo, radianes, coordenadas del punto y cuadrante o eje.
- Todo se calcula en el navegador, sin dependencias de ejecución.

## Stack

- HTML5 semántico y SVG inline.
- CSS3 con custom properties, capas y diseño mobile-first.
- JavaScript como módulos ES nativos.

## Uso

Los módulos ES requieren servir el proyecto por HTTP, no abrir `index.html` con `file://`.

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-trigonometria/`.

## Estructura

```
web-trigonometria/
├── index.html
├── css/
│   ├── style.css
│   ├── reset.css
│   └── tokens.css
├── js/
│   ├── app.js
│   └── modules/
│       └── trig.js
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

La lógica pura (`normalizeAngle`, `toRadians`, `trigValues`, `quadrantOf`, `pointOnCircle` y los formateadores) vive en `js/modules/trig.js`; sus pruebas están en `tests/web-trigonometria/trig.test.js`.

## Accesibilidad

- Deslizador y entrada numérica con `label` y `aria-label`; los ángulos frecuentes forman un grupo con `aria-pressed`.
- El SVG es decorativo para lectores de pantalla: todas las lecturas equivalentes están en texto.
- Foco visible, enlace para saltar al control y contraste conforme al libro de estilo.
- `prefers-reduced-motion` reduce las transiciones.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
