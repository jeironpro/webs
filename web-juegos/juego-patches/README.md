# juego-patches

Puzle espacial de 6×6: divide el tablero en retales rectangulares. Cada retal encierra exactamente una pista, cubre tantas casillas como indica su número y respeta la forma de la pista.

## Características

- 20 tableros de 6×6 en `json/tableros.json`, cada uno con **solución única** verificada.
- Pistas con área y forma: cuadrada, ancha, alta o libre.
- Arrastra de una casilla a otra para dibujar un retal; toca un retal colocado para quitarlo.
- Validación al soltar: el retal debe encerrar una sola pista y cumplir su área y su forma.
- Líneas de tinta entre retales, con un color plano distinto para cada pista.
- Teclado: flechas para moverte, `Enter` o espacio para iniciar y cerrar la selección, `Esc` para cancelar, `Retroceso` para quitar el retal del cursor, `U` para deshacer y `R` para vaciar.
- Botón de pista que revela una casilla de un retal pendiente; esa casilla solo admite el retal correcto y hay 10 segundos de espera entre pistas.
- Reloj, contador de retales y récord de tiempo.
- Progreso y récords guardados en `localStorage` (`patches:progreso` y `patches:records`), con aviso visible y botón para borrarlos.

## Reglas

1. **Un retal por pista.** Cada rectángulo encierra exactamente una pista.
2. **El área manda.** El retal cubre tantas casillas como dice el número.
3. **La forma también.** La pista cuadrada pide un cuadrado, la ancha un rectángulo más ancho que alto, la alta uno más alto que ancho y la libre acepta cualquiera.
4. **Sin huecos.** Al terminar, todas las casillas pertenecen a un retal y ninguno se solapa.

## Cómo se genera un tablero

1. Se parte el tablero en rectángulos cortando piezas al azar, con áreas de entre 2 y 12 casillas.
2. Cada rectángulo recibe una pista en una casilla al azar, con su área y su forma exactas.
3. Un solver de cobertura exacta cuenta las soluciones. Solo se conserva el tablero si hay **una única** solución.
4. Algunas pistas se relajan a forma libre mientras el tablero siga teniendo una sola solución.

Para regenerar los tableros:

```sh
node scripts/generar-tableros.mjs        # 20 tableros de 6×6
node scripts/generar-tableros.mjs 10     # otra cantidad
```

## Uso

Abre `index.html` con un servidor estático (por ejemplo `python3 -m http.server`) o visita `https://jeironpro.github.io/webs/web-juegos/juego-patches/`. El juego carga su JSON, así que `file://` no sirve.

## Estructura del proyecto

```
juego-patches/
├── index.html
├── css/                   # estilos de la composición
├── js/
│   ├── patches-core.js    # generación, solver y validación (sin DOM)
│   └── patches.js         # interfaz, arrastre y controles
├── json/tableros.json     # tableros con su solución única
├── icon/                  # favicon
└── scripts/               # generador reproducible
```

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
