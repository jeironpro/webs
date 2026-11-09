import { vecinos4 } from "./queens-core.js";

const $ = (selector) => document.querySelector(selector);

const elTablero = $("#tablero");
const elFronteras = $("#fronteras");
const elCapa = $("#capa");
const elTiempo = $("#tiempo");
const elReinas = $("#reinas");
const elMarcas = $("#marcas");
const elMejor = $("#mejor");
const elEstado = $("#estado");
const elRecords = $("#records");
const elTamanoActual = $("#tamano-actual");
const elGuardado = $("#guardado");
const elGuardadoTexto = $("#guardado-texto");
const elModal = $("#modal");
const elModalTiempo = $("#modal-tiempo");
const elModalRecord = $("#modal-record");
const botonesTamano = [...document.querySelectorAll(".chip[data-n]")];

const CLAVE_PROGRESO = "queens:progreso";
const CLAVE_RECORDS = "queens:records";
const TAMANOS = [7, 8, 9];
const PISTA = "Una reina por fila, columna y color. Ninguna puede tocar a otra.";
const SVG = "http://www.w3.org/2000/svg";

const estado = {
    n: 7,
    tablero: null,
    celdas: null,
    cursor: 0,
    arranque: 0,
    transcurrido: 0,
    intervalo: null,
    resuelto: false,
    historial: [],
    guardado: null,
};

let biblioteca = [];

const formatearTiempo = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

const leer = (clave) => {
    try {
        return JSON.parse(localStorage.getItem(clave));
    } catch {
        return null;
    }
};

const escribir = (clave, valor) => {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch {
        return false;
    }
};

function avisar(texto, duracion = 3200) {
    elEstado.textContent = texto;
    elEstado.classList.remove("estado--exito", "estado--error");
    clearTimeout(estado.aviso);
    if (duracion > 0) {
        estado.aviso = setTimeout(() => {
            if (!estado.resuelto && estado.tablero) pintarEstado();
        }, duracion);
    }
}

function avisarGuardado() {
    elGuardado.classList.add("guardado--activo");
    elGuardadoTexto.textContent = "Guardado";
    clearTimeout(estado.guardado);
    estado.guardado = setTimeout(() => {
        elGuardado.classList.remove("guardado--activo");
        elGuardadoTexto.textContent = "Se guarda en este navegador";
    }, 1400);
}

/* Récords ------------------------------------------------------------- */

function leerRecords() {
    return leer(CLAVE_RECORDS) || {};
}

function pintarRecords() {
    const records = leerRecords();
    const cuerpo = document.createDocumentFragment();

    for (const n of TAMANOS) {
        const registro = records[n] || {};
        const fila = document.createElement("li");
        fila.className = "record";
        fila.dataset.actual = String(n === estado.n);

        const tamano = document.createElement("span");
        tamano.className = "record__tamano";
        tamano.textContent = `${n}×${n}`;

        const mejor = document.createElement("span");
        mejor.className = "record__mejor";
        mejor.textContent = registro.mejor ? formatearTiempo(registro.mejor) : "Sin récord";

        const resueltos = document.createElement("span");
        resueltos.className = "record__resueltos";
        resueltos.textContent = registro.resueltos
            ? `${registro.resueltos} resueltos`
            : "Sin resolver";

        fila.append(tamano, mejor, resueltos);
        cuerpo.append(fila);
    }

    elRecords.replaceChildren(cuerpo);
}

function pintarMejor() {
    const registro = leerRecords()[estado.n] || {};
    elMejor.textContent = registro.mejor ? formatearTiempo(registro.mejor) : "Sin récord";
}

function guardarRecord(ms) {
    const records = leerRecords();
    const registro = records[estado.n] || { mejor: 0, resueltos: 0 };
    records[estado.n] = {
        mejor: !registro.mejor || ms < registro.mejor ? ms : registro.mejor,
        resueltos: (registro.resueltos || 0) + 1,
    };
    escribir(CLAVE_RECORDS, records);
    pintarMejor();
    pintarRecords();
    return records[estado.n].mejor;
}

