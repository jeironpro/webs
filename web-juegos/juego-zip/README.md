# juego-zip

Puzle de camino único al estilo del Zip de LinkedIn: un solo trazo que empieza en el 1, pasa por los números en orden, llena todas las casillas sin repetir ninguna y no cruza muros.

## Características

- Tableros de 6×6, 7×7 y 8×8 cargados desde `data/tableros.json`, cada uno con **solución única** verificada.
- Dibujo con ratón o dedo (arrastrando) y con el teclado (flechas para avanzar, `U` o Retroceso para deshacer, `R` para borrar).
- Retroceso arrastrando hacia atrás sobre el propio camino y botones de Deshacer, Borrar y Nuevo tablero.
- Validación al vuelo: muros, casillas repetidas y números fuera de orden se avisan sin romper el trazo.
- Reloj, contador de pasos, progreso y mejor tiempo por tamaño guardado en `localStorage`.
- Modo de movimiento reducido y avisos por `aria-live`.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES modules), sin dependencias externas ni compilación.
- Tableros y soluciones en JSON.
- Generador reproducible en `tools/generar-tableros.mjs` (semillas fijas) que valida la unicidad con el solver de `js/zip-core.js`.

## Cómo se genera un tablero

1. Se busca un camino hamiltoniano aleatorio en la cuadrícula.
2. Se reparten los números a lo largo de ese camino, incluidos el primero y el último.
3. Se añaden muros en aristas que el camino no usa hasta que el solver encuentra **una sola** solución.
4. Se comprueba que esa solución cumple todas las reglas antes de guardarla.

Para regenerar los tableros:

```sh
node tools/generar-tableros.mjs        # 12 tableros por tamaño
node tools/generar-tableros.mjs 20     # otra cantidad
```

## Uso

Abre `index.html` con un servidor estático (por ejemplo `python3 -m http.server`) o visita `https://jeironpro.github.io/webs/web-juegos/juego-zip/`. El juego carga su JSON, así que `file://` no sirve.

## Estructura del proyecto

```
juego-zip/
├── index.html
├── css/                   # estilos del tablero y del HUD
├── js/
│   ├── zip-core.js        # generación, solver y validación (sin DOM)
│   └── zip.js             # interfaz y controles
├── data/tableros.json     # tableros con su solución única
├── icon/                  # favicon
└── tools/                 # generador reproducible
```

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
