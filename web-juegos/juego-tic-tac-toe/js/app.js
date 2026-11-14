const Bot = window.TresEnRayaBot;

const NOMBRES_DIFICULTAD = {
    facil: "Fácil",
    medio: "Medio",
    dificil: "Difícil",
};

const estado = {
    modo: null,
    dificultad: "medio",
    tablero: Array(9).fill(""),
    turno: "X",
    puntajes: { X: 0, O: 0, tablas: 0 },
    terminada: false,
    ocupado: false,
    temporizador: null,
};

const elementos = {
    inicio: document.querySelector("#pantalla-inicio"),
    partida: document.querySelector("#pantalla-partida"),
    modos: [...document.querySelectorAll("[data-modo]")],
    dificultad: document.querySelector("#dificultad"),
    dificultades: [...document.querySelectorAll("[data-dificultad]")],
    empezar: document.querySelector("#empezar"),
    tablero: document.querySelector("#tablero"),
    estado: document.querySelector("#estado"),
    turno: document.querySelector("#turno"),
    modoActivo: document.querySelector("#modo-activo"),
    tablas: document.querySelector("#tablas"),
    nombreX: document.querySelector("#nombre-x"),
    nombreO: document.querySelector("#nombre-o"),
    puntosX: document.querySelector("#puntos-x"),
    puntosO: document.querySelector("#puntos-o"),
    ladoX: document.querySelector("#lado-x"),
    ladoO: document.querySelector("#lado-o"),
    reiniciar: document.querySelector("#reiniciar"),
    menu: document.querySelector("#menu"),
    menuSuperior: document.querySelector("#menu-superior"),
    modal: document.querySelector("#modal"),
    modalIcono: document.querySelector("#modal-icono"),
    modalTitulo: document.querySelector("#modal-titulo"),
    modalTexto: document.querySelector("#modal-texto"),
    modalOtra: document.querySelector("#modal-otra"),
    modalMenu: document.querySelector("#modal-menu"),
};

function crearTablero() {
    elementos.tablero.replaceChildren();

    for (let indice = 0; indice < 9; indice += 1) {
        const celda = document.createElement("button");
        celda.type = "button";
        celda.className = "celda";
        celda.dataset.indice = String(indice);
        celda.setAttribute("role", "gridcell");
        celda.setAttribute("aria-label", `Casilla ${indice + 1}, vacía`);
        celda.addEventListener("click", () => jugarHumano(indice));
        elementos.tablero.appendChild(celda);
    }
}

function elegirModo(modo) {
    estado.modo = modo;

    elementos.modos.forEach((boton) => {
        boton.setAttribute("aria-pressed", String(boton.dataset.modo === modo));
    });

    elementos.dificultad.hidden = modo !== "bot";
    elementos.empezar.disabled = false;
}

function elegirDificultad(dificultad) {
    estado.dificultad = dificultad;

    elementos.dificultades.forEach((boton) => {
        const activo = boton.dataset.dificultad === dificultad;
        boton.classList.toggle("chip--activo", activo);
        boton.setAttribute("aria-pressed", String(activo));
    });
}

function iniciarPartida() {
    if (!estado.modo) {
        return;
    }

    estado.puntajes = { X: 0, O: 0, tablas: 0 };
    elementos.inicio.hidden = true;
    elementos.partida.hidden = false;
    elementos.nombreX.textContent = "Jugador 1";
    elementos.nombreO.textContent = estado.modo === "bot" ? "Bot" : "Jugador 2";
    elementos.modoActivo.textContent =
        estado.modo === "bot" ? `Bot · ${NOMBRES_DIFICULTAD[estado.dificultad]}` : "2 jugadores";
    nuevaRonda();
}

function nuevaRonda() {
    cancelarTurnoDelBot();
    estado.tablero = Array(9).fill("");
    estado.turno = "X";
    estado.terminada = false;
    estado.ocupado = false;
    elementos.modal.hidden = true;
    pintarTablero();
    actualizarMarcador();
    anunciar("Turno de X. Elige una casilla para empezar.");
}

function pintarTablero() {
    const celdas = elementos.tablero.querySelectorAll(".celda");

    celdas.forEach((celda, indice) => {
        const valor = estado.tablero[indice];
        celda.textContent = valor;
        celda.className = "celda";
        celda.disabled = estado.terminada || estado.ocupado;
        celda.setAttribute(
            "aria-label",
            valor ? `Casilla ${indice + 1}, ${valor}` : `Casilla ${indice + 1}, vacía`
        );

        if (valor) {
            celda.classList.add("celda--ocupada", valor === "X" ? "celda--x" : "celda--o");
        }
    });
}

function actualizarMarcador() {
    elementos.puntosX.textContent = String(estado.puntajes.X);
    elementos.puntosO.textContent = String(estado.puntajes.O);
    elementos.tablas.textContent = `Tablas: ${estado.puntajes.tablas}`;

    elementos.ladoX.classList.toggle(
        "marcador__lado--activo",
        !estado.terminada && estado.turno === "X"
    );
    elementos.ladoO.classList.toggle(
        "marcador__lado--activo",
        !estado.terminada && estado.turno === "O"
    );

    if (estado.terminada) {
        elementos.turno.textContent = "Ronda terminada";
        return;
    }

    if (esTurnoDelBot()) {
        elementos.turno.textContent = "El bot piensa…";
        return;
    }

    elementos.turno.textContent = `Turno de ${estado.turno}`;
}

