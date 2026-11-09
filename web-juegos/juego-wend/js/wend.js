import { buscarPalabra } from "./wend-core.js";

const CLAVE_PROGRESO = "wend:progreso";
const CLAVE_RECORDS = "wend:records";
const SVG_NS = "http://www.w3.org/2000/svg";
const TEXTO_INICIAL =
    "El tablero está lleno de letras. Arrastra por casillas contiguas para trazar una palabra o usa las flechas y Enter.";
const TEXTO_SIN_RECORD = "Sin récord";

const elTablero = document.querySelector("#tablero");
const elCapa = document.querySelector("#capa");
const elRutas = document.querySelector("#rutas");
const elTrazo = document.querySelector("#trazo");
const elHuecos = document.querySelector("#huecos");
const elEstado = document.querySelector("#estado");
const elTiempo = document.querySelector("#tiempo");
const elPalabras = document.querySelector("#palabras");
const elPistas = document.querySelector("#pistas");
const elMejor = document.querySelector("#mejor");
const elBiblioteca = document.querySelector("#biblioteca");
const elRecords = document.querySelector("#records");
const elDeshacer = document.querySelector("#deshacer");
const elBorrar = document.querySelector("#borrar");
const elPista = document.querySelector("#pista");
const elNuevo = document.querySelector("#nuevo");
const elOlvidar = document.querySelector("#olvidar");
const elGuardado = document.querySelector("#guardado");
const elGuardadoTexto = document.querySelector("#guardado-texto");
const elModal = document.querySelector("#modal");
const elModalTiempo = document.querySelector("#modal-tiempo");
const elModalPistas = document.querySelector("#modal-pistas");
const elModalRecord = document.querySelector("#modal-record");
const elModalTexto = document.querySelector("#modal-texto");

const estado = {
    biblioteca: [],
    tablero: null,
    n: 6,
    palabraPorCelda: new Map(),
    encontradas: new Set(),
    historial: [],
    pistas: new Map(),
    pistaInicio: null,
    trazo: [],
    arrastrando: false,
    puntero: null,
    cursor: 0,
    arranque: 0,
    transcurrido: 0,
    intervalo: null,
    avisoTimer: null,
    errorCeldas: null,
    errorTimer: null,
    guardadoTimer: null,
    resuelto: false,
};

function formatearTiempo(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const minutos = Math.floor(total / 60);
    const segundos = total % 60;
    return `${minutos}:${String(segundos).padStart(2, "0")}`;
}

function leer(clave) {
    try {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : null;
    } catch {
        return null;
    }
}

function escribir(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch {
        return false;
    }
}

function borrarProgreso() {
    try {
        localStorage.removeItem(CLAVE_PROGRESO);
    } catch {
        /* el navegador puede impedir el acceso al almacenamiento */
    }
}

function borrarRecords() {
    try {
        localStorage.removeItem(CLAVE_RECORDS);
    } catch {
        /* igual que arriba */
    }
}

function recordActual() {
    const records = leer(CLAVE_RECORDS);
    const record = records && records["6"];
    return record && Number.isFinite(record.mejor) ? record : null;
}

function guardarRecord(ms) {
    const records = leer(CLAVE_RECORDS) || {};
    const anterior = records["6"] || { mejor: null, resueltos: 0 };
    const esMejor = !Number.isFinite(anterior.mejor) || ms < anterior.mejor;
    records["6"] = {
        mejor: esMejor ? ms : anterior.mejor,
        resueltos: (Number(anterior.resueltos) || 0) + 1,
    };
    escribir(CLAVE_RECORDS, records);
    return { mejor: records["6"].mejor, esMejor, resueltos: records["6"].resueltos };
}

function pintarRecords() {
    const record = recordActual();
    elRecords.replaceChildren();

    if (!record) {
        const vacio = document.createElement("li");
        vacio.className = "records__vacio";
        vacio.textContent = "Aún no hay partidas terminadas.";
        elRecords.append(vacio);
        elMejor.textContent = TEXTO_SIN_RECORD;
        return;
    }

    const fila = document.createElement("li");
    const tamano = document.createElement("strong");
    tamano.textContent = "6×6";
    const marca = document.createElement("span");
    const partidas = record.resueltos === 1 ? "1 partida" : `${record.resueltos || 0} partidas`;
    marca.textContent = `${formatearTiempo(record.mejor)} · ${partidas}`;
    fila.append(tamano, marca);
    elRecords.append(fila);
    elMejor.textContent = formatearTiempo(record.mejor);
}

