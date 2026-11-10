# 4 en Raya

Juego de **4 en raya (Connect Four)** de **7×6** para jugar contra el bot en tres niveles de dificultad o con dos jugadores en el mismo tablero.

## Funcionalidad

- Conecta cuatro bolitas en horizontal, vertical o diagonal.
- Modo contra bot con niveles Fácil, Medio y Difícil.
- Modo local para dos jugadores.
- Marcador de victorias por ronda y reinicio sin perder el marcador.
- Animación de caída, línea ganadora y pantalla de resultado.

## Stack

- HTML5, CSS y JavaScript vanilla
- Sin React, Vite ni paso de build
- Inter + Material Symbols

## Ejecución

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/juego-4-rayas/`.

## Estructura

```
index.html    — Entrada de la aplicación
styles.css    — Estilos del diseño original
app.js        — Motor del juego, bot, marcador y pantallas
favicon.svg   — Icono
```
