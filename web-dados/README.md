# web-dados

Aplicación web interactiva de dados con selección múltiple (1-12), animaciones, diseño responsive y soporte táctil para móvil.

## Características

- Lanzamiento de 1 a 12 dados de 6 caras
- Cuadrícula adaptativa según la cantidad de dados
- Animación de agitado al lanzar con parpadeo de valores
- Diseño responsive (escritorio, tablet, móvil)
- Interacción por clic, toque y teclado (Enter/Espacio)
- Barra de controles flotante con deslizador de cantidad
- Accesibilidad: enlace de salto, foco visible, `aria-live` y movimiento reducido

## Stack

- HTML5 semántico
- CSS3 (Grid, Flexbox, custom properties, media queries, animaciones)
- JavaScript ES6+ (módulos ES)
- Sora (Google Fonts)
- Vitest + jsdom (tests, desde la raíz del repositorio)
- ESLint + Prettier

## Estructura

```
web-dados/
  index.html          Página principal
  assets/
    icons/
      favicon.svg     Favicon
  css/
    style.css         Hoja principal (imports)
    reset.css         Reset CSS
    variables.css     Variables CSS
    components/       Estilos de componentes
      dice.css        Dado
      controls.css    Controles
    pages/            Estilos por página
      home.css        Página principal
  js/
    app.js            Punto de entrada
    modules/          Módulos
      dice.js         Gestor de dados
    services/         Servicios
      diceService.js  Lógica de dados
    utils/            Utilidades
      dom.js          Manipulación DOM
```

Los tests viven en `tests/web-dados/` y se ejecutan desde la raíz del
repositorio con `npm test`.

## Uso

Abrir <http://localhost:8000/web-dados/>.

## Licencia

Consulta el archivo [LICENSE](../LICENSE) para más detalles.
