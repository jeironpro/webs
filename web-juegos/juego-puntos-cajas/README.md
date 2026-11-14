# Puntos y Cajas

Juego de puntos y cajas sobre una grilla de 6×6 puntos que forma 25 cajas, para jugar contra el bot en tres niveles o con dos jugadores.

## Funcionalidad

- Coloca aristas por turnos y cierra cajas.
- Al completar una caja sumas un punto y vuelves a jugar.
- Bot con niveles Fácil, Medio y Difícil.
- Marcador de cajas, controles de reinicio y menú.
- Pantalla final con ganador o empate.

## Stack

- HTML5, CSS y JavaScript vanilla
- Sin React, Vite ni paso de build
- Fraunces + Inter + Material Symbols

## Ejecución

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/juego-puntos-cajas/`.

## Estructura

```
index.html
css/styles.css        — Estilos del tablero y la interfaz
js/app.js             — Reglas, bot, tablero y pantallas
assets/icons/favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
