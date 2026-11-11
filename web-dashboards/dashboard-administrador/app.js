// Vanilla JS Dashboard Administrativo
// Migración desde React + Vite + Tailwind + React Router

// ===== Configuración =====
const THEME = { LIGHT: "light", DARK: "dark" };

const getSystemTheme = () => {
    if (typeof window === "undefined") return THEME.LIGHT;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEME.DARK
        : THEME.LIGHT;
};

function readStoredTheme() {
    // Todos los dashboards comparten origen y clave, y no todos guardan el mismo formato.
    const raw = localStorage.getItem("theme");
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.state && parsed.state.theme) return parsed;
        if (typeof parsed === "string") return { state: { theme: parsed } };
        return null;
    } catch {
        return { state: { theme: raw } };
    }
}

const applyTheme = (theme) => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === THEME.DARK);
    localStorage.setItem("theme", JSON.stringify({ state: { theme } }));
};

const storedTheme = readStoredTheme();
const currentTheme = storedTheme
    ? storedTheme.state.theme === THEME.DARK
        ? THEME.DARK
        : THEME.LIGHT
    : getSystemTheme();
applyTheme(currentTheme);

// ===== Ruteo simple (SPA) =====
const routes = {
    "/": "overview",
    "/overview": "overview",
    "/usuarios": "users",
    "/contenido": "content",
    "/auditoria": "logs",
    "/configuracion": "settings",
    "/salud": "health",
    "/reportes": "reports",
    "/perfil": "profile",
    "*": "notfound",
};

const routeHistory = [];

// Estado actual
const state = {
    theme: currentTheme,
    mobileOpen: false,
    page: "overview",
};

// Elementos del DOM
const elements = {
    root: document.getElementById("root"),
    sidebar: null,
    main: null,
    header: null,
    footer: null,
    navLinks: [],
};

const NAV_ITEMS = [
    { path: "/overview", page: "overview", label: "Visión general" },
    { path: "/usuarios", page: "users", label: "Usuarios" },
    { path: "/contenido", page: "content", label: "Contenido" },
    { path: "/auditoria", page: "logs", label: "Auditoría" },
    { path: "/salud", page: "health", label: "Salud" },
    { path: "/reportes", page: "reports", label: "Reportes" },
    { path: "/configuracion", page: "settings", label: "Configuración" },
    { path: "/perfil", page: "profile", label: "Perfil" },
];

// Inicializar después del DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    addGlobalStyles();
    mountLayout();
    cacheElements();

    initRouting();
    initSidebar();
    initHeader();
    initThemeToggle();
});

// ===== Layout =====
// Construye nodos sin pasar por HTML.
function crear(etiqueta, propiedades = {}, hijos = []) {
    const nodo = document.createElement(etiqueta);

    Object.entries(propiedades).forEach(([clave, valor]) => {
        if (valor === undefined || valor === null || valor === false) return;
        if (clave === "clase") nodo.className = valor;
        else if (clave === "texto") nodo.textContent = valor;
        else nodo.setAttribute(clave, valor === true ? "" : String(valor));
    });

    [].concat(hijos).forEach((hijo) => {
        if (hijo === null || hijo === undefined || hijo === false) return;
        nodo.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
    });

    return nodo;
}

function mountLayout() {
    const root = elements.root;
    if (!root) return;

    root.replaceChildren(
        crear("div", { clase: "dashboard" }, [
            crear("aside", { clase: "sidebar", "aria-label": "Navegación principal" }, [
                crear("div", { clase: "sidebar-brand", texto: "Nexo" }),
                crear(
                    "nav",
                    { clase: "sidebar-nav" },
                    NAV_ITEMS.map(({ path, label }) =>
                        crear("a", {
                            href: `#${path}`,
                            clase: "nav-link",
                            "data-page-path": path,
                            texto: label,
                        }),
                    ),
                ),
            ]),
            crear("div", { clase: "main" }, [
                crear("header", { clase: "header" }, [
                    crear("div", { clase: "header-brand" }, [
                        crear("button", {
                            clase: "btn btn-secondary sidebar-toggle",
                            type: "button",
                            "aria-label": "Abrir menú",
                            texto: "Menú",
                        }),
                        crear("span", { clase: "header-title", texto: "Consola de administración" }),
                    ]),
                    crear("div", { clase: "header-actions" }, [
                        crear("button", {
                            clase: "btn btn-secondary",
                            type: "button",
                            "data-theme-toggle": true,
                            texto: "Modo oscuro",
                        }),
                    ]),
                ]),
                crear("main", { clase: "main-content", id: "page" }),
                crear("footer", { clase: "footer" }, [
                    crear("p", { texto: "Nexo · Datos de ejemplo para la consola de administración" }),
                ]),
            ]),
        ]),
    );
}

