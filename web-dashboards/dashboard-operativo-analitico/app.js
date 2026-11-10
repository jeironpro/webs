// Vanilla JS Dashboard Operativo · Pulso
// Migración desde React + Vite + Tailwind + Recharts + Zustand + jspdf + xlsx

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRouting();
    initStore();
    navigateTo(window.location.pathname || '/');
});

function initTheme() {
    const html = document.documentElement;
    const stored = localStorage.getItem('theme');
    const theme = stored ? stored : 'light';
    html.dataset.theme = theme;
    html.classList.toggle('dark', theme === 'dark');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = html.dataset.theme === 'light' ? 'dark' : 'light';
            html.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }
}

function initStore() {
    // Initialize mock data and state
    const storedData = localStorage.getItem('dashboard-data');
    window.dashboardData = storedData ? JSON.parse(storedData) : mockData;
    window.filters = { ...DEFAULT_FILTERS };
    window.period = 'diario';

    // Initialize filtered data
    applyFilters();
}

function initRouting() {
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page, true);
        });
    });

    // Handle navigation via links
    document.querySelectorAll('a:not([data-page])').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.host !== window.location.host) return;
        });
    });
}

function navigateTo(path, pushHistory = true) {
    const normalizedPath = path.startsWith('/') ? path : '/' + path;

    // Determine page
    let page = 'dashboard';
    if (normalizedPath === '/') page = 'dashboard';
    else if (normalizedPath === '/kpis' || normalizedPath.substring(0, 5) === '/kpis') page = 'kpis';
    else if (normalizedPath === '/tendencias' || normalizedPath.substring(0, 11) === '/tendencias') page = 'tendencias';
    else if (normalizedPath === '/pedidos' || normalizedPath.substring(0, 7) === '/pedidos') page = 'pedidos';
    else if (normalizedPath === '/reportes' || normalizedPath.substring(0, 9) === '/reportes') page = 'reportes';
    else if (normalizedPath === '/perfil' || normalizedPath.substring(0, 7) === '/perfil') page = 'perfil';
    else page = 'notfound';

    // Update state
    window.currentPage = page;
    window.historyState = { path: normalizedPath };

    // Update URL
    if (pushHistory) {
        window.history.pushState({ path: normalizedPath }, '', normalizedPath);
    }

    // Update content
    updatePageContent(page);

    // Update title
    updateTitle(page);

    // Re-apply filters for relevant pages
    if (page === 'dashboard' || page === 'kpis' || page === 'tendencias') {
        applyFilters();
    }
}

function navigateBack() {
    window.history.back();
}

function updatePageContent(page) {
    const main = document.getElementById('root');
    if (!main) return;

    main.innerHTML = pages[page] || pages['notfound'];

    // Initialize page-specific components
    if (page === 'dashboard') initDashboard();
    if (page === 'kpis') initKpis();
    if (page === 'tendencias') initTrends();
    if (page === 'pedidos') initOrders();
    if (page === 'reportes') initReports();
    if (page === 'perfil') initProfile();

    // Observadores de reveal
    observeReveal('.reveal');
}

function updateTitle(page) {
    const titles = {
        dashboard: 'Dashboard Operativo - Pulso',
        kpis: 'Dashboard Operativo - KPIs',
        tendencias: 'Dashboard Operativo - Tendencias',
        pedidos: 'Dashboard Operativo - Órdenes',
        reportes: 'Dashboard Operativo - Reportes',
        perfil: 'Dashboard Operativo - Perfil',
        notfound: 'Dashboard Operativo - 404'
    };
    document.title = titles[page] || titles['notfound'];
}