function avisarGuardado(correcto = true) {
    if (estado.guardadoTimer) clearTimeout(estado.guardadoTimer);
    elGuardado.classList.add("guardado--activo");
    elGuardadoTexto.textContent = correcto
        ? "Guardado en este navegador"
        : "No se pudo guardar el progreso";
    estado.guardadoTimer = setTimeout(() => {
        elGuardado.classList.remove("guardado--activo");
        elGuardadoTexto.textContent = "Se guarda en este navegador";
        estado.guardadoTimer = null;
    }, 2600);
}

function avisar(texto, duracion = 0) {
    if (estado.avisoTimer) {
        clearTimeout(estado.avisoTimer);
        estado.avisoTimer = null;
    }
    elEstado.textContent = texto;
    if (duracion > 0) {
        estado.avisoTimer = setTimeout(() => {
            estado.avisoTimer = null;
            pintarEstado();
        }, duracion);
    }
}

function pintarEstado() {
    if (estado.resuelto) {
        elEstado.textContent = "Resuelto. Todas las letras tienen su palabra.";
        return;
    }
    if (!estado.tablero) {
        elEstado.textContent = "Cargando tableros…";
        return;
    }
    const total = estado.tablero.solucion.length;
    const encontradas = estado.encontradas.size;
    if (encontradas === 0) {
        elEstado.textContent = TEXTO_INICIAL;
        return;
    }
    const quedan = total - encontradas;
    const cola =
        quedan === 1 ? "Queda 1 palabra." : `Quedan ${quedan} palabras.`;
    elEstado.textContent = `${encontradas} de ${total} palabras encontradas. ${cola}`;
}

function pintarReloj() {
    const ms = estado.arranque ? Date.now() - estado.arranque : estado.transcurrido;
    elTiempo.textContent = formatearTiempo(ms);
}

function iniciarReloj(ms = 0) {
    if (estado.intervalo) return;
    estado.transcurrido = ms;
    estado.arranque = Date.now() - ms;
    elTiempo.textContent = formatearTiempo(ms);
    estado.intervalo = setInterval(() => {
        estado.transcurrido = estado.arranque ? Date.now() - estado.arranque : 0;
        elTiempo.textContent = formatearTiempo(estado.transcurrido);
    }, 250);
}

function pararReloj() {
    if (estado.arranque) {
        estado.transcurrido = Date.now() - estado.arranque;
        estado.arranque = 0;
    }
    if (estado.intervalo) {
        clearInterval(estado.intervalo);
        estado.intervalo = null;
    }
    elTiempo.textContent = formatearTiempo(estado.transcurrido);
}

function reiniciarReloj() {
    pararReloj();
    estado.transcurrido = 0;
    estado.arranque = 0;
    elTiempo.textContent = "0:00";
}

function asegurarReloj() {
    if (!estado.resuelto && !estado.arranque) iniciarReloj(0);
}

function tiempoActual() {
    return estado.arranque ? Date.now() - estado.arranque : estado.transcurrido;
}

function esMuro(indice) {
    return !estado.tablero || estado.tablero.letras[indice] == null;
}

function palabraEn(indice) {
    return estado.palabraPorCelda.get(indice);
}

function celdaEncontrada(indice) {
    const k = palabraEn(indice);
    return k !== undefined && estado.encontradas.has(k);
}

function sonVecinas(a, b, n) {
    const fa = Math.floor(a / n);
    const ca = a % n;
    const fb = Math.floor(b / n);
    const cb = b % n;
    return Math.abs(fa - fb) + Math.abs(ca - cb) === 1;
}

function primerAbierto(tablero) {
    const indice = tablero.letras.findIndex((letra) => letra != null);
    return indice >= 0 ? indice : 0;
}

function buscarTablero(id) {
    return estado.biblioteca.find((tablero) => tablero.id === id) || null;
}

