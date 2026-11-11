// Vanilla JS app for exerciness (migración desde React + Vite + Tailwind)

// ===== Tema =====
const THEMES = { LIGHT: 'light', DARK: 'dark' }
const THEME_KEY = 'exerciness-theme'

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT

const applyThemeClass = (theme) => {
  document.documentElement.classList.toggle('dark', theme === THEMES.DARK)
}

const loadTheme = () => {
  const stored = localStorage.getItem(THEME_KEY)
  let theme = getSystemTheme()
  if (stored) {
    try {
      theme = JSON.parse(stored).state.theme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT
    } catch {
      theme = stored === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT
    }
  }
  applyThemeClass(theme)
  return theme
}

const saveTheme = (theme) => {
  applyThemeClass(theme)
  localStorage.setItem(THEME_KEY, JSON.stringify({ state: { theme } }))
}

// ===== Etiquetas =====
const fallbackLabel = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : '—')

const bodyPartLabels = {
  waist: 'Abdominales',
  'upper legs': 'Piernas superiores',
  'lower legs': 'Piernas inferiores',
  back: 'Espalda',
  chest: 'Pecho',
  'upper arms': 'Brazos superiores',
  'lower arms': 'Antebrazos',
  neck: 'Cuello',
  shoulders: 'Hombros',
  cardio: 'Cardio',
}

const equipmentLabels = {
  'body weight': 'Peso corporal',
  dumbbell: 'Mancuernas',
  kettlebell: 'Kettlebell',
  barbell: 'Barra',
  'ez barbell': 'Barra Z',
  'olympic barbell': 'Barra olímpica',
  'trap bar': 'Barra trampa',
  cable: 'Poleas',
  band: 'Banda elástica',
  'resistance band': 'Banda de resistencia',
  'stability ball': 'Balón de estabilidad',
  'medicine ball': 'Balón medicinal',
  'bosu ball': 'Bosu',
  'leverage machine': 'Máquina de palanca',
  'sled machine': 'Máquina de trineo',
  assisted: 'Asistido',
  rope: 'Cuerda',
  'ez-bar': 'Barra Z',
  hammer: 'Martillo',
  smith: 'Multipower',
  'upper body ergometer': 'Ergómetro de brazos',
  'stationary bike': 'Bicicleta estática',
  'elliptical machine': 'Elíptica',
  'stepmill machine': 'Escaladora',
  'skierg machine': 'Máquina de esquí',
  'trap bar deadlift': 'Barra trampa',
}

const muscleLabels = {
  abdominals: 'Abdominales',
  'ankle stabilizers': 'Estabilizadores del tobillo',
  ankles: 'Tobillos',
  back: 'Espalda',
  biceps: 'Bíceps',
  brachialis: 'Braquial',
  calves: 'Gemelos',
  chest: 'Pecho',
  core: 'Core',
  deltoids: 'Deltoides',
  feet: 'Pies',
  forearms: 'Antebrazos',
  glutes: 'Glúteos',
  'grip muscles': 'Músculos de agarre',
  groin: 'Ingle',
  hamstrings: 'Isquiotibiales',
  hands: 'Manos',
  'hip flexors': 'Flexores de cadera',
  'inner thighs': 'Aductores',
  'latissimus dorsi': 'Dorsal ancho',
  lats: 'Dorsales',
  'lower abs': 'Abdominales bajos',
  'lower back': 'Lumbar',
  obliques: 'Oblicuos',
  quadriceps: 'Cuádriceps',
  'rear deltoids': 'Deltoides posteriores',
  rhomboids: 'Romboides',
  'rotator cuff': 'Manguito rotador',
  shins: 'Tibiales',
  shoulders: 'Hombros',
  soleus: 'Sóleo',
  sternocleidomastoid: 'Esternocleidomastoideo',
  trapezius: 'Trapecio',
  traps: 'Trapecios',
  triceps: 'Tríceps',
  'upper back': 'Espalda alta',
  'upper chest': 'Pecho superior',
  'wrist extensors': 'Extensores de muñeca',
  'wrist flexors': 'Flexores de muñeca',
  wrists: 'Muñecas',
  abductors: 'Abductores',
  abs: 'Abdominales',
  adductors: 'Aductores',
  'cardiovascular system': 'Sistema cardiovascular',
  delts: 'Deltoides',
  'levator scapulae': 'Elevador de la escápula',
  pectorals: 'Pectorales',
  quads: 'Cuádriceps',
  'serratus anterior': 'Serrato anterior',
  spine: 'Columna',
}