// ===== Data Mock (serían fetch API en producción) =====
const mockData = {
    daily: [
        { d: '2026-01-18', r: 'electronica', c: 'hogar', ch: 'online', rev: 12500, ord: 3, uni: 5 },
        { d: '2026-01-17', r: 'hogar', c: 'moda', ch: 'tienda', rev: 9800, ord: 2, uni: 4 },
        { d: '2026-01-16', r: 'moda', c: 'deportes', ch: 'marketplace', rev: 7600, ord: 2, uni: 3 },
        { d: '2026-01-15', r: 'deportes', c: 'electronica', ch: 'mayorista', rev: 5200, ord: 1, uni: 2 },
        { d: '2026-01-14', r: 'electronica', c: 'hogar', ch: 'online', rev: 11200, ord: 3, uni: 4 },
        { d: '2026-01-13', r: 'hogar', c: 'moda', ch: 'tienda', rev: 8900, ord: 2, uni: 3 },
        { d: '2026-01-12', r: 'moda', c: 'deportes', ch: 'marketplace', rev: 6700, ord: 2, uni: 3 }
    ],
    weekly: [
        { id: 'w1', name: 'Semana 1', revenue: 45000 },
        { id: 'w2', name: 'Semana 2', revenue: 52000 },
        { id: 'w3', name: 'Semana 3', revenue: 48000 },
        { id: 'w4', name: 'Semana 4', revenue: 55000 }
    ],
    monthly: [
        { month: 'Ene', revenue: 180000 },
        { month: 'Feb', revenue: 210000 },
        { month: 'Mar', revenue: 195000 }
    ],
    customers: [
        { id: 'C001', name: 'TechSolutions', plan: 'Empresa', revenue: 25000 },
        { id: 'C002', name: 'DigitalPymes', plan: 'Pro', revenue: 12000 },
        { id: 'C003', name: 'GlobalCorp', plan: 'Empresa', revenue: 35000 }
    ],
    orders: [
        { id: 'O001', date: '2026-01-18', customer: 'TechSolutions', category: 'electronica', region: 'Norte', channel: 'online', revenue: 12500 },
        { id: 'O002', date: '2026-01-17', customer: 'DigitalPymes', category: 'moda', region: 'Sur', channel: 'tienda', revenue: 9800 },
        { id: 'O003', date: '2026-01-16', customer: 'GlobalCorp', category: 'deportes', region: 'Norte', channel: 'marketplace', revenue: 7600 }
    ],
    categories: [
        { id: 'electronica', name: 'Electrónica' },
        { id: 'hogar', name: 'Hogar' },
        { id: 'moda', name: 'Moda' },
        { id: 'deportes', name: 'Deportes' },
        { id: 'alimentacion', name: 'Alimentación' }
    ],
    regions: [
        { id: 'Norte', name: 'Norte' },
        { id: 'Sur', name: 'Sur' },
        { id: 'Este', name: 'Este' },
        { id: 'Oeste', name: 'Oeste' }
    ],
    channels: [
        { id: 'online', name: 'Online' },
        { id: 'tienda', name: 'Tienda física' },
        { id: 'marketplace', name: 'Marketplace' },
        { id: 'mayorista', name: 'Mayorista' }
    ],
    // Margen bruto por categoría (porcentaje estimado)
    categoryMargins: {
        electronica: 0.35,
        hogar: 0.28,
        moda: 0.42,
        deportes: 0.31,
        alimentacion: 0.15
    }
};

const DEFAULT_FILTERS = {
    dateRange: null,
    category: null,
    region: null,
    channel: null
};

// ===== Utilidades de formateo =====
const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('es-MX');
const compactNumberFormatter = new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    maximumFractionDigits: 1
});

function formatCurrency(value) {
    return currencyFormatter.format(value);
}

function formatCompactCurrency(value) {
    return '$' + compactNumberFormatter.format(value);
}

function formatNumber(value) {
    return numberFormatter.format(Math.round(value));
}

function formatPercent(value, digits) {
    digits = digits || 1;
    return (new Intl.NumberFormat('es-MX', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits
    }).format(value * 100)) + ' %';
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
});

function formatDate(isoDate) {
    return dateFormatter.format(new Date(isoDate + 'T00:00:00'));
}

function formatShortDate(isoDate) {
    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'short'
    }).format(new Date(isoDate + 'T00:00:00'));
}

function formatDelta(value) {
    const sign = value > 0 ? '+' : value < 0 ? '−' : '';
    return sign + Math.abs(value).toLocaleString('es-MX', {
        maximumFractionDigits: 1
    }) + ' %';
}