/* Progreso ------------------------------------------------------------ */

function guardarProgreso() {
    if (!estado.tablero || estado.resuelto || !estado.celdas) return;
    const ms = estado.arranque ? Date.now() - estado.arranque : estado.transcurrido;
    const guardado = escribir(CLAVE_PROGRESO, {
        id: estado.tablero.id,
        n: estado.n,
        celdas: Array.from(estado.celdas),
        ms,
    });
    if (guardado) avisarGuardado();
}

function borrarProgreso() {
    try {
        localStorage.removeItem(CLAVE_PROGRESO);
    } catch {
        /* sin almacenamiento */
    }
}

function restaurarProgreso() {
    const datos = leer(CLAVE_PROGRESO);
    if (!datos || typeof datos.id !== "string") return false;

    const tablero = biblioteca.find((candidato) => candidato.id === datos.id);
    if (!tablero) return false;

    const total = tablero.n * tablero.n;
    if (!Array.isArray(datos.celdas) || datos.celdas.length !== total) return false;
    if (!datos.celdas.every((valor) => valor === 0 || valor === 1 || valor === 2)) return false;

    estado.n = tablero.n;
    estado.tablero = tablero;
    estado.celdas = Int8Array.from(datos.celdas);
    estado.cursor = 0;
    estado.resuelto = false;
    estado.historial = [];

    marcarTamano();
    construirTablero();
    pintarTablero();

    const reinas = Array.from(estado.celdas).filter((valor) => valor === 1).length;
    if (reinas === estado.n) {
        borrarProgreso();
        arrancar(estado.n);
        return true;
    }

    const ms = Number(datos.ms) || 0;
    if (ms > 0) iniciarReloj(ms);
    else reiniciarReloj();

    elModal.hidden = true;
    avisar(`Partida restaurada: ${reinas} de ${estado.n} reinas. Sigue donde lo dejaste.`, 5000);
    return true;
}

/* Reloj --------------------------------------------------------------- */

function pintarReloj() {
    elTiempo.textContent = formatearTiempo(estado.arranque ? Date.now() - estado.arranque : 0);
}

function iniciarReloj(previos = 0) {
    pararReloj();
    estado.arranque = Date.now() - previos;
    estado.transcurrido = previos;
    estado.intervalo = setInterval(pintarReloj, 250);
    pintarReloj();
}

function pararReloj() {
    if (estado.intervalo) clearInterval(estado.intervalo);
    estado.intervalo = null;
    if (estado.arranque) {
        estado.transcurrido = Date.now() - estado.arranque;
        estado.arranque = 0;
    }
}

function reiniciarReloj() {
    pararReloj();
    estado.transcurrido = 0;
    elTiempo.textContent = "0:00";
}

/* Análisis del tablero ------------------------------------------------ */

function analizar() {
    const { n, regiones } = estado.tablero;
    const reinas = [];
    estado.celdas.forEach((valor, i) => {
        if (valor === 1) reinas.push(i);
    });

    const choques = new Set();
    const motivos = [];
    const porFila = new Map();
    const porColumna = new Map();
    const porRegion = new Map();

    const sumar = (mapa, clave, i) => {
        if (!mapa.has(clave)) mapa.set(clave, []);
        mapa.get(clave).push(i);
    };

    for (const i of reinas) {
        sumar(porFila, Math.floor(i / n), i);
        sumar(porColumna, i % n, i);
        sumar(porRegion, regiones[i], i);
    }

    const marcarGrupos = (mapa, motivo) => {
        let encontrado = false;
        for (const grupo of mapa.values()) {
            if (grupo.length < 2) continue;
            encontrado = true;
            for (const i of grupo) choques.add(i);
        }
        if (encontrado) motivos.push(motivo);
        return encontrado;
    };

    marcarGrupos(porFila, "Dos reinas comparten fila.");
    marcarGrupos(porColumna, "Dos reinas comparten columna.");
    marcarGrupos(porRegion, "Dos reinas comparten región.");

    for (let a = 0; a < reinas.length; a++) {
        for (let b = a + 1; b < reinas.length; b++) {
            const i = reinas[a];
            const j = reinas[b];
            const df = Math.abs(Math.floor(i / n) - Math.floor(j / n));
            const dc = Math.abs((i % n) - (j % n));
            if (df <= 1 && dc <= 1) {
                choques.add(i);
                choques.add(j);
                if (!motivos.includes("Dos reinas se tocan.")) motivos.push("Dos reinas se tocan.");
            }
        }
    }

    const regionesConReina = new Set(reinas.map((i) => regiones[i]));

    return { reinas, choques, motivos, regionesConReina };
}

