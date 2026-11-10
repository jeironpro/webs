// Enciclopedia de Naruto — filtros, ranking, paginación y modales en JS vanilla.
const BASE_URL = new URL('./', document.baseURI);
const POR_PAGINA = 24;

const ALDEAS = ['todas', 'Konohagakure', 'Sunagakure', 'Kirigakure', 'Otogakure', 'Iwagakure', 'Hoshigakure', 'Kumogakure', 'Ishigakure', 'Takumi', 'S/A'];
const CLANES = ['todos', 'Uchiha', 'Uzumaki', 'Hyûga', 'Nara', 'Yamanaka', 'Akimichi', 'Inuzuka', 'Aburame', 'Hatake', 'Sarutobi', 'Senju', 'Katô', 'Momochi', 'Yuki', 'Hoshigaki', 'Kaguya', 'Yamashiro', 'Namiashi', 'Kamizuru', 'Fûma', 'Kurama', 'Shiin', 'Kazekage', 'Lee', 'S/C'];
const EQUIPOS = ['todos', 'Akatsuki', 'Equipo 7', 'Equipo 8', 'Equipo 10', 'Equipo Dosu', 'Equipo Guy', 'Equipo Konohamaru', 'Equipo Kabuto', 'Equipo Watari', 'Equipo Hiruzen', 'Equipo Minato', 'Equipo Oboro', 'Shinobazu', 'Hermanos Criminales', 'Hermanos Diabólicos', 'Cuatro Hombres de los Símbolos Celestiales', 'Hermanos de la Arena', 'Siete Espadachines de la Niebla', 'Consejeros del Hokage', 'Familia Kurosuki', 'Legendarios Hermanos Estupidos', 'Tres Hermanos Ryûdôin', 'Cuatro del Sonido', 'S/E'];
const RANGOS = ['todos', 'Estudiante', 'Genin', 'Chûnin', 'Tokubetsu Jônin', 'Jônin', 'ANBU', 'Sannin', 'Hokage', 'Kazekage', 'Mizukage', 'Hoshikage', 'Especialista Médico', 'S/R'];
const ORDENES = [
    ['score-desc', 'Mejor puntuación'],
    ['score-asc', 'Peor puntuación'],
    ['nombre-asc', 'Nombre A-Z'],
    ['nombre-desc', 'Nombre Z-A'],
];

const filtros = { aldea: 'todas', clan: 'todos', equipo: 'todos', rango: 'todos', sort: 'score-desc', search: '' };
let personajes = [];
let paginaActual = 1;
let totalPaginas = 1;

