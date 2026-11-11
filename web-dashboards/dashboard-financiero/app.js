// Vanilla JS Dashboard Financiero
// Migración desde React + Vite + Tailwind

// ===== Configuración y datos =====
const THEME = { LIGHT: 'light', DARK: 'dark' }

const getSystemTheme = () => {
    if (typeof window === 'undefined') return THEME.LIGHT
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME.DARK : THEME.LIGHT
}

function readStoredTheme() {
    // Todos los dashboards comparten origen y clave, y no todos guardan el mismo formato.
    const raw = localStorage.getItem('theme')
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.state && parsed.state.theme) return parsed
        if (typeof parsed === 'string') return { state: { theme: parsed } }
        return null
    } catch {
        return { state: { theme: raw } }
    }
}

const applyTheme = (theme) => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === THEME.DARK)
    localStorage.setItem('theme', JSON.stringify({ state: { theme } }))
}

const storedTheme = readStoredTheme()
const currentTheme = storedTheme
    ? storedTheme.state.theme === THEME.DARK
        ? THEME.DARK
        : THEME.LIGHT
    : getSystemTheme()
applyTheme(currentTheme)

// ===== Datos simulados =====
const dashboardData = {
    updatedAt: 'Just now',
    currentUser: 'usuario@empresa.com',
    view: 'overview',
    income: [
        { id: 'i1', name: 'Servicio Cloud', amount: 1250, category: 'SaaS', date: '2024-01-15' },
        { id: 'i2', name: 'Licencias', amount: 3800, category: 'Software', date: '2024-01-10' },
        { id: 'i3', name: 'Almacenamiento', amount: 450, category: 'Infra', date: '2024-01-20' },
        { id: 'i4', name: 'Asesoría', amount: 890, category: 'Servicios', date: '2024-01-18' },
        { id: 'i5', name: 'Soporte', amount: 230, category: 'Servicios', date: '2024-01-22' },
    ],
    expenses: [
        { id: 'e1', name: 'Servidores', amount: 850, category: 'Infra', date: '2024-01-16' },
        {
            id: 'e2',
            name: 'Software licenses',
            amount: 320,
            category: 'Software',
            date: '2024-01-12',
        },
        { id: 'e3', name: 'Nómina', amount: 4200, category: 'Personal', date: '2024-01-20' },
        { id: 'e4', name: 'Marketing', amount: 670, category: 'Crecimiento', date: '2024-01-14' },
    ],
    subscriptions: [
        {
            id: 's1',
            name: 'Pro Plan',
            price: 49,
            interval: 'monthly',
            status: 'active',
            customers: 124,
        },
        {
            id: 's2',
            name: 'Basic Plan',
            price: 19,
            interval: 'monthly',
            status: 'active',
            customers: 342,
        },
        {
            id: 's3',
            name: 'Enterprise Plan',
            price: 199,
            interval: 'yearly',
            status: 'active',
            customers: 23,
        },
        {
            id: 's4',
            name: 'Trial Plan',
            price: 0,
            interval: 'monthly',
            status: 'trial',
            customers: 56,
        },
    ],
    invoices: [
        { id: 'inv1', customer: 'Acme Corp', amount: 2800, status: 'paid', date: '2024-01-15' },
        { id: 'inv2', customer: 'Beta Ltd', amount: 1500, status: 'pending', date: '2024-01-20' },
        { id: 'inv3', customer: 'Gamma LLC', amount: 950, status: 'overdue', date: '2024-01-10' },
    ],
    payments: [
        {
            id: 'p1',
            customer: 'Acme Corp',
            amount: 2800,
            method: 'Tarjeta',
            date: '2024-01-15',
            status: 'completed',
        },
        {
            id: 'p2',
            customer: 'Beta Ltd',
            amount: 1500,
            method: 'Transferencia',
            date: '2024-01-18',
            status: 'processing',
        },
        {
            id: 'p3',
            customer: 'Gamma LLC',
            amount: 950,
            method: 'Tarjeta',
            date: '2024-01-22',
            status: 'failed',
        },
    ],
    taxSummary: {
        incomeTax: 3850,
        vat: 720,
        deductibleExpenses: 5270,
    },
    revenueMetrics: {
        mrr: 7360,
        arr: 88320,
        growth: 12.5,
        churn: 3.2,
    },
    overdueInvoices: 1,
    paidInvoices: 2,
    totalCustomers: 467,
    activeSubscriptions: 147,
}

