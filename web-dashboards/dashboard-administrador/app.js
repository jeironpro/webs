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
function mountLayout() {
    const root = elements.root;
    if (!root) return;

    root.innerHTML = `
        <div class="dashboard">
            <aside class="sidebar" aria-label="Navegación principal">
                <div class="sidebar-brand">Nexo</div>
                <nav class="sidebar-nav">
                    ${NAV_ITEMS.map(
                        ({ path, label }) => `
                        <a href="#${path}" class="nav-link" data-page-path="${path}">${label}</a>
                    `,
                    ).join("")}
                </nav>
            </aside>

            <div class="main">
                <header class="header">
                    <div class="header-brand">
                        <button class="btn btn-secondary sidebar-toggle" type="button" aria-label="Abrir menú">Menú</button>
                        <span class="header-title">Consola de administración</span>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" type="button" data-theme-toggle>Modo oscuro</button>
                    </div>
                </header>

                <main class="main-content" id="page"></main>

                <footer class="footer">
                    <p>Nexo · Datos de ejemplo para la consola de administración</p>
                </footer>
            </div>
        </div>
    `;
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

    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="metric-card">
                    <span class="metric-value">${stats.totalUsers}</span>
                    <span class="metric-label">Usuarios totales</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${stats.activeUsers}</span>
                    <span class="metric-label">Usuarios activos</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${stats.newThisMonth}</span>
                    <span class="metric-label">Nuevos este mes</span>
                </div>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Estadísticas rápidas</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="metric-card">
                        <span class="metric-value">${stats.systemsOnline}%</span>
                        <span class="metric-label">Sistemas en línea</span>
                    </div>
                    <div class="metric-card">
                        <span class="metric-value">${alerts.length}</span>
                        <span class="metric-label">Alertas activas</span>
                    </div>
                </div>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Alertas recientes</h2>
                <div class="alerts-list">
                    ${alerts
                        .map(
                            (alert) => `
                        <div class="alert-item ${alert.type}">
                            <span class="alert-icon">${alert.type[0].toUpperCase()}</span>
                            <div class="alert-content">
                                <span class="alert-message">${alert.message}</span>
                                <span class="alert-time">${alert.time}</span>
                            </div>
                        </div>
                    `,
                        )
                        .join("")}
                </div>
            </div>
        </section>
    `;
    return html;
}

function createUsersPage() {
    const { users } = useData();

    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <div class="page-header">
                <h1 class="page-title">Gestión de Usuarios</h1>
                <div class="flex items-center gap-2">
                    <input type="text" class="input" placeholder="Buscar usuarios..." />
                    <button class="btn btn-secondary">Exportar CSV</button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Nombre</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Rol</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Estado</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Último ingreso</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users
                            .map(
                                (user) => `
                            <tr class="border-b">
                                <td class="p-4">${user.name}</td>
                                <td class="p-4">
                                    <span class="badge ${user.role}">${user.role}</span>
                                </td>
                                <td class="p-4">
                                    <span class="status-badge ${user.status}">${user.status}</span>
                                </td>
                                <td class="p-4">${user.lastLogin}</td>
                                <td class="p-4">
                                    <button class="btn btn-sm btn-secondary">Editar</button>
                                    <button class="btn btn-sm">Eliminar</button>
                                </td>
                            </tr>
                        `,
                            )
                            .join("")}
                    </tbody>
                </table>
            </div>
            
            <div class="mt-6">
                <button class="btn" onclick="navigateTo('/new-user')">Nuevo usuario</button>
            </div>
        </section>
    `;
    return html;
}

function createContentPage() {
    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <h2 class="section-heading">Gestión de Contenido</h2>
            <p class="text-sm text-[var(--color-ink-2)] mb-4">
                Funcionalidad de gestión de contenido en desarrollo.
            </p>
            <div class="grid grid-cols-2 gap-4">
                <div class="metric-card">
                    <span class="metric-value">1,234</span>
                    <span class="metric-label">Artículos</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">47</span>
                    <span class="metric-label">Comentarios</span>
                </div>
            </div>
        </section>
    `;
    return html;
}

function createLogsPage() {
    const { alerts } = useData();

    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <h2 class="section-heading">Log de Auditoría</h2>
            <div class="alerts-list">
                ${alerts
                    .map(
                        (alert) => `
                    <div class="alert-item ${alert.type}">
                        <span class="alert-icon">${alert.type[0].toUpperCase()}</span>
                        <div class="alert-content">
                            <span class="alert-message">${alert.message}</span>
                            <span class="alert-time">${alert.time}</span>
                        </div>
                    </div>
                `,
                    )
                    .join("")}
            </div>
            <p class="text-xs text-[var(--color-ink-2)] mt-4">
                Mostrando últimas 50 entradas. Use los filtros para refinar.
            </p>
        </section>
    `;
    return html;
}

