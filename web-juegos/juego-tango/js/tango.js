import { LUNA, SOL } from "./tango-core.js";

const $ = (selector) => document.querySelector(selector);

const elTablero = $("#tablero");
const elEstado = $("#estado");
const elTiempo = $("#tiempo");
const elSoles = $("#soles");
const elLunas = $("#lunas");
const elMejor = $("#mejor");
const elRecords = $("#records");
const elGuardado = $("#guardado");
const elGuardadoTexto = $("#guardado-texto");
const elModal = $("#modal");
const elModalTiempo = $("#modal-tiempo");
const elModalRecord = $("#modal-record");

const CLAVE_PROGRESO = "tango:progreso";
const CLAVE_RECORDS = "tango:records";
const LADO = 6;
const TOTAL = LADO * LADO;
const PISTA = "Tres soles y tres lunas por fila y columna, sin tres iguales seguidos.";
const SVG = "http://www.w3.org/2000/svg";

const estado = {
    n: LADO,
    tablero: null,
    celdas: null,
    dadas: new Set(),
    cursor: 0,
    arranque: 0,
    transcurrido: 0,
    intervalo: null,
    resuelto: false,
    historial: [],
    nodosRelacion: [],
    observador: null,
    aviso: null,
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

function leerRecords() {
    return leer(CLAVE_RECORDS) || {};
}

function pintarRecords() {
    const registro = leerRecords()[LADO] || {};
    const fila = document.createElement("li");
    fila.className = "record";

    const tamano = document.createElement("span");
    tamano.className = "record__tamano";
    tamano.textContent = `${LADO}×${LADO}`;

    const tiempo = document.createElement("span");
    tiempo.className = "record__tiempo";
    tiempo.textContent = registro.mejor ? formatearTiempo(registro.mejor) : "Sin récord";

    const resueltos = document.createElement("span");
    resueltos.className = "record__resueltos";
    resueltos.textContent = registro.resueltos ? `${registro.resueltos} resueltos` : "Sin resolver";

    fila.append(tamano, tiempo, resueltos);
    elRecords.replaceChildren(fila);
}

function pintarMejor() {
    const registro = leerRecords()[LADO] || {};
    elMejor.textContent = registro.mejor ? formatearTiempo(registro.mejor) : "Sin récord";
}

function guardarRecord(ms) {
    const records = leerRecords();
    const registro = records[LADO] || { mejor: 0, resueltos: 0 };
    records[LADO] = {
        mejor: !registro.mejor || ms < registro.mejor ? ms : registro.mejor,
        resueltos: (registro.resueltos || 0) + 1,
    };
    escribir(CLAVE_RECORDS, records);
    pintarMejor();
    pintarRecords();
    return records[LADO].mejor;
}

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
        void 0;
    }
}

function restaurarProgreso() {
    const datos = leer(CLAVE_PROGRESO);
    if (!datos || typeof datos.id !== "string") return false;

    const tablero = biblioteca.find((candidato) => candidato.id === datos.id);
    if (!tablero) return false;
    if (!Array.isArray(datos.celdas) || datos.celdas.length !== TOTAL) return false;
    if (!datos.celdas.every((valor) => valor === 0 || valor === 1 || valor === 2)) return false;

    estado.tablero = tablero;
    estado.celdas = Uint8Array.from(datos.celdas);
    estado.dadas = new Set(tablero.dados.map(({ i }) => i));
    for (const { i, v } of tablero.dados) estado.celdas[i] = v;
    estado.cursor = 0;
    estado.resuelto = false;
    estado.historial = [];

    construirTablero();
    const { choques } = pintarTablero();

    if (estado.celdas.every((valor) => valor !== 0) && choques.size === 0) {
        borrarProgreso();
        arrancar();
        return true;
    }

    const ms = Number(datos.ms) || 0;
    if (ms > 0) iniciarReloj(ms);
    else reiniciarReloj();

    elModal.hidden = true;
    avisar("Partida restaurada. Sigue donde lo dejaste.", 5000);
    return true;
}

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

