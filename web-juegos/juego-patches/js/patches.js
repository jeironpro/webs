import { LIBRE, celdasDe, formaDe } from "./patches-core.js";

const $ = (selector) => document.querySelector(selector);

const elTablero = $("#tablero");
const elCosturas = $("#costuras");
const elEstado = $("#estado");
const elTiempo = $("#tiempo");
const elRetales = $("#retales");
const elPistas = $("#pistas");
const elPista = $("#pista");
const elPistaTexto = $("#pista-texto");
const elMejor = $("#mejor");
const elRecords = $("#records");
const elGuardado = $("#guardado");
const elGuardadoTexto = $("#guardado-texto");
const elModal = $("#modal");
const elModalTiempo = $("#modal-tiempo");
const elModalRecord = $("#modal-record");

const CLAVE_PROGRESO = "patches:progreso";
const CLAVE_RECORDS = "patches:records";
const LADO = 6;
const TOTAL = LADO * LADO;
const PISTA = "Arrastra de una casilla a otra para dibujar un retal. Toca un retal para quitarlo.";
const ESPERA_PISTA = 10_000;
const SVG = "http://www.w3.org/2000/svg";

const FORMA_ICONO = {
    cuadrada: "forma-cuadrada",
    ancha: "forma-ancha",
    alta: "forma-alta",
    libre: "forma-libre",
};

const FORMA_TEXTO = {
    cuadrada: "cuadrado",
    ancha: "más ancho que alto",
    alta: "más alto que ancho",
    libre: "libre",
};

