const ETIQUETAS_GENERO = {
    tablero: "Tablero",
    palabras: "Palabras",
    logica: "Lógica",
    memoria: "Memoria",
    reflejos: "Reflejos",
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
    juegos: [],
    generos: [],
    genero: "todas",
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

function chipGenero(genero) {
    const li = chipTrozo(ETIQUETAS_GENERO[genero] ?? genero, "trozo--genero");
    li.dataset.genero = genero;
    return li;
}

function chipStack(texto) {
    const li = document.createElement("li");
    li.className = "trozo trozo--stack";
    li.textContent = texto;
    return li;
}

function chipEstado(estadoJuego) {
    const li = chipTrozo(ESTADOS[estadoJuego].texto, ESTADOS[estadoJuego].clase);
    const punto = document.createElement("span");
    punto.className = "trozo__punto";
    li.prepend(punto);
    return li;
}

function construirTarjeta(juego) {
    const li = document.createElement("li");
    li.className = "tarjeta";
    li.dataset.genero = juego.categorias[0];

    const media = document.createElement("a");
    media.className = "tarjeta__media";
    media.href = juego.url;
    media.setAttribute("aria-label", `${juego.titulo}: jugar`);
    const img = document.createElement("img");
    img.src = juego.screenshot;
    img.alt = "";
    img.width = 1280;
    img.height = 800;
    img.loading = "lazy";
    media.append(img);

    if (juego.destacado) {
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
    enlace.href = juego.url;
    enlace.textContent = juego.titulo;
    h3.append(enlace);

    cabecera.append(h3);
    cabecera.append(chipEstado(juego.estado));

    const descripcion = document.createElement("p");
    descripcion.className = "tarjeta__descripcion";
    descripcion.textContent = juego.descripcion;

    const metas = document.createElement("ul");
    metas.className = "tarjeta__metas";
    metas.append(chipGenero(juego.categorias[0]));
    juego.stack.forEach((s) => metas.append(chipStack(s)));

    const acciones = document.createElement("div");
    acciones.className = "tarjeta__acciones";

    const jugar = document.createElement("a");
    jugar.className = "btn btn--primario";
    jugar.href = juego.url;
    jugar.append("Jugar", icono("sports_esports"));

    const codigo = document.createElement("a");
    codigo.className = "btn btn--secundario";
    codigo.href = juego.repo;
    codigo.setAttribute("rel", "noreferrer");
    codigo.target = "_blank";
    codigo.append(icono("code"), "Código");

    acciones.append(jugar, codigo);

    cuerpo.append(cabecera, descripcion, metas, acciones);
    li.append(media, cuerpo);
    return li;
}

function filtrar() {
    const consulta = estado.consulta.trim().toLowerCase();
    return estado.juegos.filter((juego) => {
        if (estado.genero !== "todas" && !juego.categorias.includes(estado.genero)) {
            return false;
        }
        if (estado.destacados && !juego.destacado) {
            return false;
        }
        if (!consulta) return true;
        const texto = `${juego.titulo} ${juego.descripcion} ${juego.tags.join(
            " "
        )} ${juego.stack.join(" ")} ${juego.id}`.toLowerCase();
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

    const total = estado.juegos.length;
    elComptador.textContent =
        resultados.length === total ? `${total} juegos` : `${resultados.length} de ${total} juegos`;

    const mostrarVacio = resultados.length === 0;
    elVacio.hidden = !mostrarVacio;
    if (mostrarVacio) {
        const motivos = [];
        if (estado.consulta) motivos.push(`«${estado.consulta}»`);
        if (estado.genero !== "todas") motivos.push(ETIQUETAS_GENERO[estado.genero]);
        if (estado.destacados) motivos.push("destacados");
        elVacioMensaje.textContent = motivos.length
            ? `Sin resultados para ${motivos.join(" y ")}.`
            : "Sin resultados.";
    }
}

function construirFiltros() {
    const botones = [
        ["todas", "Todas", ""],
        ...estado.generos.map((g) => [g, ETIQUETAS_GENERO[g] ?? g, g]),
    ];
    botones.forEach(([valor, etiqueta, genero]) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "chip";
        if (genero) {
            boton.classList.add("chip--genero");
            boton.dataset.genero = genero;
        }
        boton.dataset.generoFiltro = valor;
        boton.setAttribute("aria-pressed", String(valor === estado.genero));
        boton.textContent = etiqueta;
        boton.addEventListener("click", () => {
            estado.genero = valor;
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
        total: estado.juegos.length,
        generos: estado.generos.length,
        destacados: estado.juegos.filter((j) => j.destacado).length,
    };
    document.querySelectorAll("[data-stats]").forEach((nodo) => {
        nodo.textContent = stats[nodo.dataset.stats];
    });
}

async function iniciar() {
    const respuesta = await fetch("./assets/projects.json");
    const datos = await respuesta.json();
    estado.juegos = datos.juegos;
    estado.generos = [...new Set(estado.juegos.flatMap((j) => j.categorias))];

    elBusqueda.addEventListener("input", () => {
        clearTimeout(estado._temporizador);
        estado._temporizador = setTimeout(() => {
            estado.consulta = elBusqueda.value;
            renderizar();
        }, 150);
    });

    $("vacio-reset").addEventListener("click", () => {
        estado.consulta = "";
        estado.genero = "todas";
        estado.destacados = false;
        elBusqueda.value = "";
        elFiltroDestacados.setAttribute("aria-pressed", "false");
        elFiltros
            .querySelectorAll(".chip")
            .forEach((b) =>
                b.setAttribute("aria-pressed", String(b.dataset.generoFiltro === "todas"))
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
