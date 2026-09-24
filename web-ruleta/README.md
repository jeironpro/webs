# Web Ruleta

Ruleta interactiva en una sola pagina. Configura numeros o nombres personalizados desde el panel lateral y haz girar la ruleta.

## Estructura del proyecto

```
web-ruleta/
├── index.html            # Pagina principal (onepage)
├── favicon.svg           # Icono SVG de la ruleta
├── robots.txt            # Configuracion para crawlers
├── sitemap.xml           # Mapa del sitio
├── eslint.config.js      # Configuracion de ESLint (tab 4, incluye HTML)
├── package.json          # Dependencias y scripts
│
├── css/
│   ├── reset.css         # Normalizacion de estilos entre navegadores
│   ├── variables.css     # Custom properties (colores, fuentes, spacing, etc.)
│   └── style.css         # Estilos globales y de componentes
│
├── js/
│   ├── app.js            # Entry point, orquesta modulos
│   ├── modules/
│   │   ├── roulette.js   # Ruleta: Canvas, dibujo de segmentos, animacion con desaceleracion
│   │   └── sidebar.js    # Panel lateral: tabs Numeros/Nombres, CRUD de nombres
│   └── utils/
│       └── dom.js        # Helpers de DOM ($, $$)
│
└── assets/
    └── images/           # Recursos graficos
```

## Stack

- HTML5 semantico
- CSS3 (Flexbox, Custom Properties, Media Queries)
- JavaScript ES6+ (modulos, Canvas API)
- Sin bundlers ni frameworks

## Caracteristicas

- **Dos modos de configuracion**: Numeros (rango personalizable con opcion de incluir 0) o Nombres (anyade nombres, cada uno es un segmento)
- **Panel lateral flotante**: Se abre/cierra desde el boton en la esquina superior derecha
- **Ruleta animada**: Dibujada con Canvas, animacion con desaceleracion natural
- **Responsive**: Funciona en dispositivos moviles y desktop
- **HTML semantico**: Estructura accesible y limpia

## Uso

Servir con un servidor local (requerido para modulos ES6):

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Luego abrir `http://localhost:8000`.

### Como funciona

1. Abre el panel lateral con el boton de ajustes (esquina superior derecha)
2. Elige el modo "Numeros" o "Nombres"
3. Configura los valores y presiona "Aplicar"
4. Presiona "Girar" para hacer girar la ruleta
5. El resultado se muestra debajo de la ruleta

## Reglas del proyecto

- No se usa `innerHTML` ni ninguna inyeccion insegura de HTML
- CSS con media queries para responsive
- HTML con estructura semantica
- Comentarios en espanol en el codigo
- Iconos de Material Symbols en lugar de emojis
- ESLint + Stylelint + Prettier para calidad de codigo

## Licencia

MIT
