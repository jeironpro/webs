// Vanilla JS Dashboard de Monitoreo de Infraestructura
// Migración desde React + Vite + Tailwind

// ===== Configuración y datos =====
const THEME = { LIGHT: 'light', DARK: 'dark' };

const getSystemTheme = () => {
    if (typeof window === 'undefined') return THEME.LIGHT;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME.DARK : THEME.LIGHT;
};

const applyTheme = (theme) => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === THEME.DARK);
    localStorage.setItem('theme', JSON.stringify({ state: { theme } }));
};

const storedTheme = JSON.parse(localStorage.getItem('theme'));
const currentTheme = storedTheme
    ? storedTheme.state.theme === THEME.DARK ? THEME.DARK : THEME.LIGHT
    : getSystemTheme();
applyTheme(currentTheme);

// ===== Datos simulados (serían fetch en producción) =====
const dashboardData = {
    updatedAt: 'Just now',
    currentUser: 'usuario@empresa.com',
    latencyHistory: [
        { x: '00:00', y: 45 }, { x: '01:00', y: 52 }, { x: '02:00', y: 38 },
        { x: '03:00', y: 61 }, { x: '04:00', y: 55 }, { x: '05:00', y: 48 }
    ],
    latencyAvg: 50,
    latencyMin: 38,
    latencyMax: 61,
    servers: [
        { id: 's1', name: 'Server 1', status: 'online', cpu: 45, memory: 67 },
        { id: 's2', name: 'Server 2', status: 'online', cpu: 32, memory: 45 },
        { id: 's3', name: 'Server 3', status: 'warning', cpu: 78, memory: 89 },
        { id: 's4', name: 'Server 4', status: 'online', cpu: 23, memory: 34 },
        { id: 's5', name: 'Server 5', status: 'error', cpu: 92, memory: 95 },
    ],
    recentAlerts: [
        { id: 'a1', type: 'error', message: 'High CPU on Server 5', time: '2 min ago' },
        { id: 'a2', type: 'warning', message: 'Low memory on Server 3', time: '15 min ago' },
        { id: 'a3', type: 'info', message: 'Cache refreshed', time: '1 hour ago' },
    ],
    metrics: [
        { name: 'CPU Total', value: '67%', spark: [45, 52, 38, 61, 55, 48] },
        { name: 'Memoria', value: '73%', spark: [67, 72, 89, 85, 70, 65] },
        { name: 'Disco', value: '58%', spark: [55, 62, 48, 55, 60, 52] },
        { name: 'Red', value: '45%', spark: [42, 50, 38, 45, 48, 40] },
    ],
    latencyPercentiles: { p50: 45, p95: 89, p99: 95 },
    alertCounts: { critical: 3, warning: 7, info: 15 },
    latencyHistoryData: [
        { time: '00:00', value: 45 }, { time: '01:00', value: 52 },
        { time: '02:00', value: 38 }, { time: '03:00', value: 61 },
        { time: '04:00', value: 55 }, { time: '05:00', value: 48 }
    ],
    serverHistory: [
        { time: '00:00', s1: 45, s2: 32, s3: 78, s4: 23, s5: 92 },
        { time: '01:00', s1: 52, s2: 45, s3: 89, s4: 34, s5: 95 },
        { time: '02:00', s1: 38, s2: 28, s3: 67, s4: 19, s5: 88 },
        { time: '03:00', s1: 61, s2: 35, s3: 92, s4: 28, s5: 97 },
        { time: '04:00', s1: 55, s2: 42, s3: 85, s4: 31, s5: 93 },
        { time: '05:00', s1: 48, s2: 38, s3: 79, s4: 26, s5: 90 },
    ],
    usageData: {
        labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00'],
        datasets: [
            { label: 'Entrada', data: [65, 59, 80, 81, 55, 54, 40], backgroundColor: 'rgba(59, 130, 246, 0.2)' },
            { label: 'Salida', data: [28, 48, 40, 19, 86, 27, 90], backgroundColor: 'rgba(239, 68, 68, 0.2)' }
        ]
    }
};

// ===== Estado del dashboard =====
const state = {
    mobileOpen: false,
    range: '24h',
    view: 'dashboard',
    profile: false,
    pendingSection: null
};

// ===== Elementos del DOM =====
const elements = {
    root: document.getElementById('root'),
    sidebar: null,
    header: null,
    main: null,
    footer: null
};

