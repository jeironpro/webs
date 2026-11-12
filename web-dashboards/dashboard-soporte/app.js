// Vanilla JS Dashboard de Soporte - Migrado desde React + Vite + Tailwind
// Ruteo por hash, tema, KPIs, filtros y tabla de tickets

const TICKETS = [
    {
        id: 'T-1001',
        titulo: 'No puedo restablecer mi contraseña',
        cliente_id: 'C-01',
        agente_id: 'A-01',
        estado: 'abierto',
        prioridad: 'alta',
        categoria: 'acceso',
        descripcion: 'El enlace de recuperación caduca antes de poder usarlo.',
        creado_el: '2026-01-18T09:12:00Z',
        primera_respuesta_el: '2026-01-18T10:05:00Z',
    },
    {
        id: 'T-1002',
        titulo: 'Error al exportar el informe mensual',
        cliente_id: 'C-02',
        agente_id: 'A-02',
        estado: 'en_progreso',
        prioridad: 'media',
        categoria: 'facturacion',
        descripcion: 'La exportación se queda en el 90 % y no descarga el archivo.',
        creado_el: '2026-01-17T14:30:00Z',
        primera_respuesta_el: '2026-01-17T15:10:00Z',
    },
    {
        id: 'T-1003',
        titulo: 'La integración con Slack no envía avisos',
        cliente_id: 'C-03',
        agente_id: 'A-01',
        estado: 'abierto',
        prioridad: 'alta',
        categoria: 'integraciones',
        descripcion: 'Los avisos dejaron de llegar tras cambiar el webhook.',
        creado_el: '2026-01-17T08:45:00Z',
        primera_respuesta_el: null,
    },
    {
        id: 'T-1004',
        titulo: 'Solicitud de acceso para una persona nueva',
        cliente_id: 'C-04',
        agente_id: 'A-03',
        estado: 'cerrado',
        prioridad: 'baja',
        categoria: 'acceso',
        descripcion: 'Necesitamos dar de alta a una nueva incorporación en el equipo.',
        creado_el: '2026-01-16T11:20:00Z',
        primera_respuesta_el: '2026-01-16T11:55:00Z',
    },
    {
        id: 'T-1005',
        titulo: 'Los pedidos aparecen duplicados',
        cliente_id: 'C-02',
        agente_id: 'A-02',
        estado: 'en_progreso',
        prioridad: 'alta',
        categoria: 'pedidos',
        descripcion: 'Cada pedido se muestra dos veces en el listado.',
        creado_el: '2026-01-15T16:05:00Z',
        primera_respuesta_el: '2026-01-15T16:40:00Z',
    },
    {
        id: 'T-1006',
        titulo: 'Duda sobre el límite del plan Pro',
        cliente_id: 'C-01',
        agente_id: 'A-03',
        estado: 'cerrado',
        prioridad: 'media',
        categoria: 'facturacion',
        descripcion: 'Queremos saber si el plan Pro incluye usuarios ilimitados.',
        creado_el: '2026-01-14T10:00:00Z',
        primera_respuesta_el: '2026-01-14T10:25:00Z',
    },
    {
        id: 'T-1007',
        titulo: 'El panel carga muy lento',
        cliente_id: 'C-03',
        agente_id: 'A-01',
        estado: 'abierto',
        prioridad: 'media',
        categoria: 'rendimiento',
        descripcion: 'El dashboard tarda más de diez segundos en cargar.',
        creado_el: '2026-01-13T12:15:00Z',
        primera_respuesta_el: '2026-01-13T13:00:00Z',
    },
    {
        id: 'T-1008',
        titulo: 'Adjuntos que no se visualizan',
        cliente_id: 'C-04',
        agente_id: 'A-02',
        estado: 'cerrado',
        prioridad: 'baja',
        categoria: 'integraciones',
        descripcion: 'Los PDF adjuntos se descargan pero no se previsualizan.',
        creado_el: '2026-01-12T09:30:00Z',
        primera_respuesta_el: '2026-01-12T10:10:00Z',
    },
]

const CLIENTES = [
    {
        id: 'C-01',
        nombre: 'Lucía Ferrer',
        empresa: 'Nexo Labs',
        plan: 'Pro',
        email: 'lucia@nexolabs.io',
        ciudad: 'Barcelona',
    },
    {
        id: 'C-02',
        nombre: 'Marcos Ruiz',
        empresa: 'Taller Digital',
        plan: 'Empresa',
        email: 'marcos@tallerdigital.es',
        ciudad: 'Valencia',
    },
    {
        id: 'C-03',
        nombre: 'Ana Salas',
        empresa: 'Kuma Studio',
        plan: 'Pro',
        email: 'ana@kumastudio.co',
        ciudad: 'Bogotá',
    },
    {
        id: 'C-04',
        nombre: 'Diego Álvarez',
        empresa: 'Cooperativa Sur',
        plan: 'Básico',
        email: 'diego@coopsur.ar',
        ciudad: 'Rosario',
    },
]

