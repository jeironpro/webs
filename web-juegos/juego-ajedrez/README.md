# Ajedrez

Juego de ajedrez completo con todas las reglas estándar. Se puede jugar contra el bot en tres niveles o con dos jugadores en el mismo tablero.

## Funcionalidad

- Movimiento legal de todas las piezas, enroque corto y largo, captura al paso y coronación.
- Detección de jaque, jaque mate y ahogado.
- Tablas por regla de los 50 movimientos, triple repetición y material insuficiente.
- Bot con búsqueda negamax y poda alfa-beta en niveles Fácil, Medio y Difícil.
- Marcador de piezas, bandejas de capturas, resaltado del último movimiento y del jaque.
- Un deshacer por partida, reinicio y vuelta al menú.
- Pantalla final con ganador, tablas y motivo del final.

## Stack

- HTML5, CSS y JavaScript vanilla
- Sin React, Vite ni paso de build
- Inter + Material Symbols

## Ejecución

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/juego-ajedrez/`.

## Estructura

```
index.html
css/styles.css        — Estilos del tablero y la interfaz
js/app.js             — Reglas, bot, tablero y pantallas
assets/icons/favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
