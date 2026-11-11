// Vanilla JS Dashboard Operativo · Pulso
// Migración desde React + Vite + Tailwind + Recharts + Zustand + jspdf + xlsx

// ===== Datos mock (serían fetch API en producción) =====
const mockData = {
    daily: [
        { d: '2026-01-18', r: 'electronica', c: 'hogar', ch: 'online', rev: 12500, ord: 3, uni: 5 },
        { d: '2026-01-17', r: 'hogar', c: 'moda', ch: 'tienda', rev: 9800, ord: 2, uni: 4 },
        { d: '2026-01-16', r: 'moda', c: 'deportes', ch: 'marketplace', rev: 7600, ord: 2, uni: 3 },
        {
            d: '2026-01-15',
            r: 'deportes',
            c: 'electronica',
            ch: 'mayorista',
            rev: 5200,
            ord: 1,
            uni: 2,
        },
        { d: '2026-01-14', r: 'electronica', c: 'hogar', ch: 'online', rev: 11200, ord: 3, uni: 4 },
        { d: '2026-01-13', r: 'hogar', c: 'moda', ch: 'tienda', rev: 8900, ord: 2, uni: 3 },
        { d: '2026-01-12', r: 'moda', c: 'deportes', ch: 'marketplace', rev: 6700, ord: 2, uni: 3 },
    ],
    weekly: [
        { id: 'w1', name: 'Semana 1', revenue: 45000 },
        { id: 'w2', name: 'Semana 2', revenue: 52000 },
        { id: 'w3', name: 'Semana 3', revenue: 48000 },
        { id: 'w4', name: 'Semana 4', revenue: 55000 },
    ],
    monthly: [
        { month: 'Ene', revenue: 180000 },
        { month: 'Feb', revenue: 210000 },
        { month: 'Mar', revenue: 195000 },
    ],
    customers: [
        { id: 'C001', name: 'TechSolutions', plan: 'Empresa', revenue: 25000 },
        { id: 'C002', name: 'DigitalPymes', plan: 'Pro', revenue: 12000 },
        { id: 'C003', name: 'GlobalCorp', plan: 'Empresa', revenue: 35000 },
    ],
    orders: [
        {
            id: 'O001',
            date: '2026-01-18',
            customer: 'TechSolutions',
            category: 'electronica',
            region: 'Norte',
            channel: 'online',
            revenue: 12500,
        },
        {
            id: 'O002',
            date: '2026-01-17',
            customer: 'DigitalPymes',
            category: 'moda',
            region: 'Sur',
            channel: 'tienda',
            revenue: 9800,
        },
        {
            id: 'O003',
            date: '2026-01-16',
            customer: 'GlobalCorp',
            category: 'deportes',
            region: 'Norte',
            channel: 'marketplace',
            revenue: 7600,
        },
    ],
    categories: [
        { id: 'electronica', name: 'Electrónica' },
        { id: 'hogar', name: 'Hogar' },
        { id: 'moda', name: 'Moda' },
        { id: 'deportes', name: 'Deportes' },
        { id: 'alimentacion', name: 'Alimentación' },
    ],
    regions: [
        { id: 'Norte', name: 'Norte' },
        { id: 'Sur', name: 'Sur' },
        { id: 'Este', name: 'Este' },
        { id: 'Oeste', name: 'Oeste' },
    ],
    channels: [
        { id: 'online', name: 'Online' },
        { id: 'tienda', name: 'Tienda física' },
        { id: 'marketplace', name: 'Marketplace' },
        { id: 'mayorista', name: 'Mayorista' },
    ],
    // Margen bruto por categoría (porcentaje estimado)
    categoryMargins: {
        electronica: 0.35,
        hogar: 0.28,
        moda: 0.42,
        deportes: 0.31,
        alimentacion: 0.15,
    },
}

const DEFAULT_FILTERS = {
    dateRange: null,
    category: null,
    region: null,
    channel: null,
}

const NAV_ITEMS = [
    { path: '/', page: 'dashboard', label: 'Resumen' },
    { path: '/kpis', page: 'kpis', label: 'KPIs' },
    { path: '/tendencias', page: 'tendencias', label: 'Tendencias' },
    { path: '/pedidos', page: 'pedidos', label: 'Órdenes' },
    { path: '/reportes', page: 'reportes', label: 'Reportes' },
    { path: '/perfil', page: 'perfil', label: 'Perfil' },
]

const PAGES = {
    dashboard: createDashboardPage,
    kpis: createKpisPage,
    tendencias: createTrendsPage,
    pedidos: createOrdersPage,
    reportes: createReportsPage,
    perfil: createProfilePage,
    notfound: createNotFoundPage,
}

const state = {
    page: 'dashboard',
    mobileOpen: false,
    period: 'diario',
}