// ===== Filtros =====
function applyFilters() {
    const data = window.dashboardData;
    const filters = { ...window.filters };

    let filtered = data.daily;
    if (filters.category !== null) {
        filtered = filtered.filter(function (r) { return r.c !== filters.category; });
    }
    if (filters.region !== null) {
        filtered = filtered.filter(function (r) { return r.r !== filters.region; });
    }
    if (filters.channel !== null) {
        filtered = filtered.filter(function (r) { return r.ch !== filters.channel; });
    }
    if (filters.dateRange !== null) {
        filtered = filtered.filter(function (r) {
            const d = r.d;
            return d >= filters.dateRange.from && d <= filters.dateRange.to;
        });
    }

    window.filteredDaily = filtered;
    renderKpis(filtered);
    renderTrends(filtered);
    renderOrders();
}

// ===== Componentes =====

function KpiCard(params) {
    var title = params.title;
    var value = params.value;
    var subtitle = params.subtitle;
    var className = params.className || '';
    var container = document.createElement('div');
    container.className = 'kpi-card ' + className;
    container.innerHTML = '<div class="metric-card"><span class="metric-value">' + value + '</span><span class="metric-label">' + title + '</span>' + (subtitle ? '<span class="metric-subtitle">' + subtitle + '</span>' : '') + '</div>';
    return container.outerHTML;
}

function renderKpis(filteredData) {
    var totalRevenue = 0;
    var totalOrders = 0;
    var totalUnits = 0;

    for (var i = 0; i < filteredData.length; i++) {
        totalRevenue += filteredData[i].rev;
        totalOrders += 1;
        totalUnits += filteredData[i].uni;
    }

    var avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    var kpisElement = document.getElementById('kpis');
    if (!kpisElement) return;

    kpisElement.innerHTML =
        KpiCard({ title: 'Ingresos totales', value: formatCurrency(totalRevenue), subtitle: 'Últimos 30 días' }) +
        KpiCard({ title: 'Pedidos', value: formatNumber(totalOrders), subtitle: 'Total' }) +
        KpiCard({ title: 'Unidades vendidas', value: formatNumber(totalUnits), subtitle: 'Total' }) +
        KpiCard({ title: 'Ticket promedio', value: formatCurrency(Math.round(avgTicket)), subtitle: 'Por pedido' });
}

// Chart SVG helpers
function createAreaChart(params) {
    var data = params.data;
    var width = params.width || 300;
    var height = params.height || 100;
    var label = params.label || 'Ventas';
    var color = params.color || 'var(--color-pear)';

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('class', 'chart-svg');

    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var chartWidth = width - margin.left - margin.right;
    var chartHeight = height - margin.top - margin.bottom;

    // Area path using simple manual calculation
    var dataPoints = data.map(function (d) {
        return { x: new Date(d.d), y: d.rev };
    });

    // Simplified area chart - just draw lines and fill
    // This is a basic representation without d3

    // X axis
    var gX = document.createElementNS(svgNS, 'g');
    gX.setAttribute('transform', 'translate(' + margin.left + ', ' + (margin + chartHeight) + ')');
    gX.innerHTML = '<text x="' + (chartWidth / 2) + '" y="20" font-size="10" text-anchor="middle" fill="var(--color-ink-2)">Fecha</text>';
    svg.appendChild(gX);

    // Y axis label
    var gY = document.createElementNS(svgNS, 'g');
    gY.setAttribute('transform', 'translate(' + (margin - 5) + ', ' + margin + ')');
    gY.innerHTML = '<text x="-8" y="' + (chartHeight / 2) + '" font-size="10" text-anchor="middle" transform="rotate(-90)" fill="var(--color-ink-2)">Ingresos</text>';
    svg.appendChild(gY);

    // Simple path connecting points
    var path = document.createElementNS(svgNS, 'path');
    if (dataPoints.length > 0) {
        var d = 'M' + (margin.left) + ',' + (margin + chartHeight - 20);
        for (var i = 0; i < dataPoints.length; i++) {
            var pt = dataPoints[i];
            var x = margin.left + (i / Math.max(dataPoints.length - 1, 1)) * chartWidth;
            var y = margin + chartHeight - (pt.y / (data.reduce(function (max, r) { return Math.max(max, r.y); }, 0) || 1)) * chartHeight;
            d += ' L' + x + ',' + y;
        }
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
    }
    svg.appendChild(path);

    // X axis ticks
    var xAxisGroup = document.createElementNS(svgNS, 'g');
    xAxisGroup.setAttribute('transform', 'translate(' + margin.left + ', ' + (margin + chartHeight) + ')');
    for (var i = 0; i < data.length; i++) {
        var tick = document.createElementNS(svgNS, 'line');
        tick.setAttribute('x1', String(margin.left + (i / Math.max(data.length - 1, 1)) * chartWidth));
        tick.setAttribute('x2', String(margin.left + (i / Math.max(data.length - 1, 1)) * chartWidth));
        tick.setAttribute('y1', '0');
        tick.setAttribute('y2', '4');
        tick.setAttribute('stroke', 'var(--color-rule)');
        tick.setAttribute('stroke-width', '1');
        xAxisGroup.appendChild(tick);
    }
    svg.appendChild(xAxisGroup);

    // Y axis with ticks
    var yAxisGroup = document.createElementNS(svgNS, 'g');
    yAxisGroup.setAttribute('transform', 'translate(' + (margin - 5) + ', ' + margin + ')');
    var yTicks = Math.max(3, Math.floor(chartHeight / 30));
    for (var i = 0; i <= yTicks; i++) {
        var yVal = (chartHeight - i * (chartHeight / yTicks));
        var tick = document.createElementNS(svgNS, 'line');
        tick.setAttribute('x1', '0');
        tick.setAttribute('x2', '4');
        tick.setAttribute('y1', String(yVal));
        tick.setAttribute('y2', String(yVal));
        tick.setAttribute('stroke', 'var(--color-rule)');
        tick.setAttribute('stroke-width', '1');
        // Label
        var label = document.createElementNS(svgNS, 'text');
        label.setAttribute('x', '-8');
        label.setAttribute('y', String(yVal + 3));
        label.setAttribute('font-size', '9');
        label.setAttribute('fill', 'var(--color-ink-2)');
        label.textContent = formatCurrency(Math.round(yVal));
        yAxisGroup.appendChild(tick);
        yAxisGroup.appendChild(label);
    }
    svg.appendChild(yAxisGroup);

    return svg;
}

