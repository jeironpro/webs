import {
    MAX_JUGADORES,
    MIN_JUGADORES,
    MIN_JUGADORES_DOS_FARSANTES,
    RONDAS,
    TEMATICAS,
    avanzarRonda,
    crearJugador,
    crearPartida,
    jugadoresVivos,
    ordenPistas,
    resolverVotacion,
    validarNombre,
} from "./farsante-core.js";
import {
    crearEnlaceInvitacion,
    crearPayloadInvitacion,
    leerInvitacionDeHash,
} from "./farsante-invite.js";
import { generarPistasBots, votarBots } from "./farsante-bots.js";

const app = document.querySelector("#pantalla");
const anuncio = document.querySelector("#anuncio");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PALETAS = [
    { fondo: "#d8c29b", tinta: "#1c1a18", acento: "#b33a2b" },
    { fondo: "#aebfa8", tinta: "#21352f", acento: "#d19a3b" },
    { fondo: "#d7b0a0", tinta: "#3a211d", acento: "#315e54" },
    { fondo: "#b7c2d1", tinta: "#1c2737", acento: "#8f2b1f" },
    { fondo: "#d9c68e", tinta: "#302716", acento: "#315e54" },
    { fondo: "#c7b4c7", tinta: "#2c2132", acento: "#b33a2b" },
    { fondo: "#b8c4b5", tinta: "#1f2f26", acento: "#d19a3b" },
    { fondo: "#d7b79c", tinta: "#33251a", acento: "#3a5b70" },
];

const CARAS = [
    (p) =>
        `<circle cx="24" cy="23" r="11" fill="${p.tinta}"/><circle cx="20" cy="21" r="1.8" fill="${p.fondo}"/><circle cx="28" cy="21" r="1.8" fill="${p.fondo}"/><path d="M19 27c3 2.5 7 2.5 10 0" fill="none" stroke="${p.fondo}" stroke-linecap="round" stroke-width="1.5"/><path d="M13 41c1-6 5-8 11-8s10 2 11 8" fill="${p.acento}"/>`,
    (p) =>
        `<rect x="13" y="12" width="22" height="22" rx="5" fill="${p.tinta}"/><rect x="18" y="18" width="4" height="2" rx="1" fill="${p.fondo}"/><rect x="26" y="18" width="4" height="2" rx="1" fill="${p.fondo}"/><path d="M20 26h8" stroke="${p.acento}" stroke-linecap="round" stroke-width="1.5"/><path d="m11 41 3-8h20l3 8" fill="${p.acento}"/>`,
    (p) =>
        `<path d="M9 18c7-3 15-3 22 0v8c0 7-4 10-11 10S9 33 9 26z" fill="${p.tinta}"/><path d="M23 18c7-3 15-3 22 0v8c0 7-4 10-11 10S23 33 23 26z" fill="${p.tinta}"/><circle cx="18" cy="25" r="2.4" fill="${p.acento}"/><circle cx="34" cy="25" r="2.4" fill="${p.acento}"/><path d="M20 38h16" stroke="${p.fondo}" stroke-linecap="round" stroke-width="2"/>`,
    (p) =>
        `<ellipse cx="24" cy="23" rx="12" ry="13" fill="${p.tinta}"/><path d="M14 20c4-5 16-5 20 0" fill="none" stroke="${p.acento}" stroke-width="2"/><circle cx="20" cy="23" r="1.8" fill="${p.fondo}"/><circle cx="28" cy="23" r="1.8" fill="${p.fondo}"/><path d="M21 30c2 1 4 1 6 0" fill="none" stroke="${p.fondo}" stroke-linecap="round" stroke-width="1.5"/>`,
    (p) =>
        `<path d="M12 22c0-8 5-12 12-12s12 4 12 12" fill="${p.acento}"/><rect x="16" y="19" width="16" height="16" rx="7" fill="${p.tinta}"/><circle cx="21" cy="25" r="1.5" fill="${p.fondo}"/><circle cx="27" cy="25" r="1.5" fill="${p.fondo}"/><path d="M21 30h6" stroke="${p.fondo}" stroke-linecap="round" stroke-width="1.5"/>`,
    (p) =>
        `<circle cx="24" cy="24" r="12" fill="${p.tinta}"/><path d="M12 20c1-8 6-11 12-11s11 3 12 11c-5-3-9-4-12-4s-7 1-12 4z" fill="${p.acento}"/><circle cx="20" cy="24" r="1.8" fill="${p.fondo}"/><circle cx="28" cy="24" r="1.8" fill="${p.fondo}"/><path d="M20 30c3 2 5 2 8 0" fill="none" stroke="${p.fondo}" stroke-linecap="round" stroke-width="1.5"/>`,
    (p) =>
        `<circle cx="24" cy="23" r="11" fill="${p.tinta}"/><rect x="14" y="19" width="8" height="5" rx="2" fill="none" stroke="${p.fondo}" stroke-width="1.4"/><rect x="26" y="19" width="8" height="5" rx="2" fill="none" stroke="${p.fondo}" stroke-width="1.4"/><path d="M22 21.5h4M20 29c3 2 5 2 8 0" fill="none" stroke="${p.acento}" stroke-linecap="round" stroke-width="1.4"/>`,
    (p) =>
        `<circle cx="24" cy="23" r="11" fill="${p.tinta}"/><path d="m24 8 3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="${p.acento}" opacity=".9"/><circle cx="20" cy="26" r="1.5" fill="${p.fondo}"/><circle cx="28" cy="26" r="1.5" fill="${p.fondo}"/>`,
];

const state = {
    vista: "inicio",
    jugadores: [],
    siguienteId: 1,
    config: {
        rondas: 2,
        tematicaIds: new Set(TEMATICAS.map((tematica) => tematica.id)),
        pista: true,
        farsantes: 1,
        invitacion: false,
    },
    partida: null,
    revelacionIndice: 0,
    cartaAbierta: false,
    votoListo: false,
    borradorNombre: "",
    errorNombre: "",
    enlaceInvitacion: "",
    enlaceCopiado: false,
    invitacion: null,
    jugadorInvitacionId: null,
};

let vistaRenderizada = null;
let temporizadorAnuncio = null;

const esc = (valor) =>
    String(valor).replace(
        /[&<>"']/g,
        (caracter) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;",
            })[caracter]
    );

const icono = (nombre) =>
    `<svg class="icono" aria-hidden="true" focusable="false"><use href="#i-${nombre}"></use></svg>`;

function avatarSvg(indice, clase = "avatar") {
    const paleta = PALETAS[indice % PALETAS.length];
    return `<svg class="${clase}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect width="48" height="48" rx="12" fill="${paleta.fondo}"/>${CARAS[indice % CARAS.length](paleta)}</svg>`;
}

function anunciar(texto) {
    window.clearTimeout(temporizadorAnuncio);
    anuncio.textContent = "";
    temporizadorAnuncio = window.setTimeout(() => {
        anuncio.textContent = texto;
    }, 40);
}

function temasSeleccionados() {
    return TEMATICAS.filter((tematica) => state.config.tematicaIds.has(tematica.id));
}

function minimoJugadores() {
    return state.config.farsantes === 2 ? MIN_JUGADORES_DOS_FARSANTES : MIN_JUGADORES;
}

function jugadoresHumanos() {
    return state.jugadores.filter((jugador) => !jugador.bot);
}

function hayBots() {
    return state.jugadores.some((jugador) => jugador.bot);
}

function puedeAnadirBots() {
    return (
        !state.config.invitacion &&
        !hayBots() &&
        jugadoresHumanos().length > 0 &&
        state.jugadores.length <= MAX_JUGADORES - 2
    );
}

