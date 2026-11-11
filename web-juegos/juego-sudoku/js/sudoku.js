const elementos = {
    tablero: document.querySelector("#tablero"),
    teclado: document.querySelector("#teclado"),
    estado: document.querySelector("#estado"),
    progreso: document.querySelector("#progreso"),
    progresoTexto: document.querySelector("#progreso-texto"),
    barra: document.querySelector("#barra"),
    errores: document.querySelector("#errores"),
    tiempo: document.querySelector("#tiempo"),
    btnBorrar: document.querySelector("#btn-borrar"),
    btnComprobar: document.querySelector("#btn-comprobar"),
    btnReiniciar: document.querySelector("#btn-reiniciar"),
    modal: document.querySelector("#modal-victoria"),
    modalTiempo: document.querySelector("#modal-tiempo"),
    modalErrores: document.querySelector("#modal-errores"),
    btnJugarOtra: document.querySelector("#btn-jugar-otra"),
};

const casillas = Array.from({ length: 9 }, () => Array(9));
let tableroCompleto = [];
let tableroVisible = [];
let tableroActual = Array.from({ length: 9 }, () => Array(9).fill(""));
let casillaActiva = null;
let celdasConError = new Set();
let errores = 0;
let segundos = 0;
let intervalo = null;
let resuelto = false;

function clave(fila, columna) {
    return `${fila}-${columna}`;
}

