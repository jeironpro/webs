/* Guía GTA VI · interacciones y checklist persistente */

document.documentElement.classList.add("js");

const STORAGE_KEY = "gta6-leonida-checklist-v1";

const CHECKLIST = [
    // Historia y trabajos
    {
        id: "c01",
        group: "historia",
        title: "Terminar la historia",
        detail: "91 misiones · prólogo y 5 capítulos",
    },
    {
        id: "c02",
        group: "historia",
        title: "Completar 100 tareas opcionales",
        detail: "Se acumulan haciendo el resto de la lista",
    },
    {
        id: "c03",
        group: "historia",
        title: "39 operaciones de bandas",
        detail: "39 de 39 · saquea los objetos de valor",
    },
    {
        id: "c04",
        group: "historia",
        title: "22 golpes a bancos",
        detail: "Se desbloquean en el capítulo 3",
    },
    {
        id: "c05",
        group: "historia",
        title: "8 bóvedas de banco",
        detail: "Una por cada banco con cámara acorazada",
    },
    {
        id: "c06",
        group: "historia",
        title: "7 préstamos con usura",
        detail: "Disponibles tras Credit Check",
    },
    {
        id: "c07",
        group: "historia",
        title: "34 de 35 cristalazos y joyerías",
        detail: "Casas de empeño y joyerías",
    },
    {
        id: "c08",
        group: "historia",
        title: "50 de 91 atracos a tiendas",
        detail: "Bazares, comida rápida y licorerías",
    },
    {
        id: "c09",
        group: "historia",
        title: "250.000 $ en billetes marcados",
        detail: "Vendidos a perista",
    },
    {
        id: "c10",
        group: "historia",
        title: "200.000 $ en vehículos",
        detail: "Coches robados y revendidos",
    },
    { id: "c11", group: "historia", title: "100.000 $ en joyas", detail: "Botín de joyerías" },
    {
        id: "c12",
        group: "historia",
        title: "100.000 $ en narcóticos",
        detail: "Operaciones y flamencos de cocaína",
    },

    // Descubrimiento
    {
        id: "c13",
        group: "descubrir",
        title: "200 de 277 vehículos escaneados",
        detail: "Con la app WAINK",
    },
    { id: "c14", group: "descubrir", title: "100 escaneos WAINK", detail: "Cualquier modelo base" },
    {
        id: "c15",
        group: "descubrir",
        title: "100 de 255 animales estudiados",
        detail: "Con prismáticos, sin cazarlos",
    },
    {
        id: "c16",
        group: "descubrir",
        title: "50 de 66 armas estándar",
        detail: "Armas repartidas por Leónida",
    },
    {
        id: "c17",
        group: "descubrir",
        title: "33 descubrimientos submarinos",
        detail: "Requiere traje o vehículo acuático",
    },
    {
        id: "c18",
        group: "descubrir",
        title: "100 de 125 flamencos de cocaína",
        detail: "Estatuas rosas por todo el estado",
    },
    { id: "c19", group: "descubrir", title: "70 de 79 estilos", detail: "Peluquería y ropa" },
    {
        id: "c20",
        group: "descubrir",
        title: "30 de 34 revistas",
        detail: "Algunas viven en pisos francos",
    },
    {
        id: "c21",
        group: "descubrir",
        title: "15 de 18 meditaciones",
        detail: "Puntos tranquilos del mapa",
    },
    {
        id: "c22",
        group: "descubrir",
        title: "15 de 18 sets de cartas",
        detail: "Coleccionables de Vice City",
    },
    {
        id: "c23",
        group: "descubrir",
        title: "5 de 7 sets de Kenton",
        detail: "Colección secundaria",
    },

    // Retos y actividades
    {
        id: "c24",
        group: "retos",
        title: "300 de 397 acrobacias",
        detail: "Saltos únicos con vehículo",
    },
    {
        id: "c25",
        group: "retos",
        title: "70 de 80 desafíos",
        detail: "Retos repartidos por el mapa",
    },
    { id: "c26", group: "retos", title: "42 oros en galería de tiro", detail: "Todas las pruebas" },
    { id: "c27", group: "retos", title: "42 contrarreloj de drones", detail: "Todas las rutas" },
    {
        id: "c28",
        group: "retos",
        title: "30 de 40 carreras únicas",
        detail: "Coches, motos y lanchas",
    },
    {
        id: "c29",
        group: "retos",
        title: "10 de 13 oros en desafíos de carrera",
        detail: "Variantes cronometradas",
    },
    {
        id: "c30",
        group: "retos",
        title: "15 barajas de Bret",
        detail: "Incluye sus encargos de caza",
    },
    { id: "c31", group: "retos", title: "90 de 100 canastas", detail: "Minijuego de baloncesto" },
    { id: "c32", group: "retos", title: "5 de 7 rivales de billar", detail: "Gana las partidas" },
    { id: "c33", group: "retos", title: "4 de 4 videojuegos", detail: "Recreativas de Leónida" },
    {
        id: "c34",
        group: "retos",
        title: "2 de 3 campos de minigolf",
        detail: "Juega los recorridos",
    },
    {
        id: "c35",
        group: "retos",
        title: "Ambas playlists",
        detail: "Recompensas de exploración musical",
    },
];

/* ---------- Utilidades ---------- */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set();
    }
}

function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...state]));
    } catch {
        /* almacenamiento no disponible: la checklist sigue funcionando en memoria */
    }
}

/* ---------- Header, progreso y navegación ---------- */

const header = $("#site-header");
const progressBar = $("#scroll-progress");

function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 24);

    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? Math.min(y / height, 1) : 0;
    if (progressBar) progressBar.style.width = `${ratio * 100}%`;
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const nav = $("#nav");
const navToggle = $("#nav-toggle");

function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
}

navToggle?.addEventListener("click", () => {
    if (!nav) return;
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

$$("#nav a").forEach((link) => link.addEventListener("click", closeNav));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
});

/* Sección activa */
const navLinks = $$("#nav a");
const sections = navLinks.map((link) => $(link.getAttribute("href"))).filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "is-active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
}

/* ---------- Aparición al hacer scroll ---------- */

const reveals = $$(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
}

/* ---------- Spoilers ---------- */