function cacheElements() {
    elements.sidebar = document.querySelector(".sidebar");
    elements.header = document.querySelector(".header");
    elements.main = document.getElementById("page");
    elements.footer = document.querySelector(".footer");
    elements.navLinks = document.querySelectorAll(".nav-link");
}

// ===== Router =====
function normalizePath(path) {
    const raw = (path || "").split("#").pop() || "";
    const clean = raw.trim();
    if (!clean || clean === "/") return "/overview";
    return clean.startsWith("/") ? clean : `/${clean}`;
}

function navigateTo(path, updateHash = true) {
    const normalizedPath = normalizePath(path);
    const page = routes[normalizedPath] || "notfound";

    if (updateHash && window.location.hash !== `#${normalizedPath}`) {
        window.location.hash = normalizedPath;
    }

    routeHistory.push({ path: normalizedPath, timestamp: Date.now() });
    state.page = page;
    updateNavState(page);
    updatePageContent(page);
    updateTitle(page);
}

function initRouting() {
    const currentPath = () => normalizePath(window.location.hash.replace(/^#/, ""));
    window.addEventListener("hashchange", () => navigateTo(currentPath(), false));
    navigateTo(currentPath(), false);
}

function initSidebar() {
    document.querySelectorAll(".sidebar-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            state.mobileOpen = !state.mobileOpen;
            elements.sidebar?.classList.toggle("open", state.mobileOpen);
        });
    });

    elements.navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            state.mobileOpen = false;
            elements.sidebar?.classList.remove("open");
            navigateTo(link.getAttribute("data-page-path"));
        });
    });
}

function initHeader() {
    const menuButton = document.querySelector("[data-menu]");
    if (!menuButton) return;

    menuButton.addEventListener("click", () => {
        state.mobileOpen = !state.mobileOpen;
        elements.sidebar?.classList.toggle("open", state.mobileOpen);
    });
}

function initThemeToggle() {
    const button = document.querySelector("[data-theme-toggle]");
    const { theme, toggle } = useTheme();
    if (!button) return;

    button.textContent = theme === THEME.DARK ? "Modo claro" : "Modo oscuro";
    button.addEventListener("click", () => {
        toggle();
        button.textContent = state.theme === THEME.DARK ? "Modo claro" : "Modo oscuro";
    });
}

function navigateBack() {
    if (routeHistory.length > 1) {
        routeHistory.pop();
        const prev = routeHistory[routeHistory.length - 1];
        navigateTo(prev.path, false);
    }
}

function updateNavState(activePage) {
    elements.navLinks.forEach((link) => {
        const path = link.getAttribute("data-page-path");
        if (path) {
            link.classList.toggle("active", routes[path] === activePage);
        }
    });
}

function updatePageContent(page) {
    if (!elements.main) return;

    const pages = {
        overview: createOverviewPage(),
        users: createUsersPage(),
        content: createContentPage(),
        logs: createLogsPage(),
        settings: createSettingsPage(),
        health: createHealthPage(),
        reports: createReportsPage(),
        profile: createProfilePage(),
        notfound: createNotFoundPage(),
    };

    elements.main.replaceChildren(pages[page] || pages["notfound"]);

    // Ejecutar observers de reveal
    observeReveal(".reveal");
}

