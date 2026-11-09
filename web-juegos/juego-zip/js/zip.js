import { claveMuro, vecinos } from "./zip-core.js";

const $ = (selector) => document.querySelector(selector);

const elTablero = $("#tablero");
const elCapa = $("#capa");
const elMuros = $("#capa-muros");
const elCamino = $("#capa-camino");
const elCabeza = $("#capa-cabeza");
const elEstado = $("#estado");
const elTiempo = $("#tiempo");
const elMovimientos = $("#movimientos");
const elProgreso = $("#progreso");
const elMejor = $("#mejor");
const elModal = $("#modal");
const elModalTiempo = $("#modal-tiempo");
const elModalMovimientos = $("#modal-movimientos");
const botonesTamano = [...document.querySelectorAll(".chip[data-n]")];

const PISTA = "Empieza en el 1 y arrastra sin soltar.";
const SVG = "http://www.w3.org/2000/svg";

const estado = {
    n: 6,
    tablero: null,
    camino: [],
    movimientos: 0,
    arrastrando: false,
    arranque: 0,
    intervalo: null,
    resuelto: false,
    aviso: null,
};

let biblioteca = [];
let muros = new Set();

const formatearTiempo = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

function numeroEn(i) {
    return estado.tablero.numeros.find((numero) => numero.i === i)?.orden;
}

function ultimoNumero() {
    return estado.tablero.numeros.reduce((a, b) => (a.orden > b.orden ? a : b)).i;
}

function avisar(texto, duracion = 3200) {
    elEstado.textContent = texto;
    clearTimeout(estado.aviso);
    if (duracion > 0) {
        estado.aviso = setTimeout(() => {
            if (!estado.resuelto) elEstado.textContent = PISTA;
        }, duracion);
    }
}

function leerMejor(n) {
    try {
        return Number(localStorage.getItem(`zip:mejor:${n}`)) || 0;
    } catch {
        return 0;
    }
}

function pintarMejor() {
    const mejor = leerMejor(estado.n);
    elMejor.textContent = mejor ? formatearTiempo(mejor) : "—";
}

function guardarMejor(ms) {
    const mejor = leerMejor(estado.n);
    if (mejor && ms >= mejor) return;
    try {
        localStorage.setItem(`zip:mejor:${estado.n}`, String(ms));
    } catch {
        /* sin almacenamiento local: el tiempo no se guarda */
    }
    pintarMejor();
}

function arrancarReloj() {
    if (estado.intervalo) return;
    estado.arranque = Date.now();
    estado.intervalo = setInterval(() => {
        elTiempo.textContent = formatearTiempo(Date.now() - estado.arranque);
    }, 250);
}

function pararReloj() {
    if (!estado.intervalo) return;
    clearInterval(estado.intervalo);
    estado.intervalo = null;
    if (estado.arranque) elTiempo.textContent = formatearTiempo(Date.now() - estado.arranque);
}

function reiniciarReloj() {
    pararReloj();
    estado.arranque = 0;
    elTiempo.textContent = "0:00";
}

function construirTablero() {
    const { n, numeros, muros: listaMuros } = estado.tablero;
    muros = new Set(listaMuros.map(([a, b]) => claveMuro(a, b)));
    elTablero.style.setProperty("--n", n);
    elTablero.setAttribute(
        "aria-label",
        `Tablero de ${n} por ${n}. Empieza en el 1 y avanza con las flechas.`
    );
    elCapa.setAttribute("viewBox", `0 0 ${n * 100} ${n * 100}`);

    const ordenes = new Map(numeros.map(({ i, orden }) => [i, orden]));
    const total = n * n;
    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
        const celda = document.createElement("div");
        celda.className = "celda";
        celda.dataset.i = String(i);
        celda.setAttribute("role", "gridcell");
        const fila = Math.floor(i / n) + 1;
        const columna = (i % n) + 1;
        const orden = ordenes.get(i);

        if (orden === undefined) {
            celda.setAttribute("aria-label", `Fila ${fila}, columna ${columna}, casilla vacía`);
        } else {
            celda.classList.add("celda--numero");
            if (orden === 0) celda.classList.add("celda--inicio");
            if (orden === numeros.length - 1) celda.classList.add("celda--fin");
            const insignia = document.createElement("span");
            insignia.className = "celda__numero";
            insignia.textContent = String(orden + 1);
            celda.append(insignia);
            celda.setAttribute(
                "aria-label",
                `Fila ${fila}, columna ${columna}: número ${orden + 1}`
            );
        }
        fragmento.append(celda);
    }

    elTablero.replaceChildren(fragmento);
    dibujarMuros();
}