$$(".spoiler-toggle").forEach((button) => {
    const target = document.getElementById(button.dataset.spoiler);
    if (!target) return;

    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", target.id);

    button.addEventListener("click", () => {
        const open = target.hidden;
        target.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "Ocultar spoiler" : "Mostrar aviso con spoiler";
    });
});

/* ---------- Pestañas del panel Jason y Lucía ---------- */

const tabs = $$(".tab");
const panels = $$(".tab-panel");

if (tabs.length && panels.length === tabs.length) {
    const activateTab = (index, moveFocus = false) => {
        tabs.forEach((tab, i) => {
            const active = i === index;
            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-selected", String(active));
            tab.tabIndex = active ? 0 : -1;
            panels[i].classList.toggle("is-active", active);
            panels[i].hidden = !active;
        });
        if (moveFocus) tabs[index].focus();
    };

    activateTab(0);

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(index));

        tab.addEventListener("keydown", (event) => {
            let next = null;
            if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
            if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = tabs.length - 1;
            if (next === null) return;
            event.preventDefault();
            activateTab(next, true);
        });
    });
}

/* ---------- Mapa interactivo de Leónida ---------- */

const MAP_POINTS = [
    {
        id: "vice-city",
        name: "Vice City",
        region: "Vice-Dale",
        cat: "ciudad",
        x: 65,
        y: 51,
        desc: "Capital del sol y del exceso: Downtown, Little Cuba, Stockyard, Starfish Island y el puerto. El centro económico y criminal de Leónida.",
    },
    {
        id: "ocean-beach",
        name: "Ocean Beach",
        region: "Vice City",
        cat: "costa",
        x: 86.8,
        y: 54,
        desc: "Hoteles art déco, arena blanca y paseo marítimo. El South Beach de Leónida y una de las zonas más reconocibles del juego.",
    },
    {
        id: "vice-beach",
        name: "Vice Beach",
        region: "Vice City",
        cat: "costa",
        x: 87.2,
        y: 48.6,
        desc: "Isla barrera unida a la ciudad por calzada: playa, motos de agua y aviones con pancarta sobrevolando la costa.",
    },
    {
        id: "vcia",
        name: "Aeropuerto (VCIA)",
        region: "Vice City",
        cat: "historia",
        x: 58.3,
        y: 57,
        desc: "El aeropuerto internacional de Vice City: aduanas, hangares y pista. Escenario del gran golpe del capítulo 4.",
    },
    {
        id: "key-lento",
        name: "Key Lento",
        region: "Leonida Keys",
        cat: "costa",
        x: 55.2,
        y: 83.8,
        desc: "Donde arranca la historia: la casa de Jason, la tienda, el bar, el muelle y el astillero de Brian. Aquí viven Cal y Shirley.",
    },
    {
        id: "hamlet",
        name: "Hamlet",
        region: "Mariana",
        cat: "ciudad",
        x: 54.1,
        y: 69,
        desc: "Pueblo al suroeste de Vice City, sobre la Route 35. Tiene comisaría y depósito de vehículos, y aparece en las primeras misiones.",
    },
    {
        id: "watson-bay",
        name: "Watson Bay",
        region: "Mariana",
        cat: "historia",
        x: 45,
        y: 70.9,
        desc: "Localidad de Mariana County al oeste de Hamlet. Almacenes, agua y humedales a su alrededor.",
    },
    {
        id: "grassrivers",
        name: "Grassrivers",
        region: "Mariana",
        cat: "naturaleza",
        x: 42.7,
        y: 65.5,
        desc: "Manglares, agua marrón, caimanes y airboats. El Everglades de Leónida y el sitio donde se pierden los paquetes de Donnie.",
    },
    {
        id: "port-gellhorn",
        name: "Port Gellhorn",
        region: "Kelly",
        cat: "ciudad",
        x: 30.5,
        y: 37.6,
        desc: "Costa oeste en declive: moteles baratos, atracciones cerradas, puerto activo y el Starlet Motel del capítulo 2.",
    },
    {
        id: "ambrosia",
        name: "Ambrosia",
        region: "Kelly",
        cat: "ciudad",
        x: 53,
        y: 36.3,
        desc: "Corazón industrial del estado: la refinería de Allied Crystal, campos de caña y una banda de moteros que condiciona el pueblo.",
    },
    {
        id: "mount-kalaga",
        name: "Mount Kalaga",
        region: "Lummox",
        cat: "naturaleza",
        x: 43.5,
        y: 22,
        desc: "Parque nacional en el norte: bosques, colinas, caza, pesca y rutas todoterreno. El sitio más tranquilo del mapa.",
    },
    {
        id: "lake-leonida",
        name: "Lake Leonida",
        region: "Leonard",
        cat: "naturaleza",
        x: 61.5,
        y: 29.3,
        desc: "El gran lago central del estado. Pescadores, hidroaviones y rutas de agua que cruzan el interior.",
    },
];

const MAP_CAT_LABELS = {
    ciudad: "Ciudad",
    costa: "Costa",
    naturaleza: "Naturaleza",
    historia: "Punto de historia",
};

const mapViewport = document.getElementById("map-viewport");
const mapStage = document.getElementById("map-stage");
const mapDetail = document.getElementById("map-detail");