function elegirTablero() {
    if (!estado.biblioteca.length) return null;
    const actual = estado.tablero && estado.tablero.id;
    const opciones = estado.biblioteca.filter((tablero) => tablero.id !== actual);
    const lista = opciones.length ? opciones : estado.biblioteca;
    return lista[Math.floor(Math.random() * lista.length)];
}

function actualizarActivo() {
    if (!estado.tablero) return;
    elTablero.setAttribute("aria-activedescendant", `celda-${estado.cursor}`);
}

function limpiarError() {
    if (estado.errorTimer) {
        clearTimeout(estado.errorTimer);
        estado.errorTimer = null;
    }
    estado.errorCeldas = null;
}

function marcarError(celdas) {
    if (estado.errorTimer) clearTimeout(estado.errorTimer);
    estado.errorCeldas = new Set(celdas);
    pintar(false);
    estado.errorTimer = setTimeout(() => {
        estado.errorCeldas = null;
        estado.errorTimer = null;
        pintar(false);
    }, 620);
}

function pintar(actualizarEstado = true) {
    if (!estado.tablero) return;
    const { letras, solucion, n } = estado.tablero;
    const celdas = elTablero.children;

    for (let i = 0; i < celdas.length; i++) {
        const celda = celdas[i];
        const muro = letras[i] == null;
        const k = palabraEn(i);
        const hecha = k !== undefined && estado.encontradas.has(k);
        const enTrazo = estado.trazo.includes(i);
        const esPunta = enTrazo && estado.trazo[estado.trazo.length - 1] === i;

        celda.classList.toggle("celda--hecha", hecha);
        celda.classList.toggle("celda--trazo", enTrazo);
        celda.classList.toggle("celda--punta", esPunta);
        celda.classList.toggle("celda--error", Boolean(estado.errorCeldas?.has(i)));
        celda.classList.toggle(
            "celda--pista",
            estado.pistaInicio === i && !hecha && !muro
        );
        celda.classList.toggle("celda--cursor", !muro && estado.cursor === i);

        if (hecha) {
            celda.style.setProperty("--tinte", `var(--tinte-${(k % 6) + 1})`);
            celda.setAttribute(
                "aria-label",
                `Fila ${Math.floor(i / n) + 1}, columna ${(i % n) + 1}: ${letras[i]}, en la palabra ${solucion[k].palabra}`
            );
        } else {
            celda.style.removeProperty("--tinte");
            if (!muro) {
                celda.setAttribute(
                    "aria-label",
                    `Fila ${Math.floor(i / n) + 1}, columna ${(i % n) + 1}: ${letras[i]}`
                );
            }
        }
    }

    pintarRutas();
    pintarHuecos();
    pintarBotones();

    elPalabras.textContent = `${estado.encontradas.size}/${solucion.length}`;
    let pistas = 0;
    for (const cantidad of estado.pistas.values()) pistas += cantidad;
    elPistas.textContent = String(pistas);
    actualizarActivo();

    if (actualizarEstado) pintarEstado();
}

function pintarRutas() {
    if (!estado.tablero) return;
    const { solucion, n } = estado.tablero;
    const rutas = [];
    for (let k = 0; k < solucion.length; k++) {
        if (!estado.encontradas.has(k)) continue;
        const puntos = solucion[k].celdas
            .map((i) => `${(i % n) + 0.5},${Math.floor(i / n) + 0.5}`)
            .join(" ");
        const linea = document.createElementNS(SVG_NS, "polyline");
        linea.setAttribute("points", puntos);
        linea.setAttribute("class", "ruta");
        rutas.push(linea);
    }
    elRutas.replaceChildren(...rutas);

    if (estado.trazo.length > 1) {
        const puntos = estado.trazo
            .map((i) => `${(i % n) + 0.5},${Math.floor(i / n) + 0.5}`)
            .join(" ");
        elTrazo.setAttribute("points", puntos);
    } else {
        elTrazo.setAttribute("points", "");
    }
}

function crearMarcaHecha() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "icono");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#icono-hecho");
    svg.append(use);
    return svg;
}

