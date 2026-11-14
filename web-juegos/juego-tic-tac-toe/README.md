# juego-tic-tac-toe

Juego clásico del tres en raya (tic-tac-toe) para dos jugadores o contra un bot, en el navegador.

## Características

- Dos modos: partida local para dos jugadores o partida contra el bot.
- Bot con tres niveles de dificultad: fácil, medio y difícil. Todos priorizan ganar en la siguiente jugada o bloquear una línea inmediata del jugador; el nivel difícil usa minimax y no comete errores.
- Marcador de rondas para X, O y tablas, además de la indicación del jugador en turno.
- Detección automática de victoria (tres en línea) y de empate, con la línea ganadora resaltada.
- Botón para reiniciar la ronda, jugar otra vez o volver al menú.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+), sin dependencias externas.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local.

No requiere instalación ni compilación.

## Estructura del proyecto

```
index.html
css/styles.css        — Estilos del tablero
js/app.js             — Lógica del juego
js/bot.js             — Estrategia del bot
assets/icons/xo.png
```

## Licencia

Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
