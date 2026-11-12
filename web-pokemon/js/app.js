const scriptActual = document.currentScript || document.querySelector('script[src$="app.js"]');
const BASE = scriptActual
    ? new URL("../", scriptActual.src)
    : new URL(location.pathname.replace(/\/(?:generation\/\d+\/?)?$/, "/"), location.origin);
const BASE_PATH = BASE.pathname;
const DATASET_URL = new URL("data/pokemones.json", BASE);
const LOGO_URL = new URL("assets/images/pokemon-logo.png", BASE).href;

const GENERACIONES = [
    { id: 1, nombre: "primera" },
    { id: 2, nombre: "segunda" },
    { id: 3, nombre: "tercera" },
    { id: 4, nombre: "cuarta" },
    { id: 5, nombre: "quinta" },
    { id: 6, nombre: "sexta" },
    { id: 7, nombre: "septima" },
    { id: 8, nombre: "octava" },
    { id: 9, nombre: "novena" },
];

const TIPOS_DISPONIBLES = [
    "Acero",
    "Agua",
    "Bicho",
    "Dragón",
    "Electrico",
    "Eléctrico",
    "Fantasma",
    "Fuego",
    "Hada",
    "Hielo",
    "Lucha",
    "Normal",
    "Planta",
    "Psíquico",
    "Roca",
    "Siniestro",
    "Tierra",
    "Veneno",
    "Volador",
];

const POR_PAGINA = 24;
const ESTADISTICAS = [
    ["PS", "punto_salud", "ps"],
    ["Ataque", "ataque", "ataque"],
    ["Defensa", "defensa", "defensa"],
    ["At.Esp", "ataque_especial", "at-esp"],
    ["Def.Esp", "defensa_especial", "def-esp"],
    ["Vel.", "velocidad", "velocidad"],
];

const estado = {
    generacion: 1,
    busqueda: "",
    tipo: "",
    pagina: 1,
    total: 0,
    totalPaginas: 1,
};

const elementos = {
    splash: document.getElementById("splash"),
    layout: document.getElementById("layout"),
    contenido: document.getElementById("contenido"),
    noEncontrado: document.getElementById("no-encontrado"),
    nav: document.getElementById("nav-generaciones"),
    overlay: document.getElementById("menu-overlay"),
    hamburger: document.getElementById("hamburger"),
    hamburgerIcon: document.getElementById("hamburger-icon"),
    logo: document.getElementById("logo-inicio"),
    volverInicio: document.getElementById("volver-inicio"),
};

let vistaActual = "inicio";
let datasetPromise = null;
let solicitud = 0;
let temporizadorBusqueda = null;
let temporizadorSplash = null;
let menuAbierto = false;

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
            })[caracter]
    );
}

function formatearNombre(nombre) {
    let formateado = String(nombre).replace(/_/g, " ");
    if (formateado.endsWith("-f")) formateado = `${formateado.slice(0, -2)}\u2640`;
    else if (formateado.endsWith("-m")) formateado = `${formateado.slice(0, -2)}\u2642`;
    else if (formateado.endsWith("hd")) formateado = `${formateado.slice(0, -1)}'d`;
    return formateado;
}

function formatearId(indice) {
    return String(Number(indice) + 1).padStart(4, "0");
}

function estrellas(valor) {
    return "\u2605".repeat(Math.max(0, Number(valor) || 0));
}

function urlGeneracion(id) {
    return new URL(`generation/${id}`, BASE);
}

function actualizarNav(generacionId) {
    document.querySelectorAll("[data-generacion]").forEach((enlace) => {
        const activo = Number(enlace.dataset.generacion) === Number(generacionId);
        enlace.classList.toggle("active", activo);
        if (activo) enlace.setAttribute("aria-current", "page");
        else enlace.removeAttribute("aria-current");
    });
}

function cerrarMenu() {
    menuAbierto = false;
    elementos.nav.classList.remove("abierto");
    elementos.overlay.classList.add("oculto");
    elementos.hamburgerIcon.textContent = "menu";
    elementos.hamburger.setAttribute("aria-expanded", "false");
}

function alternarMenu() {
    menuAbierto = !menuAbierto;
    elementos.nav.classList.toggle("abierto", menuAbierto);
    elementos.overlay.classList.toggle("oculto", !menuAbierto);
    elementos.hamburgerIcon.textContent = menuAbierto ? "close" : "menu";
    elementos.hamburger.setAttribute("aria-expanded", String(menuAbierto));
}

