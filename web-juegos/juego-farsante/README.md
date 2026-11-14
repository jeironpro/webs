# Farsante

Juego de deducción para 3–12 personas en un solo móvil. Reparte una palabra secreta, da pistas y vota a uno o dos farsantes. Incluye práctica con bots y cartas privadas por enlace.

## Funcionalidad

- Configuración de jugadores, rondas, temáticas y número de farsantes.
- Reparto privado de cartas y turnos de pistas en un único dispositivo.
- Votación, recuento y veredicto de cada ronda.
- Práctica con dos bots e invitaciones mediante enlace.

## Stack

- HTML5, CSS y JavaScript vanilla
- Inter y Material Symbols

## Ejecución

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/web-juegos/juego-farsante/`.

## Estructura

```
index.html
css/farsante.css       — Estilos y componentes visuales
js/farsante.js         — Interfaz y flujo de partida
js/farsante-core.js    — Reglas y estado del juego
js/farsante-bots.js    — Comportamiento de los bots
js/farsante-invite.js  — Codificación de cartas por enlace
assets/                — Cartas, expediente e iconos
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
