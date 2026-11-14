const TAMANO = 12;
const PALABRAS_POR_PARTIDA = 10;
const DIRECCIONES = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [0, -1],
    [-1, 0],
];

const elementos = {
    tablero: document.querySelector("#tablero"),
    palabras: document.querySelector("#contenedor-palabras"),
    estado: document.querySelector("#estado"),
    seleccion: document.querySelector("#seleccion"),
    progreso: document.querySelector("#progreso"),
    progresoTexto: document.querySelector("#progreso-texto"),
    barra: document.querySelector("#barra"),
    tiempo: document.querySelector("#tiempo"),
    contador: document.querySelector("#contador"),
    totalPalabras: document.querySelector("#total-palabras"),
    btnNueva: document.querySelector("#btn-nueva"),
    modal: document.querySelector("#modal-victoria"),
    modalTiempo: document.querySelector("#modal-tiempo"),
    modalPalabras: document.querySelector("#modal-palabras"),
    btnJugarOtra: document.querySelector("#btn-jugar-otra"),
};

let todasLasPalabras = [];
let palabras = [];
let encontradas = new Set();
let seleccionadas = [];
let inicioSeleccion = null;
let seleccionando = false;
let tablero = [];
let segundos = 0;
let intervalo = null;
let bloqueado = false;

function mezclar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function normalizar(palabra) {
    return palabra.trim().toUpperCase();
}

function elegirPalabras() {
    const validas = [...new Set(todasLasPalabras.map(normalizar))].filter(
        (palabra) => palabra.length >= 3 && palabra.length <= TAMANO
    );
    const seleccion = mezclar(validas).slice(0, PALABRAS_POR_PARTIDA);
    return seleccion.sort((a, b) => b.length - a.length);
}

function colocarPalabra(palabra) {
    const opciones = [];

    for (const [pasoFila, pasoColumna] of DIRECCIONES) {
        for (let fila = 0; fila < TAMANO; fila += 1) {
            for (let columna = 0; columna < TAMANO; columna += 1) {
                const celdas = [];
                let encaja = true;

                for (let i = 0; i < palabra.length; i += 1) {
                    const nuevaFila = fila + pasoFila * i;
                    const nuevaColumna = columna + pasoColumna * i;

                    if (
                        nuevaFila < 0 ||
                        nuevaFila >= TAMANO ||
                        nuevaColumna < 0 ||
                        nuevaColumna >= TAMANO
                    ) {
                        encaja = false;
                        break;
                    }

                    const actual = tablero[nuevaFila][nuevaColumna];
                    if (actual && actual !== palabra[i]) {
                        encaja = false;
                        break;
                    }

                    celdas.push({ fila: nuevaFila, columna: nuevaColumna });
                }

                if (encaja) {
                    opciones.push(celdas);
                }
            }
        }
    }

    if (opciones.length === 0) {
        return null;
    }

    const elegida = opciones[Math.floor(Math.random() * opciones.length)];
    elegida.forEach(({ fila, columna }, indice) => {
        tablero[fila][columna] = palabra[indice];
    });

    return elegida;
}

function construirPartida() {
    for (let intento = 0; intento < 25; intento += 1) {
        const candidatas = elegirPalabras();
        tablero = Array.from({ length: TAMANO }, () => Array(TAMANO).fill(""));
        const colocadas = [];

        for (const palabra of candidatas) {
            const celdas = colocarPalabra(palabra);
            if (celdas) {
                colocadas.push({ palabra, celdas });
            }
        }

        if (colocadas.length === candidatas.length) {
            return colocadas;
        }
    }

    return [];
}

function rellenarTablero() {
    const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

    for (let fila = 0; fila < TAMANO; fila += 1) {
        for (let columna = 0; columna < TAMANO; columna += 1) {
            if (!tablero[fila][columna]) {
                tablero[fila][columna] = letras[Math.floor(Math.random() * letras.length)];
            }
        }
    }
}

