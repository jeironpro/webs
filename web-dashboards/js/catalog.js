const ETIQUETAS_DOMINIO = {
    administracion: "Admin",
    finanzas: "Finanzas",
    monitoreo: "Monitoreo",
    analitica: "Analítica",
    soporte: "Soporte",
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
const elFiltroDestacados = $("filtro-destacados");
const elOrden = $("orden");

const colacion = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

const estado = {
    dashboards: [],
    dominios: [],
    dominio: "todas",
    consulta: "",
    destacados: false,
    orden: "az",
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

function chipDominio(dominio) {
    const li = chipTrozo(ETIQUETAS_DOMINIO[dominio] ?? dominio, "trozo--dominio");
    li.dataset.dominio = dominio;
    return li;
}

function chipStack(texto) {
    const li = document.createElement("li");
    li.className = "trozo trozo--stack";
    li.textContent = texto;
    return li;
}

function chipEstado(estadoDashboard) {
    const li = chipTrozo(ESTADOS[estadoDashboard].texto, ESTADOS[estadoDashboard].clase);
    const punto = document.createElement("span");
    punto.className = "trozo__punto";
    li.prepend(punto);
    return li;
}

function construirTarjeta(dashboard) {
    const li = document.createElement("li");
    li.className = "tarjeta";
    li.dataset.dominio = dashboard.categorias[0];

    const media = document.createElement("a");
    media.className = "tarjeta__media";
    media.href = dashboard.url;
    media.setAttribute("aria-label", `Abrir ${dashboard.titulo}`);
    const img = document.createElement("img");
    img.src = dashboard.screenshot;
    img.alt = "";
    img.width = 1280;
    img.height = 800;
    img.loading = "lazy";
    media.append(img);

    if (dashboard.destacado) {
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
    enlace.href = dashboard.url;
    enlace.textContent = dashboard.titulo;
    h3.append(enlace);

    cabecera.append(h3);
    cabecera.append(chipEstado(dashboard.estado));

    const descripcion = document.createElement("p");
    descripcion.className = "tarjeta__descripcion";
    descripcion.textContent = dashboard.descripcion;

    const metas = document.createElement("ul");
    metas.className = "tarjeta__metas";
    metas.append(chipDominio(dashboard.categorias[0]));
    dashboard.stack.forEach((s) => metas.append(chipStack(s)));

    const acciones = document.createElement("div");
    acciones.className = "tarjeta__acciones";

    const abrir = document.createElement("a");
    abrir.className = "btn btn--primario";
    abrir.href = dashboard.url;
    abrir.append("Abrir", icono("open_in_new"));

    const codigo = document.createElement("a");
    codigo.className = "btn btn--secundario";
    codigo.href = dashboard.repo;
    codigo.setAttribute("rel", "noreferrer");
    codigo.target = "_blank";
    codigo.append(icono("code"), "Código");

    acciones.append(abrir, codigo);

    cuerpo.append(cabecera, descripcion, metas, acciones);
    li.append(media, cuerpo);
    return li;
}

function filtrar() {
    const consulta = estado.consulta.trim().toLowerCase();
    return estado.dashboards.filter((dashboard) => {
        if (estado.dominio !== "todas" && !dashboard.categorias.includes(estado.dominio)) {
            return false;
        }
        if (estado.destacados && !dashboard.destacado) {
            return false;
        }
        if (!consulta) return true;
        const texto = `${dashboard.titulo} ${dashboard.descripcion} ${dashboard.tags.join(
            " "
        )} ${dashboard.stack.join(" ")} ${dashboard.id}`.toLowerCase();
        return texto.includes(consulta);
    });
}

function ordenar(lista) {
    const porTitulo = (a, b) => colacion.compare(a.titulo, b.titulo);
    const copia = [...lista];
    if (estado.orden === "za") return copia.sort(porTitulo).reverse();
    if (estado.orden === "destacados") {
        return copia.sort((a, b) => Number(b.destacado) - Number(a.destacado) || porTitulo(a, b));
    }
    return copia.sort(porTitulo);
}

function renderizar() {
    const resultados = ordenar(filtrar());
    elGraella.replaceChildren(...resultados.map(construirTarjeta));

    const total = estado.dashboards.length;
    elComptador.textContent =
        resultados.length === total
            ? `${total} dashboards`
            : `${resultados.length} de ${total} dashboards`;

    const mostrarVacio = resultados.length === 0;
    elVacio.hidden = !mostrarVacio;
    if (mostrarVacio) {
        const motivos = [];
        if (estado.consulta) motivos.push(`«${estado.consulta}»`);
        if (estado.dominio !== "todas") motivos.push(ETIQUETAS_DOMINIO[estado.dominio]);
        if (estado.destacados) motivos.push("destacados");
        elVacioMensaje.textContent = motivos.length
            ? `Sin resultados para ${motivos.join(" y ")}.`
            : "Sin resultados.";
    }
}

function construirFiltros() {
    const botones = [
        ["todas", "Todas", ""],
        ...estado.dominios.map((d) => [d, ETIQUETAS_DOMINIO[d] ?? d, d]),
    ];
    botones.forEach(([valor, etiqueta, dominio]) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "chip";
        if (dominio) {
            boton.classList.add("chip--dominio");
            boton.dataset.dominio = dominio;
        }
        boton.dataset.dominioFiltro = valor;
        boton.setAttribute("aria-pressed", String(valor === estado.dominio));
        boton.textContent = etiqueta;
        boton.addEventListener("click", () => {
            estado.dominio = valor;
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
        total: estado.dashboards.length,
        dominios: estado.dominios.length,
        destacados: estado.dashboards.filter((j) => j.destacado).length,
    };
    document.querySelectorAll("[data-stats]").forEach((nodo) => {
        nodo.textContent = stats[nodo.dataset.stats];
    });
}

async function iniciar() {
    const respuesta = await fetch("./assets/projects.json");
    const datos = await respuesta.json();
    estado.dashboards = datos.dashboards;
    estado.dominios = [...new Set(estado.dashboards.flatMap((j) => j.categorias))];

    elBusqueda.addEventListener("input", () => {
        clearTimeout(estado._temporizador);
        estado._temporizador = setTimeout(() => {
            estado.consulta = elBusqueda.value;
            renderizar();
        }, 150);
    });

    $("vacio-reset").addEventListener("click", () => {
        estado.consulta = "";
        estado.dominio = "todas";
        estado.destacados = false;
        elBusqueda.value = "";
        elFiltroDestacados.setAttribute("aria-pressed", "false");
        elFiltros
            .querySelectorAll(".chip")
            .forEach((b) =>
                b.setAttribute("aria-pressed", String(b.dataset.dominioFiltro === "todas"))
            );
        renderizar();
    });

    elFiltroDestacados.addEventListener("click", () => {
        estado.destacados = !estado.destacados;
        elFiltroDestacados.setAttribute("aria-pressed", String(estado.destacados));
        renderizar();
    });

    elOrden.addEventListener("change", () => {
        estado.orden = elOrden.value;
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