// Create bar chart SVG
function createBarChart(params) {
    var data = params.data;
    var width = params.width || 300;
    var height = params.height || 150;
    var orientation = params.orientation || 'horizontal';
    var color = params.color || 'var(--color-cyan)';

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('class', 'chart-svg');

    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var chartWidth = width - margin.left - margin.right;
    var chartHeight = height - margin.top - margin.bottom;

    // Simple bar chart
    var yScaleMax = 1;
    for (var i = 0; i < data.length; i++) {
        if (data[i].revenue > yScaleMax) yScaleMax = data[i].revenue;
    }

    var yScale = chartHeight / yScaleMax;
    var xBands = chartWidth / Math.max(data.length, 1);

    // Y axis
    var gY = document.createElementNS(svgNS, 'g');
    gY.setAttribute('transform', 'translate(' + (margin.left - 5) + ', ' + margin + ')');
    gY.innerHTML = '<text x="-15" y="' + (chartHeight / 2) + '" font-size="10" text-anchor="middle" transform="rotate(-90)" fill="var(--color-ink-2)">Ingresos</text>';
    svg.appendChild(gY);

    // X axis label
    var gX = document.createElementNS(svgNS, 'g');
    gX.setAttribute('transform', 'translate(' + margin.left + ', ' + (margin + chartHeight) + ')');
    gX.innerHTML = '<text x="' + (chartWidth / 2) + '" y="20" font-size="10" text-anchor="middle" fill="var(--color-ink-2)">Categoría</text>';
    svg.appendChild(gX);

    // Bars
    var bars = document.createElementNS(svgNS, 'g');
    bars.setAttribute('transform', 'translate(' + margin.left + ', ' + margin + ')');

    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var x = i * xBands + xBands / 2;
        var y = chartHeight - (d.revenue * yScale);
        var w = xBands * 0.8;
        var h = d.revenue * yScale;

        var bar = document.createElementNS(svgNS, 'rect');
        bar.setAttribute('x', String(x - w / 2));
        bar.setAttribute('y', String(y));
        bar.setAttribute('width', String(w));
        bar.setAttribute('height', String(h));
        bar.setAttribute('fill', color);
        bar.setAttribute('rx', '4');
        bar.setAttribute('ry', '4');
        bars.appendChild(bar);

        // Label
        var label = document.createElementNS(svgNS, 'text');
        label.setAttribute('x', String(x));
        label.setAttribute('y', String(y < 20 ? y + 20 : y - 5));
        label.setAttribute('font-size', '9');
        label.setAttribute('fill', 'var(--color-ink)');
        label.setAttribute('text-anchor', 'middle');
        label.textContent = d.name.substring(0, 8);
        bars.appendChild(label);
    }
    svg.appendChild(bars);

    return svg;
}