const elements = {
    root: document.getElementById('root'),
    sidebar: null,
    main: null,
    navLinks: [],
}

// ===== Utilidades de formateo =====
const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-MX')
const compactNumberFormatter = new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    maximumFractionDigits: 1,
})

function formatCurrency(value) {
    return currencyFormatter.format(value)
}

function formatCompactCurrency(value) {
    return '$' + compactNumberFormatter.format(value)
}

function formatNumber(value) {
    return numberFormatter.format(Math.round(value))
}

function formatPercent(value, digits) {
    const decimals = digits ?? 1
    return (
        new Intl.NumberFormat('es-MX', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals,
        }).format(value * 100) + ' %'
    )
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
})

function formatDate(isoDate) {
    return dateFormatter.format(new Date(isoDate + 'T00:00:00'))
}

function formatShortDate(isoDate) {
    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'short',
    }).format(new Date(isoDate + 'T00:00:00'))
}

function formatDelta(value) {
    const sign = value > 0 ? '+' : value < 0 ? '−' : ''
    return (
        sign +
        Math.abs(value).toLocaleString('es-MX', {
            maximumFractionDigits: 1,
        }) +
        ' %'
    )
}

// ===== Tema =====
function initTheme() {
    const stored = readStoredTheme()
    const theme = stored === 'dark' || stored === 'light' ? stored : getSystemTheme()
    setTheme(theme)
    syncThemeLabels()

    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-theme-toggle]')
        if (!button) return

        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
        setTheme(next)
        syncThemeLabels()
    })
}

function syncThemeLabels() {
    const isDark = document.documentElement.dataset.theme === 'dark'
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.textContent = isDark ? 'Modo claro' : 'Modo oscuro'
    })

    const label = document.getElementById('current-theme')
    if (label) label.textContent = isDark ? 'Oscuro' : 'Claro'
}

function readStoredTheme() {
    const raw = localStorage.getItem('theme')
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.state && parsed.state.theme) return parsed.state.theme
        return typeof parsed === 'string' ? parsed : null
    } catch {
        return raw === 'dark' || raw === 'light' ? raw : null
    }
}

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function setTheme(theme) {
    const html = document.documentElement
    html.dataset.theme = theme
    html.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', JSON.stringify({ state: { theme } }))
}

// ===== Layout =====
function mountLayout() {
    if (!elements.root) return

    elements.root.innerHTML = `
        <div class="dashboard-shell">
            <aside class="sidebar" aria-label="Navegación principal">
                <div class="sidebar-brand">Pulso</div>
                <nav class="sidebar-nav">
                    ${NAV_ITEMS.map(
                        ({ path, label }) => `
                        <a href="#${path}" class="nav-link" data-page-path="${path}">${label}</a>
                    `,
                    ).join('')}
                </nav>
            </aside>

            <div class="main">
                <header class="header">
                    <div class="header-brand">
                        <button class="btn btn-secondary sidebar-toggle" type="button" aria-label="Abrir menú">Menú</button>
                        <span class="header-title">Dashboard operativo</span>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" type="button" data-theme-toggle>Modo oscuro</button>
                    </div>
                </header>

                <main class="main-content" id="page"></main>

                <footer class="footer">
                    <p>Pulso · Datos de ejemplo del dashboard operativo</p>
                </footer>
            </div>
        </div>
    `
}

function cacheElements() {
    elements.sidebar = document.querySelector('.sidebar')
    elements.main = document.getElementById('page')
    elements.navLinks = document.querySelectorAll('.nav-link')
}

// ===== Routing =====
function normalizePath(path) {
    const raw = String(path || '').replace(/^#/, '')
    if (!raw || raw === '/') return '/'
    return raw.startsWith('/') ? raw : '/' + raw
}

function pageForPath(path) {
    const item = NAV_ITEMS.find((nav) => nav.path === path)
    return item ? item.page : 'notfound'
}

function navigateTo(path, updateHash = true) {
    const normalizedPath = normalizePath(path)
    const page = pageForPath(normalizedPath)

    if (updateHash && window.location.hash !== '#' + normalizedPath) {
        window.location.hash = normalizedPath
    }

    state.page = page
    updatePageContent(page)
    updateNavState(page)
    updateTitle(page)
    applyFilters()
}

function navigateBack() {
    window.history.back()
}

function initRouting() {
    const current = () => normalizePath(window.location.hash)
    window.addEventListener('hashchange', () => navigateTo(current(), false))
    navigateTo(current(), false)
}

function initSidebar() {
    document.querySelectorAll('.sidebar-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen
            elements.sidebar?.classList.toggle('open', state.mobileOpen)
        })
    })

    elements.navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault()
            state.mobileOpen = false
            elements.sidebar?.classList.remove('open')
            navigateTo(link.getAttribute('data-page-path'))
        })
    })
}