const $ = (selector) => document.querySelector(selector);
const escapar = (valor = '') => String(valor).replace(/[&<>"']/g, (caracter) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[caracter]));

function imagenUrl(imagen = '') {
    return new URL(`images/${imagen.replace(/^\/images\//, '')}`, BASE_URL).href;
}

function calcularPuntaje(estadisticas = {}) {
    return Math.round((estadisticas.fuerza * 0.3 + estadisticas.habilidad * 0.3 + estadisticas.resistencia * 0.2 + estadisticas.estrategia * 0.2) * 10) / 10;
}

function crearKunais() {
    const svg = `<svg class="kunai" width="32" height="44" viewBox="0 0 60 200" fill="none" aria-hidden="true">
        <defs><linearGradient id="kunai-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8B929A"/><stop offset="50%" stop-color="#D1D5DB"/><stop offset="100%" stop-color="#8B929A"/></linearGradient></defs>
        <path d="M30 14 C24 32 12 44 11 56 C10 68 16 76 20 80 L28 84 L30 86 Z" fill="url(#kunai-blade)" stroke="#5C6065" stroke-width=".5"/>
        <path d="M30 14 C36 32 48 44 49 56 C50 68 44 76 40 80 L32 84 L30 86 Z" fill="url(#kunai-blade)" stroke="#5C6065" stroke-width=".5"/>
        <line x1="30" y1="14" x2="30" y2="86" stroke="#5C6065" stroke-width="1.5" opacity=".8"/>
        <rect x="24" y="84" width="12" height="4" rx="1" fill="#6B7278"/><rect x="26" y="88" width="8" height="48" rx="2" fill="#8B8F94"/>
        <ellipse cx="30" cy="150" rx="8" ry="6" fill="none" stroke="#8B929A" stroke-width="3"/>
    </svg>`;
    $('#background-kunai').innerHTML = svg.repeat(8);
}

function opciones(valores, etiquetaTodos) {
    return valores.map((valor) => `<option value="${escapar(valor)}">${escapar(valor === 'todas' || valor === 'todos' ? etiquetaTodos : valor)}</option>`).join('');
}

function renderFiltros() {
    $('#filter-bar').innerHTML = `
        <div class="filter-search"><input type="text" class="filter-input" id="buscar" placeholder="Buscar personaje..." aria-label="Buscar personaje" value="${escapar(filtros.search)}"></div>
        <div class="filter-controls">
            <div class="filter-group"><label class="filter-label" for="aldea">Aldea</label><select class="filter-select" id="aldea">${opciones(ALDEAS, 'Todas')}</select></div>
            <div class="filter-group"><label class="filter-label" for="clan">Clan</label><select class="filter-select" id="clan">${opciones(CLANES, 'Todos')}</select></div>
            <div class="filter-group"><label class="filter-label" for="equipo">Equipo</label><select class="filter-select" id="equipo">${opciones(EQUIPOS, 'Todos')}</select></div>
            <div class="filter-group"><label class="filter-label" for="rango">Rango</label><select class="filter-select" id="rango">${opciones(RANGOS, 'Todos')}</select></div>
            <div class="filter-group"><label class="filter-label" for="sort">Ordenar</label><select class="filter-select" id="sort">${ORDENES.map(([valor, texto]) => `<option value="${valor}">${escapar(texto)}</option>`).join('')}</select></div>
            <button type="button" class="filter-top3" id="ver-top3">Ver top 3</button>
            <button type="button" class="filter-reset" id="reiniciar">Reiniciar</button>
        </div>`;
    sincronizarFiltros();

    $('#buscar').addEventListener('input', (evento) => { filtros.search = evento.target.value; paginaActual = 1; renderListado(); });
    ['aldea', 'clan', 'equipo', 'rango', 'sort'].forEach((clave) => {
        $(`#${clave}`).addEventListener('change', (evento) => { filtros[clave] = evento.target.value; paginaActual = 1; renderListado(); });
    });
    $('#reiniciar').addEventListener('click', () => {
        Object.assign(filtros, { aldea: 'todas', clan: 'todos', equipo: 'todos', rango: 'todos', sort: 'score-desc', search: '' });
        paginaActual = 1;
        sincronizarFiltros();
        renderListado();
    });
    $('#ver-top3').addEventListener('click', abrirTop3);
}

function sincronizarFiltros() {
    $('#buscar').value = filtros.search;
    ['aldea', 'clan', 'equipo', 'rango', 'sort'].forEach((clave) => { $(`#${clave}`).value = filtros[clave]; });
}

function filtrar() {
    const termino = filtros.search.trim().toLowerCase();
    return personajes
        .filter((personaje) => !termino || personaje.nombre.toLowerCase().includes(termino))
        .filter((personaje) => filtros.aldea === 'todas' || personaje.aldea === filtros.aldea)
        .filter((personaje) => filtros.clan === 'todos' || personaje.clan === filtros.clan)
        .filter((personaje) => filtros.equipo === 'todos' || personaje.equipo === filtros.equipo)
        .filter((personaje) => filtros.rango === 'todos' || personaje.rango === filtros.rango)
        .sort((a, b) => {
            if (filtros.sort === 'score-asc') return a.scoreTotal - b.scoreTotal;
            if (filtros.sort === 'nombre-asc') return a.nombre.localeCompare(b.nombre);
            if (filtros.sort === 'nombre-desc') return b.nombre.localeCompare(a.nombre);
            return b.scoreTotal - a.scoreTotal;
        });
}

function colorPuntaje(puntaje) {
    if (puntaje >= 8) return 'gold';
    if (puntaje >= 6) return 'silver';
    if (puntaje >= 4) return 'bronze';
    return 'base';
}

function badgePuntaje(puntaje) {
    const valor = Math.min(10, Math.max(0, puntaje || 0));
    return `<div class="score-badge score-badge--${colorPuntaje(valor)}" role="img" aria-label="Puntuación: ${valor}"><span class="score-value" aria-hidden="true">${valor}</span></div>`;
}

function listaEtiquetas(items = [], clase) {
    return items.slice(0, 3).map((item) => `<li class="${clase}">${escapar(item)}</li>`).join('');
}

function tarjeta(personaje) {
    const stats = personaje.estadisticas;
    return `<article class="card">
        <div class="card-banner">
            <img class="card-banner-img" src="${imagenUrl(personaje.imagen)}" alt="${escapar(personaje.nombre)}" loading="lazy" data-nombre="${escapar(personaje.nombre)}">
            <button type="button" class="card-expand" data-imagen="${personaje.id}" aria-label="Ver imagen completa">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </button>
            <div class="card-banner-overlay"><h2 class="card-name">${escapar(personaje.nombre)}</h2></div>
            <div class="card-banner-score">${badgePuntaje(personaje.scoreTotal)}</div>
        </div>
        <div class="card-body">
            <div class="card-meta"><span>${escapar(personaje.aldea)}</span><span class="meta-div">|</span><span>${escapar(personaje.clan)}</span><span class="meta-div">|</span><span>${escapar(personaje.rango)}</span><span class="meta-div">|</span><span>${escapar(personaje.equipo)}</span></div>
            <div class="card-divider"></div>
            <div class="card-stats-grid" aria-label="Estadísticas">
                <div class="snode"><div class="snode-value" style="color:#E8832C">${stats.fuerza}</div><div class="snode-label">Fuerza</div></div>
                <div class="snode"><div class="snode-value" style="color:#60A5FA">${stats.habilidad}</div><div class="snode-label">Habilidad</div></div>
                <div class="snode"><div class="snode-value" style="color:#4ADE80">${stats.resistencia}</div><div class="snode-label">Resistencia</div></div>
                <div class="snode"><div class="snode-value" style="color:#FACC15">${stats.estrategia}</div><div class="snode-label">Estrategia</div></div>
            </div>
            ${personaje.habilidades.length ? `<div class="card-divider"></div><div class="card-abilities"><span class="card-section-label">Habilidades</span><ul class="card-ability-list">${listaEtiquetas(personaje.habilidades, 'ability-tag')}</ul></div>` : ''}
            ${personaje.fortalezas.length || personaje.debilidades.length ? `<div class="card-divider"></div><div class="card-sides">
                ${personaje.fortalezas.length ? `<div class="card-side"><span class="card-section-label card-section-label--green">Fortalezas</span><ul>${listaEtiquetas(personaje.fortalezas, 'side-item side-item--pos')}</ul></div>` : ''}
                ${personaje.debilidades.length ? `<div class="card-side"><span class="card-section-label card-section-label--red">Debilidades</span><ul>${listaEtiquetas(personaje.debilidades, 'side-item side-item--neg')}</ul></div>` : ''}
            </div>` : ''}
        </div>
    </article>`;
}

function renderListado() {
    const resultado = filtrar();
    totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA));
    paginaActual = Math.min(Math.max(1, paginaActual), totalPaginas);
    const inicio = (paginaActual - 1) * POR_PAGINA;
    const visibles = resultado.slice(inicio, inicio + POR_PAGINA);

    if (!resultado.length) {
        $('#estado').className = 'empty-state';
        $('#estado').textContent = 'No se encontraron personajes con esos filtros.';
        $('#cards').innerHTML = '';
        $('#pagination').innerHTML = '';
        return;
    }

    $('#estado').className = 'loading-state oculto';
    $('#estado').textContent = '';
    $('#cards').innerHTML = visibles.map(tarjeta).join('');
    // Fallback visual si una imagen no carga.
    document.querySelectorAll('.card-banner-img').forEach((imagen) => {
        imagen.addEventListener('error', () => {
            const fallback = document.createElement('div');
            fallback.className = 'card-banner-fallback';
            fallback.innerHTML = `<span class="card-banner-initial">${escapar(imagen.dataset.nombre?.[0] || '?')}</span>`;
            imagen.replaceWith(fallback);
        }, { once: true });
    });
    document.querySelectorAll('[data-imagen]').forEach((boton) => {
        boton.addEventListener('click', () => abrirImagen(boton.dataset.imagen));
    });
    renderPaginacion();
}