function crearCelda(fila, columna) {
    const celda = document.createElement("button");
    celda.type = "button";
    celda.className = "celda";
    celda.dataset.fila = String(fila);
    celda.dataset.columna = String(columna);
    celda.textContent = tablero[fila][columna];
    celda.setAttribute(
        "aria-label",
        `Letra ${tablero[fila][columna]}, fila ${fila + 1}, columna ${columna + 1}`
    );
    return celda;
}

function renderizarTablero() {
    elementos.tablero.textContent = "";

    for (let fila = 0; fila < TAMANO; fila += 1) {
        for (let columna = 0; columna < TAMANO; columna += 1) {
            elementos.tablero.appendChild(crearCelda(fila, columna));
        }
    }
}

function renderizarPalabras() {
    elementos.palabras.textContent = "";

    for (const { palabra } of palabras) {
        const chip = document.createElement("span");
        chip.className = "palabra-chip";
        chip.dataset.palabra = palabra;
        chip.textContent = palabra;
        if (encontradas.has(palabra)) {
            chip.classList.add("palabra-chip--encontrada");
        }
        elementos.palabras.appendChild(chip);
    }

    elementos.contador.textContent = String(palabras.length);
    actualizarProgreso();
}

function obtenerCelda(fila, columna) {
    return elementos.tablero.querySelector(
        `.celda[data-fila="${fila}"][data-columna="${columna}"]`
    );
}

function limpiarSeleccion() {
    seleccionadas.forEach((celda) => celda.classList.remove("celda--seleccionada"));
    seleccionadas = [];
    elementos.seleccion.textContent = "";
}

function calcularRuta(objetivo) {
    const filaInicio = Number(inicioSeleccion.fila);
    const columnaInicio = Number(inicioSeleccion.columna);
    const filaObjetivo = Number(objetivo.dataset.fila);
    const columnaObjetivo = Number(objetivo.dataset.columna);
    const deltaFila = filaObjetivo - filaInicio;
    const deltaColumna = columnaObjetivo - columnaInicio;
    const celdas = [];

    if (deltaFila === 0 && deltaColumna === 0) {
        return [objetivo];
    }

    let pasoFila = 0;
    let pasoColumna = 0;

    if (Math.abs(deltaFila) === Math.abs(deltaColumna)) {
        pasoFila = Math.sign(deltaFila);
        pasoColumna = Math.sign(deltaColumna);
    } else if (Math.abs(deltaColumna) > Math.abs(deltaFila)) {
        pasoColumna = Math.sign(deltaColumna);
    } else {
        pasoFila = Math.sign(deltaFila);
    }

    const longitud = Math.max(Math.abs(deltaFila), Math.abs(deltaColumna));

    for (let i = 0; i <= longitud; i += 1) {
        const celda = obtenerCelda(filaInicio + pasoFila * i, columnaInicio + pasoColumna * i);
        if (!celda) break;
        celdas.push(celda);
    }

    return celdas;
}

function iniciarSeleccion(celda) {
    if (bloqueado) return;
    limpiarSeleccion();
    seleccionando = true;
    inicioSeleccion = {
        fila: celda.dataset.fila,
        columna: celda.dataset.columna,
    };
    seleccionadas = [celda];
    celda.classList.add("celda--seleccionada");
    elementos.seleccion.textContent = celda.textContent;
}

function continuarSeleccion(celda) {
    if (!seleccionando || !celda) return;

    const ruta = calcularRuta(celda);
    limpiarSeleccion();
    seleccionadas = ruta;
    seleccionadas.forEach((item) => item.classList.add("celda--seleccionada"));
    elementos.seleccion.textContent = seleccionadas.map((item) => item.textContent).join("");
}

function finalizarSeleccion() {
    if (!seleccionando) return;
    seleccionando = false;

    const texto = seleccionadas.map((celda) => celda.textContent).join("");
    const invertida = [...texto].reverse().join("");
    const encontrada = palabras.find(({ palabra }) => palabra === texto || palabra === invertida);

    if (encontrada && !encontradas.has(encontrada.palabra)) {
        marcarEncontrada(encontrada);
        anunciar(`¡${encontrada.palabra.toLowerCase()} encontrada!`);
    } else if (texto.length > 1) {
        anunciar("Esa palabra no está en esta sopa. Prueba otra ruta.");
    }

    limpiarSeleccion();
}