function updateNavState(activePage) {
    elements.navLinks.forEach((link) => {
        const page = pageForPath(link.getAttribute('data-page-path'))
        link.classList.toggle('active', page === activePage)
    })
}

function updatePageContent(page) {
    if (!elements.main) return
    elements.main.innerHTML = (PAGES[page] || PAGES.notfound)()
    initExportButtons()
    initReportFilters()
    syncThemeLabels()
    observeReveal('.reveal')
}

function updateTitle(page) {
    const titles = {
        dashboard: 'Dashboard Operativo - Pulso',
        kpis: 'Dashboard Operativo - KPIs',
        tendencias: 'Dashboard Operativo - Tendencias',
        pedidos: 'Dashboard Operativo - Órdenes',
        reportes: 'Dashboard Operativo - Reportes',
        perfil: 'Dashboard Operativo - Perfil',
        notfound: 'Dashboard Operativo - 404',
    }
    document.title = titles[page] || titles.notfound
}

// ===== Store y filtros =====
function initStore() {
    const storedData = localStorage.getItem('dashboard-data')
    window.dashboardData = storedData ? JSON.parse(storedData) : mockData
    window.filters = { ...DEFAULT_FILTERS }
    window.period = state.period
}

function computeFiltered() {
    const data = window.dashboardData
    if (!data) return []

    const filters = window.filters || { ...DEFAULT_FILTERS }
    let filtered = data.daily

    if (filters.category !== null) {
        filtered = filtered.filter((row) => row.c === filters.category)
    }
    if (filters.region !== null) {
        filtered = filtered.filter((row) => row.r === filters.region)
    }
    if (filters.channel !== null) {
        filtered = filtered.filter((row) => row.ch === filters.channel)
    }
    if (filters.dateRange !== null) {
        filtered = filtered.filter(
            (row) => row.d >= filters.dateRange.from && row.d <= filters.dateRange.to,
        )
    }

    return filtered
}

function applyFilters() {
    const filtered = computeFiltered()
    window.filteredDaily = filtered
    renderKpis(filtered)
    renderTrends(filtered)
    renderOrders(filtered)
    renderReportSummary(filtered)
}

function totalsFor(rows) {
    const revenue = rows.reduce((sum, row) => sum + row.rev, 0)
    const orders = rows.reduce((sum, row) => sum + (row.ord || 1), 0)
    const units = rows.reduce((sum, row) => sum + row.uni, 0)
    const avgTicket = orders > 0 ? revenue / orders : 0
    return { revenue, orders, units, avgTicket }
}

function revenueByCategory(rows) {
    const categories = window.dashboardData.categories
    const byCategory = new Map()
    rows.forEach((row) => {
        const category = categories.find((item) => item.id === row.c)
        const name = category ? category.name : row.c
        byCategory.set(name, (byCategory.get(name) || 0) + row.rev)
    })
    return [...byCategory.entries()].map(([name, revenue]) => ({ name, revenue }))
}

// ===== Componentes =====
function kpiCard({ title, value, subtitle }) {
    return `
        <div class="metric-card">
            <span class="metric-value">${value}</span>
            <span class="metric-label">${title}</span>
            ${subtitle ? `<span class="metric-subtitle">${subtitle}</span>` : ''}
        </div>
    `
}

function renderKpis(filteredData) {
    const container = document.getElementById('kpis')
    if (!container) return

    const { revenue, orders, units, avgTicket } = totalsFor(filteredData)
    container.innerHTML =
        kpiCard({
            title: 'Ingresos totales',
            value: formatCurrency(revenue),
            subtitle: 'Periodo filtrado',
        }) +
        kpiCard({ title: 'Pedidos', value: formatNumber(orders), subtitle: 'Total' }) +
        kpiCard({ title: 'Unidades vendidas', value: formatNumber(units), subtitle: 'Total' }) +
        kpiCard({
            title: 'Ticket promedio',
            value: formatCurrency(Math.round(avgTicket)),
            subtitle: 'Por pedido',
        })
}

function renderTrends(filteredData) {
    const trendContainer =
        document.getElementById('trend-chart') || document.getElementById('chart-area')
    if (trendContainer) {
        trendContainer.replaceChildren(createAreaChart({ data: filteredData }))
    }

    const barContainer =
        document.getElementById('category-chart') || document.getElementById('chart-bar')
    if (barContainer) {
        barContainer.replaceChildren(createBarChart({ data: revenueByCategory(filteredData) }))
    }
}

function renderReportSummary(filteredData) {
    const value = document.getElementById('report-revenue')
    if (!value) return
    value.textContent = formatCurrency(totalsFor(filteredData).revenue)
}