function updateTitle(page) {
    const titles = {
        overview: "Panel Administrativo - Visión General",
        users: "Panel Administrativo - Usuarios",
        content: "Panel Administrativo - Contenido",
        logs: "Panel Administrativo - Auditoría",
        settings: "Panel Administrativo - Configuración",
        health: "Panel Administrativo - Salud",
        reports: "Panel Administrativo - Reportes",
        profile: "Panel Administrativo - Perfil",
        notfound: "Panel Administrativo - 404",
    };

    document.title = titles[page] || titles["notfound"];
}

// ===== Hook useTheme equivalente =====
function useTheme() {
    return {
        theme: state.theme,
        toggle: () => {
            state.theme = state.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
            applyTheme(state.theme);
        },
    };
}

// ===== Hooks de los componentes =====
function useData() {
    // Datos simulados - en producción serían fetches API
    return {
        users: [
            {
                id: "u1",
                name: "Administrador",
                role: "admin",
                status: "active",
                lastLogin: "2024-01-20",
            },
            {
                id: "u2",
                name: "Maria Garcia",
                role: "editor",
                status: "active",
                lastLogin: "2024-01-18",
            },
            {
                id: "u3",
                name: "Juan Perez",
                role: "viewer",
                status: "inactive",
                lastLogin: "2024-01-15",
            },
            {
                id: "u4",
                name: "Laura SM",
                role: "admin",
                status: "active",
                lastLogin: "2024-01-22",
            },
            {
                id: "u5",
                name: "Carlos R.",
                role: "editor",
                status: "active",
                lastLogin: "2024-01-19",
            },
        ],
        settings: {
            companyName: "MiEmpresa S.A.",
            timezone: "UTC-5",
            dateFormat: "DD/MM/YYYY",
            emailNotifications: true,
            smsNotifications: false,
        },
        stats: {
            totalUsers: 1247,
            activeUsers: 892,
            newThisMonth: 45,
            systemsOnline: 97,
        },
        alerts: [
            {
                id: "a1",
                type: "critical",
                message: "Disco casi lleno en servidor DB",
                time: "2 min ago",
            },
            {
                id: "a2",
                type: "warning",
                message: "Uso de CPU alto en API gateway",
                time: "15 min ago",
            },
            {
                id: "a3",
                type: "info",
                message: "Backup completado exitosamente",
                time: "1 hour ago",
            },
        ],
    };
}

// ===== Páginas =====

function createOverviewPage() {
    const { stats, alerts } = useData();

    const metrica = (valor, etiqueta) =>
        crear("div", { clase: "metric-card" }, [
            crear("span", { clase: "metric-value", texto: String(valor) }),
            crear("span", { clase: "metric-label", texto: etiqueta }),
        ]);

    const alerta = (item) =>
        crear("div", { clase: `alert-item ${item.type}` }, [
            crear("span", { clase: "alert-icon", texto: item.type[0].toUpperCase() }),
            crear("div", { clase: "alert-content" }, [
                crear("span", { clase: "alert-message", texto: item.message }),
                crear("span", { clase: "alert-time", texto: item.time }),
            ]),
        ]);

    return crear("section", { clase: "reveal" }, [
        crear("div", { clase: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
            metrica(stats.totalUsers, "Usuarios totales"),
            metrica(stats.activeUsers, "Usuarios activos"),
            metrica(stats.newThisMonth, "Nuevos este mes"),
        ]),
        crear("div", { clase: "mt-6" }, [
            crear("h2", { clase: "section-heading", texto: "Estadísticas rápidas" }),
            crear("div", { clase: "grid grid-cols-2 gap-4" }, [
                metrica(`${stats.systemsOnline}%`, "Sistemas en línea"),
                metrica(alerts.length, "Alertas activas"),
            ]),
        ]),
        crear("div", { clase: "mt-6" }, [
            crear("h2", { clase: "section-heading", texto: "Alertas recientes" }),
            crear("div", { clase: "alerts-list" }, alerts.map(alerta)),
        ]),
    ]);
}