if (mapViewport && mapStage && mapDetail) {
    const markers = [];
    const markerLabel = (point) => `${point.name}, ${point.region}. ${MAP_CAT_LABELS[point.cat]}`;

    const selectPoint = (point, button) => {
        markers.forEach((marker) => marker.classList.toggle("is-active", marker === button));

        const tag = document.createElement("p");
        tag.className = "tag";
        tag.textContent = point.region;

        const title = document.createElement("h3");
        title.textContent = point.name;

        const meta = document.createElement("div");
        meta.className = "map-detail__meta";
        const category = document.createElement("span");
        category.textContent = MAP_CAT_LABELS[point.cat];
        meta.append(category);

        const desc = document.createElement("p");
        desc.textContent = point.desc;

        const note = document.createElement("p");
        note.className = "map-detail__note";
        note.append(document.createTextNode("Mapa oficial © Rockstar Games · "));

        const credit = document.createElement("a");
        credit.href = "https://www.rockstargames.com/VI/media";
        credit.rel = "noreferrer noopener";
        credit.target = "_blank";
        credit.textContent = "rockstargames.com/VI";
        note.append(credit);

        mapDetail.replaceChildren(tag, title, meta, desc, note);
    };

    MAP_POINTS.forEach((point, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "map-marker";
        button.style.setProperty("--x", `${point.x}%`);
        button.style.setProperty("--y", `${point.y}%`);
        button.dataset.cat = point.cat;
        button.dataset.id = point.id;
        button.setAttribute("aria-label", markerLabel(point));
        button.textContent = String(index + 1).padStart(2, "0");
        button.addEventListener("click", () => selectPoint(point, button));
        mapStage.append(button);
        markers.push(button);
    });

    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;

    const clampOffsets = () => {
        const maxX = ((scale - 1) * mapViewport.clientWidth) / 2;
        const maxY = ((scale - 1) * mapViewport.clientHeight) / 2;
        offsetX = Math.min(maxX, Math.max(-maxX, offsetX));
        offsetY = Math.min(maxY, Math.max(-maxY, offsetY));
    };

    const applyMap = () => {
        clampOffsets();
        mapStage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        mapStage.style.setProperty("--inv", String(1 / scale));
    };

    const zoomMap = (delta) => {
        scale = Math.min(3.2, Math.max(1, scale + delta));
        if (scale === 1) {
            offsetX = 0;
            offsetY = 0;
        }
        applyMap();
    };

    mapViewport.addEventListener(
        "wheel",
        (event) => {
            event.preventDefault();
            zoomMap(event.deltaY < 0 ? 0.25 : -0.25);
        },
        { passive: false }
    );

    mapViewport.addEventListener("pointerdown", (event) => {
        if (scale <= 1 || event.target.closest(".map-marker")) return;
        dragging = true;
        mapViewport.classList.add("is-dragging");
        mapViewport.setPointerCapture(event.pointerId);
        startX = event.clientX;
        startY = event.clientY;
        startOffsetX = offsetX;
        startOffsetY = offsetY;
    });

    mapViewport.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        offsetX = startOffsetX + event.clientX - startX;
        offsetY = startOffsetY + event.clientY - startY;
        applyMap();
    });

    const endDrag = (event) => {
        dragging = false;
        mapViewport.classList.remove("is-dragging");
        if (mapViewport.hasPointerCapture(event.pointerId)) {
            mapViewport.releasePointerCapture(event.pointerId);
        }
    };

    mapViewport.addEventListener("pointerup", endDrag);
    mapViewport.addEventListener("pointercancel", endDrag);

    $$("[data-map-zoom]").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.dataset.mapZoom;
            if (action === "in") zoomMap(0.35);
            else if (action === "out") zoomMap(-0.35);
            else {
                scale = 1;
                offsetX = 0;
                offsetY = 0;
                applyMap();
            }
        });
    });

    $$("[data-map-filter]").forEach((chip) => {
        chip.addEventListener("click", () => {
            $$("[data-map-filter]").forEach((other) => {
                other.classList.toggle("is-active", other === chip);
            });
            const filter = chip.dataset.mapFilter;
            markers.forEach((marker) => {
                marker.hidden = filter !== "all" && marker.dataset.cat !== filter;
            });
        });
    });
}

/* ---------- Campaña: 94 entradas en 5 capítulos ---------- */

/* ---------- Decisiones documentadas por misión ---------- */