// ===== Estado del dashboard =====
const state = {
    mobileOpen: false,
    view: 'overview',
    range: '30d',
}

// ===== Elementos del DOM =====
const elements = {
    root: document.getElementById('root'),
    sidebar: null,
    header: null,
    main: null,
    footer: null,
    navLinks: [],
}

// ===== Montaje del layout =====
const NAV_ITEMS = [
    { view: 'overview', label: 'Resumen' },
    { view: 'invoices', label: 'Facturas' },
    { view: 'payments', label: 'Pagos' },
    { view: 'reports', label: 'Reportes' },
    { view: 'subscriptions', label: 'Suscripciones' },
    { view: 'profile', label: 'Perfil' },
]

// Construye nodos sin pasar por HTML.
function crear(etiqueta, propiedades = {}, hijos = []) {
    const nodo = document.createElement(etiqueta)

    Object.entries(propiedades).forEach(([clave, valor]) => {
        if (valor === undefined || valor === null || valor === false) return
        if (clave === 'clase') nodo.className = valor
        else if (clave === 'texto') nodo.textContent = valor
        else nodo.setAttribute(clave, valor === true ? '' : String(valor))
    })

    ;[].concat(hijos).forEach((hijo) => {
        if (hijo === null || hijo === undefined || hijo === false) return
        nodo.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)))
    })

    return nodo
}

function fragmento(...hijos) {
    const trozo = document.createDocumentFragment()
    trozo.append(...hijos.filter(Boolean))
    return trozo
}

function mountLayout() {
    const root = elements.root
    if (!root) return

    const temaOscuro = currentTheme === THEME.DARK
    root.replaceChildren(
        crear('div', { clase: 'dashboard' }, [
            crear('aside', { clase: 'sidebar', 'aria-label': 'Navegación principal' }, [
                crear('div', { clase: 'sidebar-brand', texto: 'Suma' }),
                crear(
                    'nav',
                    { clase: 'sidebar-nav' },
                    NAV_ITEMS.map(({ view, label }) =>
                        crear('a', { href: `#${view}`, clase: 'nav-link', 'data-view': view, texto: label }),
                    ),
                ),
                crear('div', { clase: 'sidebar-footer' }, [
                    crear('span', { clase: 'sidebar-user', texto: dashboardData.currentUser }),
                ]),
            ]),
            crear('div', { clase: 'main' }, [
                crear('header', { clase: 'header' }, [
                    crear('div', { clase: 'header-brand' }, [
                        crear('button', {
                            clase: 'btn btn-secondary sidebar-toggle',
                            type: 'button',
                            'aria-label': 'Abrir menú',
                            texto: 'Menú',
                        }),
                        crear('span', { clase: 'header-title', texto: 'Finanzas al día' }),
                    ]),
                    crear('div', { clase: 'header-actions' }, [
                        crear('label', { clase: 'header-range' }, [
                            crear('span', { texto: 'Periodo' }),
                            crear('select', { clase: 'input', 'data-range': true }, [
                                crear('option', { value: '7d', texto: '7 días' }),
                                crear('option', { value: '30d', selected: true, texto: '30 días' }),
                                crear('option', { value: '90d', texto: '90 días' }),
                            ]),
                        ]),
                        crear('button', { clase: 'btn', type: 'button', 'data-refresh': true, texto: 'Actualizar' }),
                        crear('button', {
                            clase: 'btn btn-secondary',
                            type: 'button',
                            'data-theme-toggle': true,
                            texto: temaOscuro ? 'Modo claro' : 'Modo oscuro',
                        }),
                    ]),
                ]),
                crear('main', { id: 'view' }),
                crear('footer', { clase: 'footer' }, [
                    crear('p', { texto: `Suma · Datos de ejemplo actualizados ${dashboardData.updatedAt}` }),
                ]),
            ]),
        ]),
    )
}

function cacheElements() {
    elements.sidebar = document.querySelector('.sidebar')
    elements.header = document.querySelector('.header')
    elements.main = document.getElementById('view')
    elements.footer = document.querySelector('.footer')
    elements.navLinks = document.querySelectorAll('.nav-link')
}