/* Tablero ------------------------------------------------------------- */

function etiquetaCelda(i, valor, conflicto) {
    const n = estado.n;
    const fila = Math.floor(i / n) + 1;
    const columna = (i % n) + 1;
    const region = estado.tablero.regiones[i] + 1;
    const descripcion = valor === 1 ? "reina" : valor === 2 ? "marcada" : "vacía";
    return `Fila ${fila}, columna ${columna}, región ${region}: ${descripcion}${
        conflicto ? ", en conflicto" : ""
    }`;
}

function crearPieza(id, clase) {
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", `pieza ${clase}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const uso = document.createElementNS(SVG, "use");
    uso.setAttribute("href", `#${id}`);
    svg.append(uso);
    return svg;
}

function construirTablero() {
    const { n, regiones } = estado.tablero;
    elTablero.style.setProperty("--n", String(n));
    elTablero.setAttribute(
        "aria-label",
        `Tablero de Queens de ${n} por ${n}. Flechas para moverte, Enter para colocar una reina y X para marcar una casilla descartada.`
    );
    elCapa.setAttribute("viewBox", `0 0 ${n * 100} ${n * 100}`);

    const fragmento = document.createDocumentFragment();
    for (let i = 0; i < n * n; i++) {
        const celda = document.createElement("button");
        celda.type = "button";
        celda.className = "celda";
        celda.dataset.i = String(i);
        celda.dataset.region = String(regiones[i]);
        celda.tabIndex = i === estado.cursor ? 0 : -1;
        celda.append(crearPieza("pieza-reina", "pieza--reina"), crearPieza("pieza-marca", "pieza--marca"));
        fragmento.append(celda);
    }
    elTablero.replaceChildren(fragmento);
    dibujarFronteras();
}

function dibujarFronteras() {
    const { n, regiones } = estado.tablero;
    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < n * n; i++) {
        const fila = Math.floor(i / n);
        const columna = i % n;

        if (columna < n - 1 && regiones[i] !== regiones[i + 1]) {
            const linea = document.createElementNS(SVG, "line");
            linea.setAttribute("x1", String((columna + 1) * 100));
            linea.setAttribute("x2", String((columna + 1) * 100));
            linea.setAttribute("y1", String(fila * 100));
            linea.setAttribute("y2", String((fila + 1) * 100));
            linea.setAttribute("class", "frontera");
            fragmento.append(linea);
        }

        if (fila < n - 1 && regiones[i] !== regiones[i + n]) {
            const linea = document.createElementNS(SVG, "line");
            linea.setAttribute("x1", String(columna * 100));
            linea.setAttribute("x2", String((columna + 1) * 100));
            linea.setAttribute("y1", String((fila + 1) * 100));
            linea.setAttribute("y2", String((fila + 1) * 100));
            linea.setAttribute("class", "frontera");
            fragmento.append(linea);
        }
    }

    elFronteras.replaceChildren(fragmento);
}