const estado = {
    n: LADO,
    tablero: null,
    clavePista: new Map(),
    piezas: [],
    cursor: 0,
    ancla: null,
    preview: null,
    arrastro: false,
    puntero: null,
    arranque: 0,
    transcurrido: 0,
    intervalo: null,
    resuelto: false,
    historial: [],
    pistas: 0,
    reveladas: new Map(),
    finEspera: 0,
    intervaloPista: null,
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
    if (!estado.tablero || estado.resuelto) return;
    const ms = estado.arranque ? Date.now() - estado.arranque : estado.transcurrido;
    const guardado = escribir(CLAVE_PROGRESO, {
        id: estado.tablero.id,
        piezas: estado.piezas,
        pistas: estado.pistas,
        reveladas: [...estado.reveladas.entries()],
        espera: estado.finEspera,
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
    if (!datos || typeof datos.id !== "string" || !Array.isArray(datos.piezas)) return false;

    const tablero = biblioteca.find((candidato) => candidato.id === datos.id);
    if (!tablero) return false;

    const piezas = [];
    const cubierta = new Uint8Array(TOTAL);
    const usadas = new Set();

    for (const pieza of datos.piezas) {
        if (!pieza || !Number.isInteger(pieza.k)) return false;
        if (![pieza.r, pieza.c, pieza.w, pieza.h].every(Number.isInteger)) return false;
        if (pieza.r < 0 || pieza.c < 0 || pieza.w < 1 || pieza.h < 1) return false;
        if (pieza.r + pieza.h > LADO || pieza.c + pieza.w > LADO) return false;

        const pista = tablero.pistas[pieza.k];
        if (!pista || usadas.has(pieza.k)) return false;
        if (pieza.w * pieza.h !== pista.area) return false;
        if (pista.forma !== LIBRE && formaDe(pieza.w, pieza.h) !== pista.forma) return false;

        const celdas = celdasDe(pieza, LADO);
        if (!celdas.includes(pista.i)) return false;
        if (celdas.some((i) => cubierta[i])) return false;
        for (const i of celdas) cubierta[i] = 1;
        usadas.add(pieza.k);
        piezas.push({ r: pieza.r, c: pieza.c, w: pieza.w, h: pieza.h, k: pieza.k });
    }

    const reveladas = new Map();
    if (Array.isArray(datos.reveladas)) {
        for (const entrada of datos.reveladas) {
            if (!Array.isArray(entrada) || entrada.length !== 2) continue;
            const [i, k] = entrada;
            if (!Number.isInteger(i) || i < 0 || i >= TOTAL) continue;
            if (!Number.isInteger(k) || !tablero.pistas[k]) continue;
            const solucion = tablero.solucion.find((candidata) => candidata.k === k);
            if (!solucion || !celdasDe(solucion, LADO).includes(i)) continue;
            if (cubierta[i]) continue;
            reveladas.set(i, k);
        }
    }

    estado.tablero = tablero;
    estado.piezas = piezas;
    estado.pistas = Number(datos.pistas) || 0;
    elPistas.textContent = String(estado.pistas);
    estado.cursor = 0;
    estado.resuelto = false;
    estado.historial = [];
    estado.reveladas = reveladas;
    const espera = Number(datos.espera) || 0;
    if (espera > Date.now()) {
        iniciarEsperaPista(espera - Date.now());
    } else {
        pararEsperaPista();
    }

    construirTablero();
    pintar();

    if (cubierta.every((valor) => valor === 1)) {
        borrarProgreso();
        arrancar();
        return true;
    }

    const ms = Number(datos.ms) || 0;
    if (ms > 0) iniciarReloj(ms);
    else reiniciarReloj();

    elModal.hidden = true;
    avisar("Partida restaurada. Sigue donde la dejaste.", 5000);
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

function rectEntre(a, b) {
    const n = estado.n;
    const filaA = Math.floor(a / n);
    const columnaA = a % n;
    const filaB = Math.floor(b / n);
    const columnaB = b % n;
    return {
        r: Math.min(filaA, filaB),
        c: Math.min(columnaA, columnaB),
        w: Math.abs(columnaA - columnaB) + 1,
        h: Math.abs(filaA - filaB) + 1,
    };
}

function solapan(a, b) {
    return !(a.r + a.h <= b.r || b.r + b.h <= a.r || a.c + a.w <= b.c || b.c + b.w <= a.c);
}

function dentroDe(i, rect) {
    const n = estado.n;
    const fila = Math.floor(i / n);
    const columna = i % n;
    return (
        fila >= rect.r && fila < rect.r + rect.h && columna >= rect.c && columna < rect.c + rect.w
    );
}

function piezaEn(i) {
    return estado.piezas.find((pieza) => dentroDe(i, pieza));
}

function analizarRect(rect) {
    const celdas = celdasDe(rect, estado.n);
    const dentro = [];
    for (const i of celdas) {
        const k = estado.clavePista.get(i);
        if (k !== undefined) dentro.push(k);
    }

    if (dentro.length === 0) {
        return { ok: false, motivo: "Un retal necesita una pista dentro." };
    }
    if (dentro.length > 1) {
        return { ok: false, motivo: "Un retal solo puede contener una pista." };
    }

    const k = dentro[0];
    const pista = estado.tablero.pistas[k];
    const area = rect.w * rect.h;

    if (area !== pista.area) {
        return {
            ok: false,
            k,
            motivo: `Ese retal cubre ${area} casillas y la pista pide ${pista.area}.`,
        };
    }
    if (pista.forma !== LIBRE && formaDe(rect.w, rect.h) !== pista.forma) {
        return {
            ok: false,
            k,
            motivo: `La pista pide un retal ${FORMA_TEXTO[pista.forma]}.`,
        };
    }

    const solucion = estado.tablero.solucion.find((candidata) => candidata.k === k);
    const reveladas = celdas.filter((i) => estado.reveladas.has(i));
    if (reveladas.length > 0) {
        const coincide =
            solucion &&
            rect.r === solucion.r &&
            rect.c === solucion.c &&
            rect.w === solucion.w &&
            rect.h === solucion.h;
        const mismaPista = reveladas.every((i) => estado.reveladas.get(i) === k);
        if (!coincide || !mismaPista) {
            return { ok: false, motivo: "Ese retal no encaja con la casilla revelada." };
        }
    }

    return { ok: true, k };
}

function guardarHistorial() {
    estado.historial.push(estado.piezas.map((pieza) => ({ ...pieza })));
    if (estado.historial.length > 80) estado.historial.shift();
}

function colocar(rect) {
    if (estado.resuelto) return;
    const analisis = analizarRect(rect);
    if (!analisis.ok) {
        avisar(analisis.motivo, 3800);
        return;
    }

    guardarHistorial();
    estado.piezas = estado.piezas.filter((pieza) => !solapan(pieza, rect));
    estado.piezas.push({ r: rect.r, c: rect.c, w: rect.w, h: rect.h, k: analisis.k });
    for (const i of celdasDe(rect, estado.n)) estado.reveladas.delete(i);
    if (!estado.arranque) iniciarReloj();
    guardarProgreso();
    pintar();
    comprobar();
}

function quitar(pieza) {
    if (estado.resuelto || !pieza) return;
    guardarHistorial();
    estado.piezas = estado.piezas.filter((candidata) => candidata !== pieza);
    guardarProgreso();
    pintar();
}

function pintarBotonPista(resto = 0) {
    const segundos = Math.max(0, Math.ceil(resto / 1000));
    elPistaTexto.textContent = segundos > 0 ? `Pista ${segundos} s` : "Pista";
    elPista.disabled = Boolean(estado.resuelto) || segundos > 0;
    if (segundos > 0) {
        elPista.setAttribute("aria-label", `Pista disponible en ${segundos} segundos`);
    } else {
        elPista.removeAttribute("aria-label");
    }
}

function pararEsperaPista() {
    clearInterval(estado.intervaloPista);
    estado.intervaloPista = null;
    estado.finEspera = 0;
    pintarBotonPista(0);
}

function iniciarEsperaPista(resto = ESPERA_PISTA) {
    const duracion = Math.max(0, Math.min(ESPERA_PISTA, resto));
    if (duracion === 0) {
        pararEsperaPista();
        return;
    }

    clearInterval(estado.intervaloPista);
    estado.finEspera = Date.now() + duracion;
    pintarBotonPista(duracion);
    estado.intervaloPista = setInterval(() => {
        const restante = estado.finEspera - Date.now();
        if (restante <= 0) {
            pararEsperaPista();
            return;
        }
        pintarBotonPista(restante);
    }, 250);
}

function revelarPista() {
    if (estado.resuelto || !estado.tablero || estado.finEspera > Date.now()) return;

    const ocupadas = new Set();
    for (const pieza of estado.piezas) {
        for (const i of celdasDe(pieza, estado.n)) ocupadas.add(i);
    }

    const pendientes = estado.tablero.solucion.filter(
        (solucion) =>
            !estado.piezas.some(
                (pieza) =>
                    pieza.r === solucion.r &&
                    pieza.c === solucion.c &&
                    pieza.w === solucion.w &&
                    pieza.h === solucion.h
            )
    );
    const candidatas = [];
    const esquinas = [];

    for (const solucion of pendientes) {
        for (const i of celdasDe(solucion, estado.n)) {
            if (estado.clavePista.has(i) || estado.reveladas.has(i) || ocupadas.has(i)) continue;
            if (!candidatas.some((candidata) => candidata.i === i)) {
                candidatas.push({ i, k: solucion.k });
            }
        }

        const puntos = [
            [solucion.r, solucion.c],
            [solucion.r, solucion.c + solucion.w - 1],
            [solucion.r + solucion.h - 1, solucion.c],
            [solucion.r + solucion.h - 1, solucion.c + solucion.w - 1],
        ];
        for (const [fila, columna] of puntos) {
            const i = fila * estado.n + columna;
            if (estado.clavePista.has(i) || estado.reveladas.has(i) || ocupadas.has(i)) continue;
            if (!esquinas.some((candidata) => candidata.i === i)) {
                esquinas.push({ i, k: solucion.k });
            }
        }
    }

    if (candidatas.length === 0) {
        avisar("No hay casillas libres que revelar. Deshaz algún retal o vacía el tablero.", 4200);
        return;
    }

    const lista = esquinas.length > 0 ? esquinas : candidatas;
    const elegida = lista[Math.floor(Math.random() * lista.length)];
    estado.reveladas.set(elegida.i, elegida.k);
    estado.pistas += 1;
    if (!estado.arranque) iniciarReloj();
    elPistas.textContent = String(estado.pistas);
    pintar();
    iniciarEsperaPista();
    guardarProgreso();

    const fila = Math.floor(elegida.i / estado.n) + 1;
    const columna = (elegida.i % estado.n) + 1;
    avisar(
        `Pista: la casilla de la fila ${fila}, columna ${columna} pertenece a un retal pendiente.`,
        4800
    );
}

function deshacer() {
    if (estado.resuelto || estado.historial.length === 0) return;
    estado.piezas = estado.historial.pop();
    guardarProgreso();
    pintar();
}

function vaciar() {
    if (estado.resuelto) return;
    guardarHistorial();
    estado.piezas = [];
    estado.pistas = 0;
    estado.reveladas.clear();
    pararEsperaPista();
    elPistas.textContent = "0";
    reiniciarReloj();
    borrarProgreso();
    pintar();
    avisar(PISTA, 0);
}

function etiquetaCelda(i, pieza) {
    const n = estado.n;
    const fila = Math.floor(i / n) + 1;
    const columna = (i % n) + 1;
    const partes = [`Fila ${fila}, columna ${columna}`];
    const k = estado.clavePista.get(i);

    if (k !== undefined) {
        const pista = estado.tablero.pistas[k];
        partes.push(`pista ${pista.area}, forma ${FORMA_TEXTO[pista.forma]}`);
    }
    if (pieza) {
        partes.push(`retal de ${pieza.w} por ${pieza.h}`);
    } else if (k === undefined) {
        partes.push("casilla vacía");
    }
    if (estado.reveladas.has(i) && !pieza) partes.push("casilla revelada");

    return `${partes.join(": ")}.`;
}

function pintarCosturas(preview, valida) {
    const n = estado.n;
    elCosturas.setAttribute("viewBox", `0 0 ${n} ${n}`);
    const fragmento = document.createDocumentFragment();

    for (const pieza of estado.piezas) {
        const rect = document.createElementNS(SVG, "rect");
        rect.setAttribute("class", "costura");
        rect.setAttribute("x", String(pieza.c));
        rect.setAttribute("y", String(pieza.r));
        rect.setAttribute("width", String(pieza.w));
        rect.setAttribute("height", String(pieza.h));
        fragmento.append(rect);
    }

    if (preview) {
        const rect = document.createElementNS(SVG, "rect");
        rect.setAttribute("class", `costura costura--preview${valida ? "" : " costura--mal"}`);
        rect.setAttribute("x", String(preview.c));
        rect.setAttribute("y", String(preview.r));
        rect.setAttribute("width", String(preview.w));
        rect.setAttribute("height", String(preview.h));
        fragmento.append(rect);
    }

    elCosturas.replaceChildren(fragmento);
}

function pintar() {
    if (!estado.tablero) return;
    const preview = estado.preview;
    const previewValida = preview ? analizarRect(preview).ok : false;
    const ocupadas = new Map();

    for (const pieza of estado.piezas) {
        for (const i of celdasDe(pieza, estado.n)) ocupadas.set(i, pieza);
    }

    for (const celda of elTablero.children) {
        const i = Number(celda.dataset.i);
        const pieza = ocupadas.get(i);
        const enPreview = Boolean(preview) && dentroDe(i, preview);

        celda.classList.toggle("celda--retal", Boolean(pieza));
        celda.classList.toggle("celda--preview", enPreview);
        celda.classList.toggle("celda--mal", enPreview && !previewValida);
        celda.classList.toggle("celda--revelada", !pieza && estado.reveladas.has(i));
        celda.tabIndex = i === estado.cursor ? 0 : -1;
        celda.setAttribute("aria-label", etiquetaCelda(i, pieza));

        if (pieza) celda.style.setProperty("--tinte", `var(--tinte-${(pieza.k % 8) + 1})`);
        else celda.style.removeProperty("--tinte");
    }

    pintarCosturas(preview, previewValida);
    elRetales.textContent = `${estado.piezas.length}/${estado.tablero.pistas.length}`;
    pintarEstado();
}

function pintarEstado() {
    elEstado.classList.remove("estado--exito", "estado--error");

    if (estado.resuelto) {
        elEstado.classList.add("estado--exito");
        elEstado.textContent =
            "Resuelto: cada pista tiene su retal y no queda ninguna casilla suelta.";
        return;
    }

    if (!estado.tablero) return;

    const total = estado.tablero.pistas.length;
    if (estado.piezas.length === 0) {
        elEstado.textContent = PISTA;
    } else if (estado.piezas.length === total) {
        elEstado.textContent = `${total} retales colocados. Revisa que no queden huecos.`;
    } else {
        elEstado.textContent = `${estado.piezas.length} de ${total} retales. Faltan ${
            total - estado.piezas.length
        }.`;
    }
}

function construirTablero() {
    const n = estado.n;
    elTablero.style.setProperty("--n", String(n));
    elTablero.replaceChildren();
    estado.clavePista = new Map(estado.tablero.pistas.map((pista, k) => [pista.i, k]));

    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < n * n; i++) {
        const celda = document.createElement("button");
        celda.type = "button";
        celda.className = "celda";
        celda.dataset.i = String(i);
        celda.tabIndex = i === estado.cursor ? 0 : -1;

        const k = estado.clavePista.get(i);
        if (k !== undefined) {
            const pista = estado.tablero.pistas[k];
            const caja = document.createElement("span");
            caja.className = "pista";

            const numero = document.createElement("span");
            numero.className = "pista__num";
            numero.textContent = String(pista.area);

            const forma = document.createElement("span");
            forma.className = "pista__forma";
            forma.setAttribute("aria-hidden", "true");
            const svg = document.createElementNS(SVG, "svg");
            svg.setAttribute("viewBox", "0 0 18 12");
            const uso = document.createElementNS(SVG, "use");
            uso.setAttribute("href", `#${FORMA_ICONO[pista.forma]}`);
            svg.append(uso);
            forma.append(svg);

            caja.append(numero, forma);
            celda.append(caja);
        }

        fragmento.append(celda);
    }

    elTablero.append(fragmento);
    pintar();
}

function comprobar() {
    if (estado.resuelto) return;
    const cubierta = new Uint8Array(TOTAL);
    for (const pieza of estado.piezas) {
        for (const i of celdasDe(pieza, estado.n)) cubierta[i] = 1;
    }
    if (cubierta.every((valor) => valor === 1)) ganar();
}

function ganar() {
    estado.resuelto = true;
    pararEsperaPista();
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

function arrancar() {
    const tablero = elegirTablero();
    if (!tablero) return;

    estado.tablero = tablero;
    estado.piezas = [];
    estado.historial = [];
    estado.pistas = 0;
    estado.cursor = 0;
    estado.ancla = null;
    estado.preview = null;
    estado.resuelto = false;
    estado.reveladas = new Map();
    pararEsperaPista();

    reiniciarReloj();
    borrarProgreso();

    elModal.hidden = true;
    elPistas.textContent = "0";
    construirTablero();
    pintarMejor();
    pintarRecords();
    avisar(PISTA, 0);
}

function celdaEn(x, y) {
    const objetivo = document.elementFromPoint(x, y);
    const celda = objetivo?.closest?.(".celda");
    return celda && elTablero.contains(celda) ? celda : null;
}

elTablero.addEventListener("pointerdown", (evento) => {
    if (estado.resuelto || !estado.tablero) return;
    if (evento.button !== undefined && evento.button !== 0) return;
    const celda = evento.target.closest?.(".celda");
    if (!celda) return;

    evento.preventDefault();
    estado.puntero = evento.pointerId;
    estado.ancla = Number(celda.dataset.i);
    estado.cursor = estado.ancla;
    estado.arrastro = false;
    estado.preview = null;
    try {
        elTablero.setPointerCapture(evento.pointerId);
    } catch {
        void 0;
    }
    pintar();
});

elTablero.addEventListener("pointermove", (evento) => {
    if (estado.ancla === null) return;
    const celda = celdaEn(evento.clientX, evento.clientY);
    if (!celda) return;

    const i = Number(celda.dataset.i);
    if (i !== estado.ancla) estado.arrastro = true;
    estado.cursor = i;
    estado.preview = rectEntre(estado.ancla, i);
    pintar();
});

function terminarPuntero() {
    if (estado.ancla === null) return;
    const ancla = estado.ancla;
    const preview = estado.preview;
    const arrastro = estado.arrastro;

    estado.ancla = null;
    estado.preview = null;
    estado.puntero = null;
    estado.arrastro = false;

    if (arrastro && preview) {
        colocar(preview);
        return;
    }

    const pieza = piezaEn(ancla);
    if (pieza) {
        quitar(pieza);
        return;
    }

    pintar();
    avisar("Arrastra para dibujar un retal. Toca un retal para quitarlo.", 3600);
}

elTablero.addEventListener("pointerup", terminarPuntero);
elTablero.addEventListener("pointercancel", () => {
    estado.ancla = null;
    estado.preview = null;
    estado.puntero = null;
    estado.arrastro = false;
    pintar();
});

function moverCursor(fila, columna) {
    const n = estado.n;
    const f = Math.min(n - 1, Math.max(0, fila));
    const c = Math.min(n - 1, Math.max(0, columna));
    const i = f * n + c;
    estado.cursor = i;
    for (const celda of elTablero.children) {
        celda.tabIndex = Number(celda.dataset.i) === i ? 0 : -1;
    }
    elTablero.children[i].focus({ preventScroll: true });
}

elTablero.addEventListener("keydown", (evento) => {
    const enfocada = evento.target.closest?.(".celda");
    if (enfocada) estado.cursor = Number(enfocada.dataset.i);

    const n = estado.n;
    const i = estado.cursor;
    const fila = Math.floor(i / n);
    const columna = i % n;

    if (evento.key.startsWith("Arrow")) {
        evento.preventDefault();
        const df = evento.key === "ArrowDown" ? 1 : evento.key === "ArrowUp" ? -1 : 0;
        const dc = evento.key === "ArrowRight" ? 1 : evento.key === "ArrowLeft" ? -1 : 0;
        moverCursor(fila + df, columna + dc);
        if (estado.ancla !== null) {
            estado.preview = rectEntre(estado.ancla, estado.cursor);
            pintar();
        }
        return;
    }

    if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        if (estado.ancla === null) {
            estado.ancla = i;
            estado.preview = null;
            avisar("Selección iniciada. Extiende el retal con las flechas y pulsa Enter.", 4200);
            return;
        }
        if (estado.preview) {
            const rect = estado.preview;
            estado.ancla = null;
            estado.preview = null;
            colocar(rect);
            return;
        }
        avisar("Mueve el cursor con las flechas para dibujar el retal.", 3200);
        return;
    }

    if (evento.key === "Escape" && estado.ancla !== null) {
        evento.preventDefault();
        estado.ancla = null;
        estado.preview = null;
        pintar();
        return;
    }

    if (evento.key === "Backspace" || evento.key === "Delete") {
        evento.preventDefault();
        const pieza = piezaEn(i);
        if (pieza) quitar(pieza);
        return;
    }

    if (evento.key.toLowerCase() === "u") {
        evento.preventDefault();
        deshacer();
    } else if (evento.key.toLowerCase() === "r") {
        evento.preventDefault();
        vaciar();
    }
});

$("#deshacer").addEventListener("click", deshacer);
$("#borrar").addEventListener("click", vaciar);
$("#pista").addEventListener("click", revelarPista);
$("#nuevo").addEventListener("click", arrancar);

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