function initThemeToggle() {
    const button = document.querySelector('[data-theme-toggle]')
    if (!button) return

    button.addEventListener('click', () => {
        const next = document.documentElement.classList.contains('dark') ? THEME.LIGHT : THEME.DARK
        applyTheme(next)
        button.textContent = next === THEME.DARK ? 'Modo claro' : 'Modo oscuro'
    })
}

// Inicializar después del DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    addGlobalStyles()
    mountLayout()
    cacheElements()

    initSidebar()
    initHeader()
    initThemeToggle()
    updateView(state.view)
    updateNavState(state.view)
})

// ===== Navegación =====
const viewNames = ['overview', 'invoices', 'payments', 'reports', 'subscriptions', 'profile']

function setView(view) {
    state.view = view
    updateView(view)
    updateNavState(view)
}

function updateNavState(activeView) {
    elements.navLinks.forEach((link) => {
        const view = link.getAttribute('data-view')
        if (view) {
            link.classList.toggle('active', view === activeView)
        }
    })
}

// ===== Inicializar Sidebar =====
function initSidebar() {
    const toggles = document.querySelectorAll('.sidebar-toggle')

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen
            if (elements.sidebar) {
                elements.sidebar.classList.toggle('open', state.mobileOpen)
            }
        })
    })

    // Enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link')
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const view = link.getAttribute('data-view')
            if (view && viewNames.includes(view)) {
                setView(view)
                state.mobileOpen = false
                if (elements.sidebar) {
                    elements.sidebar.classList.remove('open')
                }
            }
        })
    })
}

// ===== Inicializar Header =====
function initHeader() {
    const rangeSelector = document.querySelector('[data-range]')
    const refreshBtn = document.querySelector('[data-refresh]')
    const menuBtn = document.querySelector('[data-menu]')

    if (rangeSelector) {
        rangeSelector.addEventListener('change', (e) => {
            state.range = e.target.value
        })
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateView(state.view)
        })
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen
            if (elements.sidebar) {
                elements.sidebar.classList.toggle('open', state.mobileOpen)
            }
        })
    }
}

// ===== Actualizar vista =====
function updateView(view) {
    if (!elements.main) return

    // Actualizar título
    const titleMap = {
        overview: 'Resumen',
        invoices: 'Facturas',
        payments: 'Pagos',
        reports: 'Reportes',
        subscriptions: 'Suscripciones',
        profile: 'Perfil',
    }

    // Renderizar contenido según la vista
    const pages = {
        overview: createOverviewPage(),
        invoices: createInvoicesPage(),
        payments: createPaymentsPage(),
        reports: createReportsPage(),
        subscriptions: createSubscriptionsPage(),
        profile: createProfilePage(),
    }

    elements.main.replaceChildren(
        crear('div', { clase: 'page-header' }, [
            crear('h1', { clase: 'page-title', texto: titleMap[view] || 'Resumen' }),
        ]),
        pages[view],
    )

    // Ejecutar observers de reveal
    observeReveal('.reveal')
}

// ===== Componentes =====

function createOverviewPage() {
    const income = dashboardData.income
    const expenses = dashboardData.expenses

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const netProfit = totalIncome - totalExpenses

    const metrica = (valor, etiqueta) =>
        crear('div', { clase: 'metric-card' }, [
            crear('span', { clase: 'metric-value', texto: valor }),
            crear('span', { clase: 'metric-label', texto: etiqueta }),
        ])

    const listado = (elementos, prefijo, campo) =>
        crear(
            'div',
            { clase: `${prefijo}-grid` },
            elementos.map((item) =>
                crear('div', { clase: `${prefijo}-item` }, [
                    crear('span', { clase: `${prefijo}-name`, texto: item.name }),
                    crear('span', { clase: `${prefijo}-amount`, texto: `$${item[campo].toLocaleString()}` }),
                ]),
            ),
        )

    return crear('section', { clase: 'reveal' }, [
        crear('div', { clase: 'grid grid-cols-2 gap-4 md:grid-cols-4' }, [
            metrica(`$${totalIncome.toLocaleString()}`, 'Ingresos totales'),
            metrica(`$${totalExpenses.toLocaleString()}`, 'Gastos totales'),
            metrica(`$${netProfit.toLocaleString()}`, 'Utilidad neta'),
            metrica(`${dashboardData.revenueMetrics.mrr} MRR`, 'MRR mensual'),
        ]),
        crear('div', { clase: 'mt-6' }, [
            crear('h2', { clase: 'section-heading', texto: 'Ingresos por categoría' }),
            listado(income, 'income', 'amount'),
        ]),
        crear('div', { clase: 'mt-6' }, [
            crear('h2', { clase: 'section-heading', texto: 'Principales gastos' }),
            listado(expenses, 'expense', 'amount'),
        ]),
    ])
}