function limpiarSplash() {
    if (temporizadorSplash !== null) {
        window.clearTimeout(temporizadorSplash);
        temporizadorSplash = null;
    }
}

function programarSplash() {
    limpiarSplash();
    temporizadorSplash = window.setTimeout(() => {
        if (vistaActual === "inicio") navegar("generation/1");
    }, 5000);
}

function mostrarSplash() {
    vistaActual = "inicio";
    limpiarSplash();
    solicitud += 1;
    cerrarMenu();
    actualizarNav(null);
    elementos.layout.classList.add("oculto");
    elementos.noEncontrado.classList.add("oculto");
    elementos.splash.classList.remove("oculto");
    elementos.contenido.innerHTML = "";
    document.title = "Pokémon";
    programarSplash();
}

function mostrarLayout() {
    elementos.splash.classList.add("oculto");
    elementos.layout.classList.remove("oculto");
    elementos.noEncontrado.classList.add("oculto");
}

function mostrar404() {
    vistaActual = "404";
    limpiarSplash();
    solicitud += 1;
    cerrarMenu();
    actualizarNav(null);
    elementos.splash.classList.add("oculto");
    elementos.layout.classList.add("oculto");
    elementos.noEncontrado.classList.remove("oculto");
    elementos.contenido.innerHTML = "";
    document.title = "Página no encontrada · Pokémon";
}

function navegar(ruta) {
    const url = ruta ? urlGeneracion(ruta.split("/").pop()) : new URL(BASE);
    window.history.pushState(null, "", url.pathname);
    if (!ruta) mostrarSplash();
    else mostrarGeneracion(Number(ruta.split("/").pop()));
}

function rutaActual() {
    const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
    let ruta = decodeURIComponent(window.location.pathname);

    if (ruta === base.replace(/\/$/, "")) ruta = "";
    else if (ruta.startsWith(base)) ruta = ruta.slice(base.length);

    ruta = ruta.replace(/^\/+|\/+$/g, "");

    if (ruta === "" || ruta === "index.html") return { vista: "inicio" };

    const generacion = ruta.match(/^generation\/(\d+)$/);
    if (generacion) return { vista: "generacion", id: Number(generacion[1]) };

    const consulta = window.location.search.match(/^\?\/(generation\/(\d+))(?:\/|&|$)/);
    if (consulta) {
        window.history.replaceState(null, "", `${base}${consulta[1]}`);
        return { vista: "generacion", id: Number(consulta[2]) };
    }

    return { vista: "404" };
}

function enrutar() {
    const ruta = rutaActual();
    if (ruta.vista === "inicio") mostrarSplash();
    else if (ruta.vista === "generacion") mostrarGeneracion(ruta.id);
    else mostrar404();
}

async function cargarDataset() {
    if (!datasetPromise) {
        datasetPromise = fetch(DATASET_URL)
            .then((respuesta) => {
                if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
                return respuesta.json();
            })
            .then(({ datos }) =>
                datos.map((pokemon) => ({
                    ...pokemon,
                    imagen_url: new URL(
                        `assets/images/pokemon${pokemon.imagen_url.replace(/^\/pokemon-images/, "")}`,
                        BASE
                    ).href,
                }))
            )
            .catch((error) => {
                datasetPromise = null;
                throw error;
            });
    }
    return datasetPromise;
}

function filtrarPokemon(datos) {
    let lista = datos.filter((pokemon) => pokemon.generacion === estado.generacion);
    if (estado.busqueda) {
        const termino = estado.busqueda.toLowerCase().trim();
        lista = lista.filter((pokemon) => pokemon.nombre.toLowerCase().includes(termino));
    }
    if (estado.tipo) {
        lista = lista.filter((pokemon) =>
            pokemon.tipos?.some((tipo) => tipo.nombre?.toLowerCase() === estado.tipo.toLowerCase())
        );
    }
    return lista;
}

function esqueletoHTML() {
    return `<div class="skeleton-grid">${Array.from(
        { length: 6 },
        () => `<div class="skeleton-card">
            <div class="skeleton-imagen"></div>
            <div class="skeleton-contenido">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        </div>`
    ).join("")}</div>`;
}

