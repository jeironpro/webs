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
const elBarra = $("#barra-progreso");
const elRelleno = $("#barra-relleno");
const elRecords = $("#records");
const elBiblioteca = $("#biblioteca");
const elDetalleTamano = $("#detalle-tamano");
const elTamanoActual = $("#tamano-actual");
const elGuardado = $("#guardado");
const elGuardadoTexto = $("#guardado-texto");
const elModal = $("#modal");
const elModalTiempo = $("#modal-tiempo");
const elModalMovimientos = $("#modal-movimientos");
const elModalRecord = $("#modal-record");
const botonesTamano = [...document.querySelectorAll(".chip[data-n]")];

const PISTA = "Empieza en el 1 y arrastra sin soltar.";
const SVG = "http://www.w3.org/2000/svg";
const CLAVE_PROGRESO = "zip:progreso";
const CLAVE_RECORDS = "zip:records";
const TAMANOS = [6, 7, 8];

const estado = {
    n: 6,
    tablero: null,
    camino: [],
    movimientos: 0,
    arrastrando: false,
    arranque: 0,
    transcurrido: 0,
    intervalo: null,
    resuelto: false,
    aviso: null,
    guardado: null,
};

let biblioteca = [];
let muros = new Set();

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
    elRecords.replaceChildren(
        ...TAMANOS.map((n) => {
            const registro = records[n] || {};
            const fila = document.createElement("li");
            fila.className = "record";
            fila.dataset.actual = String(n === estado.n);
            const tamano = document.createElement("span");
            tamano.className = "record__tamano";
            tamano.textContent = `${n}×${n}`;
            const mejor = document.createElement("span");
            mejor.className = "record__mejor";
            mejor.textContent = registro.mejor ? formatearTiempo(registro.mejor) : "—";
            const resueltos = document.createElement("span");
            resueltos.className = "record__resueltos";
            resueltos.textContent = registro.resueltos ? `${registro.resueltos} resueltos` : "";
            fila.append(tamano, mejor, resueltos);
            return fila;
        })
    );
}

function pintarMejor() {
    const registro = leerRecords()[estado.n] || {};
    elMejor.textContent = registro.mejor ? formatearTiempo(registro.mejor) : "—";
}

function guardarRecord(ms) {
    const records = leerRecords();
    const registro = records[estado.n] || { mejor: 0, resueltos: 0 };
    records[estado.n] = {
        mejor: !registro.mejor || ms < registro.mejor ? ms : registro.mejor,
        resueltos: (registro.resueltos || 0) + 1,
    };
    escribir(CLAVE_RECORDS, records);
    pintarRecords();
    pintarMejor();
    return records[estado.n].mejor;
}

/* Progreso ------------------------------------------------------------ */