function createInvoicesPage() {
    const invoices = dashboardData.invoices
    const overdue = dashboardData.overdueInvoices
    const paid = dashboardData.paidInvoices

    const crearFactura = () =>
        crear('button', { clase: 'btn', type: 'button', texto: 'Crear factura' })
    const botonCrear = crearFactura()
    botonCrear.addEventListener('click', () => {
        window.location.href = '/new-invoice'
    })

    return fragmento(
        crear('section', { clase: 'reveal' }, [
            crear('div', { clase: 'flex items-center justify-between mb-4' }, [
                crear('h2', { clase: 'section-heading', texto: 'Facturas' }),
                crear('span', {
                    clase: 'text-sm text-[var(--color-ink-2)]',
                    texto: `${paid} pagadas • ${overdue} vencidas`,
                }),
            ]),
            crear('div', { clase: 'overflow-x-auto' }, [
                crear('table', { clase: 'min-w-full' }, [
                    crear('thead', {}, [
                        crear(
                            'tr',
                            {},
                            ['Cliente', 'Monto', 'Fecha', 'Estado'].map((titulo) =>
                                crear('th', {
                                    clase: 'p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]',
                                    texto: titulo,
                                }),
                            ),
                        ),
                    ]),
                    crear(
                        'tbody',
                        {},
                        invoices.map((invoice) =>
                            crear('tr', { clase: 'border-b' }, [
                                crear('td', { clase: 'p-4', texto: invoice.customer }),
                                crear('td', { clase: 'p-4', texto: `$${invoice.amount.toLocaleString()}` }),
                                crear('td', { clase: 'p-4', texto: invoice.date }),
                                crear('td', { clase: 'p-4' }, [
                                    crear('span', {
                                        clase: `status-badge ${invoice.status}`,
                                        texto: invoice.status,
                                    }),
                                ]),
                            ]),
                        ),
                    ),
                ]),
            ]),
        ]),
        crear('section', { clase: 'mt-6 reveal' }, [
            crear('h2', { clase: 'section-heading', texto: 'Acciones rápidas' }),
            crear('div', { clase: 'flex gap-2' }, [
                botonCrear,
                crear('button', { clase: 'btn btn-secondary', type: 'button', texto: 'Exportar CSV' }),
            ]),
        ]),
    )
}

function createPaymentsPage() {
    const payments = dashboardData.payments
    const encabezado = (titulo) =>
        crear('th', {
            clase: 'p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]',
            texto: titulo,
        })

    return crear('section', { clase: 'reveal' }, [
        crear('div', { clase: 'flex items-center justify-between mb-4' }, [
            crear('h2', { clase: 'section-heading', texto: 'Ultimos pagos' }),
        ]),
        crear('div', { clase: 'overflow-x-auto' }, [
            crear('table', { clase: 'min-w-full' }, [
                crear('thead', {}, [
                    crear('tr', {}, ['Cliente', 'Monto', 'Método', 'Fecha', 'Estado'].map(encabezado)),
                ]),
                crear(
                    'tbody',
                    {},
                    payments.map((payment) =>
                        crear('tr', { clase: 'border-b' }, [
                            crear('td', { clase: 'p-4', texto: payment.customer }),
                            crear('td', { clase: 'p-4', texto: `$${payment.amount.toLocaleString()}` }),
                            crear('td', { clase: 'p-4', texto: payment.method }),
                            crear('td', { clase: 'p-4', texto: payment.date }),
                            crear('td', { clase: 'p-4' }, [
                                crear('span', { clase: `status-badge ${payment.status}`, texto: payment.status }),
                            ]),
                        ]),
                    ),
                ),
            ]),
        ]),
    ])
}

