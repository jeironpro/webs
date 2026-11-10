const FILAS = 6;
const COLUMNAS = 5;

const elementos = {
    tablero: document.querySelector("#tablero"),
    teclado: document.querySelector("#teclado"),
    estado: document.querySelector("#estado"),
    intento: document.querySelector("#intento"),
    mensaje: document.querySelector("#mensaje"),
    total: document.querySelector("#total-palabras"),
    btnNueva: document.querySelector("#btn-nueva"),
};

const teclas = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
    ["z", "x", "c", "v", "b", "n", "m", "eliminar", "enviar"],
];

const valores = Array.from({ length: FILAS }, () => Array(COLUMNAS).fill(""));
const celdas = Array.from({ length: FILAS }, () => Array(COLUMNAS));

let respuestas = [];
let palabraSecreta = "";
let filaActual = 0;
let juegoTerminado = false;
let validas = new Set();
let estadosTeclado = new Map();
let temporizadorMensaje = null;

function crearTablero() {
    for (let fila = 0; fila < FILAS; fila += 1) {
        const filaElemento = document.createElement("div");
        filaElemento.className = "fila";
        filaElemento.setAttribute("role", "row");

        for (let columna = 0; columna < COLUMNAS; columna += 1) {
            const casilla = document.createElement("div");
            casilla.className = "casilla";
            casilla.setAttribute("role", "gridcell");
            casilla.dataset.fila = String(fila);
            casilla.dataset.columna = String(columna);
            casilla.setAttribute("aria-label", `Fila ${fila + 1}, columna ${columna + 1}, vacía`);
            celdas[fila][columna] = casilla;
            filaElemento.appendChild(casilla);
        }

        elementos.tablero.appendChild(filaElemento);
    }
}

function crearTeclado() {
    teclas.forEach((fila) => {
        const filaElemento = document.createElement("div");
        filaElemento.className = "fila-teclado";

        fila.forEach((tecla) => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "tecla";
            boton.dataset.tecla = tecla;

            if (tecla === "eliminar") {
                boton.classList.add("tecla--accion");
                boton.innerHTML = `<span class="material-symbols-rounded" aria-hidden="true">backspace</span>`;
                boton.setAttribute("aria-label", "Borrar letra");
            } else if (tecla === "enviar") {
                boton.classList.add("tecla--accion");
                boton.textContent = "Enviar";
            } else {
                boton.textContent = tecla;
                boton.setAttribute("aria-label", `Letra ${tecla}`);
            }

            boton.addEventListener("click", () => manejarEntrada(tecla));
            filaElemento.appendChild(boton);
        });

        elementos.teclado.appendChild(filaElemento);
    });
}

function pintarTablero() {
    for (let fila = 0; fila < FILAS; fila += 1) {
        for (let columna = 0; columna < COLUMNAS; columna += 1) {
            const casilla = celdas[fila][columna];
            const valor = valores[fila][columna];
            casilla.textContent = valor;
            casilla.classList.toggle(
                "casilla--activa",
                fila === filaActual && !juegoTerminado && celdas[fila][columna].textContent === "",
            );
            casilla.setAttribute(
                "aria-label",
                `Fila ${fila + 1}, columna ${columna + 1}, ${valor || "vacía"}`,
            );
        }
    }
}

function actualizarIntento() {
    const numero = Math.min(filaActual + 1, FILAS);
    elementos.intento.textContent = `Intento ${numero} / ${FILAS}`;
}

function mostrarMensaje(texto, tipo = "", persistente = false) {
    window.clearTimeout(temporizadorMensaje);
    elementos.mensaje.hidden = false;
    elementos.mensaje.className = "mensaje";
    if (tipo) {
        elementos.mensaje.classList.add(`mensaje--${tipo}`);
    }
    elementos.mensaje.textContent = texto;

    if (!persistente) {
        temporizadorMensaje = window.setTimeout(() => {
            elementos.mensaje.hidden = true;
        }, 3500);
    }
}

function anunciar(texto) {
    elementos.estado.textContent = texto;
}

function colorearFila(palabra) {
    const secreta = palabraSecreta.split("");
    const letras = palabra.split("");
    const usadas = Array(COLUMNAS).fill(false);
    const resultado = Array(COLUMNAS).fill("gris");

    for (let i = 0; i < COLUMNAS; i += 1) {
        if (letras[i] === secreta[i]) {
            resultado[i] = "verde";
            usadas[i] = true;
        }
    }

    for (let i = 0; i < COLUMNAS; i += 1) {
        if (resultado[i] === "verde") continue;

        const posicion = secreta.findIndex((letra, indice) => letra === letras[i] && !usadas[indice]);

        if (posicion !== -1) {
            resultado[i] = "amarillo";
            usadas[posicion] = true;
        }
    }

    resultado.forEach((color, columna) => {
        celdas[filaActual][columna].classList.add(`casilla--${color}`);
        const estadoActual = estadosTeclado.get(letras[columna]);
        if (color === "verde" || (color === "amarillo" && estadoActual !== "verde") || !estadoActual) {
            estadosTeclado.set(letras[columna], color);
        }
    });
}