function anunciar(texto) {
    elementos.estado.textContent = texto;
}

function esTurnoDelBot() {
    return estado.modo === "bot" && estado.turno === "O" && !estado.terminada;
}

function jugarHumano(indice) {
    if (estado.terminada || estado.ocupado || estado.tablero[indice] !== "") {
        return;
    }

    if (esTurnoDelBot()) {
        return;
    }

    hacerJugada(indice);
}

function hacerJugada(indice) {
    if (estado.terminada || estado.tablero[indice] !== "") {
        return;
    }

    estado.tablero[indice] = estado.turno;
    const resultado = Bot.evaluarTablero(estado.tablero);

    if (resultado) {
        finalizarRonda(resultado);
        return;
    }

    estado.turno = estado.turno === "X" ? "O" : "X";
    pintarTablero();
    actualizarMarcador();

    if (esTurnoDelBot()) {
        anunciar("El bot está pensando…");
        programarTurnoDelBot();
    } else {
        anunciar(`Turno de ${estado.turno}. Elige una casilla.`);
    }
}

function finalizarRonda(resultado) {
    estado.terminada = true;
    estado.ocupado = false;
    cancelarTurnoDelBot();

    if (resultado.ganador) {
        estado.puntajes[resultado.ganador] += 1;
    } else {
        estado.puntajes.tablas += 1;
    }

    pintarTablero();
    resultado.linea?.forEach((indice) => {
        elementos.tablero.children[indice].classList.add("celda--ganadora");
    });
    actualizarMarcador();

    if (resultado.ganador) {
        const nombre =
            estado.modo === "bot" && resultado.ganador === "O"
                ? "El bot"
                : resultado.ganador === "X"
                  ? elementos.nombreX.textContent
                  : elementos.nombreO.textContent;
        anunciar(`${nombre} gana la ronda.`);
    } else {
        anunciar("Empate: tablero completo sin tres en raya.");
    }

    window.setTimeout(() => mostrarResultado(resultado), 480);
}

function mostrarResultado(resultado) {
    if (resultado.ganador) {
        const ganoBot = estado.modo === "bot" && resultado.ganador === "O";
        elementos.modalIcono.textContent = ganoBot ? "smart_toy" : "emoji_events";
        elementos.modalTitulo.textContent = ganoBot ? "Gana el bot" : `Gana ${resultado.ganador}`;
        elementos.modalTexto.textContent = ganoBot
            ? "El bot cerró la línea. Prueba otra dificultad o vuelve a intentarlo."
            : "Tres en raya. La ronda queda para el marcador de la mesa.";
    } else {
        elementos.modalIcono.textContent = "handshake";
        elementos.modalTitulo.textContent = "Empate";
        elementos.modalTexto.textContent =
            "Nadie pudo cerrar tres en raya. El tablero está completo.";
    }

    elementos.modal.hidden = false;
    elementos.modalOtra.focus({ preventScroll: true });
}

function programarTurnoDelBot() {
    estado.ocupado = true;
    pintarTablero();
    actualizarMarcador();

    estado.temporizador = window.setTimeout(() => {
        estado.temporizador = null;
        estado.ocupado = false;
        const indice = Bot.elegirJugadaDelBot(estado.tablero, estado.dificultad);

        if (indice !== null && !estado.terminada) {
            hacerJugada(indice);
        }
    }, 520);
}

function cancelarTurnoDelBot() {
    if (estado.temporizador) {
        window.clearTimeout(estado.temporizador);
        estado.temporizador = null;
    }

    estado.ocupado = false;
}

function volverAlMenu() {
    cancelarTurnoDelBot();
    elementos.modal.hidden = true;
    elementos.partida.hidden = true;
    elementos.inicio.hidden = false;
    estado.modo = null;
    elementos.modos.forEach((boton) => boton.setAttribute("aria-pressed", "false"));
    elementos.dificultad.hidden = true;
    elementos.empezar.disabled = true;
    elementos.empezar.focus({ preventScroll: true });
}

elementos.modos.forEach((boton) => {
    boton.addEventListener("click", () => elegirModo(boton.dataset.modo));
});

elementos.dificultades.forEach((boton) => {
    boton.addEventListener("click", () => elegirDificultad(boton.dataset.dificultad));
});

elementos.empezar.addEventListener("click", iniciarPartida);
elementos.reiniciar.addEventListener("click", nuevaRonda);
elementos.menu.addEventListener("click", volverAlMenu);
elementos.menuSuperior.addEventListener("click", volverAlMenu);
elementos.modalOtra.addEventListener("click", nuevaRonda);
elementos.modalMenu.addEventListener("click", volverAlMenu);

elementos.modal.addEventListener("click", (evento) => {
    if (evento.target === elementos.modal) {
        elementos.modal.hidden = true;
    }
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !elementos.modal.hidden) {
        elementos.modal.hidden = true;
    }
});

crearTablero();