const MISSION_CHOICES = {
    "Gear Up": [
        {
            q: "Escopeta o rifle táctico",
            opts: [
                [
                    "Escopeta",
                    "Cuesta menos y basta para el arranque; al principio casi no llega el dinero para el rifle.",
                ],
                ["Rifle táctico", "Más cómodo a media distancia, pero no cambia ninguna misión."],
            ],
        },
    ],
    "Just a Scratch": [
        {
            q: "Color del Ganado del 70",
            opts: [
                ["Cualquier color", "Es cosmético: Joey lo pinta igual y Lucía reacciona igual."],
            ],
        },
    ],
    "Feng Shui": [
        {
            q: "Dónde colocar la mesa de café",
            opts: [["Cualquier posición", "Cal la devuelve a su sitio; no hay consecuencia."]],
        },
    ],
    Pipework: [
        {
            q: "Cómo responder a Mandy",
            opts: [
                ["Interrumpir", "Solo cambia el diálogo."],
                ["Provocar", "Solo cambia el diálogo."],
                [
                    "Calmar",
                    "Solo cambia el diálogo: se encierra en su cuarto y te pide que te vayas igual. No hay romance posible con ella.",
                ],
            ],
        },
    ],
    "Hey Arnold!": [
        {
            q: "Matar o perdonar a Arnold en el muelle",
            opts: [
                [
                    "Matar",
                    "Perfil criminal Agresivo (Hardened); pierdes los 10.000 $ que Brian envía en el capítulo 4.",
                ],
                [
                    "Perdonar",
                    "Perfil Contenido (Restrained); Arnold puede reaparecer y Brian te paga 10.000 $ en el capítulo 4.",
                ],
            ],
        },
    ],
    "Coming Home": [
        {
            q: "Ayudar a Cal con su app de citas",
            opts: [
                ["Ayudar", "Añade una escena con su perfil; sin efecto duradero."],
                ["Dejarlo", "Te saltas la escena sin penalización."],
            ],
        },
        {
            q: "Aceptar la raya que ofrece Donnie",
            opts: [
                [
                    "Aceptar",
                    "Escena extra; varias guías lo cuentan como resta de relación con Lucía.",
                ],
                ["Rechazar", "Escena más limpia y mejor resultado de relación."],
            ],
        },
        {
            q: "Preparar la llegada de Lucía",
            opts: [
                [
                    "Completar encargos y reformas",
                    "Collar, flores, compra, corte de pelo, ropa y casa terminada suben la relación.",
                ],
                [
                    "Llegar sin preparar",
                    "Si la casa sigue a medias, la relación baja cuando Lucía la ve.",
                ],
            ],
        },
    ],
    "Buck Me": [
        {
            q: "Callar o mencionar los ahorros en el banco",
            opts: [
                ["Callar", "El banco rechaza la cuenta igual."],
                ["Mencionar los ahorros", "Mismo rechazo; solo cambia el diálogo."],
            ],
        },
    ],
    "Day Release": [
        {
            q: "Motos de agua: juntos o por separado",
            opts: [
                ["Juntos", "Sube la relación con Lucía."],
                ["Por separado", "Te pierdes el bonus de relación."],
            ],
        },
        {
            q: "Cogerle la mano en el Nine1Nine y en el hotel",
            opts: [
                ["Sí", "Sube la relación con Lucía."],
                ["No", "Sin bonus."],
            ],
        },
        {
            q: "Vestido de Lucía: negro, dorado o marrón",
            opts: [["Cualquiera", "Es cosmético; no cambia ninguna escena."]],
        },
        {
            q: "Aceptar la droga de Mattia",
            opts: [
                ["Aceptar", "Cambia los visuales de la secuencia; sin efecto posterior."],
                ["Rechazar", "La secuencia va sin efectos."],
            ],
        },
    ],
    Swamped: [
        {
            q: "Contarle a Lucía que Brian se jubila",
            opts: [
                ["Contarlo", "Sube la relación; Lucía se muestra más comprensiva después."],
                ["Callarlo", "Sin bonus de relación."],
            ],
        },
    ],
    "Clean Up After Donnie": [
        {
            q: "Razón o amenaza a los Kingfishers",
            opts: [
                ["Razón", "Solo diálogo: la pelea ocurre igual."],
                ["Amenaza", "Solo diálogo: la pelea ocurre igual."],
            ],
        },
    ],
    "Girls' Trip": [
        {
            q: "Calmar o provocar a los Kolts en el lavadero",
            opts: [
                [
                    "Calmar las dos veces",
                    "Sin pelea y puntos de reputación Profesional para Lucía.",
                ],
                ["Provocar", "Empieza una pelea; la misión sigue igual."],
            ],
        },
    ],
    "Afternoon Delight": [
        {
            q: "Bailar con Mario o empezar el atraco",
            opts: [
                [
                    "Bailar",
                    "La caja fuerte se hace en silencio, pero Lucía va sola, la pillan y Jason tiene que rescatarla; después hay que comprarle ropa.",
                ],
                ["No bailar", "Atraco más rápido, con el club alertado y nivel de búsqueda."],
            ],
        },
        {
            q: "Botín",
            opts: [["Mismo en ambos casos", "Cobras el golpe y Vicki envía 10.000 $ igual."]],
        },
    ],
    "Coffee Break": [
        {
            q: "Qué local revisar primero",
            opts: [
                [
                    "Bowling, empeño o club de barro",
                    "Solo cambia el orden; los tres quedan marcados en el mapa.",
                ],
            ],
        },
    ],
    "Twist Wrist, Smash, Grab": [
        {
            q: "Qué hacer con el guardia del furgón",
            opts: [["Calmarlo, amenazarlo o ignorarlo", "Nada cambia; cobras los 2.000 $ igual."]],
        },
    ],
    "Welcome to Vice City": [
        {
            q: "Aceptar o rechazar el dinero de Dre'Quan",
            opts: [
                [
                    "Aceptar",
                    "Escena extra lanzando billetes a las bailarinas; Dre'Quan te llama igual.",
                ],
                ["Rechazar", "Misión más corta; mismo destino."],
            ],
        },
    ],
    "Dealer's Choice": [
        {
            q: "Producto puro o cortado",
            opts: [
                ["Puro", "El trato sale limpio y ganas reputación Profesional."],
                ["Cortado", "Los compradores lo notan y hay que reaccionar."],
            ],
        },
        {
            q: "Si te pillan: media disculpa o imponerte",
            opts: [
                ["Media disculpa", "Aceptan y cobras menos."],
                [
                    "Imponerte",
                    "Tiroteo con los compradores y la policía; también pasa si dejas vencer el tiempo.",
                ],
            ],
        },
        {
            q: "Gancho de la canción de Dre'Quan",
            opts: [
                [
                    "Big Ol' Titties o Finger in My Booty Hole",
                    "Solo cambia la letra de Cooties que suena después en la radio y en escenas.",
                ],
            ],
        },
    ],
    "Meet the Heders": [
        {
            q: "Pedir Surf and Turf",
            opts: [
                ["Pedirlo", "Pequeño bonus de relación con Lucía."],
                ["No pedirlo", "Sin efecto."],
            ],
        },
        {
            q: "Aceptar o rechazar el puro cubano",
            opts: [
                ["Aceptar", "Jason fuma durante la conversación."],
                ["Rechazar", "La conversación sigue sin fumar; sin diferencia posterior."],
            ],
        },
    ],
    "Dubious Provenance": [
        {
            q: "Entregar la estatua a Halifax o rechazarla",
            opts: [
                ["Entregarla", "Te deja un Crowex de 1972 como garantía y avanza su trama."],
                [
                    "Rechazarla",
                    "Te escribe al día siguiente; si no lo llamas, pierdes las partes 2 y 3 y el dinero extra.",
                ],
            ],
        },
        {
            q: "Confiar en Halifax o no",
            opts: [
                ["Confiar", "Sigue la investigación para recuperar la estatua."],
                [
                    "No confiar",
                    "Te niegas a darle más tiempo; las guías discrepan sobre si acelera o retrasa el enfrentamiento.",
                ],
            ],
        },
        {
            q: "Matar o perdonar a Halifax",
            opts: [
                ["Matar", "Perfil criminal más agresivo; puedes saquear su alijo igual."],
                ["Perdonar", "Perfil más contenido y mismo acceso al alijo."],
            ],
        },
    ],
    "Mami Knows Best": [
        {
            q: "Usar la excavadora contra la casa de los M7",
            opts: [
                ["Derribarla", "Los daños se quedan en el mapa para siempre."],
                ["Dejarlo", "Sin destrozo ni consecuencia."],
            ],
        },
    ],
    "Safe Word": [
        {
            q: "Unirte a la pelea de la piscina",
            opts: [
                ["Unirte", "Resta relación con Lucía."],
                ["No unirte", "Mejor resultado de relación; la misión continúa igual."],
            ],
        },
    ],
    "The Missing Link": [
        {
            q: "Monty en tierra o en el estanque de caimanes",
            opts: [
                ["Al estanque", "El caimán se lo lleva."],
                ["En tierra", "Andrea le dispara; muere igual."],
            ],
        },
        {
            q: "La pistola del almacén",
            opts: [["Registrar a fondo", "Puedes perderla si no la recoges antes de salir."]],
        },
    ],
    "Top Billing": [
        {
            q: "Darle patatas, dinero o nada a Dre'Quan",
            opts: [["Cualquiera", "Solo cambia el diálogo; se queda sin patatas igual."]],
        },
    ],
    "Making Gainz": [
        {
            q: "Aceptar o rechazar los esteroides de Nate",
            opts: [
                ["Aceptar", "Lucía gana complexión mejorada y puede llegar a 5/5 de forma física."],
                ["Rechazar", "Mantiene la progresión normal; sin efecto en la historia."],
            ],
        },
    ],
    "Adventures in Babysitting": [
        {
            q: "Aceptar o rechazar la droga de Andrés",
            opts: [
                ["Aceptar", "Visuales alterados durante las peleas de la noche."],
                ["Rechazar", "Las peleas van normales; sin efecto duradero."],
            ],
        },
    ],
    "Starting From Zero": [
        {
            q: "Disparar a Mattia o dejar que venza el tiempo",
            opts: [
                ["Disparar", "El arma de Giorgio está descargada: no muere."],
                ["Esperar", "Misma escena; no cambia nada."],
            ],
        },
    ],
    Headliners: [
        {
            q: "Cuántas mesas VIP montar",
            opts: [
                ["Más mesas", "Mayor pago al cerrar la misión."],
                ["Menos mesas", "Cobras menos; sin efecto en la historia."],
            ],
        },
    ],
    "VC Baby": [
        {
            q: "Ayudar a Mattia o negarte",
            opts: [
                ["Ayudar", "Añade una escena de cierre."],
                ["Negarte", "La misión termina antes; mismo resultado."],
            ],
        },
    ],
    "Protective Custody": [
        {
            q: "Disparar a Méndez o esperar y aceptar su trato",
            opts: [
                [
                    "Disparar",
                    "Sigue The End of the Road: da acceso a todos los finales del puente y a la escena de Cal.",
                ],
                [
                    "Take Deal",
                    "Salta el puente y lleva al final secreto malo: Méndez os entrega y no hay escena de Cal.",
                ],
            ],
        },
    ],
    "The End of the Road": [
        {
            q: "Nadar para escaparos o No rendirse",
            opts: [
                [
                    "Nadar y pulsar Exit",
                    "Finales buenos o agridulces según relación, perfil criminal y ahorros (500.000 $ / 2 M $).",
                ],
                [
                    "Nadar sin Exit",
                    "Jason sale, Lucía se queda en el coche y la policía mata a los dos.",
                ],
                ["No rendirse", "Los dos mueren; Tomás queda con la familia de Lucía."],
            ],
        },
    ],
};