const AGENTES = [
    {
        id: 'A-01',
        nombre: 'Paula',
        apellido: 'Méndez',
        rol: 'Soporte senior',
        especialidad: 'Accesos e integraciones',
        tickets_resueltos: 184,
        satisfaccion_promedio: 4.7,
        disponible: true,
    },
    {
        id: 'A-02',
        nombre: 'Iván',
        apellido: 'Cortés',
        rol: 'Soporte técnico',
        especialidad: 'Pedidos y facturación',
        tickets_resueltos: 152,
        satisfaccion_promedio: 4.4,
        disponible: true,
    },
    {
        id: 'A-03',
        nombre: 'Nadia',
        apellido: 'Bermúdez',
        rol: 'Soporte técnico',
        especialidad: 'Onboarding y cuentas',
        tickets_resueltos: 131,
        satisfaccion_promedio: 4.6,
        disponible: false,
    },
]

const NAV_ITEMS = [
    { path: '/dashboard', view: 'dashboard', label: 'Visión general' },
    { path: '/tickets', view: 'tickets', label: 'Tickets' },
    { path: '/perfil', view: 'profile', label: 'Perfil' },
]

const state = {
    view: null,
    mobileOpen: false,
    filterBusqueda: '',
    filterEstado: 'todos',
    filterPrioridad: 'todos',
}

const elements = {
    root: document.getElementById('root'),
    sidebar: null,
    main: null,
    navLinks: [],
}

// ===== Utilidades =====
function formatearFecha(iso) {
    if (!iso) return '—'
    const date = new Date(iso)
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

function formatearDuracionHoras(horas) {
    if (horas === null || Number.isNaN(horas)) return '—'
    if (horas < 1) return 'menos de 1 h'
    if (horas < 24) return `${horas} h`
    const dias = Math.floor(horas / 24)
    const resto = horas % 24
    return resto ? `${dias} d ${resto} h` : `${dias} d`
}

function estadoEtiqueta(estado) {
    return estado.replace('_', ' ')
}

function contarPor(coleccion, campo, valor) {
    return coleccion.filter((item) => item[campo] === valor).length
}

// ===== Tema =====
function initTheme() {
    const stored = localStorage.getItem('theme')
    let theme = stored
    try {
        const parsed = stored ? JSON.parse(stored) : null
        if (parsed && parsed.theme) theme = parsed.theme
    } catch {
        theme = stored === 'dark' ? 'dark' : 'light'
    }
    setTheme(theme === 'dark' ? 'dark' : 'light')
    syncThemeLabels()
}

function setTheme(theme) {
    const html = document.documentElement
    html.dataset.theme = theme
    html.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', JSON.stringify({ theme }))
}

function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    syncThemeLabels()
}

function syncThemeLabels() {
    const isDark = document.documentElement.dataset.theme === 'dark'
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.textContent = isDark ? 'Modo claro' : 'Modo oscuro'
    })
    const label = document.getElementById('current-theme')
    if (label) label.textContent = isDark ? 'Oscuro' : 'Claro'
}

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

// ===== Layout =====
function mountLayout() {
    if (!elements.root) return

    const navegacion = crear(
        'nav',
        { clase: 'sidebar-nav' },
        NAV_ITEMS.map(({ path, label }) =>
            crear('a', { href: `#${path}`, clase: 'nav-link', 'data-page-path': path, texto: label }),
        ),
    )

    elements.root.replaceChildren(
        crear('div', { clase: 'dashboard-shell' }, [
            crear('aside', { clase: 'sidebar', 'aria-label': 'Navegación principal' }, [
                crear('div', { clase: 'sidebar-brand', texto: 'Soporte' }),
                navegacion,
            ]),
            crear('div', { clase: 'main' }, [
                crear('header', { clase: 'header' }, [
                    crear('div', { clase: 'header-brand' }, [
                        crear('button', {
                            clase: 'btn btn-secondary menu-btn sidebar-toggle',
                            type: 'button',
                            'aria-label': 'Abrir menú',
                            texto: 'Menú',
                        }),
                        crear('span', { clase: 'header-title', texto: 'Mesa de soporte' }),
                    ]),
                    crear('div', { clase: 'header-actions' }, [
                        crear('button', {
                            clase: 'btn btn-secondary',
                            type: 'button',
                            'data-theme-toggle': true,
                            texto: 'Modo oscuro',
                        }),
                    ]),
                ]),
                crear('main', { clase: 'main-content', id: 'page' }),
                crear('footer', { clase: 'footer' }, [
                    crear('p', { texto: 'Soporte · Datos de ejemplo de la mesa de ayuda' }),
                ]),
            ]),
        ]),
    )
}

