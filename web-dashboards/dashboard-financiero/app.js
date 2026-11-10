// Vanilla JS Dashboard Financiero
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
        { id: 'e2', name: 'Software licenses', amount: 320, category: 'Software', date: '2024-01-12' },
        { id: 'e3', name: 'Nómina', amount: 4200, category: 'Personal', date: '2024-01-20' },
        { id: 'e4', name: 'Marketing', amount: 670, category: 'Crecimiento', date: '2024-01-14' },
    ],
    subscriptions: [
        { id: 's1', name: 'Pro Plan', price: 49, interval: 'monthly', status: 'active', customers: 124 },
        { id: 's2', name: 'Basic Plan', price: 19, interval: 'monthly', status: 'active', customers: 342 },
        { id: 's3', name: 'Enterprise Plan', price: 199, interval: 'yearly', status: 'active', customers: 23 },
        { id: 's4', name: 'Trial Plan', price: 0, interval: 'monthly', status: 'trial', customers: 56 },
    ],
    invoices: [
        { id: 'inv1', customer: 'Acme Corp', amount: 2800, status: 'paid', date: '2024-01-15' },
        { id: 'inv2', customer: 'Beta Ltd', amount: 1500, status: 'pending', date: '2024-01-20' },
        { id: 'inv3', customer: 'Gamma LLC', amount: 950, status: 'overdue', date: '2024-01-10' },
    ],
    payments: [
        { id: 'p1', customer: 'Acme Corp', amount: 2800, method: 'Tarjeta', date: '2024-01-15', status: 'completed' },
        { id: 'p2', customer: 'Beta Ltd', amount: 1500, method: 'Transferencia', date: '2024-01-18', status: 'processing' },
        { id: 'p3', customer: 'Gamma LLC', amount: 950, method: 'Tarjeta', date: '2024-01-22', status: 'failed' },
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
};

// ===== Estado del dashboard =====
const state = {
    mobileOpen: false,
    view: 'overview',
    range: '30d',
};

// ===== Elementos del DOM =====
const elements = {
    root: document.getElementById('root'),
    sidebar: null,
    header: null,
    main: null,
    footer: null,
    navLinks: [],
};

// Inicializar después del DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    elements.sidebar = document.querySelector('.sidebar');
    elements.header = document.querySelector('.header');
    elements.main = document.querySelector('.main');
    elements.footer = document.querySelector('.footer');
    elements.navLinks = document.querySelectorAll('.nav-link');
    
    initSidebar();
    initHeader();
    initThemeToggle();
    updateView(currentTheme);
});

// ===== Hook useDashboardData equivalente =====
function useDashboardData() {
    return { ...dashboardData };
}

// ===== Navegación =====
const viewNames = ['overview', 'invoices', 'payments', 'reports', 'subscriptions', 'profile'];

function setView(view) {
    state.view = view;
    updateView(view);
    updateNavState(view);
}

function updateNavState(activeView) {
    elements.navLinks.forEach(link => {
        const view = link.getAttribute('data-view');
        if (view) {
            link.classList.toggle('active', view === activeView);
        }
    });
}

// ===== Inicializar Sidebar =====
function initSidebar() {
    const toggles = document.querySelectorAll('.sidebar-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen;
            if (elements.sidebar) {
                elements.sidebar.classList.toggle('open', state.mobileOpen);
            }
        });
    });
    
    // Enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            if (view && viewNames.includes(view)) {
                setView(view);
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
    const menuBtn = document.querySelector('[data-menu]');
    
    if (rangeSelector) {
        rangeSelector.addEventListener('change', (e) => {
            state.range = e.target.value;
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateView(state.view);
        });
    }
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen;
            if (elements.sidebar) {
                elements.sidebar.classList.toggle('open', state.mobileOpen);
            }
        });
    });
}