function analizar() {
    const n = estado.n;
    const valores = estado.celdas;
    const choques = new Set();
    const motivos = [];
    const mitad = n / 2;

    for (let k = 0; k < n; k++) {
        const fila = [];
        const columna = [];
        for (let p = 0; p < n; p++) {
            fila.push(k * n + p);
            columna.push(p * n + k);
        }

        for (const linea of [fila, columna]) {
            let soles = 0;
            let lunas = 0;
            for (const i of linea) {
                if (valores[i] === SOL) soles++;
                else if (valores[i] === LUNA) lunas++;
            }

            if (soles > mitad) {
                for (const i of linea) if (valores[i] === SOL) choques.add(i);
                if (!motivos.includes("Una línea lleva más de tres soles.")) {
                    motivos.push("Una línea lleva más de tres soles.");
                }
            }
            if (lunas > mitad) {
                for (const i of linea) if (valores[i] === LUNA) choques.add(i);
                if (!motivos.includes("Una línea lleva más de tres lunas.")) {
                    motivos.push("Una línea lleva más de tres lunas.");
                }
            }

            for (let p = 0; p + 2 < n; p++) {
                const a = linea[p];
                const b = linea[p + 1];
                const c = linea[p + 2];
                if (valores[a] && valores[a] === valores[b] && valores[a] === valores[c]) {
                    choques.add(a);
                    choques.add(b);
                    choques.add(c);
                    if (!motivos.includes("Hay tres símbolos iguales seguidos.")) {
                        motivos.push("Hay tres símbolos iguales seguidos.");
                    }
                }
            }
        }
    }

    for (const { a, b, tipo } of estado.tablero.relaciones) {
        if (!valores[a] || !valores[b]) continue;
        const iguales = valores[a] === valores[b];
        if (iguales !== (tipo === "=")) {
            choques.add(a);
            choques.add(b);
            if (!motivos.includes("Una relación no se cumple.")) {
                motivos.push("Una relación no se cumple.");
            }
        }
    }

    let soles = 0;
    let lunas = 0;
    for (const valor of valores) {
        if (valor === SOL) soles++;
        else if (valor === LUNA) lunas++;
    }

    return { choques, motivos, soles, lunas };
}