function puedePreparar() {
    return (
        !(state.config.invitacion && hayBots()) &&
        jugadoresHumanos().length > 0 &&
        state.jugadores.length >= minimoJugadores() &&
        state.jugadores.length <= MAX_JUGADORES &&
        state.config.tematicaIds.size > 0
    );
}

function motivoBloqueo() {
    if (state.jugadores.length < minimoJugadores()) {
        const faltan = minimoJugadores() - state.jugadores.length;
        if (state.config.farsantes === 2) {
            return `Con dos farsantes hacen falta ${faltan} jugador${
                faltan === 1 ? "" : "es"
            } más.`;
        }
        return `Faltan ${faltan} jugador${faltan === 1 ? "" : "es"} para abrir el caso.`;
    }
    if (jugadoresHumanos().length === 0) return "Añade tu nombre para poder jugar.";
    if (state.config.invitacion && hayBots()) return "El reparto por enlace no admite bots.";
    if (state.config.tematicaIds.size === 0) return "Elige al menos una temática.";
    return "";
}

function vistaInicio() {
    return `
        <section class="portada">
            <div class="portada__texto">
                <p class="kicker"><span class="kicker__punto" aria-hidden="true"></span> ARCHIVO 001 · DEDUCCIÓN SOCIAL</p>
                <h1 class="portada__titulo" tabindex="-1" data-focus>Farsante<span>.</span></h1>
                <p class="portada__lema">Uno no sabe la palabra.<br><em>Los demás tienen que notarlo.</em></p>
                <p class="portada__intro">Reparte una palabra secreta, da pistas en voz alta y vota al sospechoso. El farsante escucha, improvisa y sonríe.</p>
                <div class="acciones">
                    <button class="btn btn--primario btn--grande" id="abrir-expediente" type="button">
                        ${icono("sello")} Abrir expediente ${icono("flecha")}
                    </button>
                    <a class="btn btn--secundario btn--grande" href="#como-jugar">Cómo se juega</a>
                </div>
                <dl class="datos-portada">
                    <div><dt>Jugadores</dt><dd>3—12</dd></div>
                    <div><dt>Duración</dt><dd>10—20 min</dd></div>
                    <div><dt>Formato</dt><dd>Un móvil</dd></div>
                </dl>
            </div>
            <figure class="portada__grafico">
                <img src="assets/expediente.svg" alt="Expediente confidencial con una carta reservada" width="460" height="360" />
                <figcaption><span aria-hidden="true"></span> Nada de cuentas. Nada de servidores.</figcaption>
            </figure>
        </section>
        <section class="como-jugar" id="como-jugar" aria-labelledby="titulo-como-jugar">
            <div class="como-jugar__intro">
                <p class="kicker">CÓMO SE JUEGA</p>
                <h2 id="titulo-como-jugar">Tres actos. Una palabra. Un farsante.</h2>
                <p>No hace falta mesa, tablero ni conexión. Solo un móvil que va pasando de mano en mano.</p>
            </div>
            <ol class="pasos">
                <li>
                    <span class="pasos__numero">01</span>
                    <h3>Reparte</h3>
                    <p>Todos ven la palabra secreta menos una persona. Esa persona solo conoce la categoría.</p>
                </li>
                <li>
                    <span class="pasos__numero">02</span>
                    <h3>Da pistas</h3>
                    <p>Por turnos, cada jugador dice una pista corta. El farsante debe improvisar sin cantar la palabra.</p>
                </li>
                <li>
                    <span class="pasos__numero">03</span>
                    <h3>Vota</h3>
                    <p>La mesa vota en secreto. Si cae el farsante, ganan los inocentes. Si sobrevive, gana el farsante.</p>
                </li>
            </ol>
        </section>
    `;
}