function dibujarMuros() {
    const { n, muros: listaMuros } = estado.tablero;
    const fragmento = document.createDocumentFragment();

    for (const [a, b] of listaMuros) {
        const fila = Math.floor(a / n);
        const columna = a % n;
        const linea = document.createElementNS(SVG, "line");
        if (b === a + 1) {
            linea.setAttribute("x1", String((columna + 1) * 100));
            linea.setAttribute("x2", String((columna + 1) * 100));
            linea.setAttribute("y1", String(fila * 100 + 6));
            linea.setAttribute("y2", String((fila + 1) * 100 - 6));
        } else {
            linea.setAttribute("y1", String((fila + 1) * 100));
            linea.setAttribute("y2", String((fila + 1) * 100));
            linea.setAttribute("x1", String(columna * 100 + 6));
            linea.setAttribute("x2", String((columna + 1) * 100 - 6));
        }
        linea.setAttribute("class", "muro");
        fragmento.append(linea);
    }

    elMuros.replaceChildren(fragmento);
}

function pintarCamino() {
    const { n } = estado.tablero;
    const celdas = elTablero.children;
    for (const celda of celdas) celda.classList.remove("celda--visitada", "celda--cabeza");

    const { camino } = estado;
    for (const i of camino) celdas[i].classList.add("celda--visitada");

    if (camino.length > 0) {
        const cabeza = camino[camino.length - 1];
        celdas[cabeza].classList.add("celda--cabeza");
        elCamino.setAttribute(
            "points",
            camino
                .map((i) => `${(i % n) * 100 + 50},${Math.floor(i / n) * 100 + 50}`)
                .join(" ")
        );
        elCabeza.setAttribute("cx", String((cabeza % n) * 100 + 50));
        elCabeza.setAttribute("cy", String(Math.floor(cabeza / n) * 100 + 50));
        elCabeza.setAttribute("r", "15");
        elCamino.style.display = "";
        elCabeza.style.display = "";
    } else {
        elCamino.style.display = "none";
        elCabeza.style.display = "none";
    }

    elProgreso.textContent = `${camino.length}/${n * n}`;
    elMovimientos.textContent = String(estado.movimientos);
}

function ganar() {
    estado.resuelto = true;
    estado.arrastrando = false;
    const ms = estado.arranque ? Date.now() - estado.arranque : 0;
    pararReloj();
    guardarMejor(ms);
    elEstado.textContent = "Camino completo, en orden y sin cruzar muros.";
    elModalTiempo.textContent = formatearTiempo(ms);
    elModalMovimientos.textContent = String(estado.movimientos);
    elModal.hidden = false;
    elModal.querySelector('[data-accion="otro"]')?.focus();
}

function moverA(i) {
    if (estado.resuelto || !estado.tablero) return false;
    const { n, numeros } = estado.tablero;
    const total = n * n;

    if (estado.camino.length === 0) {
        if (numeroEn(i) !== 0) {
            avisar("El camino empieza en el 1.");
            return false;
        }
        estado.camino = [i];
        arrancarReloj();
        pintarCamino();
        avisar("Bien. Ahora sigue por una casilla contigua.", 2200);
        return true;
    }

    const camino = estado.camino;
    const cabeza = camino[camino.length - 1];
    const posicion = camino.indexOf(i);

    if (posicion !== -1) {
        if (posicion < camino.length - 1) {
            estado.camino = camino.slice(0, posicion + 1);
            estado.movimientos += 1;
            pintarCamino();
        }
        return true;
    }

    if (!vecinos(cabeza, n).includes(i)) return false;

    if (muros.has(claveMuro(cabeza, i))) {
        avisar("Hay un muro: rodea por otro lado.");
        return false;
    }

    if (cabeza === ultimoNumero() && camino.length < total) {
        avisar("El último número cierra el camino.");
        return false;
    }

    const orden = numeroEn(i);
    if (orden !== undefined) {
        const visitados = camino.reduce(
            (suma, celda) => suma + (numeroEn(celda) !== undefined ? 1 : 0),
            0
        );
        if (orden !== visitados) {
            avisar(`Toca el ${visitados + 1} antes que el ${orden + 1}.`);
            return false;
        }
    }

    estado.camino = [...camino, i];
    estado.movimientos += 1;
    pintarCamino();

    if (estado.camino.length === total) {
        if (i === ultimoNumero()) ganar();
        else avisar("Camino completo: debe terminar en el último número.");
    }
    return true;
}