function createUsersPage() {
    const { users } = useData();
    const botonNuevo = crear("button", { clase: "btn", type: "button", texto: "Nuevo usuario" });
    botonNuevo.addEventListener("click", () => navigateTo("/new-user"));

    const encabezado = (texto) =>
        crear("th", {
            clase: "p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]",
            texto,
        });

    return crear("section", { clase: "reveal" }, [
        crear("div", { clase: "page-header" }, [
            crear("h1", { clase: "page-title", texto: "Gestión de Usuarios" }),
            crear("div", { clase: "flex items-center gap-2" }, [
                crear("input", { type: "text", clase: "input", placeholder: "Buscar usuarios..." }),
                crear("button", { clase: "btn btn-secondary", type: "button", texto: "Exportar CSV" }),
            ]),
        ]),
        crear("div", { clase: "table-responsive" }, [
            crear("table", {}, [
                crear("thead", {}, [
                    crear("tr", {}, ["Nombre", "Rol", "Estado", "Último ingreso", "Acciones"].map(encabezado)),
                ]),
                crear(
                    "tbody",
                    {},
                    users.map((user) =>
                        crear("tr", { clase: "border-b" }, [
                            crear("td", { clase: "p-4", texto: user.name }),
                            crear("td", { clase: "p-4" }, [
                                crear("span", { clase: `badge ${user.role}`, texto: user.role }),
                            ]),
                            crear("td", { clase: "p-4" }, [
                                crear("span", { clase: `status-badge ${user.status}`, texto: user.status }),
                            ]),
                            crear("td", { clase: "p-4", texto: user.lastLogin }),
                            crear("td", { clase: "p-4" }, [
                                crear("button", {
                                    clase: "btn btn-sm btn-secondary",
                                    type: "button",
                                    texto: "Editar",
                                }),
                                crear("button", { clase: "btn btn-sm", type: "button", texto: "Eliminar" }),
                            ]),
                        ]),
                    ),
                ),
            ]),
        ]),
        crear("div", { clase: "mt-6" }, [botonNuevo]),
    ]);
}

function createContentPage() {
    const metrica = (valor, etiqueta) =>
        crear("div", { clase: "metric-card" }, [
            crear("span", { clase: "metric-value", texto: valor }),
            crear("span", { clase: "metric-label", texto: etiqueta }),
        ]);

    return crear("section", { clase: "reveal" }, [
        crear("h2", { clase: "section-heading", texto: "Gestión de Contenido" }),
        crear("p", {
            clase: "text-sm text-[var(--color-ink-2)] mb-4",
            texto: "Funcionalidad de gestión de contenido en desarrollo.",
        }),
        crear("div", { clase: "grid grid-cols-2 gap-4" }, [
            metrica("1,234", "Artículos"),
            metrica("47", "Comentarios"),
        ]),
    ]);
}

function createLogsPage() {
    const { alerts } = useData();

    return crear("section", { clase: "reveal" }, [
        crear("h2", { clase: "section-heading", texto: "Log de Auditoría" }),
        crear(
            "div",
            { clase: "alerts-list" },
            alerts.map((item) =>
                crear("div", { clase: `alert-item ${item.type}` }, [
                    crear("span", { clase: "alert-icon", texto: item.type[0].toUpperCase() }),
                    crear("div", { clase: "alert-content" }, [
                        crear("span", { clase: "alert-message", texto: item.message }),
                        crear("span", { clase: "alert-time", texto: item.time }),
                    ]),
                ]),
            ),
        ),
        crear("p", {
            clase: "text-xs text-[var(--color-ink-2)] mt-4",
            texto: "Mostrando últimas 50 entradas. Use los filtros para refinar.",
        }),
    ]);
}