function formatearTiempo(total) {
    const minutos = Math.floor(total / 60);
    const resto = total % 60;
    return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function crearTablero() {
    for (let fila = 0; fila < 9; fila += 1) {
        for (let columna = 0; columna < 9; columna += 1) {
            const casilla = document.createElement("button");
            casilla.type = "button";
            casilla.className = "casilla";
            casilla.dataset.fila = String(fila);
            casilla.dataset.columna = String(columna);
            casilla.setAttribute("role", "gridcell");
            casilla.setAttribute("aria-label", `Fila ${fila + 1}, columna ${columna + 1}, vacía`);

            if (fila % 3 === 0) casilla.classList.add("borde-superior");
            if (columna % 3 === 0) casilla.classList.add("borde-izquierdo");
            if (fila === 8) casilla.classList.add("borde-inferior");
            if (columna === 8) casilla.classList.add("borde-derecho");

            casilla.addEventListener("click", () => activarCasilla(fila, columna));
            casillas[fila][columna] = casilla;
            elementos.tablero.appendChild(casilla);
        }
    }
}

function crearTeclado() {
    for (let numero = 1; numero <= 9; numero += 1) {
        const tecla = document.createElement("button");
        tecla.type = "button";
        tecla.className = "tecla";
        tecla.textContent = String(numero);
        tecla.dataset.tecla = String(numero);
        tecla.setAttribute("aria-label", `Escribir ${numero}`);
        tecla.addEventListener("click", () => escribirNumero(String(numero)));
        elementos.teclado.appendChild(tecla);
    }
}

function activarCasilla(fila, columna) {
    if (resuelto) return;

    casillaActiva = { fila, columna };
    const dada = tableroVisible[fila][columna] !== "";

    if (dada) {
        anunciar("Ese número ya viene fijado. Elige una casilla vacía.");
    } else {
        anunciar("Elige un número del 1 al 9.");
    }

    pintarTablero();
}

function pintarTablero() {
    for (let fila = 0; fila < 9; fila += 1) {
        for (let columna = 0; columna < 9; columna += 1) {
            const casilla = casillas[fila][columna];
            const valor = tableroActual[fila][columna];
            const dada = tableroVisible[fila][columna] !== "";
            const activa =
                casillaActiva?.fila === fila && casillaActiva?.columna === columna;
            const relacionada =
                casillaActiva &&
                !activa &&
                (casillaActiva.fila === fila ||
                    casillaActiva.columna === columna ||
                    (Math.floor(casillaActiva.fila / 3) === Math.floor(fila / 3) &&
                        Math.floor(casillaActiva.columna / 3) === Math.floor(columna / 3)));

            casilla.textContent = valor;
            casilla.classList.toggle("casilla--dada", dada);
            casilla.classList.toggle("casilla--activa", Boolean(activa));
            casilla.classList.toggle("casilla--relacionada", Boolean(relacionada));
            casilla.classList.toggle("casilla--error", celdasConError.has(clave(fila, columna)));
            casilla.classList.toggle("casilla--grupo-completo", grupoCompleto(fila, columna));
            casilla.disabled = resuelto;
            casilla.setAttribute(
                "aria-label",
                `Fila ${fila + 1}, columna ${columna + 1}, ${valor || "vacía"}${dada ? ", fija" : ""}`,
            );
        }
    }
}

function grupoCompleto(fila, columna) {
    const inicioFila = Math.floor(fila / 3) * 3;
    const inicioColumna = Math.floor(columna / 3) * 3;

    for (let i = inicioFila; i < inicioFila + 3; i += 1) {
        for (let j = inicioColumna; j < inicioColumna + 3; j += 1) {
            if (!tableroActual[i][j] || tableroActual[i][j] !== tableroCompleto[i][j]) {
                return false;
            }
        }
    }

    return true;
}

function escribirNumero(numero) {
    if (resuelto || !casillaActiva) {
        if (!casillaActiva) anunciar("Primero elige una casilla vacía.");
        return;
    }

    const { fila, columna } = casillaActiva;

    if (tableroVisible[fila][columna] !== "") {
        anunciar("Ese número ya viene fijado.");
        return;
    }

    tableroActual[fila][columna] = numero;
    const posicion = clave(fila, columna);

    if (numero !== tableroCompleto[fila][columna]) {
        errores += 1;
        celdasConError.add(posicion);
        actualizarDatos();
        pintarTablero();
        anunciar("Ese número no va ahí. Puedes borrarlo y probar otro.");
        return;
    }

    celdasConError.delete(posicion);
    actualizarDatos();
    pintarTablero();

    if (validarSudoku()) {
        finalizarJuego();
    } else {
        anunciar(`Número ${numero} colocado. Sigue con la siguiente casilla.`);
        moverFocoSiguiente();
    }
}

function borrarNumero() {
    if (resuelto || !casillaActiva) {
        anunciar("Primero elige una casilla.");
        return;
    }

    const { fila, columna } = casillaActiva;

    if (tableroVisible[fila][columna] !== "") {
        anunciar("Los números fijos no se pueden borrar.");
        return;
    }

    tableroActual[fila][columna] = "";
    celdasConError.delete(clave(fila, columna));
    actualizarDatos();
    pintarTablero();
    anunciar("Casilla borrada. Elige otro número.");
}

function moverFocoSiguiente() {
    if (!casillaActiva) return;
    const inicio = casillaActiva.fila * 9 + casillaActiva.columna;

    for (let paso = 1; paso <= 81; paso += 1) {
        const indice = (inicio + paso) % 81;
        const fila = Math.floor(indice / 9);
        const columna = indice % 9;

        if (!tableroActual[fila][columna] && tableroVisible[fila][columna] === "") {
            casillaActiva = { fila, columna };
            pintarTablero();
            casillas[fila][columna].focus({ preventScroll: true });
            return;
        }
    }
}

function comprobarTablero() {
    if (resuelto) return;

    if (validarSudoku()) {
        finalizarJuego();
        return;
    }

    const vacias = tableroActual.flat().filter((valor) => !valor).length;
    const hayErrores = celdasConError.size > 0;

    if (hayErrores) {
        anunciar("Hay números marcados en rojo. Bórralos y vuelve a intentarlo.");
    } else if (vacias > 0) {
        anunciar(`Todavía quedan ${vacias} casillas por completar.`);
    } else {
        anunciar("Revisa el tablero: hay algún número que no encaja.");
    }
}

function validarSudoku() {
    for (let fila = 0; fila < 9; fila += 1) {
        for (let columna = 0; columna < 9; columna += 1) {
            if (tableroActual[fila][columna] !== tableroCompleto[fila][columna]) {
                return false;
            }
        }
    }

    return true;
}

function actualizarDatos() {
    const llenas = tableroActual.flat().filter(Boolean).length;
    const porcentaje = Math.round((llenas / 81) * 100);

    elementos.errores.textContent = String(errores);
    elementos.progreso.textContent = `${porcentaje}%`;
    elementos.progresoTexto.textContent = `${llenas} / 81`;
    elementos.barra.style.width = `${porcentaje}%`;
}

function actualizarReloj() {
    elementos.tiempo.textContent = formatearTiempo(segundos);
}

function iniciarReloj() {
    window.clearInterval(intervalo);
    segundos = 0;
    actualizarReloj();
    intervalo = window.setInterval(() => {
        segundos += 1;
        actualizarReloj();
    }, 1000);
}

function finalizarJuego() {
    resuelto = true;
    window.clearInterval(intervalo);
    casillaActiva = null;
    pintarTablero();
    actualizarDatos();

    elementos.modalTiempo.textContent = formatearTiempo(segundos);
    elementos.modalErrores.textContent = String(errores);
    elementos.modal.hidden = false;
    anunciar("¡Sudoku resuelto! Cada fila, columna y caja está completa.");
    elementos.btnJugarOtra.focus({ preventScroll: true });
}

function anunciar(texto) {
    elementos.estado.textContent = texto;
}

async function cargarSudoku() {
    try {
        const respuesta = await fetch("json/sudokus.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo de sudokus.");
        }

        const sudokus = await respuesta.json();
        const sudoku = sudokus[Math.floor(Math.random() * sudokus.length)];

        tableroCompleto = sudoku.completo;
        tableroVisible = sudoku.visible;
        tableroActual = sudoku.visible.map((fila) => [...fila]);
        casillaActiva = null;
        celdasConError = new Set();
        errores = 0;
        resuelto = false;
        elementos.modal.hidden = true;
        actualizarDatos();
        iniciarReloj();
        pintarTablero();
        anunciar("Elige una casilla vacía para empezar.");
    } catch (error) {
        console.error(error);
        anunciar("No se pudieron cargar los tableros. Recarga la página.");
    }
}

elementos.btnBorrar.addEventListener("click", borrarNumero);
elementos.btnComprobar.addEventListener("click", comprobarTablero);
elementos.btnReiniciar.addEventListener("click", cargarSudoku);
elementos.btnJugarOtra.addEventListener("click", cargarSudoku);

document.addEventListener("keydown", (evento) => {
    const tecla = evento.key;

    if (tecla >= "1" && tecla <= "9") {
        escribirNumero(tecla);
        return;
    }

    if (tecla === "Backspace" || tecla === "Delete") {
        evento.preventDefault();
        borrarNumero();
        return;
    }

    if (tecla === "Enter") {
        evento.preventDefault();
        comprobarTablero();
        return;
    }

    if (!casillaActiva || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(tecla)) {
        return;
    }

    evento.preventDefault();
    let { fila, columna } = casillaActiva;

    if (tecla === "ArrowUp") fila = Math.max(0, fila - 1);
    if (tecla === "ArrowDown") fila = Math.min(8, fila + 1);
    if (tecla === "ArrowLeft") columna = Math.max(0, columna - 1);
    if (tecla === "ArrowRight") columna = Math.min(8, columna + 1);

    casillaActiva = { fila, columna };
    pintarTablero();
    casillas[fila][columna].focus({ preventScroll: true });
});

crearTablero();
crearTeclado();
cargarSudoku();
