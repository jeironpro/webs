# juego-wend

Puzle de palabras al estilo del Wend de LinkedIn: un tablero 6×6 **lleno de letras** y cinco palabras ocultas. Cada palabra es un camino ortogonal sin repeticiones y las 36 casillas pertenecen exactamente a una palabra.

## Características

- 20 tableros de 6×6 en `data/tableros.json`, cada uno con **solución única** verificada.
- **36 letras visibles**: no hay casillas oscuras ni huecos decorativos. Las cinco palabras se reparten el tablero completo.
- Longitudes de 6 a 8 letras: `[6, 7, 7, 8, 8]` en todos los tableros, con las ranuras correspondientes en el panel lateral.
- Traza con ratón o dedo (arrastrando por letras contiguas) o con el teclado (flechas para mover el cursor, `Enter` para empezar/añadir y comprobar, `Retroceso` para quitar la última letra, `Esc` para cancelar, `U` para deshacer y `R` para vaciar).
- Las palabras ya encontradas bloquean el trazo; una ruta que no sea una palabra oculta se avisa sin sumar fallos.
- Pista letra a letra: rellena la ranura de una palabra pendiente y marca su casilla inicial.
- Reloj, contador de palabras, contador de pistas y récord de tiempo.
- Progreso y récords guardados en `localStorage` (`wend:progreso` y `wend:records`), con aviso visible y botón para borrarlos.
- Interfaz compacta de dos columnas en escritorio y una columna en móvil, con una identidad visual propia: azul hielo, tinta marina, coral y lima.

## Reglas

1. **Traza palabras.** Cada palabra ocupa un camino de casillas contiguas en horizontal o vertical, sin diagonales y sin repetir casilla.
2. **No repitas letra.** Una misma casilla no puede formar parte de dos palabras.
3. **Cubre el tablero.** Las cinco palabras usan las 36 casillas exactamente una vez.
4. **Solución única.** Las longitudes, las letras y el diccionario solo admiten una partición válida.

## Cómo se genera un tablero

1. Se construye un **camino hamiltoniano** aleatorio de 36 casillas: pasa por todas las casillas una sola vez.
2. El camino se corta en cinco tramos con longitudes `[6, 7, 7, 8, 8]`. Cada tramo recibe una palabra distinta del diccionario curado de `data/palabras.json`.
3. Las letras de las cinco palabras llenan el tablero: no queda ninguna casilla vacía.
4. Se consideran muros todas las aristas que no usa la solución. Después se retiran uno a uno mientras el tablero siga teniendo **una única** partición válida.
5. Un solver de cobertura exacta, que respeta los muros, cuenta las soluciones con el diccionario. Solo se conserva el tablero si hay exactamente una.
6. El generador valida de nuevo cada tablero antes de escribir el JSON. En la colección actual la unicidad se consigue sin muros, así que `muros` queda vacío; el formato y el solver siguen admitiendo aristas bloqueadas.

Para regenerar los tableros:

```sh
node tools/generar-tableros.mjs        # 20 tableros de 6×6
node tools/generar-tableros.mjs 10     # otra cantidad
```

Las semillas son fijas, así que el archivo se puede reproducir tal cual.

## Uso

Abre `index.html` con un servidor estático (por ejemplo `python3 -m http.server`) o visita `https://jeironpro.github.io/webs/web-juegos/juego-wend/`. El juego carga su JSON, así que `file://` no sirve.

## Estructura del proyecto

```
index.html
css/wend.css           — Identidad azul hielo, coral y lima
js/wend-core.js        — Generación, solver y validación
js/wend.js             — Interfaz, arrastre, teclado y controles
data/palabras.json     — Diccionario curado en español
data/tableros.json     — Tableros con solución única
assets/icons/wend.svg
tools/                 — Generador reproducible
```

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