// ===== Páginas =====
var pages = {
    dashboard: createDashboardPage(),
    kpis: createKpisPage(),
    tendencias: createTrendsPage(),
    pedidos: createOrdersPage(),
    reportes: createReportsPage(),
    perfil: createProfilePage(),
    notfound: createNotFoundPage()
};

function createDashboardPage() {
    return '<section class="dashboard py-8">' +
        '<div class="max-w-7xl mx-auto px-4">' +
        '<h1 class="text-2xl font-bold mb-6">Dashboard Operativo</h1>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">' +
        KpiCard({ title: 'Ingresos', value: '$0', subtitle: 'Este mes' }) +
        KpiCard({ title: 'Pedidos', value: '0', subtitle: 'Este mes' }) +
        KpiCard({ title: 'Unidades', value: '0', subtitle: 'Este mes' }) +
        '</div>' +

        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">' +
        '<div class="reveal">' +
        '<h2 class="section-heading">Tendencia de ventas</h2>' +
        '<div id="chart-area" class="chart-area h-64"></div>' +
        '</div>' +
        '<div class="reveal">' +
        '<h2 class="section-heading">Distribución por categoría</h2>' +
        '<div id="chart-bar" class="chart-area h-64"></div>' +
        '</div>' +
        '</div>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">' +
        KpiCard({ title: 'Clientes', value: '0', subtitle: 'Activos' }) +
        KpiCard({ title: 'Canales', value: '4', subtitle: 'Distribución' }) +
        KpiCard({ title: 'Regiones', value: '4', subtitle: 'Cobertura' }) +
        '</div>' +
        '</div>' +
        '</section>';
}

function createKpisPage() {
    var data = window.dashboardData;
    var filtered = window.filteredDaily || data.daily;

    return '<section class="dashboard py-8">' +
        '<div class="max-w-7xl mx-auto px-4">' +
        '<h1 class="text-2xl font-bold mb-6">KPIs Operativos</h1>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">' +
        KpiCard({ title: 'Ingresos totales', value: formatCurrency(data.daily.reduce(function (s, r) { return s + r.rev; }, 0)), subtitle: 'Periodo completo' }) +
        KpiCard({ title: 'Total pedidos', value: formatNumber(data.daily.length), subtitle: 'Periodo completo' }) +
        KpiCard({ title: 'Ticket promedio', value: formatCurrency(Math.round(data.daily.reduce(function (s, r) { return s + r.rev; }, 0) / data.daily.length)), subtitle: 'Por pedido' }) +
        KpiCard({ title: 'Unidades totales', value: formatNumber(data.daily.reduce(function (s, r) { return s + r.uni; }, 0)), subtitle: 'Periodo completo' }) +
        '</div>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">' +
        KpiCard({ title: 'Clientes activos', value: formatNumber(data.customers.length), subtitle: '' }) +
        KpiCard({ title: 'Órdenes por día', value: formatNumber(Math.round(data.daily.length / 7)), subtitle: 'Promedio' }) +
        KpiCard({ title: 'Ingreso promedio', value: formatCurrency(Math.round(data.daily.reduce(function (s, r) { return s + r.rev; }, 0) / data.daily.length)), subtitle: 'Por pedido' }) +
        '</div>' +
        '</div>' +
        '</section>';
}