function numerosPagina(actual, total) {
    if (total <= 7) return Array.from({ length: total }, (_, indice) => indice + 1);
    const paginas = [1];
    if (actual > 3) paginas.push('...');
    for (let pagina = Math.max(2, actual - 1); pagina <= Math.min(total - 1, actual + 1); pagina += 1) paginas.push(pagina);
    if (actual < total - 2) paginas.push('...');
    paginas.push(total);
    return paginas;
}

function renderPaginacion() {
    const contenedor = $('#pagination');
    if (totalPaginas <= 1) { contenedor.innerHTML = ''; return; }
    contenedor.innerHTML = `
        <button type="button" class="pagination-btn" data-pagina="${paginaActual - 1}" aria-label="Página anterior" ${paginaActual === 1 ? 'disabled' : ''}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        ${numerosPagina(paginaActual, totalPaginas).map((pagina) => pagina === '...'
            ? '<span class="pagination-ellipsis" aria-hidden="true">…</span>'
            : `<button type="button" class="pagination-btn pagination-btn--page ${pagina === paginaActual ? 'pagination-btn--active' : ''}" data-pagina="${pagina}" aria-label="Página ${pagina}" ${pagina === paginaActual ? 'aria-current="page"' : ''}>${pagina}</button>`).join('')}
        <button type="button" class="pagination-btn" data-pagina="${paginaActual + 1}" aria-label="Página siguiente" ${paginaActual === totalPaginas ? 'disabled' : ''}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
    contenedor.querySelectorAll('[data-pagina]').forEach((boton) => {
        boton.addEventListener('click', () => {
            const destino = Number(boton.dataset.pagina);
            if (destino >= 1 && destino <= totalPaginas && destino !== paginaActual) {
                paginaActual = destino;
                renderListado();
                $('#filter-bar').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function abrirModal(contenido, claseOverlay = '') {
    $('#modal-root').innerHTML = `<div class="modal-overlay ${claseOverlay}" data-cerrar><div class="modal-content" role="dialog" aria-modal="true" tabindex="-1">${contenido}</div></div>`;
    document.body.style.overflow = 'hidden';
    const overlay = $('#modal-root .modal-overlay');
    overlay.addEventListener('click', (evento) => { if (evento.target === overlay) cerrarModal(); });
    overlay.querySelector('.modal-close')?.addEventListener('click', cerrarModal);
    overlay.querySelector('.modal-content')?.focus();
    document.addEventListener('keydown', manejarEscape);
}

function cerrarModal() {
    $('#modal-root').innerHTML = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', manejarEscape);
}

function manejarEscape(evento) {
    if (evento.key === 'Escape') cerrarModal();
}

function cerrarBoton() {
    return `<button type="button" class="modal-close" aria-label="Cerrar"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;
}