const muscleLabel = (value) => muscleLabels[value] || fallbackLabel(value)
const bodyPartLabel = (value) => bodyPartLabels[value] || fallbackLabel(value)
const equipmentLabel = (value) => equipmentLabels[value] || fallbackLabel(value)

// ===== Datos =====
const createExerciseStore = () => {
  let exercises = []
  let loading = false
  let error = null

  const load = async () => {
    if (exercises.length > 0 || loading) return exercises
    loading = true
    try {
      const response = await fetch('data/exercises.json')
      if (!response.ok) throw new Error(`No se pudo cargar el catálogo (${response.status})`)
      exercises = await response.json()
    } catch (err) {
      error = err.message
    } finally {
      loading = false
    }
    return exercises
  }

  return {
    get exercises() {
      return exercises
    },
    get loading() {
      return loading
    },
    get error() {
      return error
    },
    load,
  }
}

// ===== Filtros =====
const DEFAULT_FILTERS = {
  search: '',
  bodyPart: 'all',
  equipment: 'all',
  sortBy: 'name',
}

const createFilterStore = () => {
  let state = { ...DEFAULT_FILTERS }

  const update = (patch) => {
    state = { ...state, ...patch }
    render()
  }

  return {
    get state() {
      return { ...state }
    },
    setSearch: (search) => update({ search }),
    setBodyPart: (bodyPart) => update({ bodyPart }),
    setEquipment: (equipment) => update({ equipment }),
    setSortBy: (sortBy) => update({ sortBy }),
    reset: () => update({ ...DEFAULT_FILTERS }),
  }
}

// ===== Favoritos y comparador =====
const createIdListStore = (key, limit = Infinity) => {
  const read = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]')
      return Array.isArray(stored) ? stored : []
    } catch {
      return []
    }
  }

  let ids = read()

  const persist = () => localStorage.setItem(key, JSON.stringify(ids))

  const toggle = (id) => {
    if (ids.includes(id)) {
      ids = ids.filter((item) => item !== id)
    } else {
      if (ids.length >= limit) ids = ids.slice(1)
      ids = [...ids, id]
    }
    persist()
    render()
  }

  const clear = () => {
    ids = []
    persist()
    render()
  }

  return {
    get ids() {
      return [...ids]
    },
    has: (id) => ids.includes(id),
    toggle,
    clear,
    get limit() {
      return limit
    },
  }
}

// ===== Utilidades de filtrado =====
const matchesSearch = (exercise, search) =>
  !search || exercise.name.toLowerCase().includes(search.toLowerCase())

const filterExercises = (exercises, filters) =>
  exercises.filter((exercise) => {
    const matchBodyPart = filters.bodyPart === 'all' || exercise.body_part === filters.bodyPart
    const matchEquipment = filters.equipment === 'all' || exercise.equipment === filters.equipment
    return matchesSearch(exercise, filters.search) && matchBodyPart && matchEquipment
  })

const sortExercises = (exercises, sortBy) => {
  const copy = [...exercises]
  if (sortBy === 'body_part') {
    return copy.sort((a, b) => (a.body_part || '').localeCompare(b.body_part || ''))
  }
  if (sortBy === 'equipment') {
    return copy.sort((a, b) => (a.equipment || '').localeCompare(b.equipment || ''))
  }
  return copy.sort((a, b) => a.name.localeCompare(b.name))
}