function etiquetaCelda(i, valor, conflicto) {
    const n = estado.n;
    const fila = Math.floor(i / n) + 1;
    const columna = (i % n) + 1;
    const simbolo = valor === SOL ? "sol" : valor === LUNA ? "luna" : "vacía";
    const dada = estado.dadas.has(i) ? ", dada por el puzle" : "";
    return `Fila ${fila}, columna ${columna}: ${simbolo}${dada}${
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

function colocarRelaciones() {
    if (!estado.tablero || estado.nodosRelacion.length === 0) return;
    const base = elTablero.getBoundingClientRect();
    if (!base.width) return;

    for (const [signo, rel] of estado.nodosRelacion) {
        const a = elTablero.children[rel.a].getBoundingClientRect();
        const b = elTablero.children[rel.b].getBoundingClientRect();
        signo.style.left = `${(a.left + a.width / 2 + b.left + b.width / 2) / 2 - base.left}px`;
        signo.style.top = `${(a.top + a.height / 2 + b.top + b.height / 2) / 2 - base.top}px`;
    }
}

function construirTablero() {
    const n = estado.n;
    elTablero.style.setProperty("--n", String(n));
    elTablero.setAttribute(
        "aria-label",
        `Tablero de Tango de ${n} por ${n}. Flechas para moverte, Enter para poner sol o luna.`
    );

    const fragmento = document.createDocumentFragment();
    for (let i = 0; i < n * n; i++) {
        const celda = document.createElement("button");
        celda.type = "button";
        celda.className = "celda";
        celda.dataset.i = String(i);
        celda.tabIndex = i === estado.cursor ? 0 : -1;
        celda.append(
            crearPieza("simbolo-sol", "pieza--sol"),
            crearPieza("simbolo-luna", "pieza--luna")
        );
        fragmento.append(celda);
    }
    elTablero.replaceChildren(fragmento);

    const capa = document.createElement("div");
    capa.className = "relaciones";
    elTablero.append(capa);

    estado.nodosRelacion = [];
    for (const rel of estado.tablero.relaciones) {
        const signo = document.createElement("span");
        signo.className = "relacion";
        signo.textContent = rel.tipo === "=" ? "=" : "×";
        capa.append(signo);
        estado.nodosRelacion.push([signo, rel]);
    }

    colocarRelaciones();
    estado.observador?.disconnect();
    if (typeof ResizeObserver !== "undefined") {
        estado.observador = new ResizeObserver(colocarRelaciones);
        estado.observador.observe(elTablero);
    }
}

function pintarEstado() {
    elEstado.classList.remove("estado--exito", "estado--error");

    if (estado.resuelto) {
        elEstado.classList.add("estado--exito");
        elEstado.textContent = "Resuelto: tres soles y tres lunas en cada línea, sin tres iguales.";
        return;
    }

    const { choques, motivos } = analizar();
    if (choques.size > 0) {
        elEstado.classList.add("estado--error");
        elEstado.textContent = motivos.join(" ");
        return;
    }

    const puestas = estado.celdas ? estado.celdas.filter((valor) => valor !== 0).length : 0;
    elEstado.textContent =
        puestas === 0 ? PISTA : `${puestas} de ${TOTAL} casillas. Faltan ${TOTAL - puestas}.`;
}

function pintarTablero() {
    const { choques, soles, lunas } = analizar();
    const n = estado.n;

    for (let i = 0; i < n * n; i++) {
        const celda = elTablero.children[i];
        const valor = estado.celdas[i];
        const dado = estado.dadas.has(i);

        celda.classList.toggle("celda--dada", dado);
        celda.classList.toggle("celda--sol", valor === SOL);
        celda.classList.toggle("celda--luna", valor === LUNA);
        celda.classList.toggle("celda--conflicto", choques.has(i));
        celda.tabIndex = i === estado.cursor ? 0 : -1;
        celda.setAttribute("aria-label", etiquetaCelda(i, valor, choques.has(i)));
        if (dado) celda.setAttribute("aria-disabled", "true");
        else celda.removeAttribute("aria-disabled");
    }

    elSoles.textContent = String(soles);
    elLunas.textContent = String(lunas);
    pintarEstado();

    return { choques, soles, lunas };
}

function moverCursor(fila, columna) {
    const n = estado.n;
    const f = Math.min(n - 1, Math.max(0, fila));
    const c = Math.min(n - 1, Math.max(0, columna));
    const i = f * n + c;
    estado.cursor = i;
    for (let k = 0; k < elTablero.children.length; k++) {
        if (elTablero.children[k].classList.contains("celda")) {
            elTablero.children[k].tabIndex = k === i ? 0 : -1;
        }
    }
    elTablero.children[i].focus({ preventScroll: true });
}

function guardarHistorial() {
    estado.historial.push(Uint8Array.from(estado.celdas));
    if (estado.historial.length > 80) estado.historial.shift();
}

function alternar(i) {
    if (estado.resuelto || !estado.tablero) return;
    if (estado.dadas.has(i)) {
        avisar("Esa casilla viene dada por el puzle.");
        return;
    }

    guardarHistorial();
    const valor = estado.celdas[i];
    estado.celdas[i] = valor === 0 ? SOL : valor === SOL ? LUNA : 0;
    estado.cursor = i;
    if (!estado.arranque) iniciarReloj();

    const { choques } = pintarTablero();
    guardarProgreso();

    if (estado.celdas.every((v) => v !== 0) && choques.size === 0) ganar();
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
    estado.celdas = new Uint8Array(TOTAL);
    for (const { i, v } of estado.tablero.dados) estado.celdas[i] = v;
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

function elegirTablero() {
    const distintas = biblioteca.filter(
        (tablero) => !estado.tablero || tablero.id !== estado.tablero.id
    );
    const lista = distintas.length > 0 ? distintas : biblioteca;
    return lista[Math.floor(Math.random() * lista.length)];
}

function arrancar(n = LADO) {
    const tablero = elegirTablero(n);
    if (!tablero) return;

    estado.n = n;
    estado.tablero = tablero;
    estado.celdas = new Uint8Array(n * n);
    estado.dadas = new Set(tablero.dados.map(({ i }) => i));
    for (const { i, v } of tablero.dados) estado.celdas[i] = v;
    estado.cursor = 0;
    estado.resuelto = false;
    estado.historial = [];
    reiniciarReloj();
    borrarProgreso();

    elModal.hidden = true;
    construirTablero();
    pintarTablero();
    pintarMejor();
    pintarRecords();
    avisar(PISTA, 0);
}

elTablero.addEventListener("click", (evento) => {
    const celda = evento.target.closest?.(".celda");
    if (!celda) return;
    alternar(Number(celda.dataset.i));
});

elTablero.addEventListener("keydown", (evento) => {
    const n = estado.n;
    const i = estado.cursor;
    const fila = Math.floor(i / n);
    const columna = i % n;

    if (evento.key.startsWith("Arrow")) {
        evento.preventDefault();
        const df = evento.key === "ArrowDown" ? 1 : evento.key === "ArrowUp" ? -1 : 0;
        const dc = evento.key === "ArrowRight" ? 1 : evento.key === "ArrowLeft" ? -1 : 0;
        moverCursor(fila + df, columna + dc);
        return;
    }

    if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        alternar(i);
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

$("#deshacer").addEventListener("click", deshacer);
$("#borrar").addEventListener("click", vaciar);
$("#nuevo").addEventListener("click", () => arrancar());

$("#olvidar").addEventListener("click", () => {
    try {
        localStorage.removeItem(CLAVE_PROGRESO);
        localStorage.removeItem(CLAVE_RECORDS);
    } catch {
        void 0;
    }
    estado.resuelto = false;
    arrancar();
    avisar("Progreso y récords borrados de este navegador.", 4000);
});

elModal.addEventListener("click", (evento) => {
    const accion = evento.target.closest?.("[data-accion]")?.dataset.accion;
    if (!accion) return;
    if (accion === "otro") arrancar();
    else elModal.hidden = true;
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !elModal.hidden) elModal.hidden = true;
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") guardarProgreso();
});

async function iniciar() {
    try {
        const respuesta = await fetch("data/tableros.json");
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        biblioteca = Array.isArray(datos.tableros) ? datos.tableros : [];
        if (biblioteca.length === 0) throw new Error("sin tableros");

        if (!restaurarProgreso()) arrancar();
        pintarRecords();
        pintarMejor();
    } catch {
        elEstado.textContent = "No se pudieron cargar los tableros. Recarga la página.";
    }
}

iniciar();