function pintarHuecos() {
    if (!estado.tablero) return;
    const { solucion } = estado.tablero;
    elHuecos.replaceChildren();

    solucion.forEach((entrada, k) => {
        const palabra = entrada.palabra;
        const hecha = estado.encontradas.has(k);
        const pista = Math.min(estado.pistas.get(k) || 0, palabra.length);
        const fila = document.createElement("div");
        fila.className = `hueco${hecha ? " hueco--hecho" : ""}`;
        fila.style.setProperty("--tinte", `var(--tinte-${(k % 6) + 1})`);
        fila.dataset.k = String(k);
        fila.setAttribute("role", "group");

        const largo = document.createElement("span");
        largo.className = "hueco__largo";
        largo.setAttribute("aria-hidden", "true");
        largo.textContent = String(palabra.length);

        const tiles = document.createElement("span");
        tiles.className = "hueco__tiles";
        tiles.setAttribute("aria-hidden", "true");

        for (let j = 0; j < palabra.length; j++) {
            const tile = document.createElement("span");
            tile.className = "hueco__tile";
            if (hecha) {
                tile.classList.add("hueco__tile--hecho");
                tile.textContent = palabra[j];
            } else if (j < pista) {
                tile.classList.add("hueco__tile--pista");
                tile.textContent = palabra[j];
            }
            tiles.append(tile);
        }

        let etiqueta = `Palabra de ${palabra.length} letras`;
        if (hecha) etiqueta += `: ${palabra}, encontrada`;
        else if (pista > 0) etiqueta += `, pista parcial: ${palabra.slice(0, pista)}`;
        else etiqueta += ", sin encontrar";

        const marca = document.createElement("span");
        marca.className = "hueco__marca";
        marca.setAttribute("aria-hidden", "true");
        if (hecha) marca.append(crearMarcaHecha());

        fila.setAttribute("aria-label", etiqueta);
        fila.append(largo, tiles, marca);
        elHuecos.append(fila);
    });
}

function pintarBotones() {
    elDeshacer.disabled = estado.resuelto || estado.historial.length === 0;
    elBorrar.disabled = estado.resuelto;
    elPista.disabled = estado.resuelto;
}

function construirTablero() {
    if (!estado.tablero) return;
    const { n, letras, solucion } = estado.tablero;
    estado.n = n;
    estado.palabraPorCelda = new Map();
    solucion.forEach((entrada, k) => {
        for (const i of entrada.celdas) estado.palabraPorCelda.set(i, k);
    });

    elTablero.style.setProperty("--n", n);
    elTablero.setAttribute("aria-rowcount", String(n));
    elTablero.setAttribute("aria-colcount", String(n));
    elTablero.replaceChildren();

    for (let i = 0; i < n * n; i++) {
        const celda = document.createElement("div");
        celda.className = "celda";
        celda.id = `celda-${i}`;
        celda.dataset.i = String(i);
        celda.setAttribute("role", "gridcell");
        celda.setAttribute(
            "aria-label",
            `Fila ${Math.floor(i / n) + 1}, columna ${(i % n) + 1}: ${letras[i]}`
        );

        const letra = document.createElement("span");
        letra.className = "celda__letra";
        letra.textContent = letras[i];
        celda.append(letra);
        elTablero.append(celda);
    }

    elCapa.setAttribute("viewBox", `0 0 ${n} ${n}`);
    elTablero.setAttribute("aria-activedescendant", `celda-${estado.cursor}`);
    pintar();
}

function iniciarTrazo(indice, arrastrando = false) {
    if (!estado.tablero || estado.resuelto) return;
    if (esMuro(indice) || celdaEncontrada(indice)) return;
    asegurarReloj();
    limpiarError();
    estado.trazo = [indice];
    estado.arrastrando = arrastrando;
    estado.cursor = indice;
    actualizarActivo();
    pintar();
}