function pintarEstado() {
    const { reinas, choques, motivos } = analizar();
    elEstado.classList.remove("estado--exito", "estado--error");

    if (estado.resuelto) {
        elEstado.classList.add("estado--exito");
        elEstado.textContent = "Resuelto: una reina por fila, columna y región, sin tocarse.";
        return;
    }

    if (choques.size > 0) {
        elEstado.classList.add("estado--error");
        elEstado.textContent = motivos.join(" ");
        return;
    }

    const faltan = estado.n - reinas.length;
    elEstado.textContent =
        faltan === 0
            ? "Todas las reinas colocadas y ninguna se toca. Comprobando…"
            : `${reinas.length} de ${estado.n} reinas colocadas. Faltan ${faltan}.`;
}

function pintarTablero() {
    const { n } = estado.tablero;
    const { reinas, choques } = analizar();
    let marcas = 0;

    for (let i = 0; i < n * n; i++) {
        const celda = elTablero.children[i];
        const valor = estado.celdas[i];
        const conflicto = choques.has(i);
        if (valor === 2) marcas += 1;

        celda.classList.toggle("celda--reina", valor === 1);
        celda.classList.toggle("celda--marca", valor === 2);
        celda.classList.toggle("celda--conflicto", conflicto);
        celda.tabIndex = i === estado.cursor ? 0 : -1;
        celda.setAttribute("aria-pressed", String(valor === 1));
        celda.setAttribute("aria-label", etiquetaCelda(i, valor, conflicto));
    }

    elReinas.textContent = `${reinas.length}/${n}`;
    elMarcas.textContent = String(marcas);
    pintarEstado();

    return { reinas, choques };
}

/* Partida ------------------------------------------------------------- */

function moverCursor(fila, columna) {
    const n = estado.n;
    const f = Math.min(n - 1, Math.max(0, fila));
    const c = Math.min(n - 1, Math.max(0, columna));
    const i = f * n + c;
    estado.cursor = i;
    for (let k = 0; k < elTablero.children.length; k++) {
        elTablero.children[k].tabIndex = k === i ? 0 : -1;
    }
    elTablero.children[i].focus({ preventScroll: true });
}

function guardarHistorial() {
    estado.historial.push(Int8Array.from(estado.celdas));
    if (estado.historial.length > 80) estado.historial.shift();
}

function alternar(i) {
    if (estado.resuelto || !estado.tablero) return;
    guardarHistorial();
    const valor = estado.celdas[i];
    estado.celdas[i] = valor === 0 ? 1 : valor === 1 ? 2 : 0;
    estado.cursor = i;
    if (!estado.arranque) iniciarReloj();

    pintarTablero();
    guardarProgreso();

    const { reinas, choques } = analizar();
    if (reinas.length === estado.n && choques.size === 0) ganar();
}

function deshacer() {
    if (estado.resuelto || estado.historial.length === 0) return;
    estado.celdas = estado.historial.pop();
    pintarTablero();
    guardarProgreso();
    avisar(PISTA, 0);
}

function vaciar() {
    if (estado.resuelto) return;
    guardarHistorial();
    estado.celdas = new Int8Array(estado.n * estado.n);
    reiniciarReloj();
    borrarProgreso();
    pintarTablero();
    avisar(PISTA, 0);
}

function ganar() {
    estado.resuelto = true;
    const ms = estado.arranque ? Date.now() - estado.arranque : estado.transcurrido;
    pararReloj();
    elTiempo.textContent = formatearTiempo(ms);
    const record = guardarRecord(ms);
    borrarProgreso();

    pintarEstado();
    elModalTiempo.textContent = formatearTiempo(ms);
    elModalRecord.textContent = formatearTiempo(record);
    elModal.hidden = false;
    elModal.querySelector('[data-accion="otro"]')?.focus();
}