function createSettingsPage() {
    const grupo = (etiqueta, campo) =>
        crear("div", { clase: "setting-group" }, [
            crear("label", { clase: "setting-label", texto: etiqueta }),
            campo,
        ]);

    return crear("section", { clase: "reveal" }, [
        crear("h2", { clase: "section-heading", texto: "Configuración del Sistema" }),
        crear("div", { clase: "grid grid-cols-2 gap-6" }, [
            grupo(
                "Nombre de la empresa",
                crear("input", { type: "text", clase: "input", value: "MiEmpresa S.A." }),
            ),
            grupo(
                "Zona horaria",
                crear("select", { clase: "input" }, [
                    crear("option", { value: "UTC-5", texto: "UTC-5" }),
                    crear("option", { value: "UTC", texto: "UTC" }),
                    crear("option", { value: "UTC+1", texto: "UTC+1" }),
                ]),
            ),
            grupo(
                "Formato de fecha",
                crear("select", { clase: "input" }, [
                    crear("option", { value: "DD/MM/YYYY", texto: "DD/MM/YYYY" }),
                    crear("option", { value: "MM/DD/YYYY", texto: "MM/DD/YYYY" }),
                    crear("option", { value: "YYYY-MM-DD", texto: "YYYY-MM-DD" }),
                ]),
            ),
        ]),
        crear("div", { clase: "mt-6" }, [
            crear("label", { clase: "setting-label", texto: "Notificaciones por email" }),
            crear("label", { clase: "flex items-center gap-2" }, [
                crear("input", { type: "checkbox", clase: "checkbox", checked: true }),
                crear("span", { texto: "Activado" }),
            ]),
        ]),
        crear("div", { clase: "mt-6" }, [
            crear("button", { clase: "btn btn-primary w-full", type: "button", texto: "Guardar configuración" }),
        ]),
    ]);
}

function createHealthPage() {
    const metrica = (valor, etiqueta) =>
        crear("div", { clase: "metric-card" }, [
            crear("span", { clase: "metric-value", texto: valor }),
            crear("span", { clase: "metric-label", texto: etiqueta }),
        ]);

    return crear("section", { clase: "reveal" }, [
        crear("h2", { clase: "section-heading", texto: "Salud del Sistema" }),
        crear("div", { clase: "grid grid-cols-2 gap-4" }, [
            metrica("99.9%", "Disponibilidad"),
            metrica("45ms", "Latencia promedio"),
            metrica("12", "Conexiones activas"),
            metrica("0", "Errores críticos"),
        ]),
        crear("div", { clase: "mt-6" }, [
            crear("h3", { clase: "section-subheading", texto: "Ultima comprobación" }),
            crear("p", {
                clase: "text-sm text-[var(--color-ink-2)]",
                texto: "Hace 2 minutos. Todos los sistemas operativos normally.",
            }),
        ]),
    ]);
}

function createReportsPage() {
    const grupo = (etiqueta, opciones) =>
        crear("div", { clase: "setting-group" }, [
            crear("label", { clase: "setting-label", texto: etiqueta }),
            crear(
                "select",
                { clase: "input" },
                opciones.map(([valor, texto]) => crear("option", { value: valor, texto })),
            ),
        ]);

    return crear("section", { clase: "reveal" }, [
        crear("h2", { clase: "section-heading", texto: "Reportes" }),
        crear("div", { clase: "grid grid-cols-2 gap-4" }, [
            grupo("Tipo de reporte", [
                ["users", "Reporte de Usuarios"],
                ["activity", "Reporte de Actividad"],
                ["system", "Reporte del Sistema"],
            ]),
            grupo("Periodo", [
                ["week", "Semana actual"],
                ["month", "Mes actual"],
                ["quarter", "Trimestre actual"],
            ]),
        ]),
        crear("div", { clase: "mt-6" }, [
            crear("button", { clase: "btn btn-primary w-full", type: "button", texto: "Generar reporte" }),
        ]),
        crear("p", {
            clase: "text-sm text-[var(--color-ink-2)] mt-4",
            texto: "Los reportes se generan en formato PDF y CSV.",
        }),
    ]);
}

function createProfilePage() {
    const item = (etiqueta, campo) =>
        crear("div", { clase: "setting-item" }, [
            crear("label", { clase: "setting-label", texto: etiqueta }),
            campo,
        ]);

    return crear("section", { clase: "reveal" }, [
        crear("div", { clase: "profile-card" }, [
            crear("div", { clase: "profile-avatar", texto: "A" }),
            crear("h2", { clase: "profile-name", texto: "Administrador" }),
            crear("p", { clase: "profile-email", texto: "admin@miempresa.com" }),
        ]),
        crear("div", { clase: "mt-6" }, [
            crear("h2", { clase: "section-heading", texto: "Configuración de perfil" }),
            item(
                "Nombre display",
                crear("input", { type: "text", clase: "input", value: "Administrador" }),
            ),
            item(
                "Dirección de email",
                crear("input", {
                    type: "email",
                    clase: "input",
                    value: "admin@miempresa.com",
                    disabled: true,
                }),
            ),
            item(
                "Cambiar contraseña",
                crear("button", { clase: "btn btn-secondary", type: "button", texto: "Configurar" }),
            ),
        ]),
    ]);
}