function renderOrders(filteredData) {
    const tbody = document.getElementById('orders-body')
    if (!tbody) return

    const rows = (filteredData && filteredData.length ? filteredData : window.dashboardData.daily)
        .map(
            (row) => `
                <tr>
                    <td>${formatShortDate(row.d)}</td>
                    <td>${row.c}</td>
                    <td>${row.r}</td>
                    <td>${row.ch}</td>
                    <td>${row.ord}</td>
                    <td>${row.uni}</td>
                    <td>${formatCurrency(row.rev)}</td>
                </tr>
            `,
        )
        .join('')

    tbody.innerHTML = rows
}

// ===== Gráficas SVG =====
function createAreaChart({
    data,
    width = 520,
    height = 240,
    color = 'var(--color-pear, #9dc454)',
}) {
    const svgNS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('class', 'chart-svg')
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', 'Evolución de ingresos')

    const margin = { top: 20, right: 20, bottom: 34, left: 56 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const points = [...data].sort((a, b) => (a.d > b.d ? 1 : -1))
    const maxRevenue = points.reduce((max, row) => Math.max(max, row.rev), 0) || 1

    const x = (index) => margin.left + (index / Math.max(points.length - 1, 1)) * chartWidth
    const y = (revenue) => margin.top + chartHeight - (revenue / maxRevenue) * chartHeight

    if (points.length > 0) {
        const line = points
            .map((row, index) => `${index === 0 ? 'M' : 'L'}${x(index)},${y(row.rev)}`)
            .join(' ')
        const area = `${line} L${x(points.length - 1)},${margin.top + chartHeight} L${x(0)},${
            margin.top + chartHeight
        } Z`

        const areaPath = document.createElementNS(svgNS, 'path')
        areaPath.setAttribute('d', area)
        areaPath.setAttribute('fill', color)
        areaPath.setAttribute('opacity', '0.18')
        svg.appendChild(areaPath)

        const linePath = document.createElementNS(svgNS, 'path')
        linePath.setAttribute('d', line)
        linePath.setAttribute('fill', 'none')
        linePath.setAttribute('stroke', color)
        linePath.setAttribute('stroke-width', '2')
        svg.appendChild(linePath)

        points.forEach((row, index) => {
            const dot = document.createElementNS(svgNS, 'circle')
            dot.setAttribute('cx', String(x(index)))
            dot.setAttribute('cy', String(y(row.rev)))
            dot.setAttribute('r', '3')
            dot.setAttribute('fill', color)
            svg.appendChild(dot)

            const label = document.createElementNS(svgNS, 'text')
            label.setAttribute('x', String(x(index)))
            label.setAttribute('y', String(margin.top + chartHeight + 18))
            label.setAttribute('font-size', '10')
            label.setAttribute('text-anchor', 'middle')
            label.setAttribute('fill', 'var(--color-ink-2, #666)')
            label.textContent = formatShortDate(row.d)
            svg.appendChild(label)
        })
    }

    ;[0, 0.5, 1].forEach((ratio) => {
        const value = maxRevenue * ratio
        const tickY = y(value)

        const gridLine = document.createElementNS(svgNS, 'line')
        gridLine.setAttribute('x1', String(margin.left))
        gridLine.setAttribute('x2', String(margin.left + chartWidth))
        gridLine.setAttribute('y1', String(tickY))
        gridLine.setAttribute('y2', String(tickY))
        gridLine.setAttribute('stroke', 'var(--color-rule, #ddd)')
        gridLine.setAttribute('stroke-width', '1')
        svg.appendChild(gridLine)

        const tickLabel = document.createElementNS(svgNS, 'text')
        tickLabel.setAttribute('x', String(margin.left - 8))
        tickLabel.setAttribute('y', String(tickY + 4))
        tickLabel.setAttribute('font-size', '10')
        tickLabel.setAttribute('text-anchor', 'end')
        tickLabel.setAttribute('fill', 'var(--color-ink-2, #666)')
        tickLabel.textContent = formatCompactCurrency(value)
        svg.appendChild(tickLabel)
    })

    return svg
}

function createBarChart({ data, width = 520, height = 240, color = 'var(--color-cyan, #38bdf8)' }) {
    const svgNS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('class', 'chart-svg')
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', 'Ingresos por categoría')

    const margin = { top: 20, right: 20, bottom: 40, left: 56 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const maxRevenue = data.reduce((max, row) => Math.max(max, row.revenue), 0) || 1
    const bandWidth = chartWidth / Math.max(data.length, 1)

    data.forEach((row, index) => {
        const barHeight = (row.revenue / maxRevenue) * chartHeight
        const barX = margin.left + index * bandWidth + bandWidth * 0.15
        const barWidth = bandWidth * 0.7
        const barY = margin.top + chartHeight - barHeight

        const bar = document.createElementNS(svgNS, 'rect')
        bar.setAttribute('x', String(barX))
        bar.setAttribute('y', String(barY))
        bar.setAttribute('width', String(barWidth))
        bar.setAttribute('height', String(barHeight))
        bar.setAttribute('fill', color)
        bar.setAttribute('rx', '4')
        svg.appendChild(bar)

        const valueLabel = document.createElementNS(svgNS, 'text')
        valueLabel.setAttribute('x', String(barX + barWidth / 2))
        valueLabel.setAttribute('y', String(Math.max(barY - 6, 12)))
        valueLabel.setAttribute('font-size', '10')
        valueLabel.setAttribute('text-anchor', 'middle')
        valueLabel.setAttribute('fill', 'var(--color-ink, #222)')
        valueLabel.textContent = formatCompactCurrency(row.revenue)
        svg.appendChild(valueLabel)

        const nameLabel = document.createElementNS(svgNS, 'text')
        nameLabel.setAttribute('x', String(barX + barWidth / 2))
        nameLabel.setAttribute('y', String(margin.top + chartHeight + 18))
        nameLabel.setAttribute('font-size', '10')
        nameLabel.setAttribute('text-anchor', 'middle')
        nameLabel.setAttribute('fill', 'var(--color-ink-2, #666)')
        nameLabel.textContent = row.name.length > 10 ? row.name.slice(0, 9) + '…' : row.name
        svg.appendChild(nameLabel)
    })

    return svg
}

// ===== Páginas =====
function createDashboardPage() {
    return `
        <section class="reveal">
            <h1 class="page-title">Dashboard Operativo</h1>
            <div id="kpis" class="kpi-grid"></div>

            <div class="chart-grid">
                <div>
                    <h2 class="section-heading">Tendencia de ventas</h2>
                    <div id="chart-area" class="chart-area"></div>
                </div>
                <div>
                    <h2 class="section-heading">Distribución por categoría</h2>
                    <div id="chart-bar" class="chart-area"></div>
                </div>
            </div>

            <div class="kpi-grid">
                ${kpiCard({
                    title: 'Clientes',
                    value: formatNumber(window.dashboardData.customers.length),
                    subtitle: 'Activos',
                })}
                ${kpiCard({
                    title: 'Canales',
                    value: formatNumber(window.dashboardData.channels.length),
                    subtitle: 'Distribución',
                })}
                ${kpiCard({
                    title: 'Regiones',
                    value: formatNumber(window.dashboardData.regions.length),
                    subtitle: 'Cobertura',
                })}
            </div>
        </section>
    `
}

function createKpisPage() {
    const rows = computeFiltered()
    const { revenue, orders, units, avgTicket } = totalsFor(rows)
    const margins = window.dashboardData.categoryMargins
    const averageMargin =
        Object.values(margins).reduce((sum, value) => sum + value, 0) /
        Object.values(margins).length

    return `
        <section class="reveal">
            <h1 class="page-title">KPIs Operativos</h1>
            <div class="kpi-grid">
                ${kpiCard({ title: 'Ingresos totales', value: formatCurrency(revenue), subtitle: 'Periodo filtrado' })}
                ${kpiCard({ title: 'Total pedidos', value: formatNumber(orders), subtitle: 'Periodo filtrado' })}
                ${kpiCard({ title: 'Ticket promedio', value: formatCurrency(Math.round(avgTicket)), subtitle: 'Por pedido' })}
                ${kpiCard({ title: 'Unidades totales', value: formatNumber(units), subtitle: 'Periodo filtrado' })}
            </div>

            <div class="kpi-grid">
                ${kpiCard({
                    title: 'Clientes activos',
                    value: formatNumber(window.dashboardData.customers.length),
                    subtitle: 'En cartera',
                })}
                ${kpiCard({
                    title: 'Pedidos por día',
                    value: formatNumber(rows.length ? orders / rows.length : 0),
                    subtitle: 'Promedio',
                })}
                ${kpiCard({
                    title: 'Margen bruto medio',
                    value: formatPercent(averageMargin),
                    subtitle: 'Por categoría',
                })}
            </div>

            <div class="reveal">
                <h2 class="section-heading">Margen por categoría</h2>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Categoría</th><th>Margen</th></tr>
                        </thead>
                        <tbody>
                            ${window.dashboardData.categories
                                .map(
                                    (category) => `
                                        <tr>
                                            <td>${category.name}</td>
                                            <td>${formatPercent(margins[category.id] || 0)}</td>
                                        </tr>
                                    `,
                                )
                                .join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    `
}

function createTrendsPage() {
    const rows = computeFiltered()
    const { revenue } = totalsFor(rows)

    return `
        <section class="reveal">
            <h1 class="page-title">Tendencias</h1>

            <div class="chart-grid">
                <div>
                    <h2 class="section-heading">Ventas por día</h2>
                    <div id="trend-chart" class="chart-area"></div>
                </div>
                <div>
                    <h2 class="section-heading">Distribución por categoría</h2>
                    <div id="category-chart" class="chart-area"></div>
                </div>
            </div>

            <div class="kpi-grid">
                ${kpiCard({ title: 'Ingresos actuales', value: formatCurrency(revenue), subtitle: 'Periodo filtrado' })}
                ${kpiCard({ title: 'Crecimiento', value: formatDelta(12.5), subtitle: 'vs periodo anterior' })}
                ${kpiCard({ title: 'Pedidos', value: formatNumber(rows.length), subtitle: 'Periodo filtrado' })}
            </div>

            <div class="reveal">
                <h2 class="section-heading">Filtros activos</h2>
                <div class="filters-summary">
                    <p>Periodo: ${window.period === 'diario' ? 'Últimos 30 días' : window.period}</p>
                    ${
                        window.filters.dateRange
                            ? `<p>Rango: ${formatDate(window.filters.dateRange.from)} — ${formatDate(
                                  window.filters.dateRange.to,
                              )}</p>`
                            : ''
                    }
                    ${window.filters.category ? `<p>Categoría: ${window.filters.category}</p>` : ''}
                    ${window.filters.region ? `<p>Región: ${window.filters.region}</p>` : ''}
                    ${window.filters.channel ? `<p>Canal: ${window.filters.channel}</p>` : ''}
                </div>
            </div>
        </section>
    `
}

function createOrdersPage() {
    return `
        <section class="reveal">
            <h1 class="page-title">Órdenes recientes</h1>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Categoría</th>
                            <th>Región</th>
                            <th>Canal</th>
                            <th>Pedidos</th>
                            <th>Unidades</th>
                            <th>Ingresos</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body"></tbody>
                </table>
            </div>

            <div class="export-actions">
                <button class="btn" type="button" data-export="csv">Exportar CSV</button>
                <button class="btn btn-secondary" type="button" data-export="pdf">Exportar PDF</button>
            </div>
        </section>
    `
}

function createReportsPage() {
    const data = window.dashboardData

    return `
        <section class="reveal">
            <h1 class="page-title">Reportes</h1>

            <div class="chart-grid">
                <div>
                    <h2 class="section-heading">Reporte por categoría (CSV)</h2>
                    <p class="text-sm">Ventas agregadas por categoría en un archivo CSV.</p>
                    <button class="btn" type="button" data-export="csv">Descargar CSV</button>
                </div>
                <div>
                    <h2 class="section-heading">Reporte por categoría (PDF)</h2>
                    <p class="text-sm">Mismo reporte en PDF con la paleta del dashboard.</p>
                    <button class="btn btn-secondary" type="button" data-export="pdf">Descargar PDF</button>
                </div>
            </div>

            <div class="kpi-grid">
                <div class="metric-card">
                    <span class="metric-value" id="report-revenue">${formatCurrency(
                        totalsFor(window.filteredDaily || []).revenue,
                    )}</span>
                    <span class="metric-label">Ingresos totales</span>
                    <span class="metric-subtitle">Periodo filtrado</span>
                </div>
                ${kpiCard({
                    title: 'Categorías',
                    value: formatNumber(data.categories.length),
                    subtitle: 'Disponibles',
                })}
                ${kpiCard({ title: 'Regiones', value: formatNumber(data.regions.length), subtitle: 'Cobertura' })}
            </div>

            <div class="reveal">
                <h2 class="section-heading">Filtros</h2>
                <div class="filters-grid">
                    <label class="filter-group">
                        <span>Fecha desde</span>
                        <input type="date" id="filter-date-from" class="input" />
                    </label>
                    <label class="filter-group">
                        <span>Fecha hasta</span>
                        <input type="date" id="filter-date-to" class="input" />
                    </label>
                    <label class="filter-group">
                        <span>Categoría</span>
                        <select id="filter-category" class="input">
                            <option value="todos">Todas</option>
                            ${data.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </label>
                    <label class="filter-group">
                        <span>Región</span>
                        <select id="filter-region" class="input">
                            <option value="todos">Todas</option>
                            ${data.regions.map((r) => `<option value="${r.id}">${r.name}</option>`).join('')}
                        </select>
                    </label>
                    <label class="filter-group">
                        <span>Canal</span>
                        <select id="filter-channel" class="input">
                            <option value="todos">Todos</option>
                            ${data.channels.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </label>
                </div>
            </div>
        </section>
    `
}

function createProfilePage() {
    return `
        <section class="reveal">
            <h1 class="page-title">Perfil</h1>

            <div class="chart-grid">
                <div class="profile-card">
                    <div class="profile-avatar">OP</div>
                    <h2 class="profile-name">Operativo Pulso</h2>
                    <p class="profile-email">Dashboard operativo · analítica de ventas</p>
                </div>

                <div>
                    <h3 class="section-heading">Estadísticas</h3>
                    <div class="kpi-grid">
                        ${kpiCard({
                            title: 'Total ingresos',
                            value: formatCurrency(totalsFor(window.dashboardData.daily).revenue),
                            subtitle: 'Histórico',
                        })}
                        ${kpiCard({
                            title: 'Pedidos totales',
                            value: formatNumber(window.dashboardData.orders.length),
                            subtitle: 'Histórico',
                        })}
                    </div>

                    <h3 class="section-heading">Configuración</h3>
                    <p><strong>Tema:</strong> <span id="current-theme">${document.documentElement.dataset.theme || 'light'}</span></p>
                    <p><strong>Última actualización:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                    <button class="btn btn-secondary" type="button" data-theme-toggle>Cambiar tema</button>
                </div>
            </div>
        </section>
    `
}

function createNotFoundPage() {
    return `
        <section class="reveal">
            <h2 class="page-title">404</h2>
            <p>La página solicitada no existe.</p>
            <a href="#/" class="btn">Volver al inicio</a>
        </section>
    `
}

// ===== Exportadores =====
function aggregateByCategory(rows) {
    const categories = window.dashboardData.categories
    const result = new Map()

    rows.forEach((row) => {
        const category = categories.find((item) => item.id === row.c)
        const name = category ? category.name : row.c
        const current = result.get(name) || { revenue: 0, orders: 0, units: 0 }
        current.revenue += row.rev
        current.orders += 1
        current.units += row.uni
        result.set(name, current)
    })

    return [...result.entries()].map(([name, stats]) => ({ name, ...stats }))
}

function exportCsvReport() {
    const rows = aggregateByCategory(window.filteredDaily || window.dashboardData.daily)
    const csvRows = [
        ['Categoría', 'Ingresos (MXN)', 'Pedidos', 'Unidades'].join(','),
        ...rows.map((row) =>
            [row.name, Math.round(row.revenue), row.orders, row.units]
                .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                .join(','),
        ),
    ]

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8' })
    downloadBlob(blob, 'reporte-ventas-categorias.csv')
}

function exportPdfReport() {
    const jsPDF = window.jspdf?.jsPDF
    if (!jsPDF) {
        window.alert('No se pudo cargar jsPDF para generar el PDF.')
        return
    }

    const rows = aggregateByCategory(window.filteredDaily || window.dashboardData.daily)
    const doc = new jsPDF()
    const marginX = 14

    doc.setFillColor(38, 34, 30)
    doc.rect(0, 0, 210, 22, 'F')
    doc.setFillColor(157, 196, 84)
    doc.rect(0, 22, 210, 2, 'F')

    doc.setTextColor(252, 248, 239)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('Pulso - Dashboard operativo', marginX, 12)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Reporte de ventas por categoría', marginX, 18)

    doc.setTextColor(38, 34, 30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('Categoría', marginX, 34)
    doc.text('Ingresos (MXN)', 80, 34)
    doc.text('Pedidos', 130, 34)
    doc.text('Unidades', 165, 34)

    doc.setFont('helvetica', 'normal')
    let cursorY = 41
    rows.forEach((row) => {
        doc.text(String(row.name), marginX, cursorY)
        doc.text(formatCurrency(row.revenue).replace('$', ''), 80, cursorY)
        doc.text(String(row.orders), 130, cursorY)
        doc.text(String(row.units), 165, cursorY)
        cursorY += 7
    })

    doc.save('reporte-ventas-categorias.pdf')
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

// ===== Inicialización =====
function initExportButtons() {
    document.querySelectorAll('[data-export]').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.getAttribute('data-export') === 'pdf') exportPdfReport()
            else exportCsvReport()
        })
    })
}