// ===== Actualizar vista =====
function updateView(view) {
    if (!elements.main) return;
    
    // Actualizar título
    const titleMap = {
        overview: 'Resumen',
        invoices: 'Facturas',
        payments: 'Pagos',
        reports: 'Reportes',
        subscriptions: 'Suscripciones',
        profile: 'Perfil',
    };
    
    // Renderizar contenido según la vista
    const pages = {
        overview: createOverviewPage(),
        invoices: createInvoicesPage(),
        payments: createPaymentsPage(),
        reports: createReportsPage(),
        subscriptions: createSubscriptionsPage(),
        profile: createProfilePage(),
    };
    
    elements.main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">${titleMap[view] || 'Resumen'}</h1>
        </div>
        ${pages[view].outerHTML}
    `;
    
    // Ejecutar observers de reveal
    observeReveal('.reveal');
}

// ===== Componentes =====

function createOverviewPage() {
    const income = dashboardData.income;
    const expenses = dashboardData.expenses;
    
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    
    const html = document.createElement('div');
    html.innerHTML = `
        <section class="reveal">
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div class="metric-card">
                    <span class="metric-value">$${totalIncome.toLocaleString()}</span>
                    <span class="metric-label">Ingresos totales</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">$${totalExpenses.toLocaleString()}</span>
                    <span class="metric-label">Gastos totales</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">$${netProfit.toLocaleString()}</span>
                    <span class="metric-label">Utilidad neta</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${dashboardData.revenueMetrics.mrr} MRR</span>
                    <span class="metric-label">MRR mensual</span>
                </div>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Ingresos por categoría</h2>
                <div class="income-grid">
                    ${income.map(item => `
                        <div class="income-item">
                            <span class="income-name">${item.name}</span>
                            <span class="income-amount">$${item.amount.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Principales gastos</h2>
                <div class="expense-grid">
                    ${expenses.map(item => `
                        <div class="expense-item">
                            <span class="expense-name">${item.name}</span>
                            <span class="expense-amount">$${item.amount.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
    return html;
}

function createInvoicesPage() {
    const invoices = dashboardData.invoices;
    const overdue = dashboardData.overdueInvoices;
    const paid = dashboardData.paidInvoices;
    
    const html = document.createElement('div');
    html.innerHTML = `
        <section class="reveal">
            <div class="flex items-center justify-between mb-4">
                <h2 class="section-heading">Facturas</h2>
                <span class="text-sm text-[var(--color-ink-2)]">${paid} pagadas • ${overdue} vencidas</span>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Cliente</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Monto</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Fecha</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoices.map(invoice => `
                            <tr class="border-b">
                                <td class="p-4">${invoice.customer}</td>
                                <td class="p-4">$${invoice.amount.toLocaleString()}</td>
                                <td class="p-4">${invoice.date}</td>
                                <td class="p-4">
                                    <span class="status-badge ${invoice.status}">${invoice.status}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
        
        <section class="mt-6 reveal">
            <h2 class="section-heading">Acciones rápidas</h2>
            <div class="flex gap-2">
                <button class="btn" onclick="window.location.href='/new-invoice'">Crear factura</button>
                <button class="btn btn-secondary">Exportar CSV</button>
            </div>
        </section>
    `;
    return html;
}

function createPaymentsPage() {
    const payments = dashboardData.payments;
    
    const html = document.createElement('div');
    html.innerHTML = `
        <section class="reveal">
            <div class="flex items-center justify-between mb-4">
                <h2 class="section-heading">Ultimos pagos</h2>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Cliente</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Monto</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Método</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Fecha</th>
                            <th class="p-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-ink-2)]">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payments.map(payment => `
                            <tr class="border-b">
                                <td class="p-4">${payment.customer}</td>
                                <td class="p-4">$${payment.amount.toLocaleString()}</td>
                                <td class="p-4">${payment.method}</td>
                                <td class="p-4">${payment.date}</td>
                                <td class="p-4">
                                    <span class="status-badge ${payment.status}">${payment.status}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;
    return html;
}

function createReportsPage() {
    const taxSummary = dashboardData.taxSummary;
    
    const html = document.createElement('div');
    html.innerHTML = `
        <section class="reveal">
            <div class="grid grid-cols-2 gap-4">
                <div class="metric-card">
                    <span class="metric-value">$${taxSummary.incomeTax.toLocaleString()}</span>
                    <span class="metric-label">Impuesto a la renta</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">$${taxSummary.vat.toLocaleString()}</span>
                    <span class="metric-label">IVA</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">$${taxSummary.deductibleExpenses.toLocaleString()}</span>
                    <span class="metric-label">Gastos deducibles</span>
                </div>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Resumen fiscal</h2>
                <p class="text-sm text-[var(--color-ink-2)] mb-4">
                    Declaration period: Q1 2024. All figures in USD.
                </p>
            </div>
        </section>
    `;
    return html;
}

function createSubscriptionsPage() {
    const subscriptions = dashboardData.subscriptions;
    const active = subscriptions.filter(s => s.status === 'active').length;
    const trial = subscriptions.filter(s => s.status === 'trial').length;
    
    const html = document.createElement('div');
    html.innerHTML = `
        <section class="reveal">
            <div class="grid grid-cols-2 gap-4">
                <div class="metric-card">
                    <span class="metric-value">${active}</span>
                    <span class="metric-label">Suscripciones activas</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${trial}</span>
                    <span class="metric-label">Suscripciones trial</span>
                </div>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Planes de suscripción</h2>
                <div class="sub-grid">
                    ${subscriptions.map(sub => `
                        <div class="sub-item">
                            <span class="sub-name">${sub.name}</span>
                            <span class="sub-price">$${sub.price}${sub.interval}</span>
                            <span class="sub-status ${sub.status}">${sub.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
    return html;
}

function createProfilePage() {
    const html = document.createElement('div');
    html.innerHTML = `
        <section class="reveal">
            <div class="profile-card">
                <div class="profile-avatar">U</div>
                <h2 class="profile-name">Usuario Administrador</h2>
                <p class="profile-email">${dashboardData.currentUser}</p>
            </div>
            
            <div class="mt-6">
                <h2 class="section-heading">Configuración de cuenta</h2>
                <div class="setting-item">
                    <label class="setting-label">Notificaciones por email</label>
                    <select class="input" disabled>
                        <option value="always">Siempre</option>
                        <option value="weekly">Semanal</option>
                        <option value="never">Nunca</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label class="setting-label">Tema</label>
                    <select class="input" id="theme-select">
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                    </select>
                </div>
                <button class="btn btn-secondary mt-4" onclick="applyTheme('dark')">Aplicar tema oscuro</button>
            </div>
        </section>
    `;
    return html;
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
        
        .main { max-width: 1400px; margin: 0 auto; }
        
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
            .main { margin-left: 0; }
            .header { flex-direction: column; text-align: center; }
            .main { margin-top: 4rem; }
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
    `;
    document.head.appendChild(style);
}

// Observadores de reveal
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

// Exportar
window.dashboard = {
    setView,
    toggleMobile: () => { state.mobileOpen = !state.mobileOpen; }
};