// Inicializar referencias después del DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    mountLayout();

    elements.sidebar = document.querySelector('.sidebar');
    elements.header = document.querySelector('.header');
    elements.main = document.querySelector('.main');
    elements.footer = document.querySelector('.footer');

    // Inicializar componentes
    initSidebar();
    initHeader();
    initThemeToggle();
    updateDashboard();
});

// ===== Montaje del layout (la plantilla solo trae #root) =====
function mountLayout() {
    const root = elements.root;
    if (!root) return;

    root.innerHTML = `
        <div class="app-shell">
            <aside class="sidebar">
                <div class="brand">
                    <span class="brand-mark">V</span>
                    <span class="brand-name">Vigía</span>
                </div>
                <nav class="nav" aria-label="Secciones del panel">
                    ${navSections
                        .map(
                            (section) => `
                        <a href="#${section.id}" class="nav-link${section.id === 'overview' ? ' active' : ''}" data-section="${section.id}">
                            <span class="nav-icon" aria-hidden="true">${section.icon}</span>
                            <span>${section.title}</span>
                        </a>`
                        )
                        .join('')}
                </nav>
            </aside>
            <div class="app-body">
                <header class="header">
                    <button type="button" class="sidebar-toggle" aria-label="Abrir menú">☰</button>
                    <div class="header-title">Observabilidad de infraestructura</div>
                    <div class="header-actions">
                        <select data-range aria-label="Rango temporal">
                            <option value="1h">Última hora</option>
                            <option value="24h" selected>Últimas 24 h</option>
                            <option value="7d">Últimos 7 días</option>
                        </select>
                        <button type="button" data-refresh>Actualizar</button>
                        <button type="button" data-theme-toggle aria-label="Cambiar tema">🌓</button>
                        <a href="#" data-profile>${dashboardData.currentUser}</a>
                    </div>
                </header>
                <main class="main" id="main"></main>
                <footer class="footer">
                    <span data-range-display>Última actualización: ${dashboardData.updatedAt}</span>
                </footer>
            </div>
        </div>
    `;
}

// ===== Tema claro/oscuro =====
function initThemeToggle() {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        applyTheme(isDark ? THEME.DARK : THEME.LIGHT);
    });
}

// ===== Hook useReveal equivalente =====
function observeReveal(selector) {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.disconnect();
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
    return observer;
}

// ===== Hook useActiveSection equivalente =====
const navSections = [
    { id: 'overview', title: 'Visión general', icon: '📊' },
    { id: 'servers', title: 'Servidores', icon: '🖥️' },
    { id: 'metrics', title: 'Métricas', icon: '📈' },
    { id: 'logs', title: 'Logs', icon: '📝' },
    { id: 'security', title: 'Seguridad', icon: '🔒' }
];

let activeSection = 'overview';

function setActiveSection(id) {
    activeSection = id;
    updateActiveState();
}

function getActiveSection() {
    return activeSection;
}

function updateActiveState() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === activeSection);
    });
}

// ===== Inicializar Sidebar =====
function initSidebar() {
    const toggles = document.querySelectorAll('.sidebar-toggle');
    const sidebarLinks = document.querySelectorAll('.nav-link');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen;
            if (elements.sidebar) {
                elements.sidebar.classList.toggle('open', state.mobileOpen);
            }
        });
    });
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                setActiveSection(section);
                state.mobileOpen = false;
                if (elements.sidebar) {
                    elements.sidebar.classList.remove('open');
                }
            }
        });
    });
}

// ===== Inicializar Header =====
function initHeader() {
    const rangeSelector = document.querySelector('[data-range]');
    const refreshBtn = document.querySelector('[data-refresh]');
    const userProfile = document.querySelector('[data-profile]');
    const menuBtn = document.querySelector('[data-menu]');
    
    if (rangeSelector) {
        rangeSelector.addEventListener('change', (e) => {
            state.range = e.target.value;
            updateRangeDisplay();
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateDashboard();
        });
    }
    
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.preventDefault();
            state.view = state.view === 'profile' ? 'dashboard' : 'profile';
            updateView();
        });
    }
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen;
            if (elements.sidebar) {
                elements.sidebar.classList.toggle('open', state.mobileOpen);
            }
        });
    }
    
    updateRangeDisplay();
}

// ===== Actualizar rango display =====
function updateRangeDisplay() {
    const rangeDisplay = document.querySelector('[data-range-display]');
    if (rangeDisplay) {
        rangeDisplay.textContent = `Última actualización: ${dashboardData.updatedAt}`;
    }
}

