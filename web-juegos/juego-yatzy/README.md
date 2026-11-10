# Yatzy

Juego de Yatzy (Yahtzee) con cinco dados, tres lanzamientos por turno y las 13 categorías clásicas. Se puede jugar contra el bot en tres niveles o con dos jugadores en el mismo dispositivo.

## Funcionalidad

- Dados retenibles con un clic entre lanzamientos.
- Sección superior con bonus de 63 puntos y +35 extra.
- Trío, póker, full house, escaleras pequeña y grande, Yatzy y oportunidad.
- Bot con niveles Fácil, Medio y Difícil.
- Marcador, progreso del bonus y pantalla final con ganador o empate.
- Controles de reinicio y menú.

## Stack

- HTML5, CSS y JavaScript vanilla
- Sin React, Vite ni paso de build
- Fredoka + Material Symbols

## Ejecución

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/juego-yatzy/`.

## Estructura

```
index.html    — Entrada de la aplicación
styles.css    — Estilos del diseño original
app.js        — Reglas, bot, dados, scorecard y pantallas
favicon.svg   — Icono
```
