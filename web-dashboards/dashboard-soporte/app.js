// Vanilla JS Dashboard de Soporte - Migrado desde React + Vite + Tailwind
// Ruteo SPA, tema, KPIs y tabla de tickets

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRouting();
    initSidebar();
    initHeader();
    navigateTo(window.location.pathname || '/dashboard');
});

function initTheme() {
    const html = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ? JSON.parse(stored).theme : (prefersDark ? 'dark' : 'light');
    html.classList.toggle('dark', theme === 'dark');
    html.dataset.theme = theme;
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.dataset.theme;
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.dataset.theme = newTheme;
    html.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', JSON.stringify({ theme: newTheme }));
}

function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main');
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            main.classList.add('sidebar-open');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            main.classList.remove('sidebar-open');
        });
    }
    
    // Cerrar sidebar al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            main.classList.remove('sidebar-open');
        });
    });
}

function initHeader() {
    // Cerrar sidebar al hacer clic fuera en móvil
    const header = document.querySelector('header');
    if (header) {
        header.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                document.querySelector('.sidebar').classList.remove('open');
                document.querySelector('.main')?.classList.remove('sidebar-open');
            }
        });
    }
}

function initRouting() {
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page, true);
        });
    });
    
    // Manejar enlaces normales fuera del dashboard
    document.querySelectorAll('a:not([data-page])').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.host !== window.location.host) return;
            // Dejar que funcione normalmente
        });
    });
}

// Estado actual
const state = {
    view: null,
    mobileOpen: false
};

// Ruteo SPA
function navigateTo(path, pushHistory = true) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    state.view = getPageFromPath(normalizedPath);
    
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === state.view);
    });
    
    // Actualizar contenido
    updatePageContent(state.view);
    
    // Actualizar título
    updateTitle(state.view);
    
    // Historial
    if (pushHistory) {
        window.history.pushState({ path: normalizedPath }, '', normalizedPath);
    }
}

function navigateBack() {
    window.history.back();
}

function getPageFromPath(path) {
    const routes = {
        '/': 'dashboard',
        '/dashboard': 'dashboard',
        '/tickets': 'tickets',
        '/tickets/': 'tickets',
        '/tickets/:id': 'ticket-detail',
        '/perfil': 'profile',
        '/profile': 'profile'
    };
    
    // Verificar rutas con parámetros
    if (path.startsWith('/tickets/') && path !== '/tickets/') {
        return 'ticket-detail';
    }
    
    return routes[path] || 'notfound';
}

function updatePageContent(view) {
    const main = document.getElementById('root');
    if (!main) return;
    
    main.innerHTML = pages[view] || pages['notfound'];
    
    // Inicializar componentes después de renderizar
    if (view === 'dashboard') initDashboard();
    if (view === 'tickets') initTickets();
    if (view === 'ticket-detail') initTicketDetail();
    if (view === 'profile') initProfile();
    
    // Observadores de reveal
    observeReveal('.reveal');
}

function updateTitle(view) {
    const titles = {
        dashboard: 'Dashboard de Soporte - Visión General',
        tickets: 'Dashboard de Soporte - Tickets',
        'ticket-detail': 'Dashboard de Soporte - Detalle de Ticket',
        profile: 'Dashboard de Soporte - Perfil',
        notfound: 'Dashboard de Soporte - 404'
    };
    document.title = titles[view] || titles['notfound'];
}

// Páginas
const pages = {
    dashboard: createDashboardPage(),
    tickets: createTicketsPage(),
    'ticket-detail': createTicketDetailPage(),
    profile: createProfilePage(),
    notfound: createNotFoundPage()
};

// Página Dashboard
function createDashboardPage() {
    const ticketsCount = ticketsData.length;
    const openCount = ticketsData.filter(t => t.estado === 'abierto').length;
    const inProgressCount = ticketsData.filter(t => t.estado === 'en_progreso').length;
    const closedCount = ticketsData.filter(t => t.estado === 'cerrado').length;
    
    return `<section class="dashboard py-8">
        <div class="max-w-7xl mx-auto px-4">
            <h1 class="text-2xl font-bold mb-6">Dashboard de Soporte</h1>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <KpiCard title="Tickets abiertos" count={openCount} />
                <KpiCard title="En progreso" count={inProgressCount} />
                <KpiCard title="Cerrados" count={closedCount} />
                <KpiCard title="Total" count={ticketsCount} />
            </div>
            
            <div class="grid grid-cols-1 gap-6 mb-8">
                <div class="reveal">
                    <h2 class="section-heading">Tickets por día (últimos 30 días)</h2>
                    <div id="chart-daily" class="chart-area h-64"></div>
                </div>
                <div class="reveal">
                    <h2 class="section-heading">Distribución por categoría</h2>
                    <div id="chart-category" class="chart-area h-64"></div>
                </div>
            </div>
            
            <div class="reveal">
                <h2 class="section-heading">Tickets recientes</h2>
                <div id="recent-tickets" class="recent-list"></div>
            </div>
        </div>
    </section>`;
}