function avanzarTrazo(indice) {
    if (!estado.tablero || !estado.trazo.length) return false;
    if (esMuro(indice) || celdaEncontrada(indice)) return false;

    const ultimo = estado.trazo[estado.trazo.length - 1];
    if (indice === ultimo) return false;

    const posicion = estado.trazo.indexOf(indice);
    if (posicion !== -1) {
        if (posicion === estado.trazo.length - 2) {
            estado.trazo.pop();
            estado.cursor = indice;
            actualizarActivo();
            pintar();
            return true;
        }
        return false;
    }

    if (!sonVecinas(ultimo, indice, estado.n)) return false;

    estado.trazo.push(indice);
    estado.cursor = indice;
    actualizarActivo();
    pintar();
    return true;
}

function esPrefijoDeSolucion(ruta) {
    if (!estado.tablero) return false;
    return estado.tablero.solucion.some(({ celdas }) => {
        if (ruta.length > celdas.length) return false;
        const directo = ruta.every((indice, j) => celdas[j] === indice);
        const inverso = ruta.every(
            (indice, j) => celdas[celdas.length - 1 - j] === indice
        );
        return directo || inverso;
    });
}

function fallar(ruta, texto) {
    estado.trazo = [];
    marcarError(ruta);
    avisar(texto, 3200);
}

function comprobarTrazo() {
    if (!estado.tablero || !estado.trazo.length || estado.resuelto) {
        estado.trazo = [];
        pintar();
        return;
    }

    const ruta = [...estado.trazo];
    const palabra = ruta.map((i) => estado.tablero.letras[i]).join("");

    if (ruta.length < 3) {
        fallar(ruta, "Una palabra necesita al menos 3 letras.");
        return;
    }

    const indice = buscarPalabra(estado.tablero, ruta);
    if (indice === -1) {
        const mensaje = esPrefijoDeSolucion(ruta)
            ? "Ese camino va bien, pero la palabra sigue."
            : `«${palabra}» no es una de las palabras ocultas.`;
        fallar(ruta, mensaje);
        return;
    }

    if (estado.encontradas.has(indice)) {
        fallar(ruta, `«${palabra}» ya está en el tablero.`);
        return;
    }

    estado.trazo = [];
    estado.encontradas.add(indice);
    estado.historial.push(indice);
    if (
        estado.pistaInicio !== null &&
        estado.tablero.solucion[indice].celdas.includes(estado.pistaInicio)
    ) {
        estado.pistaInicio = null;
    }
    estado.cursor = ruta[ruta.length - 1];

    guardarProgreso();
    pintar();
    avisar(`«${estado.tablero.solucion[indice].palabra}» encontrada.`, 2800);
    comprobarFin();
}

function comprobarFin() {
    if (
        estado.tablero &&
        estado.encontradas.size === estado.tablero.solucion.length
    ) {
        ganar();
    }
}

function ganar() {
    if (!estado.tablero || estado.resuelto) return;
    estado.resuelto = true;
    estado.arrastrando = false;
    estado.puntero = null;
    estado.trazo = [];
    estado.pistaInicio = null;
    if (estado.avisoTimer) {
        clearTimeout(estado.avisoTimer);
        estado.avisoTimer = null;
    }

    const ms = tiempoActual();
    pararReloj();
    const record = guardarRecord(ms);
    borrarProgreso();
    pintar(false);
    pintarRecords();
    pintarEstado();

    const pistas = [...estado.pistas.values()].reduce((total, n) => total + n, 0);
    elModalTexto.textContent = record.esMejor
        ? "Las 36 letras tienen su palabra y ninguna casilla queda sin recorrer. Has batido tu récord."
        : "Las 36 letras tienen su palabra y ninguna casilla queda sin recorrer.";
    elModalTiempo.textContent = formatearTiempo(ms);
    elModalPistas.textContent = String(pistas);
    elModalRecord.textContent = formatearTiempo(record.mejor);
    abrirModal();
}

function guardarProgreso() {
    if (!estado.tablero || estado.resuelto) return;
    const guardado = escribir(CLAVE_PROGRESO, {
        id: estado.tablero.id,
        encontradas: [...estado.encontradas],
        pistas: [...estado.pistas.entries()],
        pistaInicio: estado.pistaInicio,
        ms: tiempoActual(),
    });
    avisarGuardado(guardado);
}

