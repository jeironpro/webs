# juego-queens

Puzle lógico de reinas: una reina en cada fila, cada columna y cada región de color, sin que dos reinas se toquen, ni siquiera en diagonal.

## Características

- Tableros de 7×7, 8×8 y 9×9 cargados desde `data/tableros.json`: 60 tableros, cada uno con **solución única** verificada.
- Regiones contiguas dibujadas con fronteras propias, para que el color no sea la única pista.
- Toca una casilla para poner reina, otra vez para cambiarla por una X de descarte y una tercera para vaciarla.
- Reinas en conflicto resaltadas al momento: misma fila, misma columna, misma región o casillas que se tocan.
- Teclado: flechas para moverte, `Enter` para colocar, `X` para marcar, `U` para deshacer y `R` para vaciar.
- Reloj, contador de reinas y marcas, y récord por tamaño.
- Progreso, récords y tableros resueltos guardados en `localStorage` (`queens:progreso` y `queens:records`), con aviso visible y botón para borrarlos.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES modules), sin dependencias externas ni compilación.
- Tableros en JSON.
- Generador reproducible en `tools/generar-tableros.mjs` (semillas fijas).

## Cómo se genera un tablero

1. Se colocan n reinas al azar: una por fila y columna, sin tocarse.
2. Cada reina nace en su propia región y las regiones crecen por turnos hacia la más pequeña, así todas acaban con un tamaño parecido.
3. Se buscan soluciones rivales con el solver. Si existe otra, una de sus reinas pasa a una región vecina: esa colocación queda con dos reinas en la misma región y deja de valer, mientras la solución original se mantiene intacta.
4. Se repite hasta que el solver encuentra **una sola** solución y se comprueba que cumple todas las reglas.

Para regenerar los tableros:

```sh
node tools/generar-tableros.mjs        # 20 tableros por tamaño
node tools/generar-tableros.mjs 10     # otra cantidad
```

## Uso

Abre `index.html` con un servidor estático (por ejemplo `python3 -m http.server`) o visita `https://jeironpro.github.io/webs/web-juegos/juego-queens/`. El juego carga su JSON, así que `file://` no sirve.

## Estructura del proyecto

```
index.html
css/queens.css         — Estilos de la hoja y del tablero
js/queens-core.js      — Generación, solver y validación
js/queens.js           — Interfaz y controles
data/tableros.json     — Tableros con solución única
assets/icons/queens.svg
tools/                 — Generador reproducible
```

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
