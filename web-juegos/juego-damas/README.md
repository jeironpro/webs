# Damas

Juego de **damas españolas 8×8** para jugar contra el bot en tres niveles o con dos jugadores en el mismo tablero.

## Funcionalidad

- 12 fichas por jugador y movimiento diagonal.
- Captura obligatoria, capturas encadenadas y coronación a dama.
- Bot con niveles Fácil, Medio y Difícil.
- Marcador de fichas, deshacer una jugada por partida, reinicio y vuelta al menú.
- Resaltado de fichas que pueden comer y aviso de captura obligatoria.

## Stack

- HTML5, CSS y JavaScript vanilla
- Sin React, Vite ni paso de build
- Inter + Material Symbols

## Ejecución

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/juego-damas/`.

## Estructura

```
index.html
css/styles.css        — Estilos del tablero y la interfaz
js/app.js             — Reglas, bot, tablero y pantallas
assets/icons/favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