function cacheElements() {
    elements.sidebar = document.querySelector('.sidebar')
    elements.main = document.getElementById('page')
    elements.navLinks = document.querySelectorAll('.nav-link')
}

function initSidebar() {
    document.querySelectorAll('.sidebar-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            state.mobileOpen = !state.mobileOpen
            elements.sidebar?.classList.toggle('open', state.mobileOpen)
        })
    })

    elements.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            state.mobileOpen = false
            elements.sidebar?.classList.remove('open')
        })
    })
}

// ===== Routing =====
function parseRoute() {
    const raw = window.location.hash.replace(/^#/, '') || '/dashboard'
    const segments = raw.split('/').filter(Boolean)
    if (segments[0] === 'tickets' && segments[1]) {
        return { view: 'ticket-detail', id: segments[1], path: raw }
    }
    const match = NAV_ITEMS.find((item) => item.path === `/${segments[0] || 'dashboard'}`)
    return { view: match ? match.view : 'notfound', id: null, path: raw }
}

function navigateTo(path, updateHash = true) {
    const normalized = path.startsWith('/') ? path : `/${path}`
    if (updateHash && window.location.hash !== `#${normalized}`) {
        window.location.hash = normalized
        return
    }
    render()
}

function navigateBack() {
    window.history.back()
}

function initRouting() {
    window.addEventListener('hashchange', () => render())
    render()
}

function render() {
    const route = parseRoute()
    state.view = route.view
    updateNavState(route.view)
    updatePageContent(route, route.id)
    updateTitle(route.view)
}

function updateNavState(view) {
    elements.navLinks.forEach((link) => {
        const path = link.getAttribute('data-page-path')
        const item = NAV_ITEMS.find((nav) => nav.path === path)
        link.classList.toggle('active', item ? item.view === view : false)
    })
}

function updatePageContent(route, ticketId) {
    if (!elements.main) return

    const pages = {
        dashboard: createDashboardPage,
        tickets: createTicketsPage,
        'ticket-detail': () => createTicketDetailPage(ticketId),
        profile: createProfilePage,
        notfound: createNotFoundPage,
    }

    elements.main.replaceChildren((pages[route.view] || pages.notfound)())
    initPage(route.view, ticketId)
    syncThemeLabels()
    observeReveal('.reveal')
}

function updateTitle(view) {
    const titles = {
        dashboard: 'Dashboard de Soporte - Visión General',
        tickets: 'Dashboard de Soporte - Tickets',
        'ticket-detail': 'Dashboard de Soporte - Detalle de Ticket',
        profile: 'Dashboard de Soporte - Perfil',
        notfound: 'Dashboard de Soporte - 404',
    }
    document.title = titles[view] || titles.notfound
}

// ===== Componentes =====
function kpiCard({ title, count, subtitle }) {
    return crear('div', { clase: 'metric-card' }, [
        crear('span', { clase: 'metric-value', texto: String(count) }),
        crear('span', { clase: 'metric-label', texto: title }),
        subtitle ? crear('span', { clase: 'metric-subtitle', texto: subtitle }) : null,
    ])
}

function filterTickets(tickets) {
    const busqueda = state.filterBusqueda.trim().toLowerCase()
    return tickets.filter((ticket) => {
        const matchBusqueda =
            !busqueda ||
            ticket.titulo.toLowerCase().includes(busqueda) ||
            ticket.id.toLowerCase().includes(busqueda) ||
            ticket.cliente_id.toLowerCase().includes(busqueda)
        const matchEstado = state.filterEstado === 'todos' || ticket.estado === state.filterEstado
        const matchPrioridad =
            state.filterPrioridad === 'todos' || ticket.prioridad === state.filterPrioridad
        return matchBusqueda && matchEstado && matchPrioridad
    })
}

function createTicketRow(ticket) {
    const enlace = (texto) =>
        crear('a', { href: `#/tickets/${ticket.id}`, clase: 'ticket-link', texto })

    return crear('tr', {}, [
        crear('td', { clase: 'font-medium', texto: ticket.id }),
        crear('td', {}, [enlace(ticket.titulo)]),
        crear('td', { texto: ticket.cliente_id }),
        crear('td', {}, [
            crear('span', {
                clase: `status-badge status-${ticket.estado}`,
                texto: estadoEtiqueta(ticket.estado),
            }),
        ]),
        crear('td', {}, [
            crear('span', { clase: `badge badge-${ticket.prioridad}`, texto: ticket.prioridad }),
        ]),
        crear('td', { texto: ticket.categoria }),
        crear('td', { texto: formatearFecha(ticket.creado_el) }),
        crear('td', {}, [enlace('Ver')]),
    ])
}

// ===== Páginas =====
function createDashboardPage() {
    const openCount = contarPor(TICKETS, 'estado', 'abierto')
    const inProgressCount = contarPor(TICKETS, 'estado', 'en_progreso')
    const closedCount = contarPor(TICKETS, 'estado', 'cerrado')
    const recientes = [...TICKETS].sort((a, b) => (a.creado_el < b.creado_el ? 1 : -1)).slice(0, 5)

    return crear('section', { clase: 'reveal' }, [
        crear('h1', { clase: 'page-title', texto: 'Dashboard de Soporte' }),
        crear('div', { clase: 'kpi-grid' }, [
            kpiCard({ title: 'Tickets abiertos', count: openCount, subtitle: 'Pendientes de primera respuesta' }),
            kpiCard({ title: 'En progreso', count: inProgressCount, subtitle: 'Asignados a un agente' }),
            kpiCard({ title: 'Cerrados', count: closedCount, subtitle: 'Resueltos' }),
            kpiCard({ title: 'Total', count: TICKETS.length, subtitle: 'Periodo actual' }),
        ]),
        crear('div', { clase: 'chart-grid' }, [
            crear('div', {}, [
                crear('h2', { clase: 'section-heading', texto: 'Tickets por día' }),
                crear('div', { id: 'chart-daily', clase: 'chart-area' }),
            ]),
            crear('div', {}, [
                crear('h2', { clase: 'section-heading', texto: 'Distribución por categoría' }),
                crear('div', { id: 'chart-category', clase: 'chart-area' }),
            ]),
        ]),
        crear('div', { clase: 'reveal' }, [
            crear('h2', { clase: 'section-heading', texto: 'Tickets recientes' }),
            crear(
                'div',
                { clase: 'recent-list' },
                recientes.map((ticket) =>
                    crear('a', { clase: 'recent-item', href: `#/tickets/${ticket.id}` }, [
                        crear('span', { clase: `badge badge-${ticket.prioridad}`, texto: ticket.prioridad }),
                        crear('span', { clase: 'recent-title', texto: ticket.titulo }),
                        crear('span', {
                            clase: `status-badge status-${ticket.estado}`,
                            texto: estadoEtiqueta(ticket.estado),
                        }),
                    ]),
                ),
            ),
        ]),
    ])
}

function createTicketsPage() {
    const filtrados = filterTickets(TICKETS)

    return crear('section', { clase: 'reveal' }, [
        crear('div', { clase: 'page-header' }, [
            crear('h1', { clase: 'page-title', texto: 'Tickets' }),
            crear('div', { clase: 'filters-row' }, [
                crear('input', {
                    type: 'text',
                    id: 'search-input',
                    clase: 'input',
                    placeholder: 'Buscar tickets...',
                    value: state.filterBusqueda,
                }),
                crear('select', { id: 'estado-filter', clase: 'input' }, [
                    crear('option', { value: 'todos', texto: 'Todos los estados' }),
                    crear('option', { value: 'abierto', texto: 'Abiertos' }),
                    crear('option', { value: 'en_progreso', texto: 'En progreso' }),
                    crear('option', { value: 'cerrado', texto: 'Cerrados' }),
                ]),
                crear('select', { id: 'prioridad-filter', clase: 'input' }, [
                    crear('option', { value: 'todos', texto: 'Todas las prioridades' }),
                    crear('option', { value: 'alta', texto: 'Alta' }),
                    crear('option', { value: 'media', texto: 'Media' }),
                    crear('option', { value: 'baja', texto: 'Baja' }),
                ]),
            ]),
        ]),
        crear('p', {
            clase: 'text-muted',
            id: 'tickets-count',
            texto: `Mostrando ${filtrados.length} de ${TICKETS.length} tickets`,
        }),
        crear('div', { clase: 'table-responsive' }, [
            crear('table', {}, [
                crear('thead', {}, [
                    crear(
                        'tr',
                        {},
                        ['ID', 'Título', 'Cliente', 'Estado', 'Prioridad', 'Categoría', 'Creado', 'Acciones'].map(
                            (titulo) => crear('th', { texto: titulo }),
                        ),
                    ),
                ]),
                crear('tbody', { id: 'tickets-body' }, filtrados.map(createTicketRow)),
            ]),
        ]),
    ])
}

function createTicketDetailPage(ticketId) {
    const ticket = TICKETS.find((item) => item.id === ticketId)

    if (!ticket) {
        return crear('section', { clase: 'reveal' }, [
            crear('h2', { clase: 'page-title', texto: 'Ticket no encontrado' }),
            crear('p', {
                clase: 'text-muted',
                texto: `No existe ningún ticket con el identificador ${ticketId || '—'}.`,
            }),
            crear('a', { href: '#/tickets', clase: 'btn', texto: 'Volver a Tickets' }),
        ])
    }

    const cliente = CLIENTES.find((item) => item.id === ticket.cliente_id)
    const agente = AGENTES.find((item) => item.id === ticket.agente_id)
    const horasRespuesta = ticket.primera_respuesta_el
        ? Math.round((new Date(ticket.primera_respuesta_el) - new Date(ticket.creado_el)) / 3600000)
        : null

    const listaDatos = (filas) =>
        crear(
            'dl',
            { clase: 'detail-list' },
            filas.map(([etiqueta, valor]) =>
                crear('div', {}, [crear('dt', { texto: etiqueta }), crear('dd', { texto: valor })]),
            ),
        )

    const fichaCliente = cliente
        ? listaDatos([
              ['Nombre', cliente.nombre],
              ['Empresa', cliente.empresa],
              ['Plan', cliente.plan],
              ['Email', cliente.email],
              ['Ciudad', cliente.ciudad],
          ])
        : crear('p', { clase: 'text-muted', texto: 'Cliente no encontrado' })

    const fichaAgente = agente
        ? crear('div', { clase: 'agent-row' }, [
              crear('div', { clase: 'avatar-sm', texto: `${agente.nombre[0]}${agente.apellido[0]}` }),
              crear('div', {}, [
                  crear('p', {}, [crear('strong', { texto: `${agente.nombre} ${agente.apellido}` })]),
                  crear('p', {
                      clase: 'text-muted',
                      texto: `${agente.rol} · ${agente.especialidad}`,
                  }),
              ]),
          ])
        : crear('p', { clase: 'text-muted', texto: 'Sin asignar' })

    return crear('section', { clase: 'reveal' }, [
        crear('a', { href: '#/tickets', clase: 'back-link', texto: '← Volver a tickets' }),
        crear('h1', { clase: 'page-title', texto: ticket.titulo }),
        crear('div', { clase: 'detail-grid' }, [
            crear('article', { clase: 'card' }, [
                crear('div', { clase: 'card-badges' }, [
                    crear('span', {
                        clase: `status-badge status-${ticket.estado}`,
                        texto: estadoEtiqueta(ticket.estado),
                    }),
                    crear('span', { clase: `badge badge-${ticket.prioridad}`, texto: ticket.prioridad }),
                    crear('span', { clase: 'badge', texto: ticket.categoria }),
                ]),
                crear('p', { clase: 'card-description', texto: ticket.descripcion }),
                listaDatos([
                    ['ID', ticket.id],
                    ['Creado', formatearFecha(ticket.creado_el)],
                    ['Tiempo de respuesta', formatearDuracionHoras(horasRespuesta)],
                ]),
            ]),
            crear('aside', {}, [
                crear('h3', { clase: 'section-heading', texto: 'Cliente' }),
                fichaCliente,
                crear('h3', { clase: 'section-heading', texto: 'Equipo de soporte' }),
                fichaAgente,
            ]),
        ]),
    ])
}

function createProfilePage() {
    const agente = AGENTES[0]

    return crear('section', { clase: 'reveal' }, [
        crear('h1', { clase: 'page-title', texto: 'Perfil' }),
        crear('div', { clase: 'detail-grid' }, [
            crear('div', { clase: 'profile-card' }, [
                crear('div', { clase: 'profile-avatar', texto: `${agente.nombre[0]}${agente.apellido[0]}` }),
                crear('h2', { clase: 'profile-name', texto: `${agente.nombre} ${agente.apellido}` }),
                crear('p', { clase: 'profile-email', texto: agente.rol }),
            ]),
            crear('div', {}, [
                crear('h3', { clase: 'section-heading', texto: 'Estadísticas' }),
                crear('div', { clase: 'kpi-grid' }, [
                    kpiCard({ title: 'Tickets resueltos', count: agente.tickets_resueltos, subtitle: 'Histórico' }),
                    kpiCard({
                        title: 'CSAT promedio',
                        count: `${agente.satisfaccion_promedio.toFixed(1)} / 5`,
                        subtitle: 'Satisfacción',
                    }),
                ]),
                crear('h3', { clase: 'section-heading', texto: 'Información' }),
                crear('dl', { clase: 'detail-list' }, [
                    crear('div', {}, [
                        crear('dt', { texto: 'Especialidad' }),
                        crear('dd', { texto: agente.especialidad }),
                    ]),
                    crear('div', {}, [
                        crear('dt', { texto: 'Disponible' }),
                        crear('dd', { texto: agente.disponible ? 'Sí' : 'No' }),
                    ]),
                    crear('div', {}, [
                        crear('dt', { texto: 'Tema' }),
                        crear('dd', { id: 'current-theme', texto: 'Claro' }),
                    ]),
                ]),
                crear('button', {
                    clase: 'btn btn-secondary',
                    type: 'button',
                    'data-theme-toggle': true,
                    texto: 'Cambiar tema',
                }),
            ]),
        ]),
    ])
}

function createNotFoundPage() {
    return crear('section', { clase: 'reveal' }, [
        crear('h2', { clase: 'page-title', texto: '404' }),
        crear('p', { clase: 'text-muted', texto: 'La página solicitada no existe.' }),
        crear('a', { href: '#/dashboard', clase: 'btn', texto: 'Volver al inicio' }),
    ])
}

// ===== Inicialización por vista =====
function initPage(view, ticketId) {
    if (view === 'dashboard') initDashboard()
    if (view === 'tickets') initTickets()
    if (view === 'ticket-detail') initTicketDetail(ticketId)
}

function initDashboard() {
    const daily = new Map()
    TICKETS.forEach((ticket) => {
        const day = ticket.creado_el.slice(0, 10)
        daily.set(day, (daily.get(day) || 0) + 1)
    })
    const dailyData = [...daily.entries()]
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([date, count]) => ({ label: date.slice(5), value: count }))

    const categories = new Map()
    TICKETS.forEach((ticket) => {
        categories.set(ticket.categoria, (categories.get(ticket.categoria) || 0) + 1)
    })
    const categoryData = [...categories.entries()].map(([label, value]) => ({ label, value }))

    const dailyContainer = document.getElementById('chart-daily')
    if (dailyContainer) dailyContainer.replaceChildren(createLineChart(dailyData))

    const categoryContainer = document.getElementById('chart-category')
    if (categoryContainer) categoryContainer.replaceChildren(createBarChart(categoryData))
}