function deshacer() {
    if (!estado.tablero || estado.resuelto || !estado.historial.length) return;
    const k = estado.historial.pop();
    estado.encontradas.delete(k);
    estado.trazo = [];
    guardarProgreso();
    pintar();
    avisar(
        `«${estado.tablero.solucion[k].palabra}» vuelve al tablero.`,
        2800
    );
}

function vaciar() {
    if (!estado.tablero || estado.resuelto) return;
    estado.encontradas.clear();
    estado.historial = [];
    estado.pistas.clear();
    estado.pistaInicio = null;
    estado.trazo = [];
    estado.arrastrando = false;
    estado.puntero = null;
    limpiarError();
    reiniciarReloj();
    borrarProgreso();
    pintar();
    avisar("Tablero vacío. Empieza un camino nuevo.", 2600);
}

function darPista() {
    if (!estado.tablero || estado.resuelto) return;
    asegurarReloj();

    const opciones = estado.tablero.solucion
        .map((entrada, k) => ({
            k,
            palabra: entrada.palabra,
            celdas: entrada.celdas,
            pista: estado.pistas.get(k) || 0,
        }))
        .filter(
            ({ k, palabra, pista }) =>
                !estado.encontradas.has(k) && pista < palabra.length
        )
        .sort(
            (a, b) =>
                a.palabra.length - b.palabra.length ||
                a.pista - b.pista ||
                a.k - b.k
        );

    if (!opciones.length) {
        avisar(
            estado.encontradas.size === estado.tablero.solucion.length
                ? "No queda ninguna palabra por encontrar."
                : "Ya tienes todas las letras; solo queda trazar las palabras.",
            3200
        );
        return;
    }

    const elegida = opciones[0];
    estado.pistas.set(elegida.k, elegida.pista + 1);
    estado.pistaInicio = elegida.celdas[0];
    guardarProgreso();
    pintar();
    avisar(
        `Pista: ${elegida.pista + 1} de ${elegida.palabra.length} letras.`,
        3200
    );
}

function moverCursor(df, dc) {
    if (!estado.tablero) return;
    const n = estado.n;
    let fila = Math.floor(estado.cursor / n);
    let columna = estado.cursor % n;

    for (;;) {
        fila += df;
        columna += dc;
        if (fila < 0 || fila >= n || columna < 0 || columna >= n) return;
        const indice = fila * n + columna;
        if (!esMuro(indice)) {
            estado.cursor = indice;
            actualizarActivo();
            pintar();
            return;
        }
    }
}

function manejarEnter() {
    if (!estado.tablero || estado.resuelto) return;

    if (!estado.trazo.length) {
        const indice = estado.cursor;
        if (esMuro(indice) || celdaEncontrada(indice)) {
            avisar("Esa casilla no puede iniciar una palabra.", 2400);
            return;
        }
        iniciarTrazo(indice);
        avisar(
            "Traza con las flechas y Enter. Pulsa Enter otra vez al final para comprobar.",
            3800
        );
        return;
    }

    const ultimo = estado.trazo[estado.trazo.length - 1];
    if (estado.cursor === ultimo) {
        comprobarTrazo();
        return;
    }
    if (esMuro(estado.cursor)) {
        avisar("Esa casilla es un muro.", 2200);
        return;
    }
    if (celdaEncontrada(estado.cursor)) {
        avisar("Esa casilla ya pertenece a otra palabra.", 2600);
        return;
    }
    if (estado.trazo.includes(estado.cursor)) {
        if (estado.cursor === estado.trazo[estado.trazo.length - 2]) {
            estado.trazo.pop();
            pintar();
        } else {
            avisar("Esa letra ya está en el trazo.", 2200);
        }
        return;
    }
    if (!sonVecinas(ultimo, estado.cursor, estado.n)) {
        avisar("Solo puedes avanzar a una casilla contigua.", 2600);
        return;
    }
    estado.trazo.push(estado.cursor);
    pintar();
}

function abrirModal() {
    elModal.hidden = false;
    document.body.classList.add("modal-abierto");
    const cerrar = elModal.querySelector('[data-accion="cerrar"]');
    if (cerrar) cerrar.focus();
}

function cerrarModal() {
    elModal.hidden = true;
    document.body.classList.remove("modal-abierto");
}