const asArray = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim())
  return []
}

const instructionText = (exercise) => {
  const instructions = exercise.instruction_steps || exercise.instructions || {}
  if (Array.isArray(instructions.es)) return instructions.es.join(' ')
  return instructions.es || instructions.en || ''
}

// ===== Tarjetas =====
const exerciseCard = (exercise) => `
    <article class="exercise-card">
        <a class="exercise-card-image-link" href="#/ejercicio/${exercise.id}">
            <img src="${exercise.image}" alt="${exercise.name}" loading="lazy" class="exercise-card-image" />
        </a>
        <div class="exercise-card-info">
            <h3 class="exercise-card-name">
                <a class="exercise-card-link" href="#/ejercicio/${exercise.id}">${exercise.name}</a>
            </h3>
            <div class="exercise-card-badges">
                ${exercise.body_part ? `<span class="badge">${bodyPartLabel(exercise.body_part)}</span>` : ''}
                ${exercise.equipment ? `<span class="badge">${equipmentLabel(exercise.equipment)}</span>` : ''}
            </div>
            <div class="exercise-card-actions">
                <button type="button" class="btn btn--soft btn-small" data-favorite="${exercise.id}"
                    aria-pressed="${favoritesStore.has(exercise.id)}">
                    ${favoritesStore.has(exercise.id) ? '★ Guardado' : '☆ Guardar'}
                </button>
                <button type="button" class="btn btn--outline btn-small" data-compare="${exercise.id}"
                    aria-pressed="${compareStore.has(exercise.id)}">
                    ${compareStore.has(exercise.id) ? 'Quitar' : 'Comparar'}
                </button>
            </div>
        </div>
    </article>
`

// ===== Vistas =====
const renderHome = () => {
  const featured = exerciseStore.exercises.slice(0, 6)

  return `
        <section class="hero">
            <h1 class="hero-title">Tu catálogo de<br /><span>ejercicios</span></h1>
            <p class="hero-text">
                Más de ${exerciseStore.exercises.length.toLocaleString('es-ES')} movimientos. Busca, filtra, guarda y compara.
            </p>
            <div class="hero-actions">
                <a href="#/ejercicios" class="btn no-underline">Explorar ahora</a>
                <a href="#/favoritos" class="btn btn--outline no-underline">Tus favoritos</a>
            </div>
        </section>
        <section class="page-section">
            <div class="section-header">
                <span class="section-kicker">01 · Destacados</span>
                <h2 class="section-title">Seis para empezar</h2>
            </div>
            <div class="exercise-grid">${featured.map(exerciseCard).join('')}</div>
        </section>
    `
}

const renderExercisesList = () => {
  const filters = filterStore.state
  const bodyParts = [
    ...new Set(exerciseStore.exercises.map((exercise) => exercise.body_part)),
  ].sort()
  const equipment = [
    ...new Set(exerciseStore.exercises.map((exercise) => exercise.equipment)),
  ].sort()

  const results = sortExercises(filterExercises(exerciseStore.exercises, filters), filters.sortBy)

  return `
        <section class="page-section">
            <header class="section-header">
                <span class="section-kicker">Catálogo</span>
                <h1 class="section-title">Ejercicios</h1>
                <p class="section-subtitle">
                    ${results.length} de ${exerciseStore.exercises.length} ejercicios
                </p>
            </header>

            <div class="filter-bar">
                <input type="search" id="search-input" class="filter" placeholder="Buscar ejercicio..."
                    value="${filters.search}" aria-label="Buscar ejercicio" />
                <select id="body-part-filter" class="filter" aria-label="Grupo corporal">
                    <option value="all">Todos los grupos</option>
                    ${bodyParts
                      .map(
                        (part) =>
                          `<option value="${part}" ${filters.bodyPart === part ? 'selected' : ''}>${bodyPartLabel(part)}</option>`,
                      )
                      .join('')}
                </select>
                <select id="equipment-filter" class="filter" aria-label="Equipamiento">
                    <option value="all">Todo el equipamiento</option>
                    ${equipment
                      .map(
                        (item) =>
                          `<option value="${item}" ${filters.equipment === item ? 'selected' : ''}>${equipmentLabel(item)}</option>`,
                      )
                      .join('')}
                </select>
                <select id="sort-filter" class="filter" aria-label="Ordenar">
                    <option value="name" ${filters.sortBy === 'name' ? 'selected' : ''}>Nombre</option>
                    <option value="body_part" ${filters.sortBy === 'body_part' ? 'selected' : ''}>Grupo corporal</option>
                    <option value="equipment" ${filters.sortBy === 'equipment' ? 'selected' : ''}>Equipamiento</option>
                </select>
                <button type="button" class="btn btn--outline btn-small" id="reset-filters">Limpiar</button>
            </div>

            ${
              results.length === 0
                ? `<div class="empty-state">
                           <h2 class="section-title">Sin resultados</h2>
                           <p class="section-subtitle">Prueba con otra búsqueda o limpia los filtros.</p>
                       </div>`
                : `<div class="exercise-grid">${results.map(exerciseCard).join('')}</div>`
            }
        </section>
    `
}