function createNotFoundPage() {
    const boton = crear("button", { clase: "btn mt-4", type: "button", texto: "Volver al inicio" });
    boton.addEventListener("click", () => navigateTo("/"));

    return crear("section", { clase: "reveal min-h-[50vh] flex items-center justify-center" }, [
        crear("div", {}, [
            crear("h1", { clase: "text-6xl font-bold text-[var(--color-rule)]", texto: "404" }),
            crear("p", {
                clase: "text-xl text-[var(--color-ink-2)] mt-4",
                texto: "Página no encontrada",
            }),
            crear("p", {
                clase: "text-base text-[var(--color-ink-2)] mt-2",
                texto: "La página que buscas no existe.",
            }),
            boton,
        ]),
    ]);
}

// ===== Utilidades CSS =====
function addGlobalStyles() {
    const style = document.createElement("style");
    style.textContent = `
        :root {
            --color-paper: oklch(98% 0 0);
            --color-ink: oklch(20% 0 0);
            --color-ink-2: oklch(40% 0 0);
            --color-rule: oklch(85% 0 0);
            --color-accent: oklch(58% 0.25 245);
            --color-accent-2: oklch(62% 0.25 240);
            --color-accent-3: oklch(65% 0.25 235);
            --color-focus: oklch(58% 0.25 245);
        }
        
        .dark {
            --color-paper: oklch(15% 0 0);
            --color-ink: oklch(80% 0 0);
            --color-ink-2: oklch(60% 0 0);
            --color-rule: oklch(30% 0 0);
        }
        
        * { box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--color-paper);
            color: var(--color-ink);
            min-height: 100vh;
            margin: 0;
        }
        
        .dashboard { min-height: 100vh; }
        
        .sidebar {
            width: 280px;
            background-color: var(--color-paper);
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            border-right: 1px solid var(--color-rule);
            transition: transform 0.3s ease;
            z-index: 100;
        }
        
        .sidebar.open { transform: translateX(0); }
        .sidebar.closed { transform: translateX(-280px); }
        
        .main { margin-left: 280px; padding: 2rem; transition: margin-left 0.3s ease; }
        .sidebar.closed ~ .main { margin-left: 0; }

        .sidebar-brand { padding: 1.5rem 1.5rem 0.5rem; font-size: 1.25rem; font-weight: 700; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; padding: 1rem; }
        .nav-link {
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            color: var(--color-ink-2);
            text-decoration: none;
            font-size: 0.875rem;
        }
        .nav-link:hover { background: rgba(127, 127, 127, 0.12); color: var(--color-ink); }
        .nav-link.active { background: var(--color-accent); color: #fff; }
        .header-brand, .header-actions { display: flex; align-items: center; gap: 0.75rem; }
        .header-actions { justify-content: flex-end; }
        .header-title { font-weight: 600; }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--color-rule);
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .header > * { flex: 1; min-width: 200px; }
        
        .main-content { max-width: 1600px; }
        
        .section-heading {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--color-ink);
        }
        
        .section-subheading {
            font-size: 0.875rem;
            color: var(--color-ink-2);
            margin-bottom: 1.5rem;
            display: block;
        }
        
        .footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--color-rule);
            color: var(--color-ink-2);
            font-size: 0.875rem;
        }
        
        .metric-card {
            background: var(--color-paper);
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 600;
            color: var(--color-accent);
        }
        
        .metric-label {
            font-size: 0.875rem;
            color: var(--color-ink-2);
            margin-top: 0.25rem;
        }
        
        .badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge.admin { background: rgba(59, 130, 246, 0.1); color: var(--color-accent); }
        .badge.editor { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .badge.viewer { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        
        .status-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.active { background: #d1fae5; color: #059669; }
        .status-badge.inactive { background: #f3f4f6; color: #6b7280; }
        
        .alerts-list { display: flex; flex-direction: column; gap: 0.5rem; }
        
        .alert-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0;
            font-size: 0.875rem;
        }
        
        .alert-item.critical { color: #ef4444; }
        .alert-item.warning { color: #f59e0b; }
        .alert-item.info { color: #10b981; }
        
        .alert-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: bold;
        }
        
        .alert-icon.critical { background: #fee2e2; color: #ef4444; }
        .alert-item.warning { background: #fef3c7; color: #f59e0b; }
        .alert-item.info { background: #d1fae5; color: #10b981; }
        
        .table-responsive { overflow-x: auto; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; border-bottom: 1px solid var(--color-rule); }
        th { font-size: 0.75rem; color: var(--color-ink-2); text-transform: uppercase; }
        td { font-size: 0.875rem; }
        
        tr:nth-child(even) { background: rgba(59, 130, 246, 0.05); }
        
        .btn { display: inline-block; padding: 0.5rem 1rem; background: var(--color-accent); color: white; border-radius: 6px; text-decoration: none; font-size: 0.875rem; font-weight: 500; }
        .btn:hover { opacity: 0.9; }
        .btn-secondary { background: transparent; border: 1px solid var(--color-rule); color: var(--color-ink); }
        .btn-primary { background: var(--color-accent); color: white; }
        .btn-sm { padding: 0.375rem 0.5rem; font-size: 0.75rem; }
        
        .input { padding: 0.5rem; border: 1px solid var(--color-rule); border-radius: 6px; font-size: 0.875rem; }
        select.input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%236b7280'%3E%3Cpath d='M5 3l4 4L5 13'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-right: 1rem; }
        
        .checkbox { width: 1rem; height: 1rem; border: 2px solid var(--color-rule); border-radius: 3px; accent-color: var(--color-accent); cursor: pointer; }
        
        .no-js { display: none; }
        .js { display: block; }
        
        @media (max-width: 768px) {
            .sidebar { transform: translateX(-280px); }
            .sidebar.open { transform: translateX(0); }
            .main { margin-left: 0; }
            .header { flex-direction: column; text-align: center; }
            .main { margin-top: 4rem; }
        }
        
        /* --- Layout específico AppShell --- */
        .app-shell { min-height: 100vh; display: flex; }
        .app-shell > .sidebar { flex: 0 0 280px; }
        .app-shell > .main { flex: 1; padding: 2rem; }
        
        .page-header { margin-bottom: 2rem; }
        .page-title { font-size: 1.5rem; font-weight: 600; }
        
        .setting-group { margin-bottom: 1.5rem; }
        .setting-label { display: block; font-size: 0.875rem; color: var(--color-ink-2); margin-bottom: 0.5rem; }
        .setting-item { margin-bottom: 0.75rem; }
        
        .profile-card { background: var(--color-paper); padding: 2rem; border-radius: 12px; text-align: center; }
        .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: var(--color-rule); color: white; font-size: 2rem; font-weight: bold; line-height: 80px; margin: 0 auto 1rem; }
        .profile-name { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
        .profile-email { font-size: 0.875rem; color: var(--color-ink-2); }
        
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: 1fr; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        .grid-cols-sub { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        .grid-gap-4 { gap: 1rem; }
        .grid-gap-6 { gap: 1.5rem; }
        .grid-gap-8 { gap: 2rem; }
        .flex-col { flex-direction: column; }
        .items-start { align-items: start; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .space-y-8 > * + * { margin-top: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-8 { margin-top: 2rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .flex-gap-2 { gap: 0.5rem; }
        .flex-gap-4 { gap: 1rem; }
        .flex-gap-6 { gap: 1.5rem; }
    `;
    document.head.appendChild(style);
}

// Observadores de reveal
function observeReveal(selector) {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.1 },
    );
    elements.forEach((el) => observer.observe(el));
    return observer;
}

// Exportar
window.navigateTo = navigateTo;
window.dashboard = {
    navigateTo,
    navigateBack,
    toggleTheme: () => useTheme().toggle(),
    state,
};