function createSettingsPage() {
    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <h2 class="section-heading">Configuración del Sistema</h2>
            <div class="grid grid-cols-2 gap-6">
                <div class="setting-group">
                    <label class="setting-label">Nombre de la empresa</label>
                    <input type="text" class="input" value="MiEmpresa S.A." />
                </div>
                <div class="setting-group">
                    <label class="setting-label">Zona horaria</label>
                    <select class="input">
                        <option value="UTC-5">UTC-5</option>
                        <option value="UTC">UTC</option>
                        <option value="UTC+1">UTC+1</option>
                    </select>
                </div>
                <div class="setting-group">
                    <label class="setting-label">Formato de fecha</label>
                    <select class="input">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
            
            <div class="mt-6">
                <label class="setting-label">Notificaciones por email</label>
                <label class="flex items-center gap-2">
                    <input type="checkbox" checked class="checkbox" />
                    <span>Activado</span>
                </label>
            </div>
            
            <div class="mt-6">
                <button class="btn btn-primary w-full">Guardar configuración</button>
            </div>
        </section>
    `;
    return html;
}

function createHealthPage() {
    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <h2 class="section-heading">Salud del Sistema</h2>
            <div class="grid grid-cols-2 gap-4">
                <div class="metric-card">
                    <span class="metric-value">99.9%</span>
                    <span class="metric-label">Disponibilidad</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">45ms</span>
                    <span class="metric-label">Latencia promedio</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">12</span>
                    <span class="metric-label">Conexiones activas</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">0</span>
                    <span class="metric-label">Errores críticos</span>
                </div>
            </div>
            
            <div class="mt-6">
                <h3 class="section-subheading">Ultima comprobación</h2>
                <p class="text-sm text-[var(--color-ink-2)]">
                    Hace 2 minutos. Todos los sistemas operativos normally.
                </p>
            </div>
        </section>
    `;
    return html;
}

function createReportsPage() {
    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <h2 class="section-heading">Reportes</h2>
            <div class="grid grid-cols-2 gap-4">
                <div class="setting-group">
                    <label class="setting-label">Tipo de reporte</label>
                    <select class="input">
                        <option value="users">Reporte de Usuarios</option>
                        <option value="activity">Reporte de Actividad</option>
                        <option value="system">Reporte del Sistema</option>
                    </select>
                </div>
                <div class="setting-group">
                    <label class="setting-label">Periodo</label>
                    <select class="input">
                        <option value="week">Semana actual</option>
                        <option value="month">Mes actual</option>
                        <option value="quarter">Trimestre actual</option>
                    </select>
                </div>
            </div>
            
            <div class="mt-6">
                <button class="btn btn-primary w-full">Generar reporte</button>
            </div>
            
            <p class="text-sm text-[var(--color-ink-2)] mt-4">
                Los reportes se generan en formato PDF y CSV.
            </p>
        </section>
    `;
    return html;
}

function createProfilePage() {
    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal">
            <div class="profile-card">
                <div class="profile-avatar">A</div>
                <h2 class="profile-name">Administrador</h2>
                <p class="profile-email">admin@miempresa.com</p>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Configuración de perfil</h2>
                <div class="setting-item">
                    <label class="setting-label">Nombre display</label>
                    <input type="text" class="input" value="Administrador" />
                </div>
                <div class="setting-item">
                    <label class="setting-label">Dirección de email</label>
                    <input type="email" class="input" value="admin@miempresa.com" disabled />
                </div>
                <div class="setting-item">
                    <label class="setting-label">Cambiar contraseña</label>
                    <button class="btn btn-secondary">Configurar</button>
                </div>
            </div>
        </section>
    `;
    return html;
}

function createNotFoundPage() {
    const html = document.createElement("div");
    html.innerHTML = `
        <section class="reveal min-h-[50vh] flex items-center justify-center">
            <div>
                <h1 class="text-6xl font-bold text-[var(--color-rule)]">404</h1>
                <p class="text-xl text-[var(--color-ink-2)] mt-4">Página no encontrada</p>
                <p class="text-base text-[var(--color-ink-2)] mt-2">La página que buscas no existe.</p>
                <button class="btn mt-4" onclick="navigateTo('/')">Volver al inicio</button>
            </div>
        </section>
    `;
    return html;
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