function guardarProgreso() {
    if (!estado.tablero || estado.resuelto) return;
    const ms = estado.arranque ? Date.now() - estado.arranque : estado.transcurrido;
    const guardado = escribir(CLAVE_PROGRESO, {
        id: estado.tablero.id,
        n: estado.n,
        camino: estado.camino,
        movimientos: estado.movimientos,
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

function prefijoValido(tablero, camino) {
    const { n, numeros, muros: listaMuros } = tablero;
    const bloqueado = new Set(listaMuros.map(([a, b]) => claveMuro(a, b)));
    const inicio = numeros.find(({ orden }) => orden === 0);
    if (!inicio || camino[0] !== inicio.i) return false;

    const vistos = new Set();
    let numerosVistos = 0;
    for (let k = 0; k < camino.length; k++) {
        const i = camino[k];
        if (!Number.isInteger(i) || i < 0 || i >= n * n || vistos.has(i)) return false;
        vistos.add(i);
        if (k > 0) {
            const previo = camino[k - 1];
            if (!vecinos(previo, n).includes(i)) return false;
            if (bloqueado.has(claveMuro(previo, i))) return false;
        }
        const orden = numeros.find((numero) => numero.i === i)?.orden;
        if (orden !== undefined) {
            if (orden !== numerosVistos) return false;
            numerosVistos += 1;
        }
    }
    return true;
}

function restaurarProgreso() {
    const datos = leer(CLAVE_PROGRESO);
    if (!datos || typeof datos.id !== "string" || !Array.isArray(datos.camino)) return false;
    if (datos.camino.length === 0) return false;

    const tablero = biblioteca.find((candidato) => candidato.id === datos.id);
    if (!tablero || !prefijoValido(tablero, datos.camino)) return false;

    estado.n = tablero.n;
    estado.tablero = tablero;
    estado.camino = datos.camino.slice();
    estado.movimientos = Number(datos.movimientos) || 0;
    estado.resuelto = false;
    estado.arrastrando = false;
    marcarTamano();
    construirTablero();
    pintarCamino();
    pintarMejor();
    pintarRecords();

    const ms = Number(datos.ms) || 0;
    if (ms > 0) iniciarReloj(ms);
    else reiniciarReloj();
    elModal.hidden = true;
    avisar(`Partida restaurada (${estado.camino.length} casillas). Sigue donde lo dejaste.`, 5000);
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
    if (estado.arranque) estado.transcurrido = Date.now() - estado.arranque;
}

function reiniciarReloj() {
    pararReloj();
    estado.arranque = 0;
    estado.transcurrido = 0;
    elTiempo.textContent = "0:00";
}

/* Tablero ------------------------------------------------------------- */

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
    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < n * n; i++) {
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
            if (orden + 1 >= 10) insignia.classList.add("celda__numero--compacto");
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
    const total = n * n;
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

    elProgreso.textContent = `${camino.length}/${total}`;
    elMovimientos.textContent = String(estado.movimientos);
    elRelleno.style.width = `${Math.round((camino.length / total) * 100)}%`;
    elBarra.setAttribute("aria-valuemax", String(total));
    elBarra.setAttribute("aria-valuenow", String(camino.length));
}

/* Partida ------------------------------------------------------------- */

function ganar() {
    estado.resuelto = true;
    estado.arrastrando = false;
    const ms = estado.arranque ? Date.now() - estado.arranque : 0;
    pararReloj();
    const record = guardarRecord(ms);
    borrarProgreso();
    elEstado.textContent = "Camino completo, en orden y sin cruzar muros.";
    elModalTiempo.textContent = formatearTiempo(ms);
    elModalMovimientos.textContent = String(estado.movimientos);
    elModalRecord.textContent = formatearTiempo(record);
    elModal.hidden = false;
    elModal.querySelector('[data-accion="otro"]')?.focus();
}

function moverA(i) {
    if (estado.resuelto || !estado.tablero) return false;
    const { n } = estado.tablero;
    const total = n * n;

    if (estado.camino.length === 0) {
        if (numeroEn(i) !== 0) {
            avisar("El camino empieza en el 1.");
            return false;
        }
        estado.camino = [i];
        iniciarReloj();
        pintarCamino();
        guardarProgreso();
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
            guardarProgreso();
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
    guardarProgreso();

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
    guardarProgreso();
    avisar(PISTA, 0);
}

function borrar() {
    if (estado.resuelto) return;
    estado.camino = [];
    estado.movimientos = 0;
    reiniciarReloj();
    pintarCamino();
    borrarProgreso();
    avisar(PISTA, 0);
}

function marcarTamano() {
    elTamanoActual.textContent = `${estado.n}×${estado.n}`;
    elDetalleTamano.textContent = `${estado.n}×${estado.n}`;
    botonesTamano.forEach((boton) =>
        boton.setAttribute("aria-pressed", String(Number(boton.dataset.n) === estado.n))
    );
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
    borrarProgreso();
    elModal.hidden = true;
    marcarTamano();
    construirTablero();
    pintarCamino();
    pintarMejor();
    pintarRecords();
    avisar(PISTA, 0);
}

/* Eventos ------------------------------------------------------------- */

elTablero.addEventListener("pointerdown", (evento) => {
    if (evento.button !== undefined && evento.button !== 0) return;
    const celda = evento.target.closest?.(".celda");
    if (!celda || estado.resuelto) return;
    evento.preventDefault();
    elTablero.focus({ preventScroll: true });
    estado.arrastrando = true;
    try {
        elTablero.setPointerCapture(evento.pointerId);
    } catch {
        /* puntero sintético o ya liberado */
    }
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

/* Arranque ------------------------------------------------------------ */

async function iniciar() {
    try {
        const respuesta = await fetch("json/tableros.json");
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        biblioteca = Array.isArray(datos.tableros) ? datos.tableros : [];
        if (biblioteca.length === 0) throw new Error("sin tableros");

        const reparto = TAMANOS.map(
            (n) => `${n}×${n}: ${biblioteca.filter((t) => t.n === n).length}`
        ).join(" · ");
        elBiblioteca.textContent = `${biblioteca.length} tableros · ${reparto}`;

        if (!restaurarProgreso()) {
            arrancar(6);
        } else {
            pintarRecords();
        }
    } catch (error) {
        console.error("Zip:", error);
        elEstado.textContent = "No se pudieron cargar los tableros. Recarga la página.";
        elBiblioteca.textContent = "Error al cargar la biblioteca";
        elTablero.setAttribute("aria-label", "No se pudieron cargar los tableros");
    }
}

iniciar();