function createReportsPage() {
    const taxSummary = dashboardData.taxSummary
    const metrica = (valor, etiqueta) =>
        crear('div', { clase: 'metric-card' }, [
            crear('span', { clase: 'metric-value', texto: valor }),
            crear('span', { clase: 'metric-label', texto: etiqueta }),
        ])

    return crear('section', { clase: 'reveal' }, [
        crear('div', { clase: 'grid grid-cols-2 gap-4' }, [
            metrica(`$${taxSummary.incomeTax.toLocaleString()}`, 'Impuesto a la renta'),
            metrica(`$${taxSummary.vat.toLocaleString()}`, 'IVA'),
            metrica(`$${taxSummary.deductibleExpenses.toLocaleString()}`, 'Gastos deducibles'),
        ]),
        crear('div', { clase: 'mt-6' }, [
            crear('h2', { clase: 'section-heading', texto: 'Resumen fiscal' }),
            crear('p', {
                clase: 'text-sm text-[var(--color-ink-2)] mb-4',
                texto: 'Declaration period: Q1 2024. All figures in USD.',
            }),
        ]),
    ])
}

function createSubscriptionsPage() {
    const subscriptions = dashboardData.subscriptions
    const active = subscriptions.filter((s) => s.status === 'active').length
    const trial = subscriptions.filter((s) => s.status === 'trial').length

    return crear('section', { clase: 'reveal' }, [
        crear('div', { clase: 'grid grid-cols-2 gap-4' }, [
            crear('div', { clase: 'metric-card' }, [
                crear('span', { clase: 'metric-value', texto: String(active) }),
                crear('span', { clase: 'metric-label', texto: 'Suscripciones activas' }),
            ]),
            crear('div', { clase: 'metric-card' }, [
                crear('span', { clase: 'metric-value', texto: String(trial) }),
                crear('span', { clase: 'metric-label', texto: 'Suscripciones trial' }),
            ]),
        ]),
        crear('div', { clase: 'mt-6' }, [
            crear('h2', { clase: 'section-heading', texto: 'Planes de suscripción' }),
            crear(
                'div',
                { clase: 'sub-grid' },
                subscriptions.map((sub) =>
                    crear('div', { clase: 'sub-item' }, [
                        crear('span', { clase: 'sub-name', texto: sub.name }),
                        crear('span', { clase: 'sub-price', texto: `$${sub.price}${sub.interval}` }),
                        crear('span', { clase: `sub-status ${sub.status}`, texto: sub.status }),
                    ]),
                ),
            ),
        ]),
    ])
}

function createProfilePage() {
    const botonTema = crear('button', {
        clase: 'btn btn-secondary mt-4',
        type: 'button',
        texto: 'Aplicar tema oscuro',
    })
    botonTema.addEventListener('click', () => {
        applyTheme('dark')
    })

    return crear('section', { clase: 'reveal' }, [
        crear('div', { clase: 'profile-card' }, [
            crear('div', { clase: 'profile-avatar', texto: 'U' }),
            crear('h2', { clase: 'profile-name', texto: 'Usuario Administrador' }),
            crear('p', { clase: 'profile-email', texto: dashboardData.currentUser }),
        ]),
        crear('div', { clase: 'mt-6' }, [
            crear('h2', { clase: 'section-heading', texto: 'Configuración de cuenta' }),
            crear('div', { clase: 'setting-item' }, [
                crear('label', { clase: 'setting-label', texto: 'Notificaciones por email' }),
                crear('select', { clase: 'input', disabled: true }, [
                    crear('option', { value: 'always', texto: 'Siempre' }),
                    crear('option', { value: 'weekly', texto: 'Semanal' }),
                    crear('option', { value: 'never', texto: 'Nunca' }),
                ]),
            ]),
            crear('div', { clase: 'setting-item' }, [
                crear('label', { clase: 'setting-label', texto: 'Tema' }),
                crear('select', { clase: 'input', id: 'theme-select' }, [
                    crear('option', { value: 'light', texto: 'Claro' }),
                    crear('option', { value: 'dark', texto: 'Oscuro' }),
                ]),
            ]),
            botonTema,
        ]),
    ])
}