function marcarEncontrada({ palabra, celdas }) {
    encontradas.add(palabra);
    celdas.forEach(({ fila, columna }) => {
        obtenerCelda(fila, columna)?.classList.add("celda--encontrada");
    });

    const chip = elementos.palabras.querySelector(`[data-palabra="${palabra}"]`);
    chip?.classList.add("palabra-chip--encontrada");
    actualizarProgreso();

    if (encontradas.size === palabras.length) {
        bloqueado = true;
        window.clearInterval(intervalo);
        window.setTimeout(mostrarVictoria, 500);
    }
}

function actualizarProgreso() {
    const total = palabras.length || PALABRAS_POR_PARTIDA;
    const porcentaje = Math.round((encontradas.size / total) * 100);
    elementos.progresoTexto.textContent = `${encontradas.size} / ${total}`;
    elementos.progreso.textContent = `${porcentaje}% completado`;
    elementos.barra.style.width = `${porcentaje}%`;
}

function anunciar(texto) {
    elementos.estado.textContent = texto;
}

function formatearTiempo(total) {
    const minutos = Math.floor(total / 60);
    const resto = total % 60;
    return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function iniciarReloj() {
    window.clearInterval(intervalo);
    segundos = 0;
    elementos.tiempo.textContent = "00:00";
    intervalo = window.setInterval(() => {
        segundos += 1;
        elementos.tiempo.textContent = formatearTiempo(segundos);
    }, 1000);
}

function mostrarVictoria() {
    elementos.modalTiempo.textContent = formatearTiempo(segundos);
    elementos.modalPalabras.textContent = String(palabras.length);
    elementos.modal.hidden = false;
    elementos.btnJugarOtra.focus({ preventScroll: true });
}

function nuevaPartida() {
    const colocadas = construirPartida();

    if (colocadas.length === 0) {
        anunciar("No se pudo preparar la sopa. Vuelve a intentarlo.");
        return;
    }

    palabras = colocadas.sort((a, b) => b.palabra.length - a.palabra.length);
    encontradas = new Set();
    bloqueado = false;
    elementos.modal.hidden = true;
    rellenarTablero();
    renderizarTablero();
    renderizarPalabras();
    iniciarReloj();
    anunciar("Arrastra sobre las letras para encontrar una palabra.");
    elementos.seleccion.textContent = "";
}

async function cargarPalabras() {
    try {
        const respuesta = await fetch("data/sopas_letras.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar el diccionario.");
        const datos = await respuesta.json();
        todasLasPalabras = datos.palabras ?? [];
        elementos.totalPalabras.textContent = `${todasLasPalabras.length.toLocaleString("es-ES")} palabras`;
        nuevaPartida();
    } catch {
        anunciar("No se pudo cargar la sopa de letras. Recarga la página.");
    }
}

function celdaDesdeEvento(evento) {
    const elemento = document.elementFromPoint(evento.clientX, evento.clientY);
    return elemento?.closest(".celda") ?? null;
}

elementos.tablero.addEventListener("pointerdown", (evento) => {
    const celda = evento.target.closest(".celda");
    if (!celda) return;
    evento.preventDefault();
    iniciarSeleccion(celda);
});

document.addEventListener("pointermove", (evento) => {
    if (!seleccionando) return;
    const celda = celdaDesdeEvento(evento);
    if (celda) continuarSeleccion(celda);
});

document.addEventListener("pointerup", finalizarSeleccion);
document.addEventListener("pointercancel", finalizarSeleccion);

elementos.btnNueva.addEventListener("click", nuevaPartida);
elementos.btnJugarOtra.addEventListener("click", nuevaPartida);

cargarPalabras();