function deshacer() {
    if (estado.resuelto || estado.camino.length === 0) return;
    estado.camino = estado.camino.slice(0, -1);
    estado.movimientos = Math.max(0, estado.movimientos - 1);
    if (estado.camino.length === 0) reiniciarReloj();
    pintarCamino();
    avisar(PISTA, 0);
}

function borrar() {
    if (estado.resuelto) return;
    estado.camino = [];
    estado.movimientos = 0;
    reiniciarReloj();
    pintarCamino();
    avisar(PISTA, 0);
}

function elegirTablero(n) {
    const opciones = biblioteca.filter((tablero) => tablero.n === n);
    const distintas = opciones.filter(
        (tablero) => !estado.tablero || tablero.id !== estado.tablero.id
    );
    const lista = distintas.length > 0 ? distintas : opciones;
    return lista[Math.floor(Math.random() * lista.length)];
}

function arrancar(n = estado.n) {
    const tablero = elegirTablero(n);
    if (!tablero) return;
    estado.n = n;
    estado.tablero = tablero;
    estado.camino = [];
    estado.movimientos = 0;
    estado.resuelto = false;
    estado.arrastrando = false;
    reiniciarReloj();
    elModal.hidden = true;
    botonesTamano.forEach((boton) =>
        boton.setAttribute("aria-pressed", String(Number(boton.dataset.n) === n))
    );
    construirTablero();
    pintarCamino();
    pintarMejor();
    avisar(PISTA, 0);
}

elTablero.addEventListener("pointerdown", (evento) => {
    if (evento.button !== undefined && evento.button !== 0) return;
    const celda = evento.target.closest?.(".celda");
    if (!celda || estado.resuelto) return;
    evento.preventDefault();
    elTablero.focus({ preventScroll: true });
    estado.arrastrando = true;
    elTablero.setPointerCapture?.(evento.pointerId);
    moverA(Number(celda.dataset.i));
});

elTablero.addEventListener("pointermove", (evento) => {
    if (!estado.arrastrando || estado.resuelto) return;
    const celda = document.elementFromPoint(evento.clientX, evento.clientY)?.closest?.(".celda");
    if (!celda) return;
    const i = Number(celda.dataset.i);
    if (estado.camino[estado.camino.length - 1] === i) return;
    moverA(i);
});

for (const tipo of ["pointerup", "pointercancel"]) {
    elTablero.addEventListener(tipo, () => {
        estado.arrastrando = false;
    });
}

elTablero.addEventListener("keydown", (evento) => {
    if (estado.resuelto) return;
    const { n } = estado.tablero;

    if (evento.key.startsWith("Arrow")) {
        evento.preventDefault();
        if (estado.camino.length === 0) {
            moverA(estado.tablero.numeros.find(({ orden }) => orden === 0).i);
            return;
        }
        const cabeza = estado.camino[estado.camino.length - 1];
        const fila = Math.floor(cabeza / n);
        const columna = cabeza % n;
        if (evento.key === "ArrowUp") {
            if (fila > 0) moverA(cabeza - n);
        } else if (evento.key === "ArrowDown") {
            if (fila < n - 1) moverA(cabeza + n);
        } else if (evento.key === "ArrowLeft") {
            if (columna > 0) moverA(cabeza - 1);
        } else if (columna < n - 1) {
            moverA(cabeza + 1);
        }
        return;
    }

    if (evento.key === "Backspace" || evento.key.toLowerCase() === "u") {
        evento.preventDefault();
        deshacer();
    } else if (evento.key.toLowerCase() === "r") {
        evento.preventDefault();
        borrar();
    }
});

$("#deshacer").addEventListener("click", deshacer);
$("#borrar").addEventListener("click", borrar);
$("#nuevo").addEventListener("click", () => arrancar(estado.n));

for (const boton of botonesTamano) {
    boton.addEventListener("click", () => arrancar(Number(boton.dataset.n)));
}

elModal.addEventListener("click", (evento) => {
    const accion = evento.target.closest?.("[data-accion]")?.dataset.accion;
    if (!accion) return;
    if (accion === "otro") arrancar(estado.n);
    else elModal.hidden = true;
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !elModal.hidden) elModal.hidden = true;
});

async function iniciar() {
    try {
        const respuesta = await fetch("json/tableros.json");
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        biblioteca = Array.isArray(datos.tableros) ? datos.tableros : [];
        if (biblioteca.length === 0) throw new Error("sin tableros");
        arrancar(6);
    } catch (error) {
        console.error("Zip:", error);
        elEstado.textContent = "No se pudieron cargar los tableros. Recarga la página.";
        elTablero.setAttribute("aria-label", "No se pudieron cargar los tableros");
    }
}

iniciar();