function prepararTablero(tablero, { construir = true } = {}) {
    if (!tablero) return;
    estado.tablero = tablero;
    estado.n = tablero.n;
    estado.encontradas = new Set();
    estado.historial = [];
    estado.pistas = new Map();
    estado.pistaInicio = null;
    estado.trazo = [];
    estado.arrastrando = false;
    estado.puntero = null;
    estado.cursor = primerAbierto(tablero);
    estado.resuelto = false;
    if (estado.avisoTimer) {
        clearTimeout(estado.avisoTimer);
        estado.avisoTimer = null;
    }
    limpiarError();
    cerrarModal();
    reiniciarReloj();
    if (construir) construirTablero();
    pintarRecords();
}

function arrancarTablero(tablero = elegirTablero()) {
    if (!tablero) return;
    prepararTablero(tablero);
    borrarProgreso();
    avisar(TEXTO_INICIAL, 0);
}

function restaurarProgreso() {
    const datos = leer(CLAVE_PROGRESO);
    if (!datos || typeof datos !== "object") return false;

    const tablero = buscarTablero(datos.id);
    if (!tablero) {
        borrarProgreso();
        return false;
    }

    const total = tablero.solucion.length;
    const validas = [];
    if (Array.isArray(datos.encontradas)) {
        for (const k of datos.encontradas) {
            if (Number.isInteger(k) && k >= 0 && k < total && !validas.includes(k)) {
                validas.push(k);
            }
        }
    }

    const pistas = new Map();
    if (Array.isArray(datos.pistas)) {
        for (const entrada of datos.pistas) {
            if (!Array.isArray(entrada) || entrada.length !== 2) continue;
            const [k, cantidad] = entrada;
            if (
                !Number.isInteger(k) ||
                k < 0 ||
                k >= total ||
                !Number.isInteger(cantidad)
            ) {
                continue;
            }
            const maximo = tablero.solucion[k].palabra.length;
            if (cantidad > 0) pistas.set(k, Math.min(cantidad, maximo));
        }
    }

    let pistaInicio = null;
    if (
        Number.isInteger(datos.pistaInicio) &&
        datos.pistaInicio >= 0 &&
        datos.pistaInicio < tablero.n * tablero.n
    ) {
        const indice = datos.pistaInicio;
        const encontrada = tablero.solucion.some(
            (entrada, k) => validas.includes(k) && entrada.celdas.includes(indice)
        );
        if (tablero.letras[indice] != null && !encontrada) pistaInicio = indice;
    }

    const ms = Number(datos.ms);
    prepararTablero(tablero, { construir: false });
    estado.encontradas = new Set(validas);
    estado.historial = [...validas];
    estado.pistas = pistas;
    estado.pistaInicio = pistaInicio;
    estado.cursor = primerAbierto(tablero);
    construirTablero();

    if (validas.length >= total) {
        borrarProgreso();
        arrancarTablero();
        return true;
    }

    if (Number.isFinite(ms) && ms > 0) iniciarReloj(ms);
    avisar("Partida restaurada. Sigue donde la dejaste.", 4200);
    return true;
}

async function iniciar() {
    try {
        const respuesta = await fetch("json/tableros.json", { cache: "no-store" });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        estado.biblioteca = Array.isArray(datos.tableros) ? datos.tableros : [];
    } catch {
        elBiblioteca.textContent = "No se pudieron cargar";
        avisar("No se pudieron cargar los tableros. Recarga la página.", 0);
        return;
    }

    if (!estado.biblioteca.length) {
        elBiblioteca.textContent = "Sin tableros";
        avisar("No hay tableros disponibles.", 0);
        return;
    }

    elBiblioteca.textContent = `${estado.biblioteca.length} ${
        estado.biblioteca.length === 1 ? "tablero" : "tableros"
    } · 6×6`;
    pintarRecords();

    if (!restaurarProgreso()) arrancarTablero();
}