const renderExerciseDetail = (id) => {
  const exercise = exerciseStore.exercises.find((item) => item.id === id)

  if (!exercise) {
    return `
            <section class="page-section empty-state">
                <h1 class="section-title">Ejercicio no encontrado</h1>
                <p class="section-subtitle">No existe ningún ejercicio con el identificador ${id}.</p>
                <a href="#/ejercicios" class="btn no-underline">Volver al catálogo</a>
            </section>
        `
  }

  const muscles = asArray(exercise.muscle_group)
  const secondary = asArray(exercise.secondary_muscles)
  const media = exercise.gif_url || exercise.image
  const instructions = instructionText(exercise)

  return `
        <section class="detail-view">
            <a href="#/ejercicios" class="back-link">← Volver al catálogo</a>
            <header class="section-header">
                <div class="badge-row">
                    ${exercise.body_part ? `<span class="badge-primary">${bodyPartLabel(exercise.body_part)}</span>` : ''}
                    ${exercise.equipment ? `<span class="badge-secondary">${equipmentLabel(exercise.equipment)}</span>` : ''}
                </div>
                <h1 class="section-title">${exercise.name}</h1>
                <p class="section-subtitle">${exercise.target ? 'Objetivo: ' + muscleLabel(exercise.target) : ''}</p>
            </header>

            <figure class="detail-media">
                <img src="${media}" alt="Animación de ${exercise.name}" class="detail-image" />
                ${exercise.attribution ? `<figcaption class="caption">${exercise.attribution}</figcaption>` : ''}
            </figure>

            <div class="detail-actions">
                <button type="button" class="btn btn--soft" data-favorite="${exercise.id}" aria-pressed="${favoritesStore.has(exercise.id)}">
                    ${favoritesStore.has(exercise.id) ? '★ Quitar de favoritos' : '☆ Guardar en favoritos'}
                </button>
                <button type="button" class="btn btn--outline" data-compare="${exercise.id}" aria-pressed="${compareStore.has(exercise.id)}">
                    ${compareStore.has(exercise.id) ? 'Quitar del comparador' : 'Añadir al comparador'}
                </button>
            </div>

            <section class="detail-block">
                <h2 class="section-title">Instrucciones</h2>
                <p>${instructions || 'No hay instrucciones disponibles para este ejercicio.'}</p>
            </section>

            <section class="detail-block">
                <h2 class="section-title">Músculos implicados</h2>
                <div class="badge-row">
                    ${muscles.map((muscle) => `<span class="badge">${muscleLabel(muscle)}</span>`).join('')}
                </div>
                ${
                  secondary.length
                    ? `<p class="section-subtitle">Secundarios: ${secondary
                        .map(
                          (muscle) => `<span class="badge-secondary">${muscleLabel(muscle)}</span>`,
                        )
                        .join(' ')}</p>`
                    : ''
                }
            </section>
        </section>
    `
}