function elegirTablero(n) {
    const opciones = biblioteca.filter((tablero) => tablero.n === n);
    const distintas = opciones.filter(
        (tablero) => !estado.tablero || tablero.id !== estado.tablero.id
    );
    const lista = distintas.length > 0 ? distintas : opciones;
    return lista[Math.floor(Math.random() * lista.length)];
}

function marcarTamano() {
    elTamanoActual.textContent = `${estado.n}×${estado.n}`;
    botonesTamano.forEach((boton) => {
        boton.setAttribute("aria-pressed", String(Number(boton.dataset.n) === estado.n));
    });
}

function arrancar(n = estado.n) {
    const tablero = elegirTablero(n);
    if (!tablero) return;

    estado.n = n;
    estado.tablero = tablero;
    estado.celdas = new Int8Array(n * n);
    estado.cursor = 0;
    estado.resuelto = false;
    estado.historial = [];
    reiniciarReloj();
    borrarProgreso();

    elModal.hidden = true;
    marcarTamano();
    construirTablero();
    pintarTablero();
    pintarMejor();
    pintarRecords();
    avisar(PISTA, 0);
}

/* Eventos ------------------------------------------------------------- */

elTablero.addEventListener("click", (evento) => {
    const celda = evento.target.closest?.(".celda");
    if (!celda) return;
    alternar(Number(celda.dataset.i));
});

elTablero.addEventListener("keydown", (evento) => {
    const { n } = estado;
    const i = estado.cursor;
    const fila = Math.floor(i / n);
    const columna = i % n;

    if (evento.key.startsWith("Arrow")) {
        evento.preventDefault();
        if (evento.key === "ArrowUp") moverCursor(fila - 1, columna);
        else if (evento.key === "ArrowDown") moverCursor(fila + 1, columna);
        else if (evento.key === "ArrowLeft") moverCursor(fila, columna - 1);
        else moverCursor(fila, columna + 1);
        return;
    }

    if (evento.key.toLowerCase() === "x") {
        evento.preventDefault();
        if (estado.resuelto) return;
        guardarHistorial();
        estado.celdas[i] = estado.celdas[i] === 2 ? 0 : 2;
        pintarTablero();
        guardarProgreso();
        return;
    }

    if (evento.key === "Backspace" || evento.key.toLowerCase() === "u") {
        evento.preventDefault();
        deshacer();
    } else if (evento.key.toLowerCase() === "r") {
        evento.preventDefault();
        vaciar();
    }
});

for (const boton of botonesTamano) {
    boton.addEventListener("click", () => arrancar(Number(boton.dataset.n)));
}

$("#deshacer").addEventListener("click", deshacer);
$("#borrar").addEventListener("click", vaciar);
$("#nuevo").addEventListener("click", () => arrancar(estado.n));

$("#olvidar").addEventListener("click", () => {
    try {
        localStorage.removeItem(CLAVE_PROGRESO);
        localStorage.removeItem(CLAVE_RECORDS);
    } catch {
        /* sin almacenamiento */
    }
    estado.resuelto = false;
    arrancar(estado.n);
    avisar("Progreso y récords borrados de este navegador.", 4000);
});

elModal.addEventListener("click", (evento) => {
    const accion = evento.target.closest?.("[data-accion]")?.dataset.accion;
    if (!accion) return;
    if (accion === "otro") arrancar(estado.n);
    else elModal.hidden = true;
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !elModal.hidden) elModal.hidden = true;
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") guardarProgreso();
});

/* Arranque ------------------------------------------------------------ */

async function iniciar() {
    try {
        const respuesta = await fetch("json/tableros.json");
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        biblioteca = Array.isArray(datos.tableros) ? datos.tableros : [];
        if (biblioteca.length === 0) throw new Error("sin tableros");

        if (!restaurarProgreso()) arrancar(7);
        pintarRecords();
        pintarMejor();
    } catch (error) {
        console.error("Queens:", error);
        elEstado.textContent = "No se pudieron cargar los tableros. Recarga la página.";
    }
}

iniciar();
