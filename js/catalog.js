const ETIQUETAS_CATEGORIA = {
    utilidades: "Utilidades",
    generadores: "Generadores",
    educacion: "Educación",
    entretenimiento: "Entretenimiento",
    productividad: "Productividad",
    referencia: "Referencia",
    curricular: "Curricular",
};

const ESTADOS = {
    live: { clase: "trozo--vivo", texto: "en vivo" },
    pendiente: { clase: "trozo--pendiente", texto: "pendiente" },
    externo: { clase: "", texto: "externo" },
};

const $ = (id) => document.getElementById(id);
const elGraella = $("graella");
const elComptador = $("contador");
const elFiltros = $("filtros");
const elBusqueda = $("cerca");
const elVacio = $("vacio");
const elVacioMensaje = $("vacio-mensaje");

const estado = {
    webs: [],
    categorias: [],
    categoria: "todas",
    consulta: "",
};

function icono(nombre, titulo) {
    const span = document.createElement("span");
    span.className = "ms";
    span.setAttribute("aria-hidden", "true");
    span.textContent = nombre;
    if (titulo) {
        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = titulo;
        span.append(sr);
    }
    return span;
}

function chipTrozo(texto, clase = "") {
    const li = document.createElement("li");
    li.className = `trozo ${clase}`.trim();
    li.textContent = texto;
    return li;
}

function chipStack(texto) {
    const li = document.createElement("li");
    li.className = "trozo trozo--stack";
    li.textContent = texto;
    return li;
}

function chipEstado(estadoWeb) {
    const li = chipTrozo(ESTADOS[estadoWeb].texto, ESTADOS[estadoWeb].clase);
    const punto = document.createElement("span");
    punto.className = "trozo__punto";
    li.prepend(punto);
    return li;
}

function construirTarjeta(web) {
    const li = document.createElement("li");
    li.className = "tarjeta";

    const media = document.createElement("a");
    media.className = "tarjeta__media";
    media.href = web.url;
    media.setAttribute("aria-label", `${web.titulo}: abrir la web`);
    const img = document.createElement("img");
    img.src = web.screenshot;
    img.alt = "";
    img.width = 1280;
    img.height = 800;
    img.loading = "lazy";
    media.append(img);

    if (web.destacado) {
        const insignia = document.createElement("span");
        insignia.className = "tarjeta__insignia";
        insignia.append(icono("star"));
        insignia.append("Destacado");
        media.append(insignia);
    }

    const cuerpo = document.createElement("div");
    cuerpo.className = "tarjeta__cuerpo";

    const cabecera = document.createElement("div");
    cabecera.className = "tarjeta__cabecera";

    const h3 = document.createElement("h3");
    h3.className = "tarjeta__titulo";
    const enlace = document.createElement("a");
    enlace.href = web.url;
    enlace.textContent = web.titulo;
    h3.append(enlace);

    cabecera.append(h3);
    cabecera.append(chipEstado(web.estado));

    const descripcion = document.createElement("p");
    descripcion.className = "tarjeta__descripcion";
    descripcion.textContent = web.descripcion;

    const metas = document.createElement("ul");
    metas.className = "tarjeta__metas";
    web.stack.forEach((s) => metas.append(chipStack(s)));

    const acciones = document.createElement("div");
    acciones.className = "tarjeta__acciones";

    const visita = document.createElement("a");
    visita.className = "btn btn--primario";
    visita.href = web.url;
    visita.append("Visitar", icono("open_in_new"));

    const codigo = document.createElement("a");
    codigo.className = "btn btn--secundario";
    codigo.href = web.repo;
    codigo.setAttribute("rel", "noreferrer");
    codigo.target = "_blank";
    codigo.append(icono("code"), "Código");

    acciones.append(visita, codigo);

    cuerpo.append(cabecera, descripcion, metas, acciones);
    li.append(media, cuerpo);
    return li;
}

function filtrar() {
    const consulta = estado.consulta.trim().toLowerCase();
    return estado.webs.filter((web) => {
        if (estado.categoria !== "todas" && !web.categorias.includes(estado.categoria)) {
            return false;
        }
        if (!consulta) return true;
        const texto = `${web.titulo} ${web.descripcion} ${web.tags.join(" ")} ${web.stack.join(
            " "
        )} ${web.id}`.toLowerCase();
        return texto.includes(consulta);
    });
}

function renderizar() {
    const resultados = filtrar();
    elGraella.replaceChildren(...resultados.map(construirTarjeta));

    const total = estado.webs.length;
    elComptador.textContent =
        resultados.length === total
            ? `${total} proyectos`
            : `${resultados.length} de ${total} proyectos`;

    const mostrarVacio = resultados.length === 0;
    elVacio.hidden = !mostrarVacio;
    if (mostrarVacio) {
        elVacioMensaje.textContent = `Sin resultados para «${estado.consulta}».`;
    }
}

function construirFiltros() {
    const botones = [
        ["todas", "Todas"],
        ...estado.categorias.map((c) => [c, ETIQUETAS_CATEGORIA[c] ?? c]),
    ];
    botones.forEach(([valor, etiqueta]) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "chip";
        boton.dataset.categoria = valor;
        boton.setAttribute("aria-pressed", String(valor === estado.categoria));
        boton.textContent = etiqueta;
        boton.addEventListener("click", () => {
            estado.categoria = valor;
            elFiltros
                .querySelectorAll(".chip")
                .forEach((b) => b.setAttribute("aria-pressed", String(b === boton)));
            renderizar();
        });
        elFiltros.append(boton);
    });
}

function rellenarStats() {
    const stats = {
        total: estado.webs.length,
        categorias: estado.categorias.length,
        destacados: estado.webs.filter((w) => w.destacado).length,
    };
    document.querySelectorAll("[data-stats]").forEach((nodo) => {
        nodo.textContent = stats[nodo.dataset.stats];
    });
}

async function iniciar() {
    const respuesta = await fetch("./assets/projects.json");
    const datos = await respuesta.json();
    estado.webs = datos.webs;
    estado.categorias = [...new Set(estado.webs.flatMap((w) => w.categorias))];

    elBusqueda.addEventListener("input", () => {
        clearTimeout(estado._temporizador);
        estado._temporizador = setTimeout(() => {
            estado.consulta = elBusqueda.value;
            renderizar();
        }, 150);
    });

    $("vacio-reset").addEventListener("click", () => {
        estado.consulta = "";
        estado.categoria = "todas";
        elBusqueda.value = "";
        elFiltros
            .querySelectorAll(".chip")
            .forEach((b) =>
                b.setAttribute("aria-pressed", String(b.dataset.categoria === "todas"))
            );
        renderizar();
    });

    construirFiltros();
    rellenarStats();
    renderizar();
}

iniciar().catch((error) => {
    elGraella.replaceChildren();
    elComptador.textContent = "No se pudo cargar el catálogo.";
    console.error(error);
});