const CHAPTERS = [
    {
        n: 1,
        title: "Just Like Paradise",
        place: "Key Lento y los Cayos",
        summary:
            "Jason trabaja para Donnie y Brian en Key Lento mientras Lucía cumple condena. Su salida los junta y, entre encargos pequeños, intentan construir algo propio antes de que todo se tuerza.",
        missions: [
            {
                name: "Prologue",
                desc: "Lucía se sienta con su consejera penitenciaria y repasa por qué está entre rejas.",
            },
            {
                name: "Gone Fishing",
                desc: "Primera misión de Jason: recoge los paquetes del avión de Donnie y sácalo del campamento de los Kingfishers.",
            },
            {
                name: "Gear Up",
                desc: "Jason va a la armería de Key Lento a comprar su primer arma larga.",
            },
            {
                name: "Just a Scratch",
                desc: "Lleva el Ganado del 70 al taller de Joey para reparar el motor y pintarlo.",
            },
            {
                name: "Lab Fees",
                desc: "Cobra el alquiler de Brian en Moonstone Boutique, una tienda que esconde un laboratorio.",
            },
            {
                name: "Unwanted Attention",
                desc: "Jason y Cal roban un Phoenix del depósito de Hamlet y aprenden a perder el Heat.",
            },
            {
                name: "Pipework",
                desc: "Cobra el alquiler de Mandy desatascando su fregadero con un émbolo y una llave.",
            },
            {
                name: "Hey Arnold!",
                desc: "Persecución en camión y a pie para encontrar al bróker desaparecido de Brian en Maroon Key.",
            },
            {
                name: "Island Dreams",
                desc: "Primera inmersión: Jason lleva a una despedida de soltero a un pecio con detector de metales.",
            },
            {
                name: "Feng Shui",
                desc: "Sin combate: recolocar el salón de la casa de Key Lento y jugar dos recreativas con Cal.",
            },
            {
                name: "Coming Home",
                desc: "Jason recoge a Lucía en la prisión de Hamlet y la lleva al Rusty Anchor.",
            },
            {
                name: "Buck Me",
                desc: "Tras el rechazo de Fleeca, la pareja abre cuenta en la app BuckMe.",
            },
            {
                name: "Clean Up After Donnie",
                desc: "Recupera la cocaína que cayó del avión de Donnie en el pantano.",
            },
            {
                name: "Down to Earth",
                desc: "Jason y Lucía hacen tres entregas en hidroavión desde Bobcat Bay.",
            },
            {
                name: "Clear Skies",
                desc: "Escolta un avión de contrabando y acompaña a Donnie a un trato con moteros.",
            },
            {
                name: "Day Release",
                desc: "Noche libre con Mattia y Kat: lancha, carreras de motos de agua y discoteca en Vice City.",
            },
            {
                name: "Swamped",
                desc: "Reunión en el campamento de los Kingfishers, persecución en helicóptero y lancha.",
            },
            {
                name: "Don Gone",
                desc: "La búsqueda de Donnie en su caravana cierra el hilo de los Cayos.",
            },
            {
                name: "Recalibration",
                desc: "Excursión de pesca con Cal: compra cerveza, pesca tres peces y ásalos.",
            },
            {
                name: "Tourist Trap",
                desc: "Recoged una bolsa en la taquilla del centro de visitantes para Mattia.",
            },
            {
                name: "Home Sweet Home",
                desc: "Misión corta como Lucía en Key Lento, encadenada con la anterior.",
            },
            {
                name: "Discharge Time",
                desc: "Cierre del capítulo: encuentra la habitación 203 y supera tres secuencias como Jason.",
            },
        ],
    },
    {
        n: 2,
        title: "Paradise Lost",
        place: "Port Gellhorn",
        summary:
            "La pareja se esconde en el Starlet Motel de Port Gellhorn. Jason se recupera, Lucía hace trabajos de coches y la cuenta familiar empieza a importar de verdad.",
        missions: [
            {
                name: "What's in the Bag?",
                desc: "Lucía abre por fin la bolsa del centro de visitantes en un motel de Port Gellhorn.",
            },
            {
                name: "Ambulance Chaser",
                desc: "Persigue una ambulancia robada en quad y destrúyela antes de que la encuentre la policía.",
            },
            {
                name: "Just Moved In",
                desc: "Compra ocho provisiones en la gasolinera frente al Starlet Motel.",
            },
            {
                name: "Girls' Trip",
                desc: "Lucía y Vicki buscan analgésicos por el motel y las calles de Port Gellhorn.",
            },
            {
                name: "Moses",
                desc: "Aprende a usar rastreadores y pletinas; acaba registrando el primer coche de Lucía.",
            },
            {
                name: "Daily Driver",
                desc: "Roba un Crawler del 82 para Moses y entrégalo por 1.250 $.",
            },
            {
                name: "Slam Dunk",
                desc: "Lucía y Dunk van a por el proveedor de pastillas: huida en el puerto y tiroteo en una pista.",
            },
            {
                name: "Breakfast Run",
                desc: "Jason vuelve: él y Lucía atracan varias tiendas contra un cronómetro de un minuto.",
            },
            {
                name: "Coffee Break",
                desc: "Desbloquea el cambio libre de personaje y cuatro encargos en cualquier orden.",
            },
            {
                name: "Afternoon Delight",
                desc: "Atraco al club Delights, con una decisión de Jason que cambia el desarrollo del golpe.",
            },
            {
                name: "Checking Out",
                desc: "Última misión del capítulo y punto de no retorno: el Starlet Motel deja de ser vuestro hogar.",
            },
            {
                name: "Thrillbillies",
                desc: "Carrera en el Thrillbilly Mud Club: termina en cualquier puesto menos último.",
                opt: true,
            },
            {
                name: "Twist Wrist, Smash, Grab",
                desc: "Persigue un camión blindado en moto, revienta las puertas y escapa con la bolsa.",
                opt: true,
            },
        ],
    },
    {
        n: 3,
        title: "Tits Ass Drug Money",
        place: "Vice City",
        summary:
            "Vice City: Dre'Quan les abre la puerta a Bayside y Raul entra en escena. El capítulo más largo mezcla trapicheos, la industria musical y la preparación del golpe al Sinfrontera.",
        missions: [
            {
                name: "Welcome to Vice City",
                desc: "Dre'Quan recibe a la pareja en el Jack of Hearts y les consigue un piso en Bayside.",
            },
            {
                name: "Dealer's Choice",
                desc: "Trato de droga con Dre'Quan en Crosstown: elegir producto cortado o puro cambia la reacción de los compradores.",
            },
            {
                name: "Meet the Heders",
                desc: "Cena en la azotea con Brian y Lori que acaba en robo de coches en el puerto.",
            },
            {
                name: "Dubious Provenance",
                desc: "Empieza en la tienda de antigüedades de Capri; rechazar la oferta de Halifax te obliga a llamarle antes de cerrar el capítulo.",
            },
            {
                name: "Mami Knows Best",
                desc: "Lucía y Mia arreglan una casa en venta en Hamlet; aparecen un caimán y una excavadora.",
            },
            {
                name: "South Leonida Real Estate",
                desc: "Segunda misión con Mia: visita una casa y sigue a un cliente. Paga 2.000 $.",
            },
            {
                name: "Tyrone",
                desc: "Reunión con el camello Tyrone en La Perle; sale el tema de Kitty Litter y un tal Charles.",
            },
            {
                name: "Here, Kitty Kitty",
                desc: "Jason busca a Charles para Tyrone, de un piso en Rockridge a un campamento de La Perle.",
            },
            {
                name: "Car Service",
                desc: "Registra el desguace de Salton desde el tejado y entrega un Schafter V12 por 3.000 $.",
            },
            {
                name: "Top Billing",
                desc: "Sigue a Roxy a una fiesta, aparta a Jacki de la puerta trasera y corta la luz.",
            },
            {
                name: "Boobie Time",
                desc: "Jason lleva a Boobie por Vice City y persigue una bolsa robada río abajo en una Seashark.",
            },
            {
                name: "First Impressions",
                desc: "Huida para Raul: Lucía conduce de Ocean Beach a Bayside mientras Jason frena a la policía.",
            },
            {
                name: "Caught Slipping",
                desc: "Al entrar al piso de Bayside: usa Focus para disparar a las piernas y lleva el botín al almacén.",
            },
            {
                name: "Crosstown Traffic",
                desc: "Robo de lanchas en dos frentes: Jason en moto y Lucía por el metro.",
            },
            {
                name: "Credit Check",
                desc: "Tres atracos a Fleeca con la banda de Raul; desbloquea el Dye Pack Jammer.",
            },
            {
                name: "Steal the Zorrusso for Randy",
                desc: "Aprende a clonar llaves y escapa del rastreador hasta el concesionario de Randy.",
            },
            {
                name: "Sinfrontera National Bank",
                desc: "Lucía inspecciona con Focus cuatro medidas de seguridad en el vestíbulo del banco.",
            },
            {
                name: "Security Expert",
                desc: "Sigilo en una casa vigilada de Waning Sands: entra detrás de Jason y saca a Nicole.",
            },
            {
                name: "Ride or Die",
                desc: "Jason consigue unas zapatillas firmadas por DWNPLY y se lleva su coche.",
            },
            {
                name: "Company Property",
                desc: "Recogida de armas con Brian en un aeródromo cerca de Hamlet; las cajas servirán como explosivos.",
            },
            {
                name: "The Missing Link",
                desc: "Lucía y Andrea registran un almacén de Watson Bay; hay una pistola que se puede perder.",
            },
            {
                name: "Safe Word",
                desc: "Entra en la mansión de Gil, vacía la piscina, saca la caja fuerte y ábrela.",
            },
            {
                name: "Cooties",
                desc: "Rodaje de videoclip para Lucía que acaba en persecución; recompensa: el Bat de Bae-Luxe.",
            },
            {
                name: "Bricked Up",
                desc: "Recogida de droga para Boobie en Venture Apartments; 3.500 $ si sales con la bolsa roja.",
            },
            {
                name: "Hidden Charges",
                desc: "Coloca cargas en las torres este, sur y oeste; cada una añade tiempo en el atraco.",
            },
            {
                name: "The Cartel Heist",
                desc: "El gran golpe al Sinfrontera National Bank cierra el capítulo; paga 120.000 $.",
            },
        ],
    },
    {
        n: 4,
        title: "Vice City, Baby",
        place: "Ocean Beach y Vice City",
        summary:
            "Se mudan al Y Hotel de Ocean Beach y el círculo se cierra: aeropuerto, seguridad privada y un golpe que exige capital. El capítulo más urbano de los cinco.",
        missions: [
            {
                name: "Ocean Beach",
                desc: "La pareja deja Bayside y se muda a la suite 701 del Y Hotel, en Ocean Beach.",
            },
            {
                name: "Another Life",
                desc: "Flashback jugable como Lucía en su antigua casa, con cinco interacciones.",
            },
            {
                name: "Company Cars",
                desc: "Un coche gratis para cada uno en Status Auto Imports y carrera de vuelta al hotel.",
            },
            {
                name: "Lawyer Up",
                desc: "Sin peleas: reunión con el abogado Abe Gonzalez en su despacho de Downtown.",
            },
            {
                name: "Party Hard",
                desc: "Seguridad personal para Andrés de León en la inauguración de la sede de Megamundo.",
            },
            {
                name: "Heavy Lifting",
                desc: "Tres partes: disco duro a Raul, infiltración en Ajax Gym y seguimiento nocturno.",
            },
            {
                name: "Photo/Shoot",
                desc: "Lucía fotografía a Real Dimez en un helicóptero sobre Vice City; paga 6.000 $.",
            },
            {
                name: "Making Gainz",
                desc: "Lucía entrena con Nate en Ajax Gym y consigue acceso al Trauma Floor.",
            },
            {
                name: "Watch It",
                desc: "Jason y Dre'Quan: pelea por un Crowex falso, ropa nueva y reunión con Royce Jones.",
            },
            {
                name: "Cash Injections",
                desc: "Lucía acompaña a Nate a vender Synthol y el trato acaba en pelea.",
            },
            {
                name: "Amateur Hour",
                desc: "Lucía se hace pasar por actriz para cobrar a un equipo que nunca pagó; 1.000 $.",
            },
            {
                name: "Dirty Work",
                desc: "Preparación a dos bandas: Jason en el Velvet Palm y Lucía fotografiando desde fuera.",
            },
            {
                name: "Too Much Baggage",
                desc: "Jason trabaja de maletero en el VCIA y carga un avión para Omar.",
            },
            {
                name: "Adventures in Babysitting",
                desc: "Noche larga protegiendo a Andrés en The Vault, con recados y pelea a la salida.",
            },
            {
                name: "Fresh Evidence",
                desc: "Robo en la mansión de Dante Fresh: esquivar un tigre, copiar cintas y huir en lancha.",
            },
            {
                name: "Power Play",
                desc: "Preparación del golpe: Lucía conduce para Kordell y Jason fotografía los planos del aeropuerto.",
            },
            {
                name: "Child's Play",
                desc: "Lucía observa con prismáticos en una cementera mientras Jason cuida de Andrés; 30.000 $.",
            },
            {
                name: "Headliners",
                desc: "Fiesta de lanzamiento de Real Dimez en Club VYB; el pago depende de las mesas VIP que elijas.",
            },
            {
                name: "Close Surveillance",
                desc: "Jason pilota el dron de Karim, sigue a dos culturistas y oculta cámaras en un piso.",
            },
            {
                name: "Delivery Method",
                desc: "Jason entra en Transport Security Services disfrazado de repartidor con un USB.",
            },
            {
                name: "Team Building",
                desc: "Lucía y Kordell buscan a Arlo, pelean en una jaula y conducen hasta Riverbank.",
            },
            {
                name: "Fully Catered",
                desc: "Roba un camión de catering del aeropuerto y prepara bolsas con dinero falso.",
            },
            {
                name: "VCIA Takedown",
                desc: "El golpe al aeropuerto hacia el que apunta todo el capítulo.",
            },
            {
                name: "Sunset",
                desc: "Sin marcador: recoge una nota en la recepción del Y Hotel y síguela.",
            },
            {
                name: "Starting From Zero",
                desc: "El capítulo se cierra con la pareja recomponiéndose tras el golpe.",
            },
        ],
    },
    {
        n: 5,
        title: "Top of the World, Ma",
        place: "Vice City y la costa",
        summary:
            "Recta final: la Guardia Costera, un último gran golpe y la pregunta de en quién pueden confiar. El capítulo más corto y el que más pesa.",
        missions: [
            {
                name: "Bird in the Hand",
                desc: "Reconocimiento del cuartel de la Guardia Costera y asalto nocturno a un hangar militar.",
            },
            {
                name: "Taking Liberties",
                desc: "Misión de unos siete minutos sin combate: acompaña a Jason a un spa y deja que pase la escena.",
            },
            {
                name: "Doggie Bag",
                desc: "Lucía se cuela en un crucero durante un registro y se lleva a Rocco, el perro antidroga.",
            },
            {
                name: "VC Baby",
                desc: "Misión corta como Jason con una elección; las dos respuestas llevan al mismo sitio.",
            },
            {
                name: "Operation Savage Glory",
                desc: "La misión más larga del capítulo, en dos equipos: Lucía con Alpha y Jason con Bravo. Paga 50.000 $.",
            },
            {
                name: "Honest Abe",
                desc: "Sin pelea ni persecución: la pareja deja el ático y visita a Abe en su despacho de Downtown.",
                opt: true,
            },
            {
                name: "Protective Custody",
                desc: "Jason y Lucía trabajan juntos en plena recta final.",
            },
            {
                name: "The End of the Road",
                desc: "El final de la historia de Jason y Lucía.",
                spoil: true,
            },
        ],
    },
];