// ===== Actualizar dashboard =====
function updateDashboard() {
    if (!elements.main) return;

    const section = document.createElement('section');
    section.className = 'overview';
    section.innerHTML = `
        <h2 class="section-heading">Visión general</h2>
        <div class="status-summary">
            <div class="metric-card">
                <span class="metric-value">${dashboardData.latencyAvg}ms</span>
                <span class="metric-label">Latencia promedio</span>
            </div>
            <div class="metric-card">
                <span class="metric-value">${dashboardData.servers.filter((s) => s.status === 'online').length}</span>
                <span class="metric-label">Servidores en línea</span>
            </div>
            <div class="metric-card">
                <span class="metric-value">${dashboardData.alertCounts.critical}</span>
                <span class="metric-label">Alertas críticas</span>
            </div>
        </div>
    `;

    const overviewGrid = document.createElement('div');
    overviewGrid.className = 'overview-grid';
    overviewGrid.append(createLatencyChart(), createRecentAlerts());
    section.appendChild(overviewGrid);

    elements.main.innerHTML = '';
    elements.main.append(
        section,
        createServersPanel(),
        createMetricsPanels(),
        createLogsPanel(),
        createSecurityAlerts()
    );

    // Ejecutar observadores de reveal
    observeReveal('.reveal');
}

// ===== Vista de perfil =====
function updateView() {
    if (!elements.main) return;

    if (state.view !== 'profile') {
        updateDashboard();
        return;
    }

    elements.main.innerHTML = `
        <section class="profile">
            <h2 class="section-heading">Perfil</h2>
            <div class="profile-card">
                <span class="profile-avatar" aria-hidden="true">${dashboardData.currentUser[0].toUpperCase()}</span>
                <div class="profile-data">
                    <span class="profile-name">${dashboardData.currentUser}</span>
                    <span class="profile-role">Operador de infraestructura</span>
                </div>
            </div>
        </section>
    `;
}