function vistaConfig() {
    const total = state.jugadores.length;
    const seleccionadas = state.config.tematicaIds;
    const listo = puedePreparar();
    const motivo = motivoBloqueo();
    const hayBotsEnMesa = hayBots();
    const puedeAgregarBots = puedeAnadirBots();
    const notaBots = state.config.invitacion
        ? "Desactiva el reparto por enlace para usar bots."
        : hayBotsEnMesa
          ? "Ya hay bots en la mesa. Quítalos para volver a añadirlos."
          : jugadoresHumanos().length === 0
            ? "Añade tu nombre antes de los bots."
            : total > MAX_JUGADORES - 2
              ? "No hay sitio para dos bots."
              : "Ocupan dos asientos y juegan sus pistas y votos.";
    return `
        <section class="vista config">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <button class="btn-volver" id="volver-inicio" type="button">${icono("atras")} Volver</button>
                    <p class="kicker">PASO 01 / 03 · PREPARACIÓN</p>
                </div>
                <h1 tabindex="-1" data-focus>Prepara el expediente.</h1>
                <p class="vista__entrada">Añade a la mesa y decide cuánto va a durar el caso. Puedes repartir en este móvil o enviar un enlace privado a cada jugador.</p>
            </header>
            <div class="config__grid">
                <section class="panel panel--roster" aria-labelledby="titulo-jugadores">
                    <div class="panel__cabecera">
                        <div>
                            <p class="kicker">LA MESA</p>
                            <h2 id="titulo-jugadores">Jugadores</h2>
                        </div>
                        <span class="contador">${total} / ${MAX_JUGADORES}</span>
                    </div>
                    ${
                        total === 0
                            ? `<div class="vacio-roster">
                                <span class="vacio-roster__icono">${icono("personas")}</span>
                                <p><strong>El expediente está en blanco.</strong><br>Añade al menos ${minimoJugadores()} personas para empezar.</p>
                            </div>`
                            : `<ul class="roster">${state.jugadores
                                  .map(
                                      (jugador, indice) => `<li class="jugador">
                                            <span class="jugador__avatar">${avatarSvg(jugador.avatar)}</span>
                                            <span class="jugador__datos">
                                                <strong>${esc(jugador.nombre)}</strong>
                                                <small>${jugador.bot ? `<span class="jugador__bot">BOT</span> PRÁCTICA` : `JUGADOR ${String(indice + 1).padStart(2, "0")}`}</small>
                                            </span>
                                            <button class="jugador__quitar" type="button" data-quitar="${jugador.id}" aria-label="Quitar a ${esc(jugador.nombre)}">${icono("x")}</button>
                                        </li>`
                                  )
                                  .join("")}</ul>`
                    }
                    <form class="alta" id="form-jugador">
                        <div class="alta__preview">${avatarSvg(state.siguienteId - 1)}</div>
                        <div class="alta__campo">
                            <label for="nombre-jugador">Nombre del siguiente jugador</label>
                            <div class="alta__fila">
                                <input id="nombre-jugador" name="nombre" type="text" maxlength="16" autocomplete="off" placeholder="${total === 0 ? "Ana" : "Nombre"}" value="${esc(state.borradorNombre)}" ${total >= MAX_JUGADORES ? "disabled" : ""} />
                                <button class="btn btn--pequeno btn--oscuro" type="submit" ${total >= MAX_JUGADORES ? "disabled" : ""}>${icono("mas")} Añadir</button>
                            </div>
                            <p class="campo__error" id="error-nombre" role="alert">${esc(state.errorNombre)}</p>
                            <p class="campo__ayuda">De 3 a 12 personas. Nombres distintos.</p>
                        </div>
                    </form>
                    <div class="bots-alta">
                        <div>
                            <p class="kicker">MODO PRÁCTICA</p>
                            <p class="nota-bots">${notaBots}</p>
                        </div>
                        <button class="btn btn--secundario btn--pequeno" id="anadir-bots" type="button" ${puedeAgregarBots ? "" : "disabled"}>${icono("personas")} Añadir 2 bots</button>
                    </div>
                </section>
                <aside class="panel panel--ajustes" aria-labelledby="titulo-ajustes">
                    <div class="panel__cabecera">
                        <div>
                            <p class="kicker">EL CASO</p>
                            <h2 id="titulo-ajustes">Ajustes del caso</h2>
                        </div>
                    </div>
                    <fieldset class="ajuste">
                        <legend>Duración</legend>
                        <p class="ajuste__nota">Cuántas rondas de pistas y votos aguanta la mesa.</p>
                        <div class="segmentos" role="group" aria-label="Número de rondas">
                            ${RONDAS.map(
                                (ronda) => `<button class="segmento" type="button" data-rondas="${ronda}" aria-pressed="${state.config.rondas === ronda}">${ronda} ${ronda === 1 ? "ronda" : "rondas"}</button>`
                            ).join("")}
                        </div>
                    </fieldset>
                    <fieldset class="ajuste">
                        <legend>Farsantes</legend>
                        <p class="ajuste__nota">Dos farsantes necesitan 6 jugadores o más y se reconocen entre sí.</p>
                        <div class="segmentos segmentos--dos" role="group" aria-label="Número de farsantes">
                            ${[1, 2]
                                .map(
                                    (cantidad) => `<button class="segmento" type="button" data-farsantes="${cantidad}" aria-pressed="${state.config.farsantes === cantidad}" ${cantidad === 2 && state.jugadores.length < MIN_JUGADORES_DOS_FARSANTES ? "disabled" : ""}>${cantidad} ${cantidad === 1 ? "farsante" : "farsantes"}</button>`
                                )
                                .join("")}
                        </div>
                    </fieldset>
                    <fieldset class="ajuste">
                        <legend>Temáticas</legend>
                        <p class="ajuste__nota">De dónde saldrá la palabra. Puedes mezclar todas.</p>
                        <div class="temas">
                            ${TEMATICAS.map(
                                (tematica) => `<button class="tema" type="button" data-tema="${tematica.id}" aria-pressed="${seleccionadas.has(tematica.id)}">
                                    <span class="tema__marca" aria-hidden="true"></span>
                                    <span><strong>${tematica.nombre}</strong><small>${tematica.descripcion}</small></span>
                                </button>`
                            ).join("")}
                        </div>
                    </fieldset>
                    <label class="interruptor" for="pista-letra">
                        <input id="pista-letra" type="checkbox" ${state.config.pista ? "checked" : ""} />
                        <span class="interruptor__pista" aria-hidden="true"></span>
                        <span><strong>Pista de letra</strong><small>El farsante verá la primera letra. Más fácil para empezar.</small></span>
                    </label>
                    <label class="interruptor ${hayBotsEnMesa ? "interruptor--desactivado" : ""}" for="modo-invitacion">
                        <input id="modo-invitacion" type="checkbox" ${state.config.invitacion ? "checked" : ""} ${hayBotsEnMesa ? "disabled" : ""} />
                        <span class="interruptor__pista" aria-hidden="true"></span>
                        <span><strong>Reparto por enlace</strong><small>${hayBotsEnMesa ? "No disponible con bots en la mesa." : "Cada jugador abre su carta en su móvil. Después, la mesa se juega aquí."}</small></span>
                    </label>
                    <div class="resumen-config">
                        <p><span>En la mesa</span><strong>${total} ${total === 1 ? "persona" : "personas"}</strong></p>
                        <p><span>Farsantes</span><strong>${state.config.farsantes}</strong></p>
                        <p><span>Rondas</span><strong>${state.config.rondas}</strong></p>
                        <p><span>Reparto</span><strong>${state.config.invitacion ? "Por enlace" : "En este móvil"}</strong></p>
                        <p><span>Temáticas</span><strong>${seleccionadas.size} / ${TEMATICAS.length}</strong></p>
                    </div>
                    <button class="btn btn--primario btn--ancho" id="preparar-reparto" type="button" ${listo ? "" : "disabled"}>
                        ${listo ? "Preparar reparto" : "Completa el expediente"} ${listo ? icono("flecha") : ""}
                    </button>
                    <p class="nota-config">${motivo || (state.config.invitacion ? "El enlace lleva el caso; la mesa sigue en este móvil." : "El reparto se hace en este móvil, sin conexión.")}</p>
                </aside>
            </div>
        </section>
    `;
}

function vistaBrief() {
    const temas = temasSeleccionados()
        .map((tematica) => tematica.nombre)
        .join(" · ");
    return `
        <section class="vista brief">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <button class="btn-volver" id="volver-config" type="button">${icono("atras")} Editar</button>
                    <p class="kicker">PASO 02 / 03 · REPARTO</p>
                </div>
                <h1 tabindex="-1" data-focus>El caso está listo.</h1>
                <p class="vista__entrada">${
                    state.config.invitacion
                        ? "Cuando pulses el botón, se creará un enlace privado. Cada persona abrirá su carta en su propio móvil."
                        : hayBots()
                          ? "Cuando pulses el botón, verás solo tu carta. Los bots ya tienen la suya y no hace falta pasar el móvil."
                          : "Cuando pulses el botón, el móvil se convierte en una urna. Cada persona mira su carta y la tapa antes de pasarla."
                }</p>
            </header>
            <div class="brief__grid">
                <section class="panel panel--brief" aria-labelledby="titulo-mesa">
                    <div class="sello-confidencial" aria-hidden="true">CONFIDENCIAL</div>
                    <p class="kicker">LA MESA DEL CASO</p>
                    <h2 id="titulo-mesa">${state.jugadores.length} personas, ${state.config.farsantes === 2 ? "dos farsantes" : "una palabra"}.</h2>
                    <ul class="brief__jugadores">
                        ${state.jugadores
                            .map(
                                (jugador) => `<li><span>${avatarSvg(jugador.avatar)}</span><strong>${esc(jugador.nombre)}${jugador.bot ? ` <span class="brief__bot">BOT</span>` : ""}</strong></li>`
                            )
                            .join("")}
                    </ul>
                    <p class="brief__temas">${temas}</p>
                </section>
                <aside class="panel panel--brief-datos" aria-labelledby="titulo-resumen-caso">
                    <p class="kicker">RESUMEN DEL EXPEDIENTE</p>
                    <h2 id="titulo-resumen-caso">Todo listo.</h2>
                    <dl class="brief__datos">
                        <div><dt>Jugadores</dt><dd>${state.jugadores.length}</dd></div>
                        ${hayBots() ? `<div><dt>Bots</dt><dd>${state.jugadores.filter((jugador) => jugador.bot).length}</dd></div>` : ""}
                        <div><dt>Farsantes</dt><dd>${state.config.farsantes}</dd></div>
                        <div><dt>Rondas</dt><dd>${state.config.rondas}</dd></div>
                        <div><dt>Pista de letra</dt><dd>${state.config.pista ? "Sí" : "No"}</dd></div>
                        <div><dt>Reparto</dt><dd>${state.config.invitacion ? "Por enlace" : "Un móvil"}</dd></div>
                    </dl>
                    <div class="aviso-privado">${icono("candado")} <p><strong>Una carta por persona.</strong> ${state.config.invitacion ? "Cada jugador la abre en su propio móvil." : hayBots() ? "Solo verás tu carta; los bots ya tienen la suya." : "Que nadie vea la pantalla de al lado."}</p></div>
                    <button class="btn btn--primario btn--ancho btn--grande" id="empezar-reparto" type="button">${state.config.invitacion ? "Crear enlace de invitación" : "Repartir cartas"} ${icono("flecha")}</button>
                    <button class="btn btn--texto" id="editar-config" type="button">Volver a los ajustes</button>
                </aside>
            </div>
        </section>
    `;
}