function initTickets() {
    const searchInput = document.getElementById('search-input')
    const estadoFilter = document.getElementById('estado-filter')
    const prioridadFilter = document.getElementById('prioridad-filter')

    if (estadoFilter) estadoFilter.value = state.filterEstado
    if (prioridadFilter) prioridadFilter.value = state.filterPrioridad

    const refresh = () => {
        const filtrados = filterTickets(TICKETS)
        const body = document.getElementById('tickets-body')
        const count = document.getElementById('tickets-count')
        if (body) body.replaceChildren(...filtrados.map(createTicketRow))
        if (count) count.textContent = `Mostrando ${filtrados.length} de ${TICKETS.length} tickets`
    }

    searchInput?.addEventListener('input', (event) => {
        state.filterBusqueda = event.target.value
        refresh()
    })

    estadoFilter?.addEventListener('change', (event) => {
        state.filterEstado = event.target.value
        refresh()
    })

    prioridadFilter?.addEventListener('change', (event) => {
        state.filterPrioridad = event.target.value
        refresh()
    })
}

function initTicketDetail() {
    // La vista de detalle no necesita listeners propios.
}

// ===== Gráficas SVG =====
function createLineChart(data, { width = 520, height = 220, color = '#38bdf8' } = {}) {
    const svgNS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('class', 'chart-svg')
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', 'Tickets por día')

    const margin = { top: 20, right: 20, bottom: 34, left: 40 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom
    const max = data.reduce((top, row) => Math.max(top, row.value), 0) || 1

    const x = (index) => margin.left + (index / Math.max(data.length - 1, 1)) * chartWidth
    const y = (value) => margin.top + chartHeight - (value / max) * chartHeight

    if (data.length > 0) {
        const path = data
            .map((row, index) => `${index === 0 ? 'M' : 'L'}${x(index)},${y(row.value)}`)
            .join(' ')

        const line = document.createElementNS(svgNS, 'path')
        line.setAttribute('d', path)
        line.setAttribute('fill', 'none')
        line.setAttribute('stroke', color)
        line.setAttribute('stroke-width', '2')
        svg.appendChild(line)

        data.forEach((row, index) => {
            const dot = document.createElementNS(svgNS, 'circle')
            dot.setAttribute('cx', String(x(index)))
            dot.setAttribute('cy', String(y(row.value)))
            dot.setAttribute('r', '3')
            dot.setAttribute('fill', color)
            svg.appendChild(dot)

            const label = document.createElementNS(svgNS, 'text')
            label.setAttribute('x', String(x(index)))
            label.setAttribute('y', String(margin.top + chartHeight + 18))
            label.setAttribute('font-size', '10')
            label.setAttribute('text-anchor', 'middle')
            label.setAttribute('fill', 'currentColor')
            label.textContent = row.label
            svg.appendChild(label)
        })
    }

    return svg
}

function createBarChart(data, { width = 520, height = 220, color = '#9dc454' } = {}) {
    const svgNS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('class', 'chart-svg')
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', 'Tickets por categoría')

    const margin = { top: 20, right: 20, bottom: 40, left: 40 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom
    const max = data.reduce((top, row) => Math.max(top, row.value), 0) || 1
    const band = chartWidth / Math.max(data.length, 1)

    data.forEach((row, index) => {
        const barHeight = (row.value / max) * chartHeight
        const barX = margin.left + index * band + band * 0.15
        const barWidth = band * 0.7

        const bar = document.createElementNS(svgNS, 'rect')
        bar.setAttribute('x', String(barX))
        bar.setAttribute('y', String(margin.top + chartHeight - barHeight))
        bar.setAttribute('width', String(barWidth))
        bar.setAttribute('height', String(barHeight))
        bar.setAttribute('fill', color)
        bar.setAttribute('rx', '4')
        svg.appendChild(bar)

        const value = document.createElementNS(svgNS, 'text')
        value.setAttribute('x', String(barX + barWidth / 2))
        value.setAttribute('y', String(Math.max(margin.top + chartHeight - barHeight - 6, 12)))
        value.setAttribute('font-size', '10')
        value.setAttribute('text-anchor', 'middle')
        value.setAttribute('fill', 'currentColor')
        value.textContent = String(row.value)
        svg.appendChild(value)

        const label = document.createElementNS(svgNS, 'text')
        label.setAttribute('x', String(barX + barWidth / 2))
        label.setAttribute('y', String(margin.top + chartHeight + 18))
        label.setAttribute('font-size', '10')
        label.setAttribute('text-anchor', 'middle')
        label.setAttribute('fill', 'currentColor')
        label.textContent = row.label
        svg.appendChild(label)
    })

    return svg
}

// ===== Estilos propios =====
function addGlobalStyles() {
    const style = document.createElement('style')
    style.textContent = `
        :root {
            --color-paper: #f7f7fb;
            --color-ink: #1f2430;
            --color-ink-2: #5b6474;
            --color-rule: #d9dce6;
            --color-accent: #3b6cf0;
        }
        .dark {
            --color-paper: #171a21;
            --color-ink: #eef1f7;
            --color-ink-2: #a6adbb;
            --color-rule: #333a47;
        }
        body { margin: 0; background: var(--color-paper); color: var(--color-ink); font-family: system-ui, sans-serif; }
        .dashboard-shell { display: flex; min-height: 100vh; }
        .sidebar { width: 240px; flex: 0 0 240px; border-right: 1px solid var(--color-rule); padding: 1.5rem 1rem; }
        .sidebar-brand { font-weight: 700; font-size: 1.2rem; margin-bottom: 1.5rem; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; }
        .nav-link { padding: 0.5rem 0.75rem; border-radius: 6px; color: var(--color-ink-2); text-decoration: none; font-size: 0.9rem; }
        .nav-link:hover { background: rgba(127, 127, 127, 0.12); color: var(--color-ink); }
        .nav-link.active { background: var(--color-accent); color: #fff; }
        .main { flex: 1; min-width: 0; padding: 2rem; }
        .header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-rule); }
        .header-brand, .header-actions { display: flex; align-items: center; gap: 0.75rem; }
        .header-title { font-weight: 600; }
        .main-content { max-width: 1200px; }
        .footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-rule); color: var(--color-ink-2); font-size: 0.85rem; }
        .page-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 1rem; margin-bottom: 1rem; }
        .page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; }
        .section-heading { font-size: 1.05rem; font-weight: 600; margin: 2rem 0 1rem; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .metric-card { display: flex; flex-direction: column; gap: 0.25rem; padding: 1rem; border: 1px solid var(--color-rule); border-radius: 10px; }
        .metric-value { font-size: 1.5rem; font-weight: 700; }
        .metric-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-ink-2); }
        .metric-subtitle { font-size: 0.8rem; color: var(--color-ink-2); }
        .chart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .chart-area { border: 1px solid var(--color-rule); border-radius: 10px; padding: 0.75rem; }
        .chart-svg { width: 100%; height: auto; display: block; color: var(--color-ink-2); }
        .table-responsive { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--color-rule); }
        th { text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.08em; color: var(--color-ink-2); }
        .ticket-link { color: var(--color-accent); text-decoration: none; }
        .ticket-link:hover { text-decoration: underline; }
        .status-badge, .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; border: 1px solid var(--color-rule); }
        .status-abierto { border-color: #f59e0b; color: #b45309; }
        .status-en_progreso { border-color: #3b82f6; color: #1d4ed8; }
        .status-cerrado { border-color: #10b981; color: #047857; }
        .badge-alta { border-color: #ef4444; color: #b91c1c; }
        .badge-media { border-color: #f59e0b; color: #b45309; }
        .badge-baja { border-color: #94a3b8; color: #475569; }
        .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid transparent; background: var(--color-accent); color: #fff; font-size: 0.875rem; cursor: pointer; text-decoration: none; }
        .btn-secondary { background: transparent; border-color: var(--color-rule); color: var(--color-ink); }
        .input { padding: 0.5rem 0.65rem; border: 1px solid var(--color-rule); border-radius: 6px; font-size: 0.875rem; background: transparent; color: inherit; }
        .filters-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .text-muted { color: var(--color-ink-2); font-size: 0.9rem; }
        .recent-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .recent-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid var(--color-rule); border-radius: 8px; text-decoration: none; color: inherit; }
        .recent-item:hover { border-color: var(--color-accent); }
        .recent-title { flex: 1; }
        .back-link { color: var(--color-accent); text-decoration: none; font-size: 0.875rem; }
        .detail-grid { display: grid; grid-template-columns: minmax(280px, 2fr) minmax(240px, 1fr); gap: 1.5rem; }
        .card { border: 1px solid var(--color-rule); border-radius: 10px; padding: 1.25rem; }
        .card-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
        .card-description { color: var(--color-ink-2); }
        .detail-list { display: grid; gap: 0.5rem; margin: 0; }
        .detail-list div { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px dashed var(--color-rule); padding-bottom: 0.35rem; }
        .detail-list dt { color: var(--color-ink-2); font-size: 0.85rem; }
        .detail-list dd { margin: 0; font-size: 0.9rem; }
        .agent-row { display: flex; gap: 0.75rem; align-items: center; }
        .avatar-sm { width: 40px; height: 40px; border-radius: 50%; background: var(--color-accent); color: #fff; display: grid; place-items: center; font-weight: 600; }
        .profile-card { border: 1px solid var(--color-rule); border-radius: 10px; padding: 2rem; text-align: center; }
        .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--color-accent); color: #fff; font-weight: 700; display: grid; place-items: center; margin: 0 auto 1rem; }
        .profile-name { margin: 0 0 0.25rem; font-size: 1.2rem; }
        .profile-email { margin: 0; color: var(--color-ink-2); }
        .reveal { opacity: 0; transform: translateY(8px); transition: opacity 0.4s ease, transform 0.4s ease; }
        .reveal.revealed { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
        @media (max-width: 820px) {
            .sidebar { position: fixed; inset: 0 auto 0 0; z-index: 20; background: var(--color-paper); transform: translateX(-100%); transition: transform 0.25s ease; }
            .sidebar.open { transform: none; }
            .main { padding: 1.25rem; }
            .detail-grid { grid-template-columns: 1fr; }
        }
    `
    document.head.appendChild(style)

    const skin = document.createElement('link')
    skin.rel = 'stylesheet'
    skin.href = '../css/dashboard-skin.css'
    document.head.append(skin)
}

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

// ===== Arranque =====
document.addEventListener('DOMContentLoaded', () => {
    addGlobalStyles()
    mountLayout()
    cacheElements()
    initTheme()
    initSidebar()
    initRouting()

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-theme-toggle]')) toggleTheme()
    })
})

window.dashboard = { navigateTo, navigateBack, toggleTheme, state }