elTablero.addEventListener("pointerdown", (evento) => {
    if (evento.pointerType === "mouse" && evento.button !== 0) return;
    const celda = evento.target.closest(".celda");
    if (!celda || !elTablero.contains(celda)) return;
    const indice = Number(celda.dataset.i);
    if (esMuro(indice) || celdaEncontrada(indice) || estado.resuelto) return;

    evento.preventDefault();
    elTablero.focus({ preventScroll: true });
    try {
        elTablero.setPointerCapture(evento.pointerId);
    } catch {
        /* algunos punteros sintéticos no se pueden capturar */
    }
    estado.puntero = evento.pointerId;
    iniciarTrazo(indice, true);
});

elTablero.addEventListener("pointermove", (evento) => {
    if (!estado.arrastrando || evento.pointerId !== estado.puntero) return;
    evento.preventDefault();
    const elemento = document.elementFromPoint(evento.clientX, evento.clientY);
    const celda = elemento && elemento.closest(".celda");
    if (!celda || !elTablero.contains(celda)) return;
    avanzarTrazo(Number(celda.dataset.i));
});

function terminarPuntero(evento) {
    if (!estado.arrastrando || evento.pointerId !== estado.puntero) return;
    estado.arrastrando = false;
    estado.puntero = null;
    try {
        if (elTablero.hasPointerCapture?.(evento.pointerId)) {
            elTablero.releasePointerCapture(evento.pointerId);
        }
    } catch {
        /* nada que liberar */
    }
    if (estado.trazo.length < 3) {
        estado.trazo = [];
        pintar();
        return;
    }
    comprobarTrazo();
}

function cancelarPuntero(evento) {
    if (evento.pointerId !== estado.puntero) return;
    estado.arrastrando = false;
    estado.puntero = null;
    estado.trazo = [];
    pintar();
}

elTablero.addEventListener("pointerup", terminarPuntero);
elTablero.addEventListener("pointercancel", cancelarPuntero);

elTablero.addEventListener("keydown", (evento) => {
    if (!estado.tablero) return;
    const tecla = evento.key;

    if (tecla === "ArrowUp" || tecla === "ArrowDown" || tecla === "ArrowLeft" || tecla === "ArrowRight") {
        evento.preventDefault();
        if (tecla === "ArrowUp") moverCursor(-1, 0);
        if (tecla === "ArrowDown") moverCursor(1, 0);
        if (tecla === "ArrowLeft") moverCursor(0, -1);
        if (tecla === "ArrowRight") moverCursor(0, 1);
        return;
    }
    if (tecla === "Enter" || tecla === " ") {
        evento.preventDefault();
        manejarEnter();
        return;
    }
    if (tecla === "Backspace") {
        evento.preventDefault();
        if (estado.trazo.length) {
            estado.trazo.pop();
            pintar();
        }
        return;
    }
    if (tecla === "Escape") {
        estado.trazo = [];
        estado.arrastrando = false;
        estado.puntero = null;
        pintar();
        return;
    }
    if (tecla.toLowerCase() === "u") {
        evento.preventDefault();
        deshacer();
        return;
    }
    if (tecla.toLowerCase() === "r") {
        evento.preventDefault();
        vaciar();
    }
});

elDeshacer.addEventListener("click", deshacer);
elBorrar.addEventListener("click", vaciar);
elPista.addEventListener("click", darPista);
elNuevo.addEventListener("click", () => arrancarTablero());

elOlvidar.addEventListener("click", () => {
    const confirmado = window.confirm(
        "¿Borrar el progreso y los récords de Wend en este navegador?"
    );
    if (!confirmado) return;

    borrarProgreso();
    borrarRecords();
    if (estado.tablero) prepararTablero(estado.tablero);
    estado.resuelto = false;
    pintarRecords();
    avisar("Progreso y récords borrados.", 3000);
});

document.querySelector('[data-accion="cerrar"]').addEventListener("click", () => {
    cerrarModal();
    elTablero.focus();
});

document.querySelector('[data-accion="otro"]').addEventListener("click", () => {
    cerrarModal();
    arrancarTablero();
});

elModal.addEventListener("click", (evento) => {
    if (evento.target === elModal) {
        cerrarModal();
        elTablero.focus();
    }
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !elModal.hidden) {
        cerrarModal();
        elTablero.focus();
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) guardarProgreso();
});

window.addEventListener("pagehide", guardarProgreso);

iniciar();
