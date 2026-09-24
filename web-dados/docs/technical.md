# Documentacion tecnica - web-dados

## Descripcion

Aplicacion web interactiva de dados desarrollada con HTML semantico, CSS3 y JavaScript vanilla (ES6+). Permite lanzar de 1 a 12 dados de 6 caras con animacion visual, diseno responsive y soporte para interaccion tactil en dispositivos moviles.

## Stack tecnologico

- **HTML5** - Estructura semantica
- **CSS3** - Flexbox, CSS Grid, Custom Properties, Media Queries, animaciones
- **JavaScript ES6+** - Modulos, Promesas, Arrow functions
- **Vitest** - Framework de testing con entorno jsdom
- **ESLint** - Analisis estatico de JS
- **Stylelint** - Analisis estatico de CSS
- **Prettier** - Formateo de codigo

## Estructura del proyecto

```
web-dados/
├── index.html              # Pagina principal
├── 404.html                # Pagina de error 404
├── favicon.svg             # Favicon en SVG
├── robots.txt              # Configuracion para motores de busqueda
├── sitemap.xml             # Mapa del sitio
├── package.json            # Dependencias y scripts
├── .eslintrc.json          # Configuracion ESLint
├── .stylelintrc.json       # Configuracion Stylelint
├── .prettierrc             # Configuracion Prettier
├── css/
│   ├── style.css           # Hoja principal (imports)
│   ├── reset.css           # Reset CSS
│   ├── variables.css       # Variables CSS (colores, tipografia, espaciado)
│   ├── components/
│   │   ├── dice.css        # Estilos del componente dado
│   │   └── controls.css    # Estilos de los controles
│   └── pages/
│       └── home.css        # Estilos especificos de la pagina principal
├── js/
│   ├── app.js              # Punto de entrada principal
│   ├── modules/
│   │   └── dice.js         # Gestor de dados (DiceManager)
│   ├── services/
│   │   └── diceService.js  # Logica de generacion de valores aleatorios
│   └── utils/
│       └── dom.js          # Funciones auxiliares de manipulacion del DOM
├── docs/
│   ├── style-guide.md      # Libro de estilo
│   └── technical.md        # Documentacion tecnica (este archivo)
└── tests/
    ├── diceService.test.js # Tests del servicio de dados
    └── dice.test.js        Tests del modulo de dados
```

## Arquitectura

### Flujo de la aplicacion

1. El navegador carga `index.html`
2. Se descargan y aplican los estilos CSS (modulares con @import)
3. `app.js` se ejecuta como modulo ES6
4. `app.js` importa e inicializa `DiceManager`
5. `DiceManager` renderiza los dados en el DOM
6. Los eventos de click/touch disparan `rollAll()`
7. `rollAll()` usa `diceService.rollMultiple()` para generar valores aleatorios
8. La animacion visual se ejecuta via CSS keyframes
9. El resultado se muestra en el footer

### Modulos JavaScript

#### `js/utils/dom.js`

- `createElement(tag, classes)` - Crea elementos DOM con clases
- `clearElement(element)` - Limpia hijos de un elemento
- `createText(text)` - Crea nodos de texto

#### `js/services/diceService.js`

- `roll()` - Genera un valor aleatorio 1-6
- `rollMultiple(count)` - Genera array de valores
- `sumValues(values)` - Suma los valores

#### `js/modules/dice.js`

- `class DiceManager` - Gestiona la creacion, renderizado y animacion de dados
- Metodos: `setCount()`, `render()`, `rollAll()`, `setDieValue()`, `getValues()`

#### `js/app.js`

- Punto de entrada
- Configura eventos de controles y lanzamiento
- Actualiza la visualizacion del resultado

### Sistema de cuadricula

El numero de columnas se calcula automaticamente segun la cantidad de dados:

| Dados | Columnas | Filas |
| ----- | -------- | ----- |
| 1     | 1        | 1     |
| 2     | 2        | 1     |
| 3     | 3        | 1     |
| 4     | 2        | 2     |
| 5     | 3        | 2     |
| 6     | 3        | 2     |
| 7-9   | 3        | 3     |
| 10-12 | 4        | 3     |

### Animacion de lanzamiento

1. Se anade la clase `rolling` a cada dado (activa `@keyframes dice-shake`)
2. Durante 600ms los valores parpadean cada 60ms con valores aleatorios
3. Al finalizar, se establecen los valores finales y se elimina la clase `rolling`

### Seguridad DOM

Prohibido el uso de:

- `innerHTML`
- `outerHTML`
- `insertAdjacentHTML`
- `document.write`

Toda manipulacion del DOM usa: `createElement()`, `textContent`, `appendChild()`, `classList`.

## Scripts disponibles

```bash
npm test         # Ejecutar tests (Vitest)
npm run test:watch  # Tests en modo watch
npm run lint     # Analizar JS con ESLint
npm run lint:css # Analizar CSS con Stylelint
npm run format   # Formatear codigo con Prettier
npm run format:check  # Verificar formato
```

## Testing

Los tests usan Vitest con entorno jsdom para simular el navegador.

### `tests/diceService.test.js`

- roll() devuelve valores entre 1 y 6
- roll() devuelve solo enteros
- rollMultiple(n) devuelve array de longitud n
- rollMultiple(n) contiene solo valores validos

### `tests/dice.test.js`

- DiceManager crea la cantidad correcta de dados
- DiceManager limpia y recrea al cambiar cantidad
- setDieValue() coloca la cantidad correcta de puntos
- rollAll() devuelve valores entre 1 y 6