function cartaMarkup({ jugador, partida, pista, abierta, companero = null }) {
    const nombre = esc(jugador.nombre);
    const esFarsante = partida.farsanteIds.includes(jugador.id);
    const dosFarsantes = partida.farsanteIds.length > 1;
    return `
        <div class="carta ${abierta ? "carta--abierta" : ""}" role="group" aria-label="Carta privada de ${nombre}">
            <div class="carta__cara carta__cara--reverso" aria-hidden="${abierta}">
                <img src="assets/card-back.svg" alt="" width="280" height="400" />
                <span class="carta__reverso-texto">Solo para tus ojos</span>
            </div>
            <div class="carta__cara carta__cara--frente ${esFarsante ? "carta__cara--farsante" : "carta__cara--inocente"}" aria-hidden="${!abierta}">
                <span class="carta__sello" aria-hidden="true">F</span>
                <p class="carta__etiqueta">${esFarsante ? "FARSANTE" : "INOCENTE"}</p>
                <p class="carta__rol">${esFarsante ? (dosFarsantes ? "Eres uno de los dos farsantes. No conoces la palabra." : "No conoces la palabra.") : "Tu palabra secreta"}</p>
                <p class="carta__palabra">${esFarsante ? "???" : esc(partida.palabra)}</p>
                <p class="carta__categoria">${esc(partida.categoria)}</p>
                ${
                    esFarsante && pista
                        ? `<p class="carta__pista">Pista: empieza por <strong>${esc(partida.letra)}</strong></p>`
                        : ""
                }
                ${
                    companero
                        ? `<p class="carta__complice">Tu cómplice: <strong>${esc(companero.nombre)}</strong></p>`
                        : ""
                }
                <p class="carta__aviso">${esFarsante ? (companero ? "Escucha, improvisa y protege a tu cómplice." : "Escucha, improvisa y no des demasiados detalles.") : "Da una pista corta. No digas la palabra."}</p>
            </div>
        </div>`;
}

function vistaInvitacionHost() {
    const partida = state.partida;
    if (!partida) return "";
    return `
        <section class="vista invitacion">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <p class="kicker">PASO 03 / 03 · REPARTO POR ENLACE</p>
                    <span class="estado-pill">SIN SERVIDOR</span>
                </div>
                <h1 tabindex="-1" data-focus>Comparte el enlace.</h1>
                <p class="vista__entrada">Cada persona abre su carta en su propio móvil. La ronda y la votación se quedan en este dispositivo.</p>
            </header>
            <div class="invitacion__grid">
                <section class="panel panel--invitacion" aria-labelledby="titulo-enlace">
                    <p class="kicker">ENLACE DEL EXPEDIENTE</p>
                    <h2 id="titulo-enlace">Una carta por persona.</h2>
                    <p class="invitacion__intro">Comparte este enlace con la mesa. Cada jugador elige su nombre y ve su carta sin pasar el móvil.</p>
                    <label class="sr-only" for="enlace-invitacion">Enlace de invitación</label>
                    <div class="enlace-fila">
                        <input id="enlace-invitacion" type="text" readonly value="${esc(state.enlaceInvitacion)}" />
                        <button class="btn btn--pequeno btn--oscuro" id="copiar-enlace" type="button">${icono("copiar")} ${state.enlaceCopiado ? "Copiado" : "Copiar"}</button>
                    </div>
                    <p class="nota-config">El enlace lleva el caso completo. Compártelo solo con la mesa.</p>
                    <div class="aviso-privado">${icono("candado")} <p><strong>Es un enlace privado.</strong> Quien lo abra puede ver las cartas de la mesa.</p></div>
                    <button class="btn btn--primario btn--ancho btn--grande" id="empezar-ronda-invitacion" type="button">Empezar ronda 1 ${icono("flecha")}</button>
                    <button class="btn btn--texto" id="volver-config-invitacion" type="button">Volver a los ajustes</button>
                </section>
                <aside class="panel panel--invitacion-mesa" aria-labelledby="titulo-mesa-enlace">
                    <div class="panel__cabecera">
                        <div>
                            <p class="kicker">LA MESA</p>
                            <h2 id="titulo-mesa-enlace">Cartas privadas</h2>
                        </div>
                        <span class="contador">${state.jugadores.length}</span>
                    </div>
                    <ul class="invitacion-lista">
                        ${state.jugadores
                            .map(
                                (jugador) => `<li>${avatarSvg(jugador.avatar)}<strong>${esc(jugador.nombre)}</strong><span>Por enlace</span></li>`
                            )
                            .join("")}
                    </ul>
                    <p class="nota-config">Cuando todos hayan visto su carta, empezad la ronda desde este móvil.</p>
                </aside>
            </div>
        </section>
    `;
}

function vistaInvitacionJugador() {
    const invitacion = state.invitacion;
    if (!invitacion) return "";
    const jugador = invitacion.jugadores.find(
        (item) => item.id === state.jugadorInvitacionId
    );
    if (!jugador) {
        return `
            <section class="vista invitacion-jugador">
                <header class="vista__cabecera">
                    <div class="vista__barra">
                        <p class="kicker">INVITACIÓN PRIVADA</p>
                        <span class="estado-pill estado-pill--rojo">SOLO TU CARTA</span>
                    </div>
                    <h1 tabindex="-1" data-focus>Elige tu nombre.</h1>
                    <p class="vista__entrada">Te han invitado a un caso. Selecciona tu nombre para ver tu carta. La mesa se juega en el dispositivo anfitrión.</p>
                </header>
                <div class="invitacion-jugadores">
                    ${invitacion.jugadores
                        .map(
                            (item) => `<button class="jugador-invitado" type="button" data-elegir-invitado="${item.id}">
                                ${avatarSvg(item.avatar)}
                                <strong>${esc(item.nombre)}</strong>
                                <span>Ver mi carta ${icono("flecha")}</span>
                            </button>`
                        )
                        .join("")}
                </div>
                <p class="nota-privacidad">${icono("candado")} Elige solo tu nombre. Si te equivocas, puedes volver a empezar.</p>
            </section>
        `;
    }

    const companero =
        invitacion.partida.farsanteIds.length > 1 &&
        invitacion.partida.farsanteIds.includes(jugador.id)
            ? invitacion.jugadores.find(
                  (item) =>
                      item.id !== jugador.id &&
                      invitacion.partida.farsanteIds.includes(item.id)
              )
            : null;

    return `
        <section class="vista reparto invitacion-jugador">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <p class="kicker">INVITACIÓN PRIVADA · CARTA</p>
                    <span class="progreso-texto">${invitacion.jugadores.length} JUGADORES</span>
                </div>
                <h1 tabindex="-1" data-focus>Carta de ${esc(jugador.nombre)}.</h1>
                <p class="vista__entrada">Que nadie más mire. Cuando termines, oculta la carta y devuelve el móvil a la mesa.</p>
            </header>
            <div class="escena-carta">
                ${cartaMarkup({
                    jugador,
                    partida: invitacion.partida,
                    pista: invitacion.config.pista,
                    abierta: true,
                    companero,
                })}
            </div>
            <div class="acciones reparto__acciones">
                <button class="btn btn--primario btn--grande" id="ocultar-invitacion" type="button" data-focus>${icono("ojo")} Ocultar y elegir otro</button>
            </div>
            <p class="nota-privacidad">${icono("candado")} Esta invitación muestra solo la carta elegida. La partida continúa en el dispositivo anfitrión.</p>
        </section>
    `;
}