function abrirTop3() {
    const top3 = [...personajes].sort((a, b) => b.scoreTotal - a.scoreTotal).slice(0, 3);
    if (top3.length < 3) return;
    const estilos = [
        { key: 'first', label: '1', color: '#FFD700', stream: 'linear-gradient(180deg, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.02) 100%)', glow: 'rgba(255,215,0,0.25)' },
        { key: 'second', label: '2', color: '#94A3B8', stream: 'linear-gradient(180deg, rgba(148,163,184,0.3) 0%, rgba(148,163,184,0.02) 100%)', glow: 'rgba(148,163,184,0.15)' },
        { key: 'third', label: '3', color: '#CD7F32', stream: 'linear-gradient(180deg, rgba(205,127,50,0.3) 0%, rgba(205,127,50,0.02) 100%)', glow: 'rgba(205,127,50,0.15)' },
    ];
    const items = [[top3[1], estilos[1]], [top3[0], estilos[0]], [top3[2], estilos[2]]];
    const contenido = `${cerrarBoton()}<section class="podium"><h2 class="podium-title"><span class="podium-title-bg">TOP 3</span></h2><div class="ascension">
        ${items.map(([personaje, rank]) => `<div class="ascension-item ascension-item--${rank.key}">
            <div class="ascension-particles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="ascension-frame" style="border-color:${rank.color};box-shadow:0 0 24px ${rank.glow}">
                ${rank.key === 'first' ? '<div class="ascension-halo" style="border-color:rgba(255,215,0,0.12)"></div>' : ''}
                <div class="ascension-glow" style="background:radial-gradient(circle, ${rank.glow} 0%, transparent 70%)"></div>
                <img class="ascension-img" src="${imagenUrl(personaje.imagen)}" alt="${escapar(personaje.nombre)}" loading="lazy">
            </div>
            <div class="ascension-badge" style="background:${rank.color};color:#0D1B3E">${rank.label}</div>
            <div class="ascension-stream" style="background:${rank.stream}"><div class="ascension-stream-inner" style="background:${rank.color}"></div></div>
            <div class="ascension-info"><span class="ascension-name" style="color:${rank.color}">${escapar(personaje.nombre)}</span><span class="ascension-score" aria-label="Puntuación: ${personaje.scoreTotal}">${personaje.scoreTotal}</span></div>
        </div>`).join('')}
    </div></section>`;
    abrirModal(contenido);
}