const makeEl = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};

const buildChoices = (name) => {
    const choices = MISSION_CHOICES[name];
    if (!choices) {
        return makeEl("p", "mission__linear", "Sin decisiones · misión lineal");
    }

    const details = makeEl("details", "mission__choices");
    const summary = makeEl("summary", null, "Decisiones ");
    summary.append(makeEl("span", "mission__choices-count", String(choices.length)));

    const list = makeEl("ul", "mission__choices-list");
    choices.forEach((decision) => {
        const item = makeEl("li", "decision");
        item.append(makeEl("p", "decision__q", decision.q));

        const options = makeEl("ul", "decision__opts");
        decision.opts.forEach(([label, effect]) => {
            const option = makeEl("li");
            option.append(makeEl("span", "decision__opt", label), makeEl("span", null, effect));
            options.append(option);
        });

        item.append(options);
        list.append(item);
    });

    details.append(summary, list);
    return details;
};

const campaignEl = document.getElementById("campaign");
const chapterNavEl = document.getElementById("chapter-nav");
const campaignSection = document.getElementById("campana");

if (campaignEl) {
    let counter = 0;

    CHAPTERS.forEach((chapter) => {
        const mains = chapter.missions.filter((mission) => !mission.opt).length;
        const optionals = chapter.missions.length - mains;

        const article = document.createElement("article");
        article.className = "chapter";
        article.id = `cap-${chapter.n}`;

        const rows = chapter.missions.map((mission) => {
            counter += 1;
            const number = String(counter).padStart(2, "0");
            const nameClass = mission.spoil
                ? "mission__name mission__name--spoil"
                : "mission__name";

            const item = makeEl("li", "mission");
            const num = makeEl("span", "mission__num", number);
            num.setAttribute("aria-hidden", "true");

            const body = makeEl("div", "mission__body");
            const heading = document.createElement("h3");
            heading.append(makeEl("span", nameClass, mission.name));
            if (mission.opt) heading.append(makeEl("span", "mission__opt", "Opcional"));

            body.append(heading, makeEl("p", null, mission.desc), buildChoices(mission.name));
            item.append(num, body);
            return item;
        });

        const header = makeEl("header", "chapter__head");
        const optionalText = optionals
            ? ` + ${optionals} opcional${optionals > 1 ? "es" : ""}`
            : "";
        header.append(
            makeEl(
                "p",
                "chapter__kicker",
                `Capítulo ${String(chapter.n).padStart(2, "0")} · ${mains} misiones${optionalText}`
            ),
            makeEl("h3", "chapter__title", chapter.title),
            makeEl("p", "chapter__place", chapter.place),
            makeEl("p", "chapter__summary", chapter.summary)
        );

        const track = makeEl("ol", "mission-track");
        track.append(...rows);
        article.append(header, track);
        campaignEl.append(article);

        if (chapterNavEl) {
            const link = document.createElement("a");
            link.href = `#cap-${chapter.n}`;
            link.textContent = `Cap. ${chapter.n} · ${chapter.missions.length}`;
            chapterNavEl.append(link);
        }
    });
}