function createTrendsPage() {
    var data = window.dashboardData;
    var filtered = window.filteredDaily || data.daily;

    return '<section class="dashboard py-8">' +
        '<div class="max-w-7xl mx-auto px-4">' +
        '<h1 class="text-2xl font-bold mb-6">Tendencias</h1>' +

        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">' +
        '<div>' +
        '<h2 class="section-heading">Ventas por día (últimos 30 días)</h2>' +
        '<div id="trend-chart" class="chart-area h-64"></div>' +
        '</div>' +
        '<div>' +
        '<h2 class="section-heading">Distribución por categoría</h2>' +
        '<div id="category-chart" class="chart-area h-64"></div>' +
        '</div>' +
        '</div>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">' +
        KpiCard({ title: 'Ingresos actual', value: formatCurrency(filtered.reduce(function (s, r) { return s + r.rev; }, 0)), subtitle: 'Periodo filtrado' }) +
        KpiCard({ title: 'Crecimiento', value: '+12.5%', subtitle: 'vs periodo anterior' }) +
        KpiCard({ title: 'Pedidos este mes', value: formatNumber(filtered.length), subtitle: '' }) +
        '</div>' +

        '<div class="reveal">' +
        '<h2 class="section-heading">Filtros activos</h2>' +
        '<div class="filters-summary">' +
        '<p>Período: ' + (window.period === 'diario' ? 'Últimos 30 días' : window.period) + '</p>' +
        (window.filters.dateRange ? '<p>Rango de fechas: ' + formatShortDate(window.filters.dateRange.from) + ' - ' + formatShortDate(window.filters.dateRange.to) + '</p>' : '') +
        (window.filters.category ? '<p>Categoría: ' + window.filters.category + '</p>' : '') +
        (window.filters.region ? '<p>Región: ' + window.filters.region + '</p>' : '') +
        (window.filters.channel ? '<p>Canal: ' + window.filters.channel + '</p>' : '') +
        '</div>' +
        '</div>' +
        '</div>' +
        '</section>';
}

function createOrdersPage() {
    var data = window.dashboardData;

    return '<section class="dashboard py-8">' +
        '<div class="max-w-7xl mx-auto px-4">' +
        '<h1 class="text-2xl font-bold mb-6">Órdenes Recientes</h1>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">' +
        KpiCard({ title: 'Total pedidos', value: formatNumber(data.orders.length), subtitle: 'Periodo' }) +
        KpiCard({ title: 'Ingreso total', value: formatCurrency(data.orders.reduce(function (s, r) { return s + r.revenue; }, 0)), subtitle: '' }) +
        KpiCard({ title: 'Ticket promedio', value: formatCurrency(Math.round(data.orders.reduce(function (s, r) { return s + r.revenue; }, 0) / data.orders.length)), subtitle: '' }) +
        '</div>' +

        '<div class="table-responsive">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>ID</th>' +
        '<th>Fecha</th>' +
        '<th>Cliente</th>' +
        '<th>Categoría</th>' +
        '<th>Región</th>' +
        '<th>Canal</th>' +
        '<th>Ingresos</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        data.orders.slice(0, 10).map(function (order) {
            return '<tr>' +
            '<td>' + order.id + '</td>' +
            '<td>' + formatShortDate(order.date) + '</td>' +
            '<td>' + order.customer + '</td>' +
            '<td>' + order.category + '</td>' +
            '<td>' + order.region + '</td>' +
            '<td>' + order.channel + '</td>' +
            '<td>' + formatCurrency(order.revenue) + '</td>' +
            '</tr>';
        }).join('') +
        '</tbody>' +
        '</table>' +
        '</div>' +

        '<div class="mt-6">' +
        '<button class="btn btn-primary" onclick="exportExcel(\'ordenes\')">Exportar a Excel</button>' +
        '<button class="btn btn-secondary ml-2" onclick="exportPdf(\'ordenes\')">Exportar a PDF</button>' +
        '</div>' +
        '</div>' +
        '</section>';
}