function vistaReparto() {
    const partida = state.partida;
    const humanos = jugadoresHumanos();
    const jugador = humanos[state.revelacionIndice];
    if (!partida || !jugador) return "";

    const abierta = state.cartaAbierta;
    const companero =
        partida.farsanteIds.length > 1 && partida.farsanteIds.includes(jugador.id)
            ? state.jugadores.find(
                  (item) =>
                      item.id !== jugador.id && partida.farsanteIds.includes(item.id)
              )
            : null;
    const ultima = state.revelacionIndice === humanos.length - 1;
    const soloConBots = humanos.length === 1 && hayBots();
    const nombre = esc(jugador.nombre);

    return `
        <section class="vista reparto ${abierta ? "reparto--abierta" : ""}">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <p class="kicker">PASO 03 / 03 · CARTAS PRIVADAS</p>
                    <span class="progreso-texto">${state.revelacionIndice + 1} / ${humanos.length}</span>
                </div>
                <h1 tabindex="-1" data-focus>${abierta ? `Carta de ${nombre}` : soloConBots ? `Tu carta, ${nombre}.` : `Pasa el móvil a ${nombre}`}</h1>
                <p class="vista__entrada">${abierta ? "Que nadie más mire la pantalla. Cuando termines, tapa la carta y pasa el móvil." : hayBots() ? "Solo verás tu carta. Los bots ya tienen la suya; no hace falta pasar el móvil." : "Una carta por persona. Sin enseñar, sin comentar, sin mirar de reojo."}</p>
            </header>
            <div class="progreso-cartas" role="progressbar" aria-label="Progreso del reparto" aria-valuemin="1" aria-valuemax="${humanos.length}" aria-valuenow="${state.revelacionIndice + 1}">
                ${humanos
                    .map(
                        (_, indice) => `<span class="progreso-cartas__punto ${indice < state.revelacionIndice ? "hecho" : indice === state.revelacionIndice ? "actual" : ""}"></span>`
                    )
                    .join("")}
            </div>
            <div class="escena-carta">
                ${cartaMarkup({ jugador, partida, pista: state.config.pista, abierta, companero })}
            </div>
            <div class="acciones reparto__acciones">
                ${
                    abierta
                        ? `<button class="btn btn--primario btn--grande" id="avanzar-carta" type="button" data-focus>${ultima ? "Empezar ronda 1" : "Ocultar y pasar"} ${icono("flecha")}</button>`
                        : `<button class="btn btn--primario btn--grande" id="voltear-carta" type="button" data-focus>${icono("ojo")} Soy ${nombre}, ver mi carta</button>`
                }
            </div>
            <p class="nota-privacidad">${icono("candado")} ${hayBots() ? "Cuando termines, empieza la ronda. Los bots ya tienen su carta." : "La carta se oculta al pasar. Nadie necesita verla dos veces."}</p>
        </section>
    `;
}

function vistaRonda() {
    const partida = state.partida;
    if (!partida) return "";
    const vivos = jugadoresVivos(state.jugadores, partida.eliminados);
    const orden = ordenPistas(state.jugadores, partida.eliminados, partida.rondaActual);
    const pistasBots = generarPistasBots({ jugadores: state.jugadores, partida });
    const mesaConBots = vivos.some((jugador) => jugador.bot);
    return `
        <section class="vista ronda">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <p class="kicker">RONDA ${partida.rondaActual} DE ${state.config.rondas}</p>
                    <span class="estado-pill"><span aria-hidden="true"></span>${vivos.length} EN JUEGO</span>
                </div>
                <h1 tabindex="-1" data-focus>Las pistas empiezan.</h1>
                <p class="vista__entrada">${mesaConBots ? "Los bots ya han dejado su pista. Tú das la tuya en voz alta: una idea corta, sin decir la palabra." : "Cada persona dice una pista corta sobre la palabra. Sin decirla, sin deletrearla, sin mirar la carta."}</p>
            </header>
            <div class="ronda__grid">
                <section class="panel panel--orden" aria-labelledby="titulo-orden">
                    <div class="panel__cabecera">
                        <div>
                            <p class="kicker">LA MESA</p>
                            <h2 id="titulo-orden">Orden de la ronda</h2>
                        </div>
                        <span class="contador">${vivos.length}</span>
                    </div>
                    <ol class="orden">
                        ${orden
                            .map(
                                (jugador, indice) => `<li class="${indice === 0 ? "orden__primero" : ""}">
                                    <span class="orden__numero">${String(indice + 1).padStart(2, "0")}</span>
                                    <span>${avatarSvg(jugador.avatar)}</span>
                                    <strong>${esc(jugador.nombre)}</strong>
                                    ${jugador.bot ? `<em class="orden__bot">BOT</em>` : ""}
                                    ${indice === 0 ? `<em>Empieza</em>` : ""}
                                    ${jugador.bot ? `<span class="orden__pista">“${esc(pistasBots[jugador.id]?.texto || "Pista reservada.")}”</span>` : ""}
                                </li>`
                            )
                            .join("")}
                    </ol>
                    ${mesaConBots ? `<p class="orden__nota">${icono("personas")} Los bots ya han dejado su pista. Tú das la tuya en voz alta.</p>` : ""}
                </section>
                <aside class="panel panel--recordatorio" aria-labelledby="titulo-recordatorio">
                    <p class="kicker">REGLA DE ORO</p>
                    <h2 id="titulo-recordatorio">Una pista. Una sola idea.</h2>
                    <blockquote>“Una pista corta. Una idea concreta. Nunca la palabra.”</blockquote>
                    <p>El farsante también tiene que dar una pista. Si duda, que improvise. Si acierta demasiado, que se explique.</p>
                    <button class="btn btn--primario btn--ancho btn--grande" id="abrir-votacion" type="button">Abrir votación ${icono("flecha")}</button>
                    <p class="nota-config">Cuando hayáis dado una vuelta completa, votad.</p>
                </aside>
            </div>
        </section>
    `;
}

