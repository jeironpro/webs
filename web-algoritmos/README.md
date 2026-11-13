# web-algoritmos

Página web con tarjetas de repaso de algoritmos clásicos de programación: cada tarjeta muestra el nombre del algoritmo, una descripción breve y un icono.

## Características

- Catálogo de algoritmos conocidos (compresión, búsqueda, estructuras de datos, etc.).
- Tarjetas interactivas tipo flashcard que se voltean para consultar la descripción.
- Navegación con ratón, teclado y pantalla táctil.
- Estado de cada tarjeta anunciado con `aria-expanded`.
- Interfaz sencilla en español, sin necesidad de registro.

## Tecnologías

- HTML5 semántico.
- CSS3 con custom properties, diseño mobile-first y movimiento reducido.
- JavaScript moderno con módulos ES.
- Google Fonts (Fredoka) y Material Symbols.

## Uso

Los módulos ES no funcionan abriendo `index.html` con `file://`. Sirve la carpeta por HTTP:

```bash
python3 -m http.server 8000
# o
npx serve .
```

Después abre <http://localhost:8000>.

No requiere instalación, compilación ni dependencias de ejecución.

## Estructura del proyecto

```
web-algoritmos/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── cards.js
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
