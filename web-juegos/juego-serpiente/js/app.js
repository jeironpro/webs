const COLUMNAS = 24;
const FILAS = 24;
const VELOCIDAD = 115;
const canvas = document.querySelector("#tablero");
const contexto = canvas.getContext("2d");
const capa = document.querySelector("#capa");
const capaEyebrow = document.querySelector("#capa-eyebrow");
const capaTitulo = document.querySelector("#capa-titulo");
const capaTexto = document.querySelector("#capa-texto");
const botonInicio = document.querySelector("#boton-inicio");
const botonReiniciar = document.querySelector("#boton-reiniciar");
const botonPausa = document.querySelector("#boton-pausa");
const puntuacionUI = document.querySelector("#puntuacion");
const recordUI = document.querySelector("#record");
const estadoUI = document.querySelector("#estado");

const direcciones = {
    arriba: { x: 0, y: -1 },
    abajo: { x: 0, y: 1 },
    izquierda: { x: -1, y: 0 },
    derecha: { x: 1, y: 0 },
};

const opuestas = {
    arriba: "abajo",
    abajo: "arriba",
    izquierda: "derecha",
    derecha: "izquierda",
};

let cuerpo = [];
let comida = { x: 0, y: 0 };
let direccion = "derecha";
let direccionPendiente = "derecha";
let puntuacion = 0;
let record = 0;
let intervalo = null;
let jugando = false;
let pausado = false;
let terminado = false;

function tamanioCelda() {
    return canvas.width / COLUMNAS;
}

function reiniciarEstado() {
    cuerpo = [
        { x: 8, y: 12 },
        { x: 7, y: 12 },
        { x: 6, y: 12 },
    ];
    direccion = "derecha";
    direccionPendiente = "derecha";
    puntuacion = 0;
    actualizarPuntuacion();
    colocarComida();
    dibujar();
}

function colocarComida() {
    let nueva;

    do {
        nueva = {
            x: Math.floor(Math.random() * COLUMNAS),
            y: Math.floor(Math.random() * FILAS),
        };
    } while (cuerpo.some((segmento) => segmento.x === nueva.x && segmento.y === nueva.y));

    comida = nueva;
}

function actualizarPuntuacion() {
    puntuacionUI.textContent = String(puntuacion);
    recordUI.textContent = String(record);
}

function dibujar() {
    const celda = tamanioCelda();
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    contexto.fillStyle = "#f7f1e6";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.strokeStyle = "rgba(32, 27, 23, 0.08)";
    contexto.lineWidth = 1;

    for (let columna = 1; columna < COLUMNAS; columna += 1) {
        contexto.beginPath();
        contexto.moveTo(columna * celda, 0);
        contexto.lineTo(columna * celda, canvas.height);
        contexto.stroke();
    }

    for (let fila = 1; fila < FILAS; fila += 1) {
        contexto.beginPath();
        contexto.moveTo(0, fila * celda);
        contexto.lineTo(canvas.width, fila * celda);
        contexto.stroke();
    }

    contexto.fillStyle = "#b83b2e";
    contexto.beginPath();
    contexto.arc(
        comida.x * celda + celda / 2,
        comida.y * celda + celda / 2,
        celda * 0.32,
        0,
        Math.PI * 2
    );
    contexto.fill();

    cuerpo.forEach((segmento, indice) => {
        const margen = indice === 0 ? celda * 0.08 : celda * 0.13;
        const radio = Math.max(2, celda * 0.18);
        contexto.fillStyle = indice === 0 ? "#16726f" : "#2d8c83";
        contexto.beginPath();
        contexto.roundRect(
            segmento.x * celda + margen,
            segmento.y * celda + margen,
            celda - margen * 2,
            celda - margen * 2,
            radio
        );
        contexto.fill();

        if (indice === 0) {
            contexto.fillStyle = "#fbf8f1";
            const ojo = Math.max(1.2, celda * 0.09);
            contexto.beginPath();
            contexto.arc(
                segmento.x * celda + celda * 0.36,
                segmento.y * celda + celda * 0.4,
                ojo,
                0,
                Math.PI * 2
            );
            contexto.arc(
                segmento.x * celda + celda * 0.64,
                segmento.y * celda + celda * 0.4,
                ojo,
                0,
                Math.PI * 2
            );
            contexto.fill();
        }
    });
}