function vistaVotacion() {
    const partida = state.partida;
    if (!partida) return "";
    const vivos = jugadoresVivos(state.jugadores, partida.eliminados);
    const humanos = vivos.filter((jugador) => !jugador.bot);
    const votante = humanos[partida.indiceVotante];
    if (!votante) return "";
    const nombre = esc(votante.nombre);
    const soloConBots = humanos.length === 1 && vivos.some((jugador) => jugador.bot);

    if (!state.votoListo) {
        return `
            <section class="vista voto voto--paso">
                <header class="vista__cabecera">
                    <div class="vista__barra">
                        <p class="kicker">VOTACIÓN · ${partida.indiceVotante + 1} DE ${humanos.length}</p>
                        <span class="estado-pill estado-pill--rojo">VOTO SECRETO</span>
                    </div>
                    <h1 tabindex="-1" data-focus>${soloConBots ? `Te toca votar, ${nombre}.` : `Pasa el móvil a ${nombre}.`}</h1>
                    <p class="vista__entrada">${soloConBots ? "Los bots ya han dejado su voto. Elige al sospechoso sin que nadie más mire la pantalla." : "El resto, mirad hacia otro lado. El voto es secreto: nadie debería verlo antes que la mesa."}</p>
                </header>
                <div class="votante">
                    <span class="votante__avatar">${avatarSvg(votante.avatar)}</span>
                    <p class="kicker">LE TOCA VOTAR</p>
                    <strong>${nombre}</strong>
                    <p>${soloConBots ? "Los bots ya han votado. Ahora decides tú." : "Nadie más en la pantalla."}</p>
                </div>
                <button class="btn btn--primario btn--grande" id="preparar-voto" type="button" data-focus>${soloConBots ? "Votar ahora" : `Estoy ${nombre}, votar`} ${icono("flecha")}</button>
                <p class="nota-privacidad">${icono("candado")} El voto se guarda sin mostrar el nombre del votante.</p>
            </section>
        `;
    }

    const candidatos = vivos.filter((jugador) => jugador.id !== votante.id);
    return `
        <section class="vista voto">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <p class="kicker">VOTO DE ${nombre.toLocaleUpperCase("es")}</p>
                    <span class="estado-pill estado-pill--rojo">${partida.indiceVotante + 1} DE ${humanos.length}</span>
                </div>
                <h1 tabindex="-1" data-focus>¿Quién te parece sospechoso?</h1>
                <p class="vista__entrada">Elige una carta. No puedes votarte a ti. No hay vuelta atrás.${soloConBots ? " Los bots ya han dejado su voto." : ""}</p>
            </header>
            <div class="candidatos" role="group" aria-label="Candidatos a la votación">
                ${candidatos
                    .map(
                        (jugador) => `<button class="candidato" type="button" data-votar="${jugador.id}" aria-label="Votar a ${esc(jugador.nombre)}">
                            <span class="candidato__avatar">${avatarSvg(jugador.avatar)}</span>
                            <strong>${esc(jugador.nombre)}</strong>
                            <span class="candidato__accion">Seleccionar ${icono("flecha")}</span>
                        </button>`
                    )
                    .join("")}
            </div>
            <p class="nota-privacidad">${icono("candado")} Un voto por persona. La mesa verá el recuento, no quién votó a quién.</p>
        </section>
    `;
}

function vistaResultado() {
    const partida = state.partida;
    const resultado = partida?.resultado;
    if (!partida || !resultado) return "";
    const eliminado = state.jugadores.find((jugador) => jugador.id === resultado.eliminadoId);
    const filas = [...resultado.tally].sort((a, b) => b.votos - a.votos || a.nombre.localeCompare(b.nombre, "es"));
    const maximo = resultado.maximo || 1;
    const totalVotos = filas.reduce((total, fila) => total + fila.votos, 0);
    const farsantesTotales = partida.farsanteIds.length;
    const farsantesRestantes = resultado.farsantesVivos?.length || 0;
    const acertoParcial = resultado.eraFarsante && !resultado.fin;
    return `
        <section class="vista resultado">
            <header class="vista__cabecera">
                <div class="vista__barra">
                    <p class="kicker">ACTA DE VOTACIÓN · RONDA ${partida.rondaActual}</p>
                    <span class="estado-pill estado-pill--rojo">${totalVotos} VOTOS</span>
                </div>
                <h1 tabindex="-1" data-focus>${resultado.empate ? "La mesa no se pone de acuerdo." : `${esc(eliminado?.nombre || "")} queda fuera.`}</h1>
                <p class="vista__entrada">${resultado.empate ? "Nadie abandona el caso esta ronda. La palabra sigue en juego." : "La mesa ha decidido. Ahora se descubre si ha acertado."}</p>
            </header>
            <div class="resultado__grid">
                <section class="panel panel--recuento" aria-labelledby="titulo-recuento">
                    <div class="panel__cabecera">
                        <div>
                            <p class="kicker">RECUENTO</p>
                            <h2 id="titulo-recuento">Votos recibidos</h2>
                        </div>
                    </div>
                    <ul class="recuento">
                        ${filas
                            .map(
                                (fila) => `<li class="recuento__fila ${fila.id === resultado.eliminadoId ? "recuento__fila--fuera" : ""}">
                                    <span class="recuento__avatar">${avatarSvg(state.jugadores.find((j) => j.id === fila.id)?.avatar || 0)}</span>
                                    <span class="recuento__nombre">${esc(fila.nombre)}</span>
                                    <span class="recuento__barra" aria-hidden="true"><span style="width:${Math.round((fila.votos / maximo) * 100)}%"></span></span>
                                    <strong>${fila.votos}</strong>
                                </li>`
                            )
                            .join("")}
                    </ul>
                </section>
                <aside class="panel panel--veredicto" aria-labelledby="titulo-veredicto">
                    <p class="kicker">${resultado.empate ? "SIN EXPULSIÓN" : resultado.eraFarsante ? (resultado.fin ? (farsantesTotales > 1 ? "LOS FARSANTES ERAN" : "EL FARSANTE ERA") : "ERA UN FARSANTE") : "NO ERA EL FARSANTE"}</p>
                    <h2 id="titulo-veredicto">${resultado.empate ? "Empate." : resultado.eraFarsante ? (resultado.fin ? "Habéis acertado." : "Un farsante menos.") : "La mesa se equivocó."}</h2>
                    ${
                        eliminado
                            ? `<div class="veredicto__persona">${avatarSvg(eliminado.avatar)}<strong>${esc(eliminado.nombre)}</strong><span>${resultado.eraFarsante ? (resultado.fin ? (farsantesTotales > 1 ? "Farsantes" : "Farsante") : `Farsante · queda${farsantesRestantes === 1 ? "" : "n"} ${farsantesRestantes}`) : "Inocente"}</span></div>`
                            : `<div class="veredicto__empate">${icono("personas")}<p>Nadie tenía la mayoría. El caso continúa.</p></div>`
                    }
                    <p class="veredicto__texto">${
                        resultado.fin
                            ? resultado.ganador === "inocentes"
                                ? farsantesTotales > 1
                                    ? "Los farsantes han caído. La palabra queda a salvo."
                                    : "El farsante ha caído. La palabra queda a salvo."
                                : farsantesTotales > 1
                                  ? "Al menos un farsante ha sobrevivido. La mesa se queda sin tiempo."
                                  : "El farsante ha sobrevivido. La mesa se queda sin tiempo."
                            : acertoParcial
                              ? "Habéis eliminado a un farsante, pero queda al menos uno. El caso sigue abierto."
                              : "La partida sigue. Cambiad de ronda y volved a dar pistas."
                    }</p>
                    <button class="btn btn--primario btn--ancho btn--grande" id="continuar-resultado" type="button">${resultado.fin ? "Ver veredicto" : "Siguiente ronda"} ${icono("flecha")}</button>
                </aside>
            </div>
        </section>
    `;
}

