const scriptActual = document.currentScript;
const BASE = new URL(".", scriptActual ? scriptActual.src : document.baseURI);
const BASE_PATH = BASE.pathname;

const CATALOGO = [
    { id: "javascript", nombre: "JavaScript", color: "accent" },
    { id: "typescript", nombre: "TypeScript", color: "accent-2" },
    { id: "python", nombre: "Python", color: "accent-3" },
    { id: "html", nombre: "HTML", color: "lavender" },
    { id: "css", nombre: "CSS", color: "mint" },
    { id: "sql", nombre: "SQL", color: "accent-2" },
    { id: "java", nombre: "Java", color: "accent-3" },
    { id: "go", nombre: "Go", color: "mint" },
    { id: "rust", nombre: "Rust", color: "accent-3" },
    { id: "php", nombre: "PHP", color: "lavender" },
    { id: "csharp", nombre: "C#", color: "accent-2" },
    { id: "cpp", nombre: "C++", color: "accent-3" },
];

const DIFICULTADES = {
    facil: { label: "Fácil", puntos: 1 },
    media: { label: "Media", puntos: 2 },
    dificil: { label: "Difícil", puntos: 3 },
};

const TIPOS = {
    output: "¿Qué imprime?",
    sintaxis: "Sintaxis",
    bug: "Bug",
    concepto: "Concepto",
};

const OPCIONES = ["A", "B", "C", "D"];
const TIEMPO_PREGUNTA = 30;
const CLAVE_SCORE = "codelang-quiz:score";
const CLAVE_HISTORIAL = "codelang-quiz:historial";

const RATIOS = {
    "4-5": { w: 1080, h: 1350 },
    "1-1": { w: 1080, h: 1080 },
    "9-16": { w: 1080, h: 1920 },
    "1-91": { w: 1200, h: 628 },
};

const PALETTE = {
    javascript: "accent",
    typescript: "accent-2",
    python: "accent-3",
    html: "lavender",
    css: "mint",
    sql: "accent-2",
    java: "accent-3",
    go: "mint",
    rust: "accent-3",
    php: "lavender",
    csharp: "accent-2",
    cpp: "accent-3",
};

const TIPO_CAPTURA = {
    output: "Que imprime?",
    sintaxis: "Sintaxis",
    bug: "Bug",
    concepto: "Concepto",
};

const DIFICULTAD_CAPTURA = {
    facil: "Facil",
    media: "Media",
    dificil: "Dificil",
};

const elementos = {
    app: document.getElementById("app"),
    cuerpo: document.getElementById("cuerpo"),
    captura: document.getElementById("captura"),
    modal: document.getElementById("modal-root"),
    navToggle: document.getElementById("nav-toggle"),
    navLinks: document.getElementById("nav-enlaces"),
    menuInfo: document.getElementById("menu-info"),
    navInfo: document.getElementById("nav-info"),
};

let datasetPromise = null;
let filtrosHome = { lenguaje: "", dificultad: "", tipo: "" };
let filtrosResultados = {};
let cargando = false;
let errorHome = "";
let quiz = null;
let temporizador = null;
let tokenInicio = 0;
let score = leerNumero(CLAVE_SCORE, 0);
let historial = leerHistorial();
let modalEstado = null;

