# Farsante

Juego de deducción para 3–12 personas. Reparte una palabra secreta, da pistas y vota a uno o dos farsantes. Se puede jugar en un solo móvil o abrir una sala remota para que cada jugador escriba sus pistas desde su dispositivo. Incluye práctica con bots y cartas privadas por enlace.

## Funcionalidad

- Configuración de jugadores, rondas, temáticas y número de farsantes.
- Reparto privado de cartas y turnos de pistas en un único dispositivo.
- Sala remota de pistas entre dispositivos mediante WebRTC (PeerJS), con código o enlace de invitación.
- Votación, recuento y veredicto de cada ronda.
- Práctica con dos bots e invitaciones mediante enlace.

## Stack

- HTML5, CSS y JavaScript vanilla
- PeerJS 1.5.5 vendorizado para la sala remota
- Fraunces, DM Sans e IBM Plex Mono

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
js/farsante-sala.js    — Sala remota WebRTC (PeerJS)
vendor/                — PeerJS y su licencia
assets/                — Cartas, expediente e iconos
```

## Sala remota

La sala usa WebRTC con el broker público de PeerJS. El anfitrión crea la sala y debe mantener la pestaña abierta: su navegador guarda el historial y retransmite los mensajes. Los invitados entran con el código `FAR-XXXX` o con el enlace `?sala=FAR-XXXX`. Las pistas viajan directamente entre navegadores; no hay cuentas ni base de datos.

La sala necesita HTTPS (o `localhost`) y acceso al broker público. En redes muy restrictivas puede hacer falta un servidor TURN propio. Si el invitado pierde el canal, la app intenta reconectar una vez, vigila los latidos del anfitrión y ofrece un botón para volver a entrar conservando su nombre. Si la conexión falla del todo, el juego sigue funcionando en modo local.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../../LICENSE) para más detalles.