function vistaFinal() {
    const partida = state.partida;
    const resultado = partida?.resultado;
    if (!partida || !resultado?.ganador) return "";
    const farsantes = state.jugadores.filter((jugador) =>
        partida.farsanteIds.includes(jugador.id)
    );
    const totalFarsantes = partida.farsanteIds.length;
    const ganaFarsante = resultado.ganador === "farsante";
    return `
        <section class="vista final ${ganaFarsante ? "final--farsante" : "final--inocentes"}">
            <div class="final__sello">${icono(ganaFarsante ? "ojo" : "check")} CASO CERRADO</div>
            <p class="kicker">VEREDICTO · ${partida.rondaActual} ${partida.rondaActual === 1 ? "RONDA" : "RONDAS"}</p>
            <h1 tabindex="-1" data-focus>${ganaFarsante ? (totalFarsantes > 1 ? "Los farsantes se escapan." : "El farsante se escapa.") : "Los inocentes cierran el caso."}</h1>
            <p class="vista__entrada">${ganaFarsante ? (totalFarsantes > 1 ? "La mesa no los vio venir. Al menos un farsante sobrevivió con la palabra en el bolsillo." : "La mesa no lo vio venir. El farsante sobrevivió con la palabra en el bolsillo.") : "La mentira tenía un nombre. La mesa lo encontró a tiempo."}</p>
            <div class="final__revelacion">
                <section class="panel panel--revelacion" aria-label="Farsantes del caso">
                    <p class="kicker">${totalFarsantes > 1 ? "LOS FARSANTES ERAN" : "EL FARSANTE ERA"}</p>
                    <div class="final__personas">${farsantes
                        .map(
                            (jugador) => `<div class="final__persona">${avatarSvg(jugador.avatar)}<h2>${esc(jugador.nombre)}</h2></div>`
                        )
                        .join("")}</div>
                </section>
                <section class="panel panel--revelacion" aria-labelledby="titulo-palabra">
                    <p class="kicker">LA PALABRA ERA</p>
                    <p class="final__palabra" id="titulo-palabra">${esc(partida.palabra)}</p>
                    <p class="final__categoria">${esc(partida.categoria)}</p>
                </section>
            </div>
            <div class="final__acciones">
                <button class="btn btn--primario btn--grande" id="jugar-otra" type="button">Jugar otra vez ${icono("aleatorio")}</button>
                <button class="btn btn--secundario btn--grande" id="nuevo-caso" type="button">Nuevo expediente</button>
            </div>
            <p class="nota-privacidad">${icono("candado")} Mismos jugadores, nueva palabra. Nadie tiene que apuntar nada.</p>
        </section>
    `;
}

const VISTAS = {
    inicio: vistaInicio,
    config: vistaConfig,
    brief: vistaBrief,
    invitacion: vistaInvitacionHost,
    reparto: vistaReparto,
    "invitacion-jugador": vistaInvitacionJugador,
    ronda: vistaRonda,
    votacion: vistaVotacion,
    resultado: vistaResultado,
    final: vistaFinal,
};

function render(foco = null) {
    const markup = VISTAS[state.vista]();
    if (!markup) return;
    app.innerHTML = markup;
    enlazar();
    if (vistaRenderizada !== state.vista) {
        vistaRenderizada = state.vista;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
    const objetivo = foco ? app.querySelector(foco) : app.querySelector("[data-focus]");
    if (objetivo) {
        window.requestAnimationFrame(() => objetivo.focus({ preventScroll: true }));
    }
}

function agregarJugador() {
    if (state.jugadores.length >= MAX_JUGADORES) {
        state.errorNombre = `El máximo es ${MAX_JUGADORES} jugadores.`;
        render("#nombre-jugador");
        return;
    }
    const error = validarNombre(state.borradorNombre, state.jugadores);
    if (error) {
        state.errorNombre = error;
        render("#nombre-jugador");
        return;
    }
    const indice = state.siguienteId - 1;
    state.jugadores.push(crearJugador(state.borradorNombre, indice, `p-${state.siguienteId}`));
    state.siguienteId += 1;
    state.borradorNombre = "";
    state.errorNombre = "";
    anunciar("Jugador añadido al expediente.");
    render("#nombre-jugador");
}

function quitarJugador(id) {
    const jugador = state.jugadores.find((item) => item.id === id);
    state.jugadores = state.jugadores.filter((item) => item.id !== id);
    state.errorNombre = "";
    anunciar(`${jugador?.nombre || "Jugador"} sale del expediente.`);
    render();
}

function agregarBots() {
    if (state.config.invitacion) {
        anunciar("Desactiva el reparto por enlace para añadir bots.");
        return;
    }
    if (hayBots()) {
        anunciar("Ya hay bots en la mesa.");
        return;
    }
    if (jugadoresHumanos().length === 0) {
        state.errorNombre = "Añade tu nombre antes de los bots.";
        render("#nombre-jugador");
        return;
    }
    if (state.jugadores.length > MAX_JUGADORES - 2) {
        anunciar("No hay sitio para dos bots.");
        return;
    }

    const usados = new Set(state.jugadores.map((jugador) => jugador.nombre.toLocaleLowerCase("es")));
    const nombres = [];
    for (let numero = 1; nombres.length < 2 && numero < 100; numero += 1) {
        const nombre = `Bot ${numero}`;
        if (!usados.has(nombre.toLocaleLowerCase("es"))) {
            nombres.push(nombre);
            usados.add(nombre.toLocaleLowerCase("es"));
        }
    }
    nombres.forEach((nombre) => {
        const indice = state.siguienteId - 1;
        state.jugadores.push({
            ...crearJugador(nombre, indice, `p-${state.siguienteId}`),
            bot: true,
        });
        state.siguienteId += 1;
    });
    state.errorNombre = "";
    anunciar("Dos bots añadidos. Ya puedes jugar sin mesa.");
    render();
}

function prepararPartida() {
    if (state.config.invitacion && hayBots()) {
        throw new Error("El reparto por enlace no admite bots.");
    }
    state.partida = crearPartida(state.jugadores, {
        rondas: state.config.rondas,
        tematicaIds: [...state.config.tematicaIds],
        pista: state.config.pista,
        farsantes: state.config.farsantes,
    });
    state.revelacionIndice = 0;
    state.cartaAbierta = false;
    state.votoListo = false;
    state.enlaceCopiado = false;
    if (state.config.invitacion) {
        state.enlaceInvitacion = crearEnlaceInvitacion(
            window.location.href,
            crearPayloadInvitacion({
                jugadores: state.jugadores,
                config: state.config,
                partida: state.partida,
            })
        );
        state.vista = "invitacion";
    } else {
        state.enlaceInvitacion = "";
        state.vista = "reparto";
    }
}

function comenzarPartida() {
    try {
        prepararPartida();
        anunciar(
            state.config.invitacion
                ? "Enlace creado. Compártelo con la mesa."
                : "Cartas repartidas. Pasa el móvil al primer jugador."
        );
        render();
    } catch (error) {
        anunciar(error.message);
    }
}

async function copiarEnlace() {
    const entrada = app.querySelector("#enlace-invitacion");
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(state.enlaceInvitacion);
        } else {
            entrada?.focus();
            entrada?.select();
            document.execCommand("copy");
        }
        state.enlaceCopiado = true;
        anunciar("Enlace copiado. Compártelo solo con la mesa.");
    } catch {
        state.enlaceCopiado = false;
        anunciar("No se pudo copiar. Selecciona el enlace manualmente.");
    }
    render();
}

function empezarRondaInvitacion() {
    state.votoListo = false;
    state.vista = "ronda";
    anunciar("Empieza la ronda 1. Las cartas ya están repartidas.");
    render();
}

function volverConfigInvitacion() {
    state.partida = null;
    state.enlaceInvitacion = "";
    state.enlaceCopiado = false;
    state.vista = "config";
    anunciar("Vuelves a los ajustes del caso.");
    render();
}

function avanzarCarta() {
    if (!state.cartaAbierta) return;
    if (state.revelacionIndice >= jugadoresHumanos().length - 1) {
        state.vista = "ronda";
        state.cartaAbierta = false;
        anunciar("Todas las cartas repartidas. Empieza la ronda de pistas.");
        render();
        return;
    }
    state.revelacionIndice += 1;
    state.cartaAbierta = false;
    render();
}