const renderFavorites = () => {
  const favorites = exerciseStore.exercises.filter((exercise) => favoritesStore.has(exercise.id))

  return `
        <section class="page-section">
            <header class="section-header">
                <span class="section-kicker">Guardados</span>
                <h1 class="section-title">Mis favoritos</h1>
                <p class="section-subtitle">
                    ${favorites.length} ${favorites.length === 1 ? 'ejercicio guardado' : 'ejercicios guardados'}
                </p>
            </header>

            ${
              favorites.length === 0
                ? `<div class="empty-state">
                           <h2 class="section-title">Aún no tienes favoritos</h2>
                           <p class="section-subtitle">Marca ejercicios con el botón Guardar para tenerlos a mano.</p>
                           <a href="#/ejercicios" class="btn no-underline">Explorar ejercicios</a>
                       </div>`
                : `<div class="exercise-grid">${favorites.map(exerciseCard).join('')}</div>`
            }
        </section>
    `
}

const renderComparator = () => {
  const selected = compareStore.ids
    .map((id) => exerciseStore.exercises.find((exercise) => exercise.id === id))
    .filter(Boolean)

  if (selected.length < 2) {
    return `
            <section class="page-section empty-state">
                <h1 class="section-title">Selecciona al menos dos ejercicios</h1>
                <p class="section-subtitle">
                    Añade ejercicios con el botón Comparar del catálogo (máximo ${compareStore.limit}).
                </p>
                <a href="#/ejercicios" class="btn no-underline">Ir al catálogo</a>
            </section>
        `
  }

  const rows = [
    { label: 'Grupo corporal', value: (exercise) => bodyPartLabel(exercise.body_part) },
    { label: 'Equipamiento', value: (exercise) => equipmentLabel(exercise.equipment) },
    { label: 'Objetivo', value: (exercise) => fallbackLabel(exercise.target) },
    {
      label: 'Músculo principal',
      value: (exercise) => asArray(exercise.muscle_group).map(muscleLabel).join(', ') || '—',
    },
    {
      label: 'Músculos secundarios',
      value: (exercise) => asArray(exercise.secondary_muscles).map(muscleLabel).join(', ') || '—',
    },
  ]

  return `
        <section class="page-section">
            <header class="section-header">
                <span class="section-kicker">Comparador</span>
                <h1 class="section-title">Comparar ejercicios</h1>
                <p class="section-subtitle">${selected.length} de ${compareStore.limit} ejercicios seleccionados.</p>
            </header>

            <div class="table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th scope="col">Atributo</th>
                            ${selected.map((exercise) => `<th scope="col">${exercise.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows
                          .map(
                            (row) => `
                                    <tr>
                                        <th scope="row">${row.label}</th>
                                        ${selected.map((exercise) => `<td>${row.value(exercise)}</td>`).join('')}
                                    </tr>
                                `,
                          )
                          .join('')}
                    </tbody>
                </table>
            </div>

            <div class="detail-actions">
                <a href="#/ejercicios" class="btn no-underline">Seguir explorando</a>
                <button type="button" class="btn btn--outline" id="clear-compare">Vaciar comparador</button>
            </div>
        </section>
    `
}

const renderNotFound = () => `
    <section class="page-section empty-state">
        <span class="section-kicker">404</span>
        <h1 class="section-title">No encontramos lo que buscas</h1>
        <a href="#/" class="btn no-underline">Volver al inicio</a>
    </section>
`

const renderLoading = (message) => `
    <section class="page-section empty-state">
        <p class="section-title">${message}</p>
    </section>
`

// ===== Shell y rutas =====
const routes = {
  '/': renderHome,
  '/ejercicios': renderExercisesList,
  '/favoritos': renderFavorites,
  '/comparar': renderComparator,
}

const parseRoute = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const detail = raw.match(/^\/ejercicio\/([^/]+)$/)
  if (detail) return { view: 'detail', id: decodeURIComponent(detail[1]), path: raw }
  return { view: routes[raw] ? raw : '*', id: null, path: raw }
}

const mountLayout = () => {
  const root = document.getElementById('root')
  if (!root) return

  root.innerHTML = `
        <header class="site-header">
            <a class="site-brand" href="#/">exerciness</a>
            <nav class="site-nav" aria-label="Navegación principal">
                <a class="nav-link" href="#/ejercicios">Ejercicios</a>
                <a class="nav-link" href="#/favoritos">Favoritos</a>
                <a class="nav-link" href="#/comparar">Comparar</a>
            </nav>
            <button type="button" class="btn btn--outline btn-small" id="theme-toggle">Modo oscuro</button>
        </header>
        <main id="app" class="site-main"></main>
        <footer class="site-footer">
            <p>exerciness · catálogo de ejercicios con datos de ejemplo</p>
        </footer>
    `
}

const updateNav = (route) => {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href').replace(/^#/, '')
    const active = href === route || (route === '/ejercicio' && href === '/ejercicios')
    link.classList.toggle('active', active)
  })
}

const render = () => {
  const main = document.getElementById('app')
  if (!main) return

  if (exerciseStore.loading) {
    main.innerHTML = renderLoading('Cargando ejercicios...')
    return
  }

  if (exerciseStore.error) {
    main.innerHTML = renderLoading(exerciseStore.error)
    return
  }

  const activeId = document.activeElement?.id || null
  const caret = document.activeElement?.selectionStart ?? null

  const route = parseRoute()
  let html
  if (route.view === 'detail') html = renderExerciseDetail(route.id)
  else if (routes[route.view]) html = routes[route.view]()
  else html = renderNotFound()

  main.innerHTML = html
  if (activeId) {
    const focused = document.getElementById(activeId)
    if (focused) {
      focused.focus()
      if (caret !== null && typeof focused.setSelectionRange === 'function') {
        focused.setSelectionRange(caret, caret)
      }
    }
  }
  updateNav(route.path)
  document.title =
    route.view === 'detail'
      ? 'exerciness · Detalle'
      : `exerciness · ${route.view === '*' ? '404' : 'Catálogo'}`
  bindViewEvents(route)
}

const bindViewEvents = (route) => {
  document.querySelectorAll('[data-favorite]').forEach((button) => {
    button.addEventListener('click', () =>
      favoritesStore.toggle(button.getAttribute('data-favorite')),
    )
  })

  document.querySelectorAll('[data-compare]').forEach((button) => {
    button.addEventListener('click', () => compareStore.toggle(button.getAttribute('data-compare')))
  })

  const clearCompare = document.getElementById('clear-compare')
  if (clearCompare) clearCompare.addEventListener('click', () => compareStore.clear())

  if (route.view !== '/ejercicios') return

  const search = document.getElementById('search-input')
  search?.addEventListener('input', (event) => filterStore.setSearch(event.target.value))

  const bodyPart = document.getElementById('body-part-filter')
  bodyPart?.addEventListener('change', (event) => filterStore.setBodyPart(event.target.value))

  const equipment = document.getElementById('equipment-filter')
  equipment?.addEventListener('change', (event) => filterStore.setEquipment(event.target.value))

  const sort = document.getElementById('sort-filter')
  sort?.addEventListener('change', (event) => filterStore.setSortBy(event.target.value))

  document.getElementById('reset-filters')?.addEventListener('click', () => filterStore.reset())
}

const initThemeToggle = () => {
  const button = document.getElementById('theme-toggle')
  const sync = (theme) => {
    if (button) button.textContent = theme === THEMES.DARK ? 'Modo claro' : 'Modo oscuro'
  }

  sync(currentTheme)
  button?.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? THEMES.LIGHT : THEMES.DARK
    saveTheme(next)
    sync(next)
  })
}

// ===== Arranque =====
const exerciseStore = createExerciseStore()
const filterStore = createFilterStore()
const favoritesStore = createIdListStore('exerciness-favorites')
const compareStore = createIdListStore('exerciness-compare', 4)
const currentTheme = loadTheme()

document.addEventListener('DOMContentLoaded', async () => {
  mountLayout()
  initThemeToggle()
  window.addEventListener('hashchange', render)
  await exerciseStore.load()
  render()
})

// Estilos propios del shell (el resto viene del CSS compilado)
const style = document.createElement('style')
style.textContent = `
    .site-header { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(127, 127, 127, 0.25); }
    .site-brand { font-weight: 700; font-size: 1.15rem; text-decoration: none; color: inherit; }
    .site-nav { display: flex; gap: 1rem; flex: 1; }
    .site-nav .nav-link { text-decoration: none; color: inherit; opacity: 0.75; font-size: 0.95rem; }
    .site-nav .nav-link.active, .site-nav .nav-link:hover { opacity: 1; font-weight: 600; }
    .site-main { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
    .site-footer { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; opacity: 0.7; font-size: 0.85rem; }
    .hero { padding: 4rem 1rem 2rem; text-align: center; }
    .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; margin: 0 0 1rem; }
    .hero-text { opacity: 0.75; max-width: 46ch; margin: 0 auto 2rem; }
    .hero-actions, .detail-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .page-section { padding: 1.5rem 0 3rem; }
    .section-header { margin-bottom: 1.5rem; }
    .section-kicker { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.65; }
    .section-title { font-size: 1.5rem; margin: 0.35rem 0; }
    .section-subtitle { opacity: 0.75; margin: 0; }
    .exercise-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
    .exercise-card { border: 1px solid rgba(127, 127, 127, 0.25); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
    .exercise-card-image-link { display: block; background: rgba(127, 127, 127, 0.08); }
    .exercise-card-image { width: 100%; aspect-ratio: 1; object-fit: contain; display: block; }
    .exercise-card-info { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .exercise-card-name { font-size: 1rem; margin: 0; text-transform: capitalize; }
    .exercise-card-link { color: inherit; text-decoration: none; }
    .exercise-card-badges, .badge-row { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .exercise-card-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: auto; }
    .btn-small { font-size: 0.78rem; padding: 0.35rem 0.6rem; }
    .filter-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
    .filter { padding: 0.5rem 0.65rem; border-radius: 8px; border: 1px solid rgba(127, 127, 127, 0.35); background: transparent; color: inherit; font: inherit; }
    .filter[type="search"] { flex: 1; min-width: 200px; }
    .detail-view { max-width: 780px; margin: 0 auto; padding: 1.5rem 0 3rem; }
    .back-link { display: inline-block; margin-bottom: 1rem; text-decoration: none; color: inherit; opacity: 0.75; }
    .detail-media { margin: 1.5rem 0; text-align: center; }
    .detail-image { max-width: 320px; width: 100%; border-radius: 12px; background: rgba(127, 127, 127, 0.08); }
    .caption { font-size: 0.75rem; opacity: 0.6; margin-top: 0.5rem; }
    .detail-block { margin-top: 2rem; }
    .detail-block p { line-height: 1.6; max-width: 65ch; }
    .table-wrapper { overflow-x: auto; border: 1px solid rgba(127, 127, 127, 0.25); border-radius: 10px; }
    .comparison-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .comparison-table th, .comparison-table td { padding: 0.6rem 0.75rem; border-bottom: 1px solid rgba(127, 127, 127, 0.2); text-align: left; vertical-align: top; }
    .empty-state { text-align: center; padding: 3rem 1rem; }
    @media (max-width: 640px) {
        .site-nav { order: 3; width: 100%; }
    }
`
document.head.appendChild(style)

// API de depuración
window.exerciness = {
  stores: { exerciseStore, filterStore, favoritesStore, compareStore },
  render,
}