// Componente KpiCard
function KpiCard({title, count}) {
    const container = document.createElement('div');
    container.className = 'kpi-card';
    container.innerHTML = `
        <div class="metric-card">
            <span class="metric-value">${count}</span>
            <span class="metric-label">${title}</span>
        </div>
    `;
    return container.outerHTML;
}

// Página Tickets
function createTicketsPage() {
    const filteredTickets = filterTickets(ticketsData, state);
    
    return `<section class="dashboard py-8">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
                <h1 class="text-2xl font-bold sm:w-64">Tickets</h1>
                <div class="flex-1 flex gap-2">
                    <input type="text" id="search-input" class="input" placeholder="Buscar tickets..." />
                    <select id="estado-filter" class="input">
                        <option value="todos">Todos los estados</option>
                        <option value="abierto">Abiertos</option>
                        <option value="en_progreso">En progreso</option>
                        <option value="cerrado">Cerrados</option>
                    </select>
                    <select id="prioridad-filter" class="input">
                        <option value="todos">Todas las prioridades</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>
            </div>
            
            <p class="text-sm text-muted-foreground mb-4">Mostrando ${filteredTickets.length} de ${ticketsData.length} tickets</p>
            
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Cliente</th>
                            <th>Estado</th>
                            <th>Prioridad</th>
                            <th>Categoría</th>
                            <th>Creado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredTickets.map(ticket => createTicketRow(ticket)).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;
}

function filterTickets(tickets, state) {
    const { filterBusqueda, filterEstado, filterPrioridad, filterCategoria } = state;
    
    return tickets.filter(ticket => {
        const matchBusqueda = !filterBusqueda || 
            ticket.titulo.toLowerCase().includes(filterBusqueda.toLowerCase()) ||
            ticket.id.includes(filterBusqueda) ||
            ticket.cliente_id.includes(filterBusqueda);
        
        const matchEstado = filterEstado === 'todos' || ticket.estado === filterEstado;
        const matchPrioridad = filterPrioridad === 'todos' || ticket.prioridad === filterPrioridad;
        
        // Categoría no tiene filtro en esta versión simplificada
        
        return matchBusqueda && matchEstado && matchPrioridad;
    });
}

function createTicketRow(ticket) {
    const statusClass = `status-${ticket.estado}`;
    const priorityClass = `priority-${ticket.prioridad}`;
    
    return `
        <tr>
            <td class="font-medium">${ticket.id}</td>
            <td><a href="/tickets/${ticket.id}" class="text-primary hover-underline">${ticket.titulo}</a></td>
            <td>${ticket.cliente_id}</td>
            <td><span class="status-badge status-${ticket.estado}">${ticket.estado}</span></td>
            <td><span class="badge badge-${ticket.prioridad}">${ticket.prioridad}</span></td>
            <td>${ticket.categoria}</td>
            <td>${formatearFecha(ticket.creado_el)}</td>
            <td>
                <a href="/tickets/${ticket.id}" class="text-sm text-accent">Ver</a>
            </td>
        </tr>
    `;
}

// Helper formatear fecha
function formatearFecha(iso) {
    if (!iso) return '—';
    const partes = new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date(iso));
    const year = partes.find(p => p.type === 'year').value;
    const month = partes.find(p => p.type === 'month').value;
    const day = partes.find(p => p.type === 'day').value;
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${day} ${meses[Number(month) - 1]} ${year}`;
}