// ===== Utilidades CSS =====
function addGlobalStyles() {
    const style = document.createElement('style')
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
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            background-color: var(--color-paper);
            color: var(--color-ink);
            min-height: 100vh;
            margin: 0;
        }
        
        .dashboard { min-height: 100vh; }
        
        .sidebar {
            width: 260px;
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
        .sidebar.closed { transform: translateX(-260px); }
        
        .main { margin-left: 260px; padding: 2rem; transition: margin-left 0.3s ease; }
        .sidebar.closed ~ .main { margin-left: 0; }
        
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
        
        .main { max-width: 1400px; margin-left: 260px; padding: 2rem; }

        .sidebar-brand {
            padding: 1.5rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-accent);
            border-bottom: 1px solid var(--color-rule);
        }

        .sidebar-nav { display: flex; flex-direction: column; padding: 1rem 0.75rem; gap: 0.25rem; }

        .nav-link {
            padding: 0.6rem 0.75rem;
            border-radius: 6px;
            color: var(--color-ink);
            text-decoration: none;
            font-size: 0.9rem;
        }

        .nav-link:hover { background: rgba(59, 130, 246, 0.08); }
        .nav-link.active { background: var(--color-accent); color: #fff; }

        .sidebar-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--color-rule);
            font-size: 0.8rem;
            color: var(--color-ink-2);
        }

        .header-brand { display: flex; align-items: center; gap: 0.75rem; }
        .header-title { font-weight: 600; }
        .header-actions { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .header-range { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--color-ink-2); }
        .sidebar-toggle { display: none; }

        #view { padding-bottom: 2rem; }
        
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
        
        .income-grid, .expense-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.75rem;
        }
        
        .income-item, .expense-item {
            background: white;
            padding: 0.75rem;
            border-radius: 6px;
        }
        
        .income-name, .expense-name { font-weight: 500; display: block; margin-bottom: 0.25rem; }
        .income-amount, .expense-amount { font-weight: 600; color: var(--color-accent); }
        
        .status-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.paid { background: #d1fae5; color: #059669; }
        .status-badge.pending { background: #fef3c7; color: #d97706; }
        .status-badge.overdue { background: #fee2e2; color: #dc2626; }
        
        .page { padding-top: 4rem; }
        .page-header { margin-bottom: 2rem; }
        .page-title { font-size: 1.5rem; font-weight: 600; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; border-bottom: 1px solid var(--color-rule); }
        th { font-size: 0.75rem; color: var(--color-ink-2); text-transform: uppercase; }
        td { font-size: 0.875rem; }
        
        tr:nth-child(even) { background: rgba(59, 130, 246, 0.05); }
        
        .btn { display: inline-block; padding: 0.5rem 1rem; background: var(--color-accent); color: white; border-radius: 6px; text-decoration: none; font-size: 0.875rem; font-weight: 500; }
        .btn:hover { opacity: 0.9; }
        .btn-secondary { background: transparent; border: 1px solid var(--color-rule); color: var(--color-ink); }
        .input { padding: 0.5rem; border: 1px solid var(--color-rule); border-radius: 6px; font-size: 0.875rem; }
        select.input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%236b7280'%3E%3Cpath d='M5 3l4 4L5 13'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-right: 1rem; }
        
        .no-js { display: none; }
        .js { display: block; }
        
        @media (max-width: 768px) {
            .sidebar { transform: translateX(-260px); }
            .sidebar.open { transform: translateX(0); }
            .main { margin-left: 0; padding: 1rem; padding-top: 4rem; }
            .header { flex-direction: column; text-align: center; }
            .sidebar-toggle { display: inline-block; }
        }
        
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        .grid-cols-sub { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        .grid-cols-inv { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        .grid-rows { grid-template-rows: repeat(auto-fit, minmax(150px, 1fr)); }
        .grid-gap-4 { gap: 0.75rem; }
        .grid-gap-6 { gap: 1.5rem; }
        .flex-col { flex-direction: column; }
        .items-start { align-items: start; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .flex-gap-2 { gap: 0.5rem; }
        .flex-gap-4 { gap: 1rem; }
    `
    document.head.appendChild(style)
}

// Observadores de reveal
function observeReveal(selector) {
    const elements = document.querySelectorAll(selector)
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed')
                    observer.disconnect()
                }
            })
        },
        { threshold: 0.1 },
    )
    elements.forEach((el) => observer.observe(el))
    return observer
}

// Exportar
window.dashboard = {
    setView,
    toggleMobile: () => {
        state.mobileOpen = !state.mobileOpen
    },
}