function abrirVotacion() {
    if (!state.partida) return;
    const vivos = jugadoresVivos(state.jugadores, state.partida.eliminados);
    const mesaConBots = vivos.some((jugador) => jugador.bot);
    state.partida.votos = mesaConBots
        ? votarBots({ jugadores: state.jugadores, partida: state.partida })
        : {};
    state.partida.indiceVotante = 0;
    state.votoListo = false;
    state.vista = "votacion";
    anunciar(
        mesaConBots
            ? "Votación abierta. Los bots ya han votado; elige tú."
            : "Votación abierta. Pasa el móvil al primer votante."
    );
    render();
}

function registrarVoto(objetivoId) {
    const partida = state.partida;
    if (!partida || !state.votoListo) return;
    const vivos = jugadoresVivos(state.jugadores, partida.eliminados);
    const humanos = vivos.filter((jugador) => !jugador.bot);
    const votante = humanos[partida.indiceVotante];
    if (!votante || objetivoId === votante.id) return;
    if (!vivos.some((jugador) => jugador.id === objetivoId)) return;

    partida.votos[votante.id] = objetivoId;
    partida.indiceVotante += 1;
    state.votoListo = false;

    if (partida.indiceVotante >= humanos.length) {
        const resultado = resolverVotacion({
            jugadores: state.jugadores,
            eliminados: partida.eliminados,
            votos: partida.votos,
            rondaActual: partida.rondaActual,
            rondasMax: state.config.rondas,
            farsanteIds: partida.farsanteIds,
            impostorId: partida.impostorId,
        });
        partida.resultado = resultado;
        if (resultado.eliminadoId) {
            partida.eliminados = [...partida.eliminados, resultado.eliminadoId];
        }
        state.vista = "resultado";
        anunciar(resultado.empate ? "Empate. Nadie queda fuera." : `${resultado.eliminadoId ? "Un jugador queda fuera." : "Votación cerrada."}`);
    } else {
        anunciar("Voto guardado. Pasa el móvil al siguiente votante.");
    }
    render();
}

function continuarResultado() {
    const partida = state.partida;
    if (!partida?.resultado) return;
    if (partida.resultado.fin) {
        state.vista = "final";
        render();
        return;
    }
    state.partida = avanzarRonda(partida);
    state.votoListo = false;
    state.vista = "ronda";
    anunciar(`Empieza la ronda ${state.partida.rondaActual}.`);
    render();
}

function jugarOtra() {
    try {
        prepararPartida();
        anunciar(
            state.config.invitacion
                ? "Nueva partida. Se ha creado un enlace nuevo."
                : "Nueva partida. Se reparten cartas nuevas."
        );
        render();
    } catch (error) {
        anunciar(error.message);
    }
}

function nuevoCaso() {
    state.partida = null;
    state.revelacionIndice = 0;
    state.cartaAbierta = false;
    state.votoListo = false;
    state.enlaceInvitacion = "";
    state.enlaceCopiado = false;
    state.vista = "config";
    anunciar("Nuevo expediente. La mesa sigue en la lista.");
    render();
}

function enlazar() {
    const $ = (selector) => app.querySelector(selector);
    const $$ = (selector) => [...app.querySelectorAll(selector)];

    $("#abrir-expediente")?.addEventListener("click", () => {
        state.vista = "config";
        render();
    });

    $("#volver-inicio")?.addEventListener("click", () => {
        state.vista = "inicio";
        render();
    });

    $("#form-jugador")?.addEventListener("submit", (event) => {
        event.preventDefault();
        agregarJugador();
    });

    $("#anadir-bots")?.addEventListener("click", agregarBots);

    const entradaNombre = $("#nombre-jugador");
    entradaNombre?.addEventListener("input", () => {
        state.borradorNombre = entradaNombre.value;
        if (state.errorNombre) {
            state.errorNombre = "";
            const error = $("#error-nombre");
            if (error) error.textContent = "";
        }
    });

    $$("[data-quitar]").forEach((boton) => {
        boton.addEventListener("click", () => quitarJugador(boton.dataset.quitar));
    });

    $$("[data-rondas]").forEach((boton) => {
        boton.addEventListener("click", () => {
            state.config.rondas = Number(boton.dataset.rondas);
            render();
        });
    });

    $$("[data-farsantes]").forEach((boton) => {
        boton.addEventListener("click", () => {
            state.config.farsantes = Number(boton.dataset.farsantes);
            anunciar(
                state.config.farsantes === 2
                    ? "Dos farsantes. La mesa necesita al menos 6 jugadores."
                    : "Un farsante."
            );
            render();
        });
    });

    $$("[data-tema]").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.tema;
            if (state.config.tematicaIds.has(id)) state.config.tematicaIds.delete(id);
            else state.config.tematicaIds.add(id);
            render();
        });
    });

    $("#pista-letra")?.addEventListener("change", (event) => {
        state.config.pista = event.target.checked;
    });

    $("#modo-invitacion")?.addEventListener("change", (event) => {
        state.config.invitacion = event.target.checked;
        anunciar(
            state.config.invitacion
                ? "Reparto por enlace activado. La mesa seguirá en este móvil."
                : "Reparto en este móvil activado."
        );
    });

    $("#preparar-reparto")?.addEventListener("click", () => {
        if (!puedePreparar()) return;
        state.vista = "brief";
        render();
    });

    $("#volver-config")?.addEventListener("click", () => {
        state.vista = "config";
        render();
    });

    $("#editar-config")?.addEventListener("click", () => {
        state.vista = "config";
        render();
    });

    $("#empezar-reparto")?.addEventListener("click", comenzarPartida);
    $("#copiar-enlace")?.addEventListener("click", copiarEnlace);
    $("#empezar-ronda-invitacion")?.addEventListener("click", empezarRondaInvitacion);
    $("#volver-config-invitacion")?.addEventListener("click", volverConfigInvitacion);
    $$("[data-elegir-invitado]").forEach((boton) => {
        boton.addEventListener("click", () => {
            state.jugadorInvitacionId = boton.dataset.elegirInvitado;
            anunciar("Carta privada cargada. Que nadie más mire.");
            render();
        });
    });
    $("#ocultar-invitacion")?.addEventListener("click", () => {
        state.jugadorInvitacionId = null;
        anunciar("Carta oculta. Puedes elegir otro nombre.");
        render();
    });
    $("#voltear-carta")?.addEventListener("click", () => {
        state.cartaAbierta = true;
        anunciar("Carta revelada. Que solo la vea su destinatario.");
        render();
    });
    $("#avanzar-carta")?.addEventListener("click", avanzarCarta);
    $("#abrir-votacion")?.addEventListener("click", abrirVotacion);
    $("#preparar-voto")?.addEventListener("click", () => {
        state.votoListo = true;
        anunciar("Voto en curso.");
        render();
    });
    $$("[data-votar]").forEach((boton) => {
        boton.addEventListener("click", () => registrarVoto(boton.dataset.votar));
    });
    $("#continuar-resultado")?.addEventListener("click", continuarResultado);
    $("#jugar-otra")?.addEventListener("click", jugarOtra);
    $("#nuevo-caso")?.addEventListener("click", nuevoCaso);
}

function cargarInvitacionDesdeHash() {
    const invitacion = leerInvitacionDeHash(window.location.hash);
    if (!invitacion) return false;
    state.invitacion = invitacion;
    state.jugadorInvitacionId = null;
    state.vista = "invitacion-jugador";
    return true;
}

window.addEventListener("hashchange", () => {
    if (cargarInvitacionDesdeHash()) {
        anunciar("Invitación cargada. Elige tu nombre para ver tu carta.");
        render();
    }
});

if (cargarInvitacionDesdeHash()) {
    anunciar("Invitación cargada. Elige tu nombre para ver tu carta.");
}
render();