function estadisticasHTML(estadisticas) {
    if (!estadisticas) return "";
    return ESTADISTICAS.map(([etiqueta, clave, clase]) => {
        const valor = Number(estadisticas[clave]) || 0;
        return `<div class="estadistica ${clase}">
            <span class="estadistica-label">${etiqueta}</span>
            <span class="estadistica-estrellas">${estrellas(valor)}</span>
            <span class="estadistica-valor">${valor}</span>
        </div>`;
    }).join("");
}

function tarjetaHTML(pokemon, retraso) {
    const nombre = formatearNombre(pokemon.nombre);
    const colorTipo = pokemon.tipos?.[0]?.color || "#f0f0f0";
    const tipos = (pokemon.tipos || [])
        .map(
            (tipo) =>
                `<span class="tipo-badge" style="background-color:${escapar(
                    tipo.color || "#666"
                )}">${escapar(tipo.nombre)}</span>`
        )
        .join("");

    return `<article class="carta" style="animation-delay:${retraso}ms;background:linear-gradient(135deg, ${colorTipo}22 0%, ${colorTipo}11 100%)">
        <div class="carta-imagen">
            ${
                pokemon.imagen_url
                    ? `<img src="${escapar(pokemon.imagen_url)}" alt="${escapar(
                          nombre
                      )}" loading="lazy" />`
                    : '<div style="color:#999;font-size:14px">Sin imagen</div>'
            }
        </div>
        <div class="carta-contenido">
            <div class="carta-encabezado">
                <h3 class="carta-nombre">${escapar(nombre)}</h3>
                <span class="carta-id">N.\u00A0${formatearId(pokemon.indice_global)}</span>
            </div>
            <div class="carta-tipos">${tipos}</div>
            <p class="carta-descripcion">${escapar(pokemon.descripcion)}</p>
            <div class="carta-estadisticas">${estadisticasHTML(pokemon.estadisticas)}</div>
        </div>
    </article>`;
}

function paginacionHTML() {
    return `<div class="paginacion">
        <button class="generacion-btn" data-pagina="anterior" ${
            estado.pagina <= 1 ? "disabled" : ""
        } aria-label="Página anterior">
            <span class="material-icons">chevron_left</span>
        </button>
        <span class="paginacion-info">${estado.pagina} de ${estado.totalPaginas} (${estado.total} pokemon)</span>
        <button class="generacion-btn" data-pagina="siguiente" ${
            estado.pagina >= estado.totalPaginas ? "disabled" : ""
        } aria-label="Página siguiente">
            <span class="material-icons">chevron_right</span>
        </button>
    </div>`;
}

function pintarResultados(lista) {
    const total = lista.length;
    estado.total = total;
    estado.totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
    estado.pagina = Math.min(estado.pagina, estado.totalPaginas) || 1;

    const inicio = (estado.pagina - 1) * POR_PAGINA;
    const pagina = lista.slice(inicio, inicio + POR_PAGINA);
    const resultados = document.getElementById("resultados");
    if (!resultados) return;

    if (pagina.length === 0) {
        resultados.innerHTML =
            '<p class="sin-resultados">No se encontraron pokemon con esos filtros.</p>';
        return;
    }

    resultados.innerHTML = `<div class="contenedor-cartas">${pagina
        .map((pokemon, indice) => tarjetaHTML(pokemon, (indice % 20) * 40))
        .join("")}</div>${estado.totalPaginas > 1 ? paginacionHTML() : ""}`;
}

async function cargarResultados() {
    const resultados = document.getElementById("resultados");
    if (!resultados) return;
    const token = ++solicitud;
    resultados.innerHTML = esqueletoHTML();

    try {
        const datos = await cargarDataset();
        if (token !== solicitud) return;
        pintarResultados(filtrarPokemon(datos));
    } catch (error) {
        if (token !== solicitud) return;
        resultados.innerHTML = `<div class="generacion-contenido"><h2>Error</h2><p>${escapar(
            error.message
        )}</p></div>`;
    }
}

function programarCarga(retraso) {
    if (temporizadorBusqueda !== null) window.clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = window.setTimeout(cargarResultados, retraso);
}

function opcionesTipoHTML() {
    return TIPOS_DISPONIBLES.map(
        (tipo) => `<option value="${escapar(tipo)}">${escapar(tipo)}</option>`
    ).join("");
}

function mostrarGeneracion(id) {
    vistaActual = "generacion";
    limpiarSplash();
    cerrarMenu();
    mostrarLayout();
    actualizarNav(id);

    estado.generacion = id;
    estado.busqueda = "";
    estado.tipo = "";
    estado.pagina = 1;
    estado.total = 0;
    estado.totalPaginas = 1;

    const generacion = GENERACIONES.find((item) => item.id === id);
    if (!generacion) {
        document.title = "Generación no válida · Pokémon";
        elementos.contenido.innerHTML = `<div class="generacion-contenido">
            <h2>Generacion no valida</h2>
            <p>Selecciona una generacion del menu de navegacion.</p>
        </div>`;
        return;
    }

    document.title = `Pokémon · ${generacion.nombre} generación`;
    const progreso = (id / GENERACIONES.length) * 100;
    elementos.contenido.innerHTML = `<div class="generacion-contenido">
        <div class="generacion-navegacion">
            <button class="generacion-btn" id="btn-gen-anterior" ${id <= 1 ? "disabled" : ""}>
                <span class="material-icons">arrow_back</span>
                <span>Anterior</span>
            </button>
            <div class="generacion-progreso">
                <span>Generacion ${id} de ${GENERACIONES.length}</span>
                <div class="generacion-barra">
                    <div class="generacion-barra-inner" style="width:${progreso}%"></div>
                </div>
            </div>
            <button class="generacion-btn" id="btn-gen-siguiente" ${
                id >= GENERACIONES.length ? "disabled" : ""
            }>
                <span>Siguiente</span>
                <span class="material-icons">arrow_forward</span>
            </button>
        </div>

        <h2>Pokemon de ${escapar(generacion.nombre)} generacion</h2>

        <div class="filtros">
            <input class="buscador" id="buscador" type="text" placeholder="Buscar pokemon..." />
            <select class="filtro-tipo" id="filtro-tipo">
                <option value="">Todos los tipos</option>
                ${opcionesTipoHTML()}
            </select>
        </div>

        <div id="resultados">${esqueletoHTML()}</div>
    </div>`;

    document.getElementById("btn-gen-anterior").addEventListener("click", () => {
        if (id > 1) navegar(`generation/${id - 1}`);
    });
    document.getElementById("btn-gen-siguiente").addEventListener("click", () => {
        if (id < GENERACIONES.length) navegar(`generation/${id + 1}`);
    });
    document.getElementById("buscador").addEventListener("input", (evento) => {
        estado.busqueda = evento.target.value;
        estado.pagina = 1;
        programarCarga(evento.target.value ? 300 : 0);
    });
    document.getElementById("filtro-tipo").addEventListener("change", (evento) => {
        estado.tipo = evento.target.value;
        estado.pagina = 1;
        cargarResultados();
    });
    document.getElementById("resultados").addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-pagina]");
        if (!boton) return;
        if (boton.dataset.pagina === "anterior" && estado.pagina > 1) {
            estado.pagina -= 1;
            cargarResultados();
        }
        if (boton.dataset.pagina === "siguiente" && estado.pagina < estado.totalPaginas) {
            estado.pagina += 1;
            cargarResultados();
        }
    });

    cargarResultados();
}

function configurarEnlaces() {
    document.querySelectorAll("[data-logo]").forEach((imagen) => {
        imagen.src = LOGO_URL;
    });
    document.querySelectorAll("[data-generacion]").forEach((enlace) => {
        enlace.href = urlGeneracion(enlace.dataset.generacion).pathname;
        enlace.addEventListener("click", (evento) => {
            evento.preventDefault();
            navegar(`generation/${enlace.dataset.generacion}`);
        });
    });
    elementos.logo.href = BASE_PATH;
    elementos.logo.addEventListener("click", (evento) => {
        evento.preventDefault();
        window.history.pushState(null, "", BASE_PATH);
        mostrarSplash();
    });
    elementos.volverInicio.href = BASE_PATH;
    elementos.volverInicio.addEventListener("click", (evento) => {
        evento.preventDefault();
        window.history.pushState(null, "", BASE_PATH);
        mostrarSplash();
    });
    elementos.hamburger.addEventListener("click", alternarMenu);
    elementos.overlay.addEventListener("click", cerrarMenu);
    window.addEventListener("popstate", enrutar);
}

configurarEnlaces();
enrutar();
