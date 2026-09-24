# web-dados

Aplicacion web interactiva de dados con seleccion multiple (1-12), animaciones, diseno responsive y soporte tactil para movil.

## Caracteristicas

- Lanzamiento de 1 a 12 dados de 6 caras
- Cuadricula adaptativa segun la cantidad de dados
- Animacion de agitado al lanzar con parpadeo de valores
- Diseno responsive (escritorio, tablet, movil)
- Interaccion por click, touch y teclado (Enter/Space)
- Barra de controles flotante con slider de cantidad
- Accesibilidad: skip link, focus-visible, aria-live, reduced-motion
- Sin uso de innerHTML (manipulacion DOM segura)

## Stack

- HTML5 semantico
- CSS3 (Grid, Flexbox, Custom Properties, Media Queries, animaciones)
- JavaScript ES6+ (modulos, promesas)
- Sora (Google Fonts)
- Vitest + jsdom (tests)
- ESLint + Stylelint + Prettier

## Estructura

```
web-dados/
  index.html          Pagina principal
  favicon.svg         Favicon
  robots.txt          Configuracion SEO
  sitemap.xml         Mapa del sitio
  css/
    style.css         Hoja principal (imports)
    reset.css         Reset CSS
    variables.css     Variables CSS
    components/       Estilos de componentes
      dice.css        Dado
      controls.css    Controles
    pages/            Estilos por pagina
      home.css        Pagina principal
  js/
    app.js            Punto de entrada
    modules/          Modulos
      dice.js         Gestor de dados
    services/         Servicios
      diceService.js  Logica de dados
    utils/            Utilidades
      dom.js          Manipulacion DOM
  docs/
    style-guide.md    Libro de estilo
    technical.md      Documentacion tecnica
  tests/
    diceService.test.js
    dice.test.js
```

## Scripts

```bash
npm test              Ejecutar tests
npm run test:watch    Tests en modo watch
npm run lint          Analizar JS con ESLint
npm run lint:css      Analizar CSS con Stylelint
npm run format        Formatear codigo con Prettier
npm run format:check  Verificar formato
```

## Licencia

MIT