function initReportFilters() {
    const from = document.getElementById('filter-date-from')
    const to = document.getElementById('filter-date-to')
    if (!from || !to) return

    const updateDateRange = () => {
        if (!from.value && !to.value) {
            window.filters.dateRange = null
        } else {
            window.filters.dateRange = {
                from: from.value || to.value,
                to: to.value || from.value,
            }
        }
        applyFilters()
    }

    from.addEventListener('change', updateDateRange)
    to.addEventListener('change', updateDateRange)

    ;[
        ['filter-category', 'category'],
        ['filter-region', 'region'],
        ['filter-channel', 'channel'],
    ].forEach(([id, key]) => {
        const select = document.getElementById(id)
        if (!select) return
        select.addEventListener('change', () => {
            window.filters[key] = select.value === 'todos' ? null : select.value
            applyFilters()
        })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    addGlobalStyles()
    initStore()
    mountLayout()
    cacheElements()
    initTheme()
    initSidebar()
    initRouting()
})

// ===== Estilos propios del dashboard =====
function addGlobalStyles() {
    const style = document.createElement('style')
    style.textContent = `
        :root {
            --color-paper: #fcf8ef;
            --color-ink: #26221e;
            --color-ink-2: #6b6259;
            --color-rule: #ded5c6;
            --color-pear: #9dc454;
            --color-cyan: #38bdf8;
        }
        .dark {
            --color-paper: #1c1a17;
            --color-ink: #f1ece2;
            --color-ink-2: #b3a99a;
            --color-rule: #3a352e;
        }
        body { margin: 0; background: var(--color-paper); color: var(--color-ink); font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .dashboard-shell { display: flex; min-height: 100vh; }
        .sidebar { width: 240px; flex: 0 0 240px; border-right: 1px solid var(--color-rule); padding: 1.5rem 1rem; }
        .sidebar-brand { font-weight: 700; font-size: 1.25rem; margin-bottom: 1.5rem; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; }
        .nav-link { padding: 0.5rem 0.75rem; border-radius: 6px; color: var(--color-ink-2); text-decoration: none; font-size: 0.9rem; }
        .nav-link:hover { background: rgba(127, 127, 127, 0.12); color: var(--color-ink); }
        .nav-link.active { background: var(--color-pear); color: #1c1a17; }
        .main { flex: 1; min-width: 0; padding: 2rem; }
        .header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-rule); }
        .header-brand, .header-actions { display: flex; align-items: center; gap: 0.75rem; }
        .header-title { font-weight: 600; }
        .main-content { max-width: 1200px; }
        .footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-rule); color: var(--color-ink-2); font-size: 0.85rem; }
        .page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 1.5rem; }
        .section-heading { font-size: 1.1rem; font-weight: 600; margin: 2rem 0 1rem; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .metric-card { display: flex; flex-direction: column; gap: 0.25rem; padding: 1rem; border: 1px solid var(--color-rule); border-radius: 10px; background: color-mix(in oklab, var(--color-paper) 80%, white 20%); }
        .metric-value { font-size: 1.5rem; font-weight: 700; }
        .metric-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-ink-2); }
        .metric-subtitle { font-size: 0.8rem; color: var(--color-ink-2); }
        .chart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .chart-area { border: 1px solid var(--color-rule); border-radius: 10px; padding: 0.75rem; }
        .chart-svg { width: 100%; height: auto; display: block; }
        .table-responsive { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--color-rule); }
        th { text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.08em; color: var(--color-ink-2); }
        .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid transparent; background: var(--color-ink); color: var(--color-paper); font-size: 0.875rem; cursor: pointer; text-decoration: none; }
        .btn-secondary { background: transparent; border-color: var(--color-rule); color: var(--color-ink); }
        .export-actions { display: flex; gap: 0.5rem; margin-top: 1.5rem; }
        .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
        .filter-group { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: var(--color-ink-2); }
        .filters-summary p { margin: 0.25rem 0; font-size: 0.9rem; color: var(--color-ink-2); }
        .profile-card { border: 1px solid var(--color-rule); border-radius: 10px; padding: 2rem; text-align: center; }
        .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--color-pear); color: #1c1a17; font-weight: 700; display: grid; place-items: center; margin: 0 auto 1rem; }
        .profile-name { font-size: 1.25rem; margin: 0 0 0.25rem; }
        .profile-email { color: var(--color-ink-2); margin: 0; }
        .text-sm { font-size: 0.9rem; color: var(--color-ink-2); }
        .reveal { opacity: 0; transform: translateY(8px); transition: opacity 0.4s ease, transform 0.4s ease; }
        .reveal.revealed { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
        @media (max-width: 820px) {
            .sidebar { position: fixed; inset: 0 auto 0 0; z-index: 20; background: var(--color-paper); transform: translateX(-100%); transition: transform 0.25s ease; }
            .sidebar.open { transform: none; }
            .main { padding: 1.25rem; }
        }
    `
    document.head.appendChild(style)
}

// Observadores IntersectionObserver
function observeReveal(selector) {
    const nodes = document.querySelectorAll(selector)
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed')
                    observer.unobserve(entry.target)
                }
            })
        },
        { threshold: 0.1 },
    )
    nodes.forEach((node) => observer.observe(node))
    return observer
}

// API pública mínima para depuración
window.dashboard = { navigateTo, navigateBack, exportCsvReport, exportPdfReport, state }