// ===== Componentes Vanilla =====
function createLatencyChart() {
    const container = document.createElement('div');
    container.className = 'latency-chart chart';
    
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 50');
    svg.setAttribute('class', 'chart-svg');
    
    // Ejes y líneas simplificados
    const path = document.createElementNS(svgNS, 'path');
    const points = dashboardData.latencyHistoryData.map((p, i) => {
        const x = (i / (dashboardData.latencyHistoryData.length - 1)) * 200;
        const y = 50 - (p.value / 100) * 30;
        return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    });
    path.setAttribute('d', points.join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgb(59, 130, 246)');
    path.setAttribute('stroke-width', '2');
    
    // Área bajo la curva
    const areaPath = document.createElementNS(svgNS, 'path');
    const total = dashboardData.latencyHistoryData.length - 1;
    const areaPoints = dashboardData.latencyHistoryData.map((p, i) => {
        const x = (i / total) * 200;
        const y = 50 - (p.value / 100) * 30;
        return `${x},${y}`;
    });
    const areaD = `M${areaPoints[0]} ${areaPoints.slice(1).map((p) => `L${p}`).join(' ')} L200,50 L0,50 Z`;
    areaPath.setAttribute('d', areaD);
    areaPath.setAttribute('fill', 'rgba(59, 130, 246, 0.1)');
    
    svg.appendChild(path);
    svg.appendChild(areaPath);
    container.appendChild(svg);
    
    // Leyenda
    const legend = document.createElement('div');
    legend.innerHTML = `<div class="legend-item"><span class="legend-color"></span><span>Latencia</span></div>`;
    container.appendChild(legend);
    
    return container;
}

function createRecentAlerts() {
    const container = document.createElement('div');
    container.className = 'recent-alerts';
    
    const alerts = dashboardData.recentAlerts;
    if (!alerts || alerts.length === 0) {
        container.innerHTML = '<p class="no-alerts">No hay alertas recientes</p>';
        return container;
    }
    
    const html = `
        <div class="alerts-list">
            ${alerts.map(alert => `
                <div class="alert-item ${alert.type}">
                    <span class="alert-icon">${alert.type[0].toUpperCase()}</span>
                    <div class="alert-content">
                        <span class="alert-message">${alert.message}</span>
                        <span class="alert-time">${alert.time}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    return container;
}

function createServersPanel() {
    const container = document.createElement('div');
    container.className = 'servers-panel';
    
    const servers = dashboardData.servers;
    if (!servers || servers.length === 0) {
        container.innerHTML = '<p>No hay datos de servidores</p>';
        return container;
    }
    
    const html = `
        <div class="servers-grid">
            ${servers.map(server => `
                <div class="server-card ${server.status}">
                    <div class="server-info">
                        <span class="server-name">${server.name}</span>
                        <div class="server-status ${server.status}">${server.status}</div>
                    </div>
                    <div class="server-stats">
                        <span class="stat-item">
                            <span class="stat-value">${server.cpu}%</span>
                            <span class="stat-label">CPU</span>
                        </span>
                        <span class="stat-value">${server.memory}%</span>
                        <span class="stat-label">Mem.</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    return container;
}

function createMetricsPanels() {
    const container = document.createElement('div');
    container.className = 'metrics-panels';
    
    const metrics = dashboardData.metrics;
    if (!metrics || metrics.length === 0) {
        container.innerHTML = '<p>No hay datos de métricas</p>';
        return container;
    }
    
    const html = `
        <div class="metrics-grid">
            ${metrics.map(metric => `
                <div class="metric-panel">
                    <span class="metric-name">${metric.name}</span>
                    <span class="metric-value">${metric.value}</span>
                    <div class="metric-spark">
                        ${metric.spark ? metric.spark.map(v => `<span class="spark-point" style="height: ${(v / 100) * 50}%"></span>`).join('') : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    return container;
}

function createLogsPanel() {
    const container = document.createElement('div');
    container.className = 'logs-panel';
    
    const logs = [
        { time: 'Just now', message: 'Dashboard actualizado', level: 'info' },
        { time: '2 min ago', message: 'High CPU warning on Server 5', level: 'warning' },
        { time: '15 min ago', message: 'Memory threshold crossed', level: 'warning' },
        { time: '1 hour ago', message: 'Cache refreshed', level: 'info' },
    ];
    
    const html = `
        <div class="logs-list">
            ${logs.map(log => `
                <div class="log-item ${log.level}">
                    <span class="log-time">${log.time}</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    return container;
}

function createSecurityAlerts() {
    const container = document.createElement('div');
    container.className = 'security-alerts';
    
    const alerts = [
        { id: 'a1', type: 'error', message: 'High CPU on Server 5', time: '2 min ago' },
        { id: 'a2', type: 'warning', message: 'Low memory on Server 3', time: '15 min ago' },
        { id: 'a3', type: 'info', message: 'Cache refreshed', time: '1 hour ago' },
    ];
    
    const html = `
        <div class="alerts-summary">
            <div class="alert-counts">
                <span class="count critical">${dashboardData.alertCounts.critical}</span>
                <span class="count warning">${dashboardData.alertCounts.warning}</span>
                <span class="count info">${dashboardData.alertCounts.info}</span>
            </div>
            <ul class="alert-list">
                ${alerts.map(alert => `
                    <li class="alert-item ${alert.type}">
                        <span class="alert-time">${alert.time}</span>
                        <span class="alert-message">${alert.message}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
    return container;
}

// ===== Utilidades CSS =====
function addGlobalStyles() {
    const style = document.createElement('style');
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
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--color-paper);
            color: var(--color-ink);
            min-height: 100vh;
            margin: 0;
        }
        
        .dark body {
            background-color: var(--color-paper);
        }
        
        .dashboard {
            min-height: 100vh;
        }
        
        .sidebar {
            width: 240px;
            background-color: var(--color-paper);
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            border-right: 1px solid var(--color-rule);
            transition: transform 0.3s ease;
            z-index: 100;
        }
        
        .sidebar.open {
            transform: translateX(0);
        }
        
        .sidebar.closed {
            transform: translateX(-240px);
        }
        
        .main {
            margin-left: 240px;
            padding: 2rem;
            transition: margin-left 0.3s ease;
        }
        
        .sidebar.closed ~ .main {
            margin-left: 0;
        }
        
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
        
        .header > * {
            flex: 1;
            min-width: 200px;
        }
        
        .main {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .section-heading {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--color-ink);
        }
        
        .footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--color-rule);
            color: var(--color-ink-2);
            font-size: 0.875rem;
        }
        
        .chart {
            width: 100%;
            aspect-ratio: 4 / 1;
        }
        
        .chart-svg {
            width: 100%;
            height: 100%;
        }
        
        .legend {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.875rem;
        }
        
        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }
        
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        
        .metric-card {
            background: white;
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
        
        .servers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .server-card {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .server-card.warning {
            border-left: 3px solid #f59e0b;
        }
        
        .server-card.error {
            border-left: 3px solid #ef4444;
        }
        
        .server-card.online {
            border-left: 3px solid #22c55e;
        }
        
        .server-name {
            font-weight: 500;
        }
        
        .server-status {
            position: absolute;
            left: 8px;
            top: 8px;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .metric-panel {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            text-align: center;
        }
        
        .metric-name {
            font-size: 0.875rem;
            color: var(--color-ink-2);
            margin-bottom: 0.5rem;
        }
        
        .metric-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-accent);
        }
        
        .spark {
            display: flex;
            gap: 1px;
            height: 20px;
        }
        
        .spark-point {
            flex: 1;
            background-color: var(--color-rule);
            border-radius: 1px;
        }
        
        .alerts-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .alert-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: white;
            border-radius: 6px;
        }
        
        .alert-item.error { border-left: 3px solid #ef4444; }
        .alert-item.warning { border-left: 3px solid #f59e0b; }
        .alert-item.info { border-left: 3px solid #10b981; }
        
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
        
        .alert-icon.error { background: #fee2e2; color: #ef4444; }
        .alert-icon.warning { background: #fef3c7; color: #f59e0b; }
        .alert-icon.info { background: #d1fae5; color: #10b981; }
        
        .alert-content { flex: 1; }
        
        .alert-message { font-weight: 500; }
        .alert-time { font-size: 0.75rem; color: var(--color-ink-2); }
        
        .no-alerts {
            padding: 2rem;
            text-align: center;
            color: var(--color-ink-2);
        }
        
        .servers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 0.75rem;
        }
        
        .server-card {
            background: white;
            padding: 0.75rem;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .server-status {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .server-status.online { background: #d1fae5; color: #059669; }
        .server-status.warning { background: #fef3c7; color: #d97706; }
        .server-status.error { background: #fee2e2; color: #dc2626; }
        
        .metric-spark {
            display: flex;
            gap: 1px;
            height: 16px;
            margin-top: 0.25rem;
        }
        
        .spark-point {
            flex: 1;
            background-color: var(--color-rule);
            border-radius: 1px;
            height: 100%;
        }
        
        .logs-list { display: flex; flex-direction: column; gap: 0.5rem; }
        
        .log-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0;
            font-size: 0.875rem;
        }
        
        .log-item.warning { color: #f59e0b; }
        .log-item.error { color: #ef4444; }
        .log-item.info { color: #10b981; }
        
        .alert-summary { margin-top: 1rem; }
        
        .alert-counts { display: flex; gap: 1rem; margin-bottom: 1rem; }
        
        .count {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .count.critical { background: #fee2e2; color: #ef4444; }
        .count.warning { background: #fef3c7; color: #f59e0b; }
        .count.info { background: #d1fae5; color: #059669; }
        
        .alert-list { display: flex; flex-direction: column; gap: 0.5rem; }
        
        .alert-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0;
            font-size: 0.875rem;
        }
        
        .alert-item.error { color: #ef4444; }
        .alert-item.warning { color: #f59e0b; }
        .alert-item.info { color: #10b981; }
        
        .nav-link {
            display: block;
            padding: 0.5rem 1rem;
            color: var(--color-ink);
            text-decoration: none;
            border-radius: 6px;
            margin: 0.25rem 0;
            transition: background 0.2s;
        }
        
        .nav-link.active {
            background: rgba(59, 130, 246, 0.1);
        }
        
        .nav-link:hover { background: rgba(59, 130, 246, 0.05); }
        
        .nav-link[data-section]:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--color-accent);
            transform: scaleX(0);
            transition: transform 0.2s;
        }
        
        .nav-link.active:after {
            transform: scaleX(1);
        }
        
        .btn {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: var(--color-accent);
            color: white;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .btn:hover { opacity: 0.9; }
        
        .btn-secondary {
            background: transparent;
            border: 1px solid var(--color-rule);
            color: var(--color-ink);
        }
        
        .input {
            padding: 0.5rem;
            border: 1px solid var(--color-rule);
            border-radius: 6px;
            font-size: 0.875rem;
        }
        
        select.input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%236b7280'%3E%3Cpath d='M5 3l4 4L5 13'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-right: 1rem; }
        
        .no-js { display: none; }
        .js { display: block; }
        
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-240px);
            }
            
            .sidebar.open {
                transform: translateX(0);
            }
            
            .main {
                margin-left: 0;
            }
            
            .header {
                flex-direction: column;
                text-align: center;
            }
            
            .main {
                margin-top: 4rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Agregar estilos globales al cargar
document.addEventListener('DOMContentLoaded', addGlobalStyles);

// Exportar funciones para uso global
window.dashboard = {
    setActiveSection,
    getActiveSection,
    updateDashboard,
    toggleMobile: () => { state.mobileOpen = !state.mobileOpen; }
};