function mover() {
    if (!jugando || pausado || terminado) return;

    if (direccionPendiente !== opuestas[direccion]) {
        direccion = direccionPendiente;
    }

    const vector = direcciones[direccion];
    const cabeza = cuerpo[0];
    const nuevaCabeza = {
        x: (cabeza.x + vector.x + COLUMNAS) % COLUMNAS,
        y: (cabeza.y + vector.y + FILAS) % FILAS,
    };
    const comera = nuevaCabeza.x === comida.x && nuevaCabeza.y === comida.y;
    const cuerpoAComprobar = comera ? cuerpo : cuerpo.slice(0, -1);
    const choca = cuerpoAComprobar.some(
        (segmento) => segmento.x === nuevaCabeza.x && segmento.y === nuevaCabeza.y
    );

    if (choca) {
        terminarJuego(false);
        return;
    }

    cuerpo.unshift(nuevaCabeza);

    if (comera) {
        puntuacion += 10;
        if (puntuacion > record) record = puntuacion;
        actualizarPuntuacion();
        colocarComida();

        if (cuerpo.length === COLUMNAS * FILAS) {
            terminarJuego(true);
            return;
        }
    } else {
        cuerpo.pop();
    }

    dibujar();
}

function pintarIcono(boton, icono, texto) {
    const marca = document.createElement("span");
    marca.className = "material-symbols-rounded";
    marca.setAttribute("aria-hidden", "true");
    marca.textContent = icono;
    boton.replaceChildren(marca, document.createTextNode(` ${texto}`));
}

function iniciarJuego() {
    if (terminado) reiniciarEstado();

    jugando = true;
    pausado = false;
    terminado = false;
    capa.hidden = true;
    botonPausa.disabled = false;
    pintarIcono(botonPausa, "pause", "Pausa");
    estadoUI.textContent = "En marcha";
    window.clearInterval(intervalo);
    intervalo = window.setInterval(mover, VELOCIDAD);
}

function pausarJuego() {
    if (!jugando || terminado) return;

    if (pausado) {
        pausado = false;
        estadoUI.textContent = "En marcha";
        pintarIcono(botonPausa, "pause", "Pausa");
        window.clearInterval(intervalo);
        intervalo = window.setInterval(mover, VELOCIDAD);
        return;
    }

    pausado = true;
    estadoUI.textContent = "Pausada";
    pintarIcono(botonPausa, "play_arrow", "Seguir");
    window.clearInterval(intervalo);
}

function terminarJuego(victoria) {
    terminado = true;
    jugando = false;
    window.clearInterval(intervalo);
    estadoUI.textContent = victoria ? "Completada" : "Fin del juego";
    capaEyebrow.textContent = victoria ? "TABLERO COMPLETO" : "FIN DE LA PARTIDA";
    capaTitulo.textContent = victoria ? "¡Serpiente completa!" : "Te has mordido";
    capaTexto.textContent = victoria
        ? `Has llenado las ${COLUMNAS * FILAS} casillas. Puntuación: ${puntuacion}.`
        : `Puntuación: ${puntuacion} · Récord: ${record}. Los bordes conectan; la cola no perdona.`;
    pintarIcono(botonInicio, "refresh", "Reintentar");
    capa.hidden = false;
    dibujar();
}

function reiniciarJuego() {
    window.clearInterval(intervalo);
    jugando = false;
    pausado = false;
    terminado = false;
    reiniciarEstado();
    estadoUI.textContent = "En espera";
    capaEyebrow.textContent = "LISTO CUANDO QUIERAS";
    capaTitulo.textContent = "Toma el control";
    capaTexto.textContent =
        "Usa las flechas o WASD. La serpiente aparece en el centro del tablero.";
    pintarIcono(botonInicio, "play_arrow", "Empezar");
    botonPausa.disabled = true;
    capa.hidden = false;
}

function cambiarDireccion(nueva) {
    if (!direcciones[nueva]) return;
    if (nueva === opuestas[direccion]) return;
    direccionPendiente = nueva;

    if (!jugando && !terminado) iniciarJuego();
}

document.addEventListener("keydown", (evento) => {
    const teclas = {
        ArrowUp: "arriba",
        ArrowDown: "abajo",
        ArrowLeft: "izquierda",
        ArrowRight: "derecha",
        w: "arriba",
        s: "abajo",
        a: "izquierda",
        d: "derecha",
        W: "arriba",
        S: "abajo",
        A: "izquierda",
        D: "derecha",
    };

    if (teclas[evento.key]) {
        evento.preventDefault();
        cambiarDireccion(teclas[evento.key]);
        return;
    }

    if (evento.key === " " || evento.key === "Spacebar") {
        evento.preventDefault();
        if (!jugando && !terminado) {
            iniciarJuego();
        } else {
            pausarJuego();
        }
    }
});

document.querySelectorAll("[data-direccion]").forEach((boton) => {
    boton.addEventListener("click", () => cambiarDireccion(boton.dataset.direccion));
});

botonInicio.addEventListener("click", iniciarJuego);
botonReiniciar.addEventListener("click", reiniciarJuego);
botonPausa.addEventListener("click", pausarJuego);
botonPausa.disabled = true;

reiniciarEstado();