function createReportsPage() {
    var data = window.dashboardData;

    return '<section class="dashboard py-8">' +
        '<div class="max-w-7xl mx-auto px-4">' +
        '<h1 class="text-2xl font-bold mb-6">Reportes</h1>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">' +
        '<div class="reveal">' +
        '<h2 class="section-heading">Reporte por categoría (CSV)</h2>' +
        '<p class="text-sm text-muted-foreground mb-4">Genera un archivo CSV con las ventas agregadas por categoría.</p>' +
        '<button class="btn btn-outline" onclick="exportCsvReport()">Descargar CSV</button>' +
        '</div>' +
        '<div class="reveal">' +
        '<h2 class="section-heading">Reporte por categoría (PDF)</h2>' +
        '<p class="text-sm text-muted-foreground mb-4">Genera un PDF con el reporte de ventas por categoría con la paleta del dashboard.</p>' +
        '<button class="btn btn-outline" onclick="exportPdfReport()">Descargar PDF</button>' +
        '</div>' +
        '</div>' +

        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">' +
        KpiCard({ title: 'Ingresos totales', value: formatCurrency(data.daily.reduce(function (s, r) { return s + r.rev; }, 0)), subtitle: 'Periodo' }) +
        KpiCard({ title: 'Total pedidos', value: formatNumber(data.daily.length), subtitle: '' }) +
        KpiCard({ title: 'Categorías', value: data.categories.length, subtitle: '' }) +
        KpiCard({ title: 'Regiones', value: data.regions.length, subtitle: '' }) +
        '</div>' +

        '<div class="reveal">' +
        '<h2 class="section-heading">Filtros</h2>' +
        '<div class="filters-grid">' +
        '<div class="filter-group">' +
        '<label class="label filter-label">Fecha desde</label>' +
        '<input type="date" id="filter-date-from" class="input" />' +
        '</div>' +
        '<div class="filter-group">' +
        '<label class="label filter-label">Fecha hasta</label>' +
        '<input type="date" id="filter-date-to" class="input" />' +
        '</div>' +
        '<div class="filter-group">' +
        '<label class="label filter-label">Categoría</label>' +
        '<select id="filter-category" class="select input">' +
        '<option value="todos">Todas</option>' +
        data.categories.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('') +
        '</select>' +
        '</div>' +
        '<div class="filter-group">' +
        '<label class="label filter-label">Región</label>' +
        '<select id="filter-region" class="select input">' +
        '<option value="todos">Todas</option>' +
        data.regions.map(function (r) { return '<option value="' + r.id + '">' + r.name + '</option>'; }).join('') +
        '</select>' +
        '</div>' +
        '<div class="filter-group">' +
        '<label class="label filter-label">Canal</label>' +
        '<select id="filter-channel" class="select input">' +
        '<option value="todos">Todos</option>' +
        data.channels.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('') +
        '</select>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</section>';
}

function createProfilePage() {
    return '<section class="dashboard py-8">' +
        '<div class="max-w-7xl mx-auto px-4">' +
        '<h1 class="text-2xl font-bold mb-6">Perfil</h1>' +

        '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">' +
        '<div>' +
        '<div class="avatar-lg">OP</div>' +
        '<h2 class="text-2xl font-bold mt-2">Operativo Pulso</h2>' +
        '<p class="text-muted-foreground">Dashboard administrator</p>' +
        '</div>' +

        '<div>' +
        '<h3 class="section-heading mt-4">Estadísticas</h3>' +
        '<div class="grid grid-cols-2 gap-2">' +
        '<div>' +
        '<p class="text-lg font-medium">Total ingresos</p>' +
        '<p class="text-3xl font-bold">$185,234</p>' +
        '</div>' +
        '<div>' +
        '<p class="text-lg font-medium">Pedidos totales</p>' +
        '<p class="text-3xl font-bold">1,247</p>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div>' +
        '<h3 class="section-heading mt-4">Configuración</h3>' +
        '<p><strong>Tema:</strong> <span id="current-theme" data-theme="light">Claro</span></p>' +
        '<p><strong>Última actualización:</strong> ' + new Date().toLocaleDateString('es-AR') + '</p>' +
        '<button class="btn btn-secondary w-full mt-4" onclick="toggleTheme()">Cambiar tema</button>' +
        '</div>' +
        '</div>' +
        '</section>';
}

function createNotFoundPage() {
    return '<section class="dashboard py-8">' +
        '<div class="max-w-xl mx-auto text-center py-16">' +
        '<h2 class="text-5xl font-bold mb-2">404</h2>' +
        '<p class="text-muted-foreground">La página solicitada no existe</p>' +
        '<a href="/" class="btn btn-primary mt-4">Volver al inicio</a>' +
        '</div>' +
        '</section>';
}