function abrirImagen(id) {
    const personaje = personajes.find((item) => item.id === id);
    if (!personaje) return;
    const contenido = `<div class="modal-overlay imodal-overlay" data-cerrar><div class="imodal" role="dialog" aria-modal="true" aria-label="Imagen de ${escapar(personaje.nombre)}">
        <div class="imodal-bg"></div>
        <button type="button" class="modal-close imodal-close" aria-label="Cerrar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        <div class="imodal-image-wrap"><div class="imodal-image-glow"></div><img class="imodal-image" src="${imagenUrl(personaje.imagen)}" alt="${escapar(personaje.nombre)}" loading="lazy"></div>
        <div class="imodal-info"><h2 class="imodal-name">${escapar(personaje.nombre)}</h2><div class="imodal-meta"><span class="imodal-tag">${escapar(personaje.aldea)}</span><span class="imodal-dot">•</span><span class="imodal-tag">${escapar(personaje.rango)}</span><span class="imodal-dot">•</span><span class="imodal-tag">${escapar(personaje.equipo)}</span></div></div>
        <div class="imodal-corner imodal-corner--tl"></div><div class="imodal-corner imodal-corner--tr"></div><div class="imodal-corner imodal-corner--bl"></div><div class="imodal-corner imodal-corner--br"></div>
    </div></div>`;
    $('#modal-root').innerHTML = contenido;
    document.body.style.overflow = 'hidden';
    const overlay = $('#modal-root .imodal-overlay');
    overlay.addEventListener('click', (evento) => { if (evento.target === overlay) cerrarModal(); });
    overlay.querySelector('.modal-close').addEventListener('click', cerrarModal);
    const imagen = overlay.querySelector('.imodal-image');
    imagen.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'imodal-fallback';
        fallback.innerHTML = `<span class="imodal-initial">${escapar(personaje.nombre[0] || '?')}</span>`;
        imagen.replaceWith(fallback);
    }, { once: true });
    overlay.querySelector('.imodal').addEventListener('click', (evento) => evento.stopPropagation());
    document.addEventListener('keydown', manejarEscape);
}

async function iniciar() {
    crearKunais();
    renderFiltros();
    try {
        const respuesta = await fetch(new URL('data/naruto/personajes.json', BASE_URL));
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        personajes = datos.map((personaje) => ({
            id: personaje.id,
            nombre: personaje.nombre,
            aldea: personaje.aldea || '',
            clan: personaje.clan || '',
            equipo: personaje.equipo || '',
            rango: personaje.rango || '',
            imagen: personaje.imagen || '',
            habilidades: personaje.habilidades || [],
            fortalezas: personaje.fortalezas || [],
            debilidades: personaje.debilidades || [],
            estadisticas: personaje.estadisticas || { fuerza: 0, habilidad: 0, resistencia: 0, estrategia: 0 },
            scoreTotal: calcularPuntaje(personaje.estadisticas),
        }));
        renderListado();
    } catch (error) {
        console.error('No se pudieron cargar los personajes:', error);
        $('#estado').className = 'error-state';
        $('#estado').textContent = 'No se pudieron cargar los personajes. Inténtalo de nuevo.';
    }
}

iniciar();