const spoilerFinal = document.getElementById("spoiler-final");

if (spoilerFinal && campaignSection) {
    spoilerFinal.setAttribute("aria-pressed", "false");
    spoilerFinal.addEventListener("click", () => {
        const revealed = campaignSection.classList.toggle("is-revealed");
        spoilerFinal.setAttribute("aria-pressed", String(revealed));
        spoilerFinal.textContent = revealed
            ? "Ocultar nombre del final"
            : "Mostrar nombre del final";
    });
}

if (chapterNavEl && "IntersectionObserver" in window) {
    const chapterLinks = $$("a", chapterNavEl);
    const chapterSpy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                chapterLinks.forEach((link) => {
                    link.classList.toggle(
                        "is-current",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    $$(".chapter", campaignEl).forEach((chapter) => chapterSpy.observe(chapter));
}

/* ---------- Checklist 100% ---------- */

const list = $("#check-list");
const count = $("#check-count");
const fill = $("#check-fill");
const bar = $("#check-progress");

if (list) {
    const state = loadState();
    const total = CHECKLIST.length;

    CHECKLIST.forEach((item) => {
        const li = document.createElement("li");
        li.className = "check-item";
        li.dataset.group = item.group;

        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = item.id;
        input.checked = state.has(item.id);

        const box = document.createElement("span");
        box.className = "check-box";
        box.setAttribute("aria-hidden", "true");

        const text = document.createElement("span");
        text.className = "check-text";

        const title = document.createElement("strong");
        title.textContent = item.title;

        const detail = document.createElement("small");
        detail.textContent = item.detail;

        text.append(title, detail);
        label.append(input, box, text);
        li.append(label);
        list.append(li);
    });

    const update = () => {
        const done = state.size;
        if (count) count.textContent = String(done);
        const percent = (done / total) * 100;
        if (fill) fill.style.width = `${percent}%`;
        if (bar) {
            bar.setAttribute("aria-valuenow", String(done));
            bar.setAttribute("aria-valuemax", String(total));
            bar.setAttribute("aria-valuetext", `${done} de ${total} requisitos completados`);
        }
    };

    update();

    list.addEventListener("change", (event) => {
        const input = event.target.closest("input[type='checkbox']");
        if (!input) return;

        if (input.checked) state.add(input.value);
        else state.delete(input.value);

        saveState(state);
        update();
    });

    $("#check-reset")?.addEventListener("click", () => {
        state.clear();
        saveState(state);
        $$("input[type='checkbox']", list).forEach((input) => {
            input.checked = false;
        });
        update();
    });

    $$(".checklist__filters .chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            $$(".checklist__filters .chip").forEach((other) => {
                other.classList.toggle("is-active", other === chip);
            });

            const filter = chip.dataset.filter;
            $$(".check-item", list).forEach((item) => {
                item.hidden = filter !== "all" && item.dataset.group !== filter;
            });
        });
    });
}