// Página Ticket Detail
function createTicketDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get('id') || window.location.pathname.replace('/tickets/', '');
    const ticket = ticketsData.find(t => t.id === ticketId);
    
    if (!ticket) {
        return `<section class="dashboard py-8">
            <div class="max-w-2xl mx-auto text-center py-16">
                <h2 class="text-2xl font-bold mb-2">404</h2>
                <p class="text-muted-foreground">Ticket no encontrado</p>
                <a href="/tickets" class="btn btn-secondary mt-4">Volver a Tickets</a>
            </div>
        </section>`;
    }
    
    const cliente = clientesData.find(c => c.id === ticket.cliente_id);
    const agente = agentesData.find(a => a.id === ticket.agente_id);
    const tiempoRespuesta = ticket.primera_respuesta_el 
        ? Math.round((new Date(ticket.primera_respuesta_el) - new Date(ticket.creado_el)) / 3600000)
        : null;
    
    return `<section class="dashboard py-8">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                    <h2 class="section-heading">Detalle del Ticket</h2>
                    <div class="card">
                        <div class="card-header flex flex-col sm:flex-row gap-2">
                            <span class="status-badge status-${ticket.estado}">${ticket.estado}</span>
                            <span class="badge badge-${ticket.prioridad} ml-auto">${ticket.prioridad}</span>
                            <span class="badge badge-${ticket.categoria} ml-2">${ticket.categoria}</span>
                        </div>
                        <h1 class="card-title">${ticket.titulo}</h1>
                        <p class="card-description">${ticket.descripcion}</p>
                    </div>
                </div>
                
                <div class="lg:col-span-2 space-y-4">
                    <div>
                        <h3 class="section-heading">Información del cliente</h3>
                        ${cliente ? `
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p><strong>Nombre:</strong> ${cliente.nombre}</p>
                                    <p><strong>Empresa:</strong> ${cliente.empresa}</p>
                                    <p><strong>Plan:</strong> ${cliente.plan}</p>
                                </div>
                                <div>
                                    <p><strong>Email:</strong> ${cliente.email}</p>
                                    <p><strong>Ciudad:</strong> ${cliente.ciudad}</p>
                                </div>
                            </div>
                        ` : '<p>Cliente no encontrado</p>'}
                    </div>
                    
                    <div>
                        <h3 class="section-heading">Equipo de soporte</h3>
                        ${agente ? `
                            <div class="flex items-center gap-3">
                                <div class="avatar-sm">${agente.nombre[0]}${agente.apellido ? agente.apellido[0] : ''}</div>
                                <div>
                                    <p><strong>${agente.nombre}</strong></p>
                                    <p class="text-sm text-muted-foreground">${agente.rol}</p>
                                </div>
                            </div>
                        ` : '<p>Sin asignar</p>'}
                    </div>
                    
                    <div>
                        <h3 class="section-heading">Estadísticas</h3>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <p>Tiempo de respuesta:${tiempoRespuesta !== null ? ` ${formatearDuracionHoras(tiempoRespuesta)}` : ' Sin respuesta'}</p>
                            </div>
                            <div>
                                <p>Creado: ${formatearFecha(ticket.creado_el)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

// Página Profile
function createProfilePage() {
    const agente = agentesData[0];
    return `<section class="dashboard py-8">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                    <div class="avatar-lg">${agente.nombre[0]}${agente.apellido ? agente.apellido[0] : ''}</div>
                    <h2 class="text-2xl font-bold mt-2">${agente.nombre}</h2>
                    <p class="text-muted-foreground">${agente.rol}</p>
                </div>
                
                <div>
                    <h3 class="section-heading mt-4">Estadísticas</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <p class="text-lg font-medium">Tickets resueltos</p>
                            <p class="text-3xl font-bold">${agente.tickets_resueltos}</p>
                        </div>
                        <div>
                            <p class="text-lg font-medium">CSAT promedio</p>
                            <p class="text-3xl font-bold">${agente.satisfaccion_promedio.toFixed(1)} / 5</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="section-heading mt-4">Información</h3>
                    <p><strong>Especialidad:</strong> ${agente.especialidad}</p>
                    <p><strong>Disponible:</strong> ${agente.disponible ? 'Sí' : 'No'}</p>
                </div>
            </div>
        </div>
    </section>`;
}

function createNotFoundPage() {
    return `<section class="dashboard py-8">
        <div class="max-w-xl mx-auto text-center py-16">
            <h2 class="text-5xl font-bold mb-2">404</h2>
            <p class="text-muted-foreground">La página solicitada no existe</p>
            <a href="/" class="btn btn-primary mt-4">Volver al inicio</a>
        </div>
    </section>`;
}

// Observadores IntersectionObserver
function observeReveal(selector) {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
    return observer;
}

// Hilera de eventos para filtros
document.addEventListener('DOMContentLoaded', () => {
    // Filtro de búsqueda
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.filterBusqueda = e.target.value;
            navigateTo('tickets', false);
        });
    }
    
    // Filtro de estado
    const estadoFilter = document.getElementById('estado-filter');
    if (estadoFilter) {
        estadoFilter.addEventListener('change', (e) => {
            state.filterEstado = e.target.value;
            navigateTo('tickets', false);
        });
    }
    
    // Filtro de prioridad
    const prioridadFilter = document.getElementById('prioridad-filter');
    if (prioridadFilter) {
        prioridadFilter.addEventListener('change', (e) => {
            state.filterPrioridad = e.target.value;
            navigateTo('tickets', false);
        });
    }
});