function escapar(valor) {
    return String(valor ?? "").replace(
        /[&<>"']/g,
        (caracter) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[caracter],
    );
}

function leerNumero(clave, inicial) {
    try {
        const guardado = window.localStorage.getItem(clave);
        return guardado === null ? inicial : JSON.parse(guardado);
    } catch {
        return inicial;
    }
}

function leerHistorial() {
    try {
        const guardado = JSON.parse(window.localStorage.getItem(CLAVE_HISTORIAL));
        return Array.isArray(guardado) ? guardado : [];
    } catch {
        return [];
    }
}

function guardarLocal(clave, valor) {
    try {
        window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
        /* sin persistencia disponible */
    }
}

function barajar(arreglo) {
    const copia = [...arreglo];
    for (let i = copia.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function prepararPregunta(pregunta) {
    const textos = barajar(OPCIONES.map((letra) => pregunta.opciones[letra]));
    const opciones = {};
    OPCIONES.forEach((letra, indice) => {
        opciones[letra] = textos[indice];
    });
    const respuesta = OPCIONES.find(
        (letra) => opciones[letra] === pregunta.opciones[pregunta.respuesta],
    );
    return { ...pregunta, opciones, respuesta, orden: OPCIONES };
}

function puntosDe(dificultad) {
    return DIFICULTADES[dificultad]?.puntos || 0;
}

function aplicarRespuesta(total, dificultad, esCorrecta) {
    const delta = puntosDe(dificultad);
    return total + (esCorrecta ? delta : -delta);
}

function scoreDe(respuestas) {
    return respuestas.reduce(
        (total, item) => aplicarRespuesta(total, item.dificultad, item.esCorrecta),
        0,
    );
}

function pluralPuntos(valor) {
    return `${valor} pt${Math.abs(valor) === 1 ? "" : "s"}`;
}

function nombreLenguaje(id) {
    return CATALOGO.find((lenguaje) => lenguaje.id === id)?.nombre;
}

function registrarPartida({ aciertos, fallos, puntos, total, lenguaje, dificultad }) {
    const partida = {
        fecha: new Date().toISOString(),
        aciertos,
        fallos,
        puntos,
        total,
        lenguaje,
        dificultad,
    };
    historial = [partida, ...historial].slice(0, 20);
    score += puntos;
    guardarLocal(CLAVE_HISTORIAL, historial);
    guardarLocal(CLAVE_SCORE, score);
}

async function cargarTodasLasPreguntas() {
    if (!datasetPromise) {
        datasetPromise = Promise.allSettled(
            CATALOGO.map(async (lenguaje) => {
                const respuesta = await fetch(new URL(`public/data/${lenguaje.id}.json`, BASE));
                if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
                return { lenguaje: lenguaje.id, preguntas: await respuesta.json() };
            }),
        ).then((resultados) =>
            resultados
                .filter((resultado) => resultado.status === "fulfilled")
                .map((resultado) => resultado.value),
        );
    }
    return datasetPromise;
}

function filtrarPreguntas(dataset, filtros) {
    return dataset.preguntas.filter((pregunta) => {
        if (filtros.dificultad && pregunta.dificultad !== filtros.dificultad) return false;
        if (filtros.tipo && pregunta.tipo !== filtros.tipo) return false;
        if (filtros.lenguaje && dataset.lenguaje !== filtros.lenguaje) return false;
        return true;
    });
}

function pararTemporizador() {
    if (temporizador !== null) {
        window.clearInterval(temporizador);
        temporizador = null;
    }
}

function cerrarMenu() {
    elementos.navLinks.classList.remove("is-open");
    elementos.navToggle.setAttribute("aria-expanded", "false");
    elementos.navToggle.setAttribute("aria-label", "Abrir menú");
}

function actualizarNav(vista) {
    document.querySelectorAll("[data-ruta]").forEach((enlace) => {
        const activo = enlace.dataset.ruta === vista;
        enlace.classList.toggle("is-active", activo);
        if (activo) enlace.setAttribute("aria-current", "page");
        else enlace.removeAttribute("aria-current");
    });
}

function configurarEnlaces() {
    document.querySelectorAll("[data-ruta]").forEach((enlace) => {
        const ruta = enlace.dataset.ruta;
        enlace.href = ruta === "inicio" ? BASE_PATH : new URL(ruta, BASE).pathname;
        enlace.addEventListener("click", (evento) => {
            evento.preventDefault();
            cerrarMenu();
            navegar(ruta === "inicio" ? "" : ruta);
        });
    });
    elementos.navToggle.addEventListener("click", () => {
        const abierto = elementos.navLinks.classList.toggle("is-open");
        elementos.navToggle.setAttribute("aria-expanded", String(abierto));
        elementos.navToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    elementos.menuInfo.addEventListener("click", abrirInfo);
    elementos.navInfo.addEventListener("click", abrirInfo);
}

function abrirInfo() {
    cerrarMenu();
    abrirModal({
        titulo: "Tus datos se guardan en este navegador",
        contenido: `<p>Tu progreso se almacena con <strong>localStorage</strong> en este navegador: el score acumulado y el historial de las últimas 20 partidas.</p>
            <p>Los datos viven solo en tu dispositivo: no se envían a ningún servidor. Puedes borrarlos cuando quieras desde la configuración de tu navegador (opción «limpiar datos» o «borrar el almacenamiento local»).</p>`,
        acciones: [{ texto: "Entendido", onClick: cerrarModal }],
    });
}

function abrirModal({ titulo, contenido, acciones = [] }) {
    cerrarModal();
    const anterior = document.activeElement;
    elementos.modal.classList.remove("oculto");
    elementos.modal.innerHTML = `<div class="modal__overlay" data-modal-overlay>
        <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" tabindex="-1">
            <h2 id="modal-titulo" class="modal__titulo">${escapar(titulo)}</h2>
            <div class="modal__texto">${contenido}</div>
            <div class="modal__acciones"></div>
        </div>
    </div>`;

    const overlay = elementos.modal.querySelector("[data-modal-overlay]");
    const dialogo = elementos.modal.querySelector(".modal__dialog");
    const contenedorAcciones = elementos.modal.querySelector(".modal__acciones");
    const cerrar = () => cerrarModal();

    if (acciones.length === 0) acciones = [{ texto: "Entendido", onClick: cerrar }];
    acciones.forEach((accion) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = accion.clase || "btn";
        boton.textContent = accion.texto;
        boton.addEventListener("click", accion.onClick);
        contenedorAcciones.appendChild(boton);
    });

    overlay.addEventListener("click", cerrar);
    dialogo.addEventListener("click", (evento) => evento.stopPropagation());
    document.body.style.overflow = "hidden";
    elementos.modal.querySelectorAll(".nav__info, .nav__menu-info").forEach((boton) => {
        boton.setAttribute("aria-expanded", "true");
    });

    const onKeyDown = (evento) => {
        if (evento.key === "Escape") {
            cerrar();
            return;
        }
        if (evento.key !== "Tab") return;
        const focoables = dialogo.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focoables.length === 0) return;
        const primero = focoables[0];
        const ultimo = focoables[focoables.length - 1];
        if (evento.shiftKey && document.activeElement === primero) {
            evento.preventDefault();
            ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
            evento.preventDefault();
            primero.focus();
        }
    };

    document.addEventListener("keydown", onKeyDown);
    modalEstado = { anterior, onKeyDown };
    dialogo.focus();
}

function cerrarModal() {
    if (!modalEstado) {
        elementos.modal.classList.add("oculto");
        elementos.modal.innerHTML = "";
        return;
    }
    document.removeEventListener("keydown", modalEstado.onKeyDown);
    document.body.style.overflow = "";
    elementos.modal.classList.add("oculto");
    elementos.modal.innerHTML = "";
    elementos.menuInfo.setAttribute("aria-expanded", "false");
    elementos.navInfo.setAttribute("aria-expanded", "false");
    const anterior = modalEstado.anterior;
    modalEstado = null;
    if (anterior && typeof anterior.focus === "function") anterior.focus();
}

function navegar(ruta) {
    const destino = ruta ? new URL(ruta, BASE) : BASE;
    window.history.pushState(null, "", destino.pathname);
    enrutar();
}

function rutaActual() {
    const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
    let ruta = decodeURIComponent(window.location.pathname);
    if (ruta === base.replace(/\/$/, "")) ruta = "";
    else if (ruta.startsWith(base)) ruta = ruta.slice(base.length);
    ruta = ruta.replace(/^\/+|\/+$/g, "");

    if (ruta === "" || ruta === "index.html") return { vista: "inicio" };
    if (ruta === "quiz") return { vista: "quiz" };
    if (ruta === "resultados") return { vista: "resultados" };

    const captura = ruta.match(/^captura\/([^/]+)\/([^/]+)\/([^/]+)$/);
    if (captura) {
        return {
            vista: "captura",
            lenguaje: decodeURIComponent(captura[1]),
            id: decodeURIComponent(captura[2]),
            ratio: decodeURIComponent(captura[3]),
        };
    }

    const consulta = window.location.search.match(/^\?\/([^&]+)/);
    if (consulta) {
        const subruta = decodeURIComponent(consulta[1]).replace(/\/+$/, "");
        if (subruta === "quiz" || subruta === "resultados") {
            window.history.replaceState(null, "", `${base}${subruta}`);
            return { vista: subruta };
        }
        const capturaQuery = subruta.match(/^captura\/([^/]+)\/([^/]+)\/([^/]+)$/);
        if (capturaQuery) {
            window.history.replaceState(null, "", `${base}${subruta}`);
            return {
                vista: "captura",
                lenguaje: decodeURIComponent(capturaQuery[1]),
                id: decodeURIComponent(capturaQuery[2]),
                ratio: decodeURIComponent(capturaQuery[3]),
            };
        }
    }

    return { vista: "404" };
}

function enrutar() {
    tokenInicio += 1;
    pararTemporizador();
    cerrarMenu();
    const ruta = rutaActual();

    if (ruta.vista === "captura") {
        mostrarCaptura(ruta);
        return;
    }

    elementos.app.classList.remove("oculto");
    elementos.captura.classList.add("oculto");
    actualizarNav(ruta.vista === "inicio" ? "inicio" : ruta.vista === "resultados" ? "resultados" : "");

    if (ruta.vista === "inicio") mostrarInicio();
    else if (ruta.vista === "quiz") mostrarQuiz();
    else if (ruta.vista === "resultados") mostrarResultados();
    else mostrar404();
}

function mostrarInicio() {
    document.title = "Codelang Quiz";
    filtrosResultados = {};
    errorHome = "";
    filtrosHome = { lenguaje: "", dificultad: "", tipo: "" };
    renderHome();
}

function renderHome() {
    const chipLenguaje = CATALOGO.map((lenguaje) => {
        const activo = filtrosHome.lenguaje === lenguaje.id;
        return `<button type="button" class="chip chip--${lenguaje.color}${activo ? " is-active" : ""}" data-filtro="lenguaje" data-valor="${lenguaje.id}">${lenguaje.nombre}</button>`;
    }).join("");
    const chipDificultad = Object.entries(DIFICULTADES)
        .map(([clave, dato]) => {
            const activo = filtrosHome.dificultad === clave;
            return `<button type="button" class="chip${activo ? " is-active" : ""}" data-filtro="dificultad" data-valor="${clave}">${dato.label} · ${dato.puntos} pt</button>`;
        })
        .join("");
    const chipTipo = Object.entries(TIPOS)
        .map(([clave, label]) => {
            const activo = filtrosHome.tipo === clave;
            return `<button type="button" class="chip${activo ? " is-active" : ""}" data-filtro="tipo" data-valor="${clave}">${label}</button>`;
        })
        .join("");

    elementos.cuerpo.innerHTML = `<div class="home">
        <section class="section home__hero">
            <p class="eyebrow mono-label">Practica con código real</p>
            <h1 class="hero-title">Pon a prueba lo que <em>sabes</em> de código.</h1>
            <p class="home__lead">Elige tu lenguaje y nivel. Resuelve problemáticas de código con opciones de respuesta y gana puntos según la dificultad.</p>
        </section>
        <section class="section home__config" aria-label="Configuración de la partida">
            <fieldset class="filtro"><legend class="mono-label">Lenguaje</legend>
                <div class="filtro__chips">
                    <button type="button" class="chip${!filtrosHome.lenguaje ? " is-active" : ""}" data-filtro="lenguaje" data-valor="">Todos</button>
                    ${chipLenguaje}
                </div>
            </fieldset>
            <fieldset class="filtro"><legend class="mono-label">Dificultad</legend>
                <div class="filtro__chips">
                    <button type="button" class="chip${!filtrosHome.dificultad ? " is-active" : ""}" data-filtro="dificultad" data-valor="">Cualquiera</button>
                    ${chipDificultad}
                </div>
            </fieldset>
            <fieldset class="filtro"><legend class="mono-label">Tipo de problema</legend>
                <div class="filtro__chips">
                    <button type="button" class="chip${!filtrosHome.tipo ? " is-active" : ""}" data-filtro="tipo" data-valor="">Cualquiera</button>
                    ${chipTipo}
                </div>
            </fieldset>
            ${errorHome ? `<p class="home__error" role="alert">${escapar(errorHome)}</p>` : ""}
            <button type="button" class="btn btn--lg" id="empezar" ${cargando ? "disabled" : ""}>${cargando ? "Preparando..." : "Empezar partida"}</button>
        </section>
    </div>`;

    elementos.cuerpo.querySelectorAll("[data-filtro]").forEach((boton) => {
        boton.addEventListener("click", () => {
            filtrosHome[boton.dataset.filtro] = boton.dataset.valor;
            errorHome = "";
            renderHome();
        });
    });
    document.getElementById("empezar").addEventListener("click", empezarPartida);
}

async function empezarPartida() {
    if (cargando) return;
    cargando = true;
    errorHome = "";
    const token = ++tokenInicio;
    renderHome();

    try {
        const dataset = await cargarTodasLasPreguntas();
        if (token !== tokenInicio || rutaActual().vista !== "inicio") return;
        if (dataset.length === 0) throw new Error("sin datos");
        const disponibles = dataset.flatMap((dato) =>
            filtrarPreguntas(dato, filtrosHome).map((pregunta) => ({
                ...pregunta,
                lenguaje: dato.lenguaje,
            })),
        );
        if (disponibles.length === 0) {
            cargando = false;
            errorHome = "No hay preguntas que coincidan con esos filtros. Prueba con otros.";
            renderHome();
            return;
        }
        cargando = false;
        filtrosResultados = { ...filtrosHome };
        quiz = {
            preguntas: disponibles.map(prepararPregunta),
            filtros: { ...filtrosHome },
            indice: 0,
            respuestas: [],
            seleccionada: null,
            bloqueada: false,
            tiempoRestante: TIEMPO_PREGUNTA,
            tiempoAgotado: false,
        };
        navegar("quiz");
    } catch {
        if (token !== tokenInicio) return;
        cargando = false;
        errorHome = "No se pudo cargar el catálogo de preguntas.";
        renderHome();
    }
}

function renderQuiz() {
    const anterior = quiz;
    if (!anterior || !anterior.preguntas.length) {
        elementos.cuerpo.innerHTML = `<div class="home"><section class="section">
            <p class="home__error">Aún no has configurado una partida.</p>
            <button type="button" class="btn" id="volver-inicio">Volver al inicio</button>
        </section></div>`;
        document.getElementById("volver-inicio").addEventListener("click", () => navegar(""));
        return;
    }

    const pregunta = anterior.preguntas[anterior.indice];
    if (!pregunta) {
        elementos.cuerpo.innerHTML = '<div class="section mono-label">Partida terminada.</div>';
        return;
    }

    const score = scoreDe(anterior.respuestas);
    const actualLenguaje = nombreLenguaje(pregunta.lenguaje);
    const tiempoUrgente = anterior.tiempoRestante <= 5;

    const opciones = pregunta.orden
        .map((letra) => {
            const esCorrecta = letra === pregunta.respuesta;
            let clase = "opcion";
            if (anterior.seleccionada === letra) clase += " is-selected";
            if (anterior.bloqueada && esCorrecta) clase += " is-correct";
            if (anterior.bloqueada && anterior.seleccionada === letra && !esCorrecta) {
                clase += " is-wrong";
            }
            return `<button type="button" data-letra="${letra}" class="${clase}" ${anterior.bloqueada ? "disabled" : ""}>
                <span class="opcion__letra mono-label">${letra}</span>
                <span class="opcion__texto">${escapar(pregunta.opciones[letra])}</span>
            </button>`;
        })
        .join("");

    let feedback = "";
    if (anterior.bloqueada) {
        if (anterior.tiempoAgotado) {
            feedback = `<p class="feedback feedback--ko"><strong>Se acabó el tiempo.</strong> La correcta era la opción ${pregunta.respuesta}. ${escapar(pregunta.explicacion)}</p>`;
        } else if (anterior.seleccionada === pregunta.respuesta) {
            const puntos = puntosDe(pregunta.dificultad);
            feedback = `<p class="feedback feedback--ok"><strong>Acertaste. +${puntos} punto${puntos === 1 ? "" : "s"}.</strong> ${escapar(pregunta.explicacion)}</p>`;
        } else {
            feedback = `<p class="feedback feedback--ko"><strong>No acertaste.</strong> La correcta era la opción ${pregunta.respuesta}. ${escapar(pregunta.explicacion)}</p>`;
        }
        feedback += `<button type="button" class="btn btn--coral" id="continuar">${anterior.indice >= anterior.preguntas.length - 1 ? "Ver resultados" : "Siguiente"}</button>`;
    }

    elementos.cuerpo.innerHTML = `<div class="quiz">
        <section class="section quiz__header" aria-label="Progreso">
            <div class="quiz__progreso">
                <span class="mono-label">Pregunta ${anterior.indice + 1} de ${anterior.preguntas.length}</span>
                <span id="tiempo" class="quiz__tiempo${tiempoUrgente ? " is-urgente" : ""}" role="timer" aria-label="Tiempo restante para responder">⏱ ${anterior.tiempoRestante}s</span>
            </div>
            <span class="quiz__score" aria-label="Score de la partida">${pluralPuntos(score)}</span>
        </section>
        <section class="section quiz__body">
            <div class="card quiz__pregunta">
                <span class="mono-label quiz__tag">${actualLenguaje ? `${actualLenguaje} · ` : ""}${pregunta.tipo} · ${pregunta.dificultad}</span>
                <h2 class="quiz__texto">${escapar(pregunta.pregunta)}</h2>
                ${pregunta.codigo ? `<div class="code-card">${anterior.filtros.lenguaje ? `<span class="code-card__lang mono-label">${escapar(anterior.filtros.lenguaje)}</span>` : ""}<pre class="code-card__pre"><code>${escapar(pregunta.codigo)}</code></pre></div>` : ""}
            </div>
            <div class="quiz__opciones" role="group" aria-label="Opciones de respuesta">${opciones}</div>
            <div class="quiz__feedback">
                <button type="button" class="btn btn--mint quiz__detener" id="detener" ${anterior.respuestas.length === 0 ? "disabled" : ""}>Detener partida</button>
            </div>
            ${feedback ? `<div class="quiz__feedback">${feedback}</div>` : ""}
        </section>
    </div>`;

    elementos.cuerpo.querySelectorAll("[data-letra]").forEach((boton) => {
        boton.addEventListener("click", () => responder(boton.dataset.letra));
    });
    document.getElementById("detener").addEventListener("click", abrirConfirmacion);
    const continuar = document.getElementById("continuar");
    if (continuar) continuar.addEventListener("click", continuarPartida);

    if (!anterior.bloqueada) iniciarTemporizador();
    else pararTemporizador();

}

function iniciarTemporizador() {
    pararTemporizador();
    if (!quiz || quiz.bloqueada) return;
    temporizador = window.setInterval(() => {
        if (!quiz || quiz.bloqueada) return;
        quiz.tiempoRestante = Math.max(0, quiz.tiempoRestante - 1);
        const tiempo = document.getElementById("tiempo");
        if (tiempo) {
            tiempo.textContent = `⏱ ${quiz.tiempoRestante}s`;
            tiempo.classList.toggle("is-urgente", quiz.tiempoRestante <= 5);
        }
        if (quiz.tiempoRestante === 0) {
            pararTemporizador();
            quiz.bloqueada = true;
            quiz.tiempoAgotado = true;
            quiz.respuestas.push({
                ...quiz.preguntas[quiz.indice],
                letra: null,
                esCorrecta: false,
            });
            renderQuiz();
        }
    }, 1000);
}

function responder(letra) {
    if (!quiz || quiz.bloqueada) return;
    const pregunta = quiz.preguntas[quiz.indice];
    quiz.seleccionada = letra;
    quiz.respuestas.push({
        ...pregunta,
        letra,
        esCorrecta: letra === pregunta.respuesta,
    });
    quiz.bloqueada = true;
    pararTemporizador();
    renderQuiz();
}

function continuarPartida() {
    if (!quiz) return;
    if (quiz.indice >= quiz.preguntas.length - 1) {
        finalizarPartida();
        return;
    }
    quiz.indice += 1;
    quiz.seleccionada = null;
    quiz.bloqueada = false;
    quiz.tiempoAgotado = false;
    quiz.tiempoRestante = TIEMPO_PREGUNTA;
    renderQuiz();
}

function finalizarPartida() {
    if (!quiz) return;
    const aciertos = quiz.respuestas.filter((respuesta) => respuesta.esCorrecta).length;
    const fallos = quiz.respuestas.length - aciertos;
    registrarPartida({
        aciertos,
        fallos,
        puntos: scoreDe(quiz.respuestas),
        total: quiz.preguntas.length,
        lenguaje: quiz.filtros.lenguaje,
        dificultad: quiz.filtros.dificultad,
    });
    filtrosResultados = quiz.filtros;
    quiz = null;
    navegar("resultados");
}

function abrirConfirmacion() {
    if (!quiz) return;
    const puntos = scoreDe(quiz.respuestas);
    abrirModal({
        titulo: "¿Detener la partida?",
        contenido: `<p>Tu puntuación actual (<strong>${pluralPuntos(puntos)}</strong>) se guardará y no podrás continuar esta partida.</p>`,
        acciones: [
            { texto: "Continuar jugando", clase: "btn", onClick: cerrarModal },
            {
                texto: "Detener y guardar",
                clase: "btn btn--coral",
                onClick: () => {
                    cerrarModal();
                    detenerPartida();
                },
            },
        ],
    });
}

function detenerPartida() {
    if (!quiz) return;
    const aciertos = quiz.respuestas.filter((respuesta) => respuesta.esCorrecta).length;
    const fallos = quiz.respuestas.length - aciertos;
    registrarPartida({
        aciertos,
        fallos,
        puntos: scoreDe(quiz.respuestas),
        total: quiz.respuestas.length,
        lenguaje: quiz.filtros.lenguaje,
        dificultad: quiz.filtros.dificultad,
    });
    filtrosResultados = quiz.filtros;
    quiz = null;
    navegar("resultados");
}

function mostrarQuiz() {
    document.title = "Quiz · Codelang Quiz";
    renderQuiz();
}

function mostrarResultados() {
    document.title = "Resultados · Codelang Quiz";
    const ultima = historial[0];
    const lenguaje = filtrosResultados.lenguaje || "todos los lenguajes";
    const historialHTML =
        historial.length > 0
            ? `<ul class="historial">${historial
                  .map(
                      (partida) => `<li class="historial__item">
                        <span class="mono-label historial__fecha">${escapar(new Date(partida.fecha).toLocaleString())}</span>
                        <span class="historial__resumen">${partida.aciertos}/${partida.total} aciertos</span>
                        <span class="historial__puntos">${partida.puntos} pt</span>
                    </li>`,
                  )
                  .join("")}</ul>`
            : "";

    elementos.cuerpo.innerHTML = `<div class="resultados">
        <section class="section resultados__hero">
            <p class="eyebrow mono-label">Resultados</p>
            <h1 class="hero-title">Tu rendimiento, de un vistazo.</h1>
        </section>
        <section class="section resultados__stats" aria-label="Estadísticas">
            <div class="card card__tint stat stat--pear"><span class="mono-label">Score acumulado</span><strong class="stat__num">${score}</strong></div>
            <div class="card card__tint stat stat--cyan"><span class="mono-label">Partidas</span><strong class="stat__num">${historial.length}</strong></div>
        </section>
        <section class="section" aria-label="Historial de partidas">
            <h2 class="seccion-titulo">Historial</h2>
            ${
                ultima
                    ? `<div class="card resultados__ultima"><p class="mono-label">Última partida · ${escapar(lenguaje)}</p><p class="resultados__resumen">${ultima.aciertos} aciertos · ${ultima.fallos} fallos · ${ultima.puntos} puntos</p></div>`
                    : '<p class="resultados__vacio">Aún no has jugado ninguna partida.</p>'
            }
            ${historialHTML}
            <button type="button" class="btn btn--lg" id="nueva-partida">Nueva partida</button>
        </section>
    </div>`;
    document.getElementById("nueva-partida").addEventListener("click", () => navegar(""));
}

function mostrar404() {
    document.title = "Página no encontrada · Codelang Quiz";
    elementos.cuerpo.innerHTML = `<div class="home"><section class="section">
        <p class="mono-label">404</p>
        <h1 class="hero-title">Esa ruta no existe.</h1>
        <p>La página que buscas no está en esta app.</p>
        <a href="${BASE_PATH}" class="btn btn--mint" id="volver-inicio">Volver al inicio</a>
    </section></div>`;
    document.getElementById("volver-inicio").addEventListener("click", (evento) => {
        evento.preventDefault();
        navegar("");
    });
}

function opcionesCapturaHTML(pregunta, columns) {
    return `<div class="captura__opciones${columns === 2 ? " captura__opciones--cols2" : ""}" role="group" aria-label="Opciones">
        ${OPCIONES.map(
            (letra) => `<div class="opcion"><span class="opcion__letra mono-label">${letra}</span><span class="opcion__texto">${escapar(pregunta.opciones[letra])}</span></div>`,
        ).join("")}
    </div>`;
}

async function mostrarCaptura({ lenguaje, id, ratio }) {
    document.title = "Captura · Codelang Quiz";
    pararTemporizador();
    cerrarMenu();
    const objetivo = RATIOS[ratio] || RATIOS["4-5"];
    elementos.app.classList.add("oculto");
    elementos.captura.classList.remove("oculto");
    elementos.captura.className = "captura captura--loading";
    elementos.captura.style.width = `${objetivo.w}px`;
    elementos.captura.style.height = `${objetivo.h}px`;
    elementos.captura.innerHTML = "";

    try {
        const dataset = await cargarTodasLasPreguntas();
        const dato = dataset.find((item) => item.lenguaje === lenguaje);
        const pregunta = dato?.preguntas.find((item) => item.id === id);
        if (!pregunta) {
            elementos.captura.className = "captura captura--error";
            elementos.captura.innerHTML = '<p class="mono-label">No encontrada</p>';
            return;
        }
        const langMeta = CATALOGO.find((item) => item.id === lenguaje);
        const chipColor = PALETTE[lenguaje] || "accent";
        const columns = ratio === "1-91" ? 2 : 1;
        elementos.captura.className = "captura";
        elementos.captura.dataset.fit = "busy";
        elementos.captura.innerHTML = `<div class="captura__frame"><div class="captura__fill">
            <header class="captura__header">
                <span class="captura__brand mono-label">Codelang · Quiz</span>
                <span class="captura__chip mono-label" style="background:var(--color-${chipColor});color:var(--color-ink)">${escapar(langMeta?.nombre || lenguaje)} · ${TIPO_CAPTURA[pregunta.tipo] || pregunta.tipo} · ${DIFICULTAD_CAPTURA[pregunta.dificultad] || pregunta.dificultad}</span>
            </header>
            <div class="captura__columnas">
                <article class="captura__pregunta">
                    <h2 class="captura__texto">${escapar(pregunta.pregunta)}</h2>
                    ${
                        pregunta.codigo
                            ? `<div class="captura__code code-card"><span class="code-card__lang mono-label">${escapar(lenguaje)}</span><pre class="captura__pre code-card__pre"><code>${escapar(pregunta.codigo)}</code></pre></div>`
                            : ""
                    }
                </article>
                ${opcionesCapturaHTML(pregunta, columns)}
            </div>
            <footer class="captura__footer mono-label" aria-hidden="true">codelang.quiz</footer>
        </div></div>`;
        await document.fonts.ready;
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                if (elementos.captura.classList.contains("captura")) {
                    elementos.captura.dataset.fit = "ready";
                }
            });
        });
    } catch {
        elementos.captura.className = "captura captura--error";
        elementos.captura.innerHTML = '<p class="mono-label">No encontrada</p>';
    }
}

window.addEventListener("popstate", enrutar);
configurarEnlaces();
enrutar();