// ===== Exportadores simplificados =====
function exportCsvReport() {
    var data = window.filteredDaily || window.dashboardData.daily;
    var categories = window.dashboardData.categories;

    // Aggregar por categoría
    var byCategory = {};
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        var cat = categories.find(function (c) { return c.id === r.c; });
        var name = cat ? cat.name : r.c;
        if (!byCategory[name]) byCategory[name] = { revenue: 0, orders: 0, units: 0 };
        byCategory[name].revenue += r.rev;
        byCategory[name].orders += 1;
        byCategory[name].units += r.uni;
    }

    var headers = ['Categoría', 'Ingresos (MXN)', 'Pedidos', 'Unidades'];
    var rows = [];
    for (var category in byCategory) {
        var stats = byCategory[category];
        rows.push([category, formatCurrency(stats.revenue), formatNumber(stats.orders), formatNumber(stats.units)]);
    }

    var csvRows = [];
    csvRows.push(headers.join(','));
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        csvRows.push(row.map(function (v) { return v.replace(/[$,]/g, '').replace(/"/g, '""'); }).join(','));
    }

    var csv = csvRows.join('\r\n');

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'reporte-ventas-categorias.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportPdfReport() {
    var data = window.filteredDaily || window.dashboardData.daily;
    var categories = window.dashboardData.categories;

    // Agregar por categoría
    var byCategory = {};
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        var cat = categories.find(function (c) { return c.id === r.c; });
        var name = cat ? cat.name : r.c;
        if (!byCategory[name]) byCategory[name] = { revenue: 0, orders: 0, units: 0 };
        byCategory[name].revenue += r.rev;
        byCategory[name].orders += 1;
        byCategory[name].units += r.uni;
    }

    var doc = new jsPDF();
    var marginX = 14;

    // Header
    doc.setFillColor(38, 34, 30); // ink
    doc.rect(0, 0, 210, 22, 'F');
    doc.setFillColor(157, 196, 84); // pear
    doc.rect(0, 22, 210, 2, 'F');

    doc.setTextColor(252, 248, 239); // cream
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Pulso - Dashboard operativo', marginX, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de ventas por categoría', marginX, 18);

    // Table
    var head = [['Categoría', 'Ingresos (MXN)', 'Pedidos', 'Unidades']];
    var body = [];
    for (var category in byCategory) {
        var stats = byCategory[category];
        body.push([category, formatCurrency(stats.revenue).replace('$', ''), formatNumber(stats.orders), formatNumber(stats.units)]);
    }

    autoTable(doc, {
        startY: 30,
        head: head,
        body: body,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 9, textColor: [38, 34, 30], cellPadding: 3 },
        headStyles: { fillColor: [157, 196, 84], textColor: [38, 34, 30], fontStyle: 'bold' }
    });

    doc.save('reporte-ventas-categorias.pdf');
}

// ===== Event listeners =====
document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle
    var html = document.documentElement;
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var newTheme = html.dataset.theme === 'light' ? 'dark' : 'light';
            html.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }

    // Initialize with stored theme
    var stored = localStorage.getItem('theme');
    if (stored) html.dataset.theme = stored;

    // Filter inputs
    var filterDateFrom = document.getElementById('filter-date-from');
    var filterDateTo = document.getElementById('filter-date-to');
    var filterCategory = document.getElementById('filter-category');
    var filterRegion = document.getElementById('filter-region');
    var filterChannel = document.getElementById('filter-channel');

    if (filterDateFrom) {
        filterDateFrom.addEventListener('change', function () {
            window.filters.dateRange = { from: filterDateFrom.value, to: filterDateTo.value || filterDateFrom.value };
            applyFilters();
        });
    }

    if (filterDateTo) {
        filterDateTo.addEventListener('change', function () {
            window.filters.dateRange = { from: filterDateFrom.value, to: filterDateTo.value };
            applyFilters();
        });
    }

    if (filterCategory) {
        filterCategory.addEventListener('change', function (e) {
            window.filters.category = e.target.value === 'todos' ? null : e.target.value;
            applyFilters();
        });
    }

    if (filterRegion) {
        filterRegion.addEventListener('change', function (e) {
            window.filters.region = e.target.value === 'todos' ? null : e.target.value;
            applyFilters();
        });
    }

    if (filterChannel) {
        filterChannel.addEventListener('change', function (e) {
            window.filters.channel = e.target.value === 'todos' ? null : e.target.value;
            applyFilters();
        });
    }

    // Initial render
    applyFilters();
    observeReveal('.reveal');
});

// Helper functions for PDF
function $(selector) { return document.querySelector(selector); }
function text(content, x, y) { /* placeholder */ }
function autoTable() { /* placeholder - uses jspdf-autotable */ }

// Observadores IntersectionObserver
function observeReveal(selector) {
    var elements = document.querySelectorAll(selector);
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    elements.forEach(function (el) { observer.observe(el); });
    return observer;
}