function actualizarTeclado() {
    elementos.teclado.querySelectorAll(".tecla[data-tecla]").forEach((boton) => {
        const letra = boton.dataset.tecla;
        if (!/^[a-zñ]$/.test(letra)) return;
        boton.classList.remove("tecla--verde", "tecla--amarillo", "tecla--gris");
        const estado = estadosTeclado.get(letra);
        if (estado) {
            boton.classList.add(`tecla--${estado}`);
        }
    });
}

function validarFila() {
    const palabra = valores[filaActual].join("");

    if (palabra.length < COLUMNAS) {
        mostrarMensaje("Completa las cinco letras para enviar la palabra.", "aviso");
        return;
    }

    if (!validas.has(palabra)) {
        mostrarMensaje("Esa palabra no está en el diccionario del juego.", "error");
        return;
    }

    colorearFila(palabra);
    actualizarTeclado();

    if (palabra === palabraSecreta) {
        juegoTerminado = true;
        anunciar("¡Palabra acertada!");
        mostrarMensaje(`¡Has acertado! La palabra era ${palabraSecreta}.`, "exito", true);
        elementos.btnNueva.focus({ preventScroll: true });
        pintarTablero();
        return;
    }

    filaActual += 1;
    actualizarIntento();

    if (filaActual === FILAS) {
        juegoTerminado = true;
        anunciar("No quedan intentos.");
        mostrarMensaje(`No has acertado. La palabra oculta era ${palabraSecreta}.`, "error", true);
        elementos.btnNueva.focus({ preventScroll: true });
        pintarTablero();
        return;
    }

    anunciar("Sigue probando. Cada intento afina las pistas.");
    pintarTablero();
}

function manejarEntrada(tecla) {
    if (juegoTerminado) return;

    if (tecla === "eliminar") {
        for (let columna = COLUMNAS - 1; columna >= 0; columna -= 1) {
            if (valores[filaActual][columna]) {
                valores[filaActual][columna] = "";
                pintarTablero();
                return;
            }
        }
        return;
    }

    if (tecla === "enviar") {
        validarFila();
        return;
    }

    if (!/^[a-zñ]$/.test(tecla)) return;

    for (let columna = 0; columna < COLUMNAS; columna += 1) {
        if (!valores[filaActual][columna]) {
            valores[filaActual][columna] = tecla;
            pintarTablero();
            return;
        }
    }
}

function nuevaPartida() {
    if (respuestas.length === 0) return;

    window.clearTimeout(temporizadorMensaje);
    palabraSecreta = respuestas[Math.floor(Math.random() * respuestas.length)];
    filaActual = 0;
    juegoTerminado = false;
    estadosTeclado = new Map();
    elementos.mensaje.hidden = true;

    for (let fila = 0; fila < FILAS; fila += 1) {
        for (let columna = 0; columna < COLUMNAS; columna += 1) {
            valores[fila][columna] = "";
            celdas[fila][columna].className = "casilla";
        }
    }

    elementos.btnNueva.textContent = "";
    elementos.btnNueva.innerHTML =
        '<span class="material-symbols-rounded" aria-hidden="true">refresh</span> Nueva palabra';
    actualizarIntento();
    actualizarTeclado();
    pintarTablero();
    anunciar("Escribe una palabra de cinco letras.");
}

async function cargarDiccionario() {
    try {
        const respuesta = await fetch("json/palabras_ocultas.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar el diccionario.");

        const datos = await respuesta.json();
        const lista = Array.isArray(datos) ? datos : datos.validas;
        respuestas = Array.isArray(datos) ? datos : datos.respuestas;
        validas = new Set(lista.map((palabra) => palabra.toLowerCase()));
        elementos.total.textContent = `${lista.length.toLocaleString("es-ES")} palabras válidas`;
        nuevaPartida();
    } catch (error) {
        console.error(error);
        anunciar("No se pudo cargar el diccionario. Recarga la página.");
        mostrarMensaje("No se pudo cargar el juego. Revisa que el JSON esté disponible.", "error", true);
    }
}

document.addEventListener("keydown", (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;

    const tecla = evento.key.toLowerCase();

    if (tecla === "enter") {
        evento.preventDefault();
        manejarEntrada("enviar");
    } else if (tecla === "backspace" || tecla === "delete") {
        evento.preventDefault();
        manejarEntrada("eliminar");
    } else if (/^[a-zñ]$/.test(tecla)) {
        evento.preventDefault();
        manejarEntrada(tecla);
    }
});

elementos.btnNueva.addEventListener("click", nuevaPartida);

crearTablero();
crearTeclado();
cargarDiccionario();
