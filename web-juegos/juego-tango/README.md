# juego-tango

Puzle binario de 6×6: cada fila y cada columna llevan exactamente tres soles y tres lunas, nunca hay tres símbolos iguales seguidos y hay que respetar las pistas de relación.

## Características

- 20 tableros de 6×6 en `data/tableros.json`, cada uno con **solución única** y resoluble solo con deducciones.
- Casillas dadas bloqueadas y pistas de relación: `=` une símbolos iguales y `×` separa contrarios.
- Conflictos al momento: tres iguales seguidos, líneas con más de tres símbolos o relaciones incumplidas.
- Toca una casilla para poner sol, otra vez para luna y otra para dejarla vacía.
- Teclado: flechas para moverte, `Enter` o espacio para colocar, `U` o `Retroceso` para deshacer y `R` para vaciar.
- Reloj, contador de soles y lunas, y récord de tiempo.
- Progreso y récords guardados en `localStorage` (`tango:progreso` y `tango:records`), con aviso visible y botón para borrarlos.

## Reglas

1. **Tres y tres.** Cada fila y cada columna llevan 3 soles y 3 lunas al terminar.
2. **Nunca tres.** No puede haber tres símbolos iguales seguidos en horizontal ni en vertical (en diagonal sí se permite).
3. **Pistas.** Las casillas oscuras vienen dadas. Entre dos casillas, `=` obliga a que sean iguales y `×` a que sean distintas.

## Cómo se genera un tablero

1. Se construye una cuadrícula válida fila a fila, sin triples y con tres soles por columna.
2. Se parte de todas las casillas dadas y todas las relaciones posibles entre vecinos.
3. Se retiran pistas en orden aleatorio: una pista solo se queda fuera si el tablero sigue teniendo **una única solución** y esa solución se alcanza solo con deducciones, sin probar a ciegas.
4. Se conservan al menos 4 casillas dadas y 3 relaciones para que el puzle no empiece vacío.

Para regenerar los tableros:

```sh
node tools/generar-tableros.mjs        # 20 tableros de 6×6
node tools/generar-tableros.mjs 10     # otra cantidad
```

## Uso

Abre `index.html` con un servidor estático (por ejemplo `python3 -m http.server`) o visita `https://jeironpro.github.io/webs/web-juegos/juego-tango/`. El juego carga su JSON, así que `file://` no sirve.

## Estructura del proyecto

```
juego-tango/
├── index.html
├── css/                   # estilos del cuaderno cuadriculado
├── js/
│   ├── tango-core.js      # generación, solver y validación (sin DOM)
│   └── tango.js           # interfaz y controles
├── data/tableros.json     # tableros con pistas y solución única
├── icon/                  # favicon
└── tools/                 # generador reproducible
```

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
