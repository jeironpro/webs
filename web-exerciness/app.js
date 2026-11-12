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

// Construye nodos sin pasar por HTML.
const crear = (etiqueta, propiedades = {}, hijos = []) => {
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

const fragmento = (...hijos) => {
  const trozo = document.createDocumentFragment()
  trozo.append(...hijos.filter(Boolean))
  return trozo
}

// ===== Tarjetas =====
const exerciseCard = (exercise) => {
  const guardado = favoritesStore.has(exercise.id)
  const comparando = compareStore.has(exercise.id)
  const enlace = {
    clase: 'exercise-card-link',
    href: `#/ejercicio/${exercise.id}`,
    texto: exercise.name,
  }

  return crear('article', { clase: 'exercise-card' }, [
    crear('a', { clase: 'exercise-card-image-link', href: `#/ejercicio/${exercise.id}` }, [
      crear('img', {
        src: exercise.image,
        alt: exercise.name,
        loading: 'lazy',
        clase: 'exercise-card-image',
      }),
    ]),
    crear('div', { clase: 'exercise-card-info' }, [
      crear('h3', { clase: 'exercise-card-name' }, [crear('a', enlace)]),
      crear('div', { clase: 'exercise-card-badges' }, [
        exercise.body_part
          ? crear('span', { clase: 'badge', texto: bodyPartLabel(exercise.body_part) })
          : null,
        exercise.equipment
          ? crear('span', { clase: 'badge', texto: equipmentLabel(exercise.equipment) })
          : null,
      ]),
      crear('div', { clase: 'exercise-card-actions' }, [
        crear('button', {
          type: 'button',
          clase: 'btn btn--soft btn-small',
          'data-favorite': exercise.id,
          'aria-pressed': String(guardado),
          texto: guardado ? '★ Guardado' : '☆ Guardar',
        }),
        crear('button', {
          type: 'button',
          clase: 'btn btn--outline btn-small',
          'data-compare': exercise.id,
          'aria-pressed': String(comparando),
          texto: comparando ? 'Quitar' : 'Comparar',
        }),
      ]),
    ]),
  ])
}

const seccionVacia = (titulo, texto, enlace) =>
  crear('div', { clase: 'empty-state' }, [
    crear(titulo.etiqueta, { clase: 'section-title', texto: titulo.texto }),
    crear('p', { clase: 'section-subtitle', texto }),
    enlace,
  ])

// ===== Vistas =====
const renderHome = () => {
  const featured = exerciseStore.exercises.slice(0, 6)

  return fragmento(
    crear('section', { clase: 'hero' }, [
      crear('h1', { clase: 'hero-title' }, [
        'Tu catálogo de',
        crear('br'),
        crear('span', { texto: 'ejercicios' }),
      ]),
      crear('p', {
        clase: 'hero-text',
        texto: `Más de ${exerciseStore.exercises.length.toLocaleString('es-ES')} movimientos. Busca, filtra, guarda y compara.`,
      }),
      crear('div', { clase: 'hero-actions' }, [
        crear('a', { href: '#/ejercicios', clase: 'btn no-underline', texto: 'Explorar ahora' }),
        crear('a', {
          href: '#/favoritos',
          clase: 'btn btn--outline no-underline',
          texto: 'Tus favoritos',
        }),
      ]),
    ]),
    crear('section', { clase: 'page-section' }, [
      crear('div', { clase: 'section-header' }, [
        crear('span', { clase: 'section-kicker', texto: '01 · Destacados' }),
        crear('h2', { clase: 'section-title', texto: 'Seis para empezar' }),
      ]),
      crear('div', { clase: 'exercise-grid' }, featured.map(exerciseCard)),
    ]),
  )
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

  const opcion = (valor, etiqueta, activo) =>
    crear('option', { value: valor, selected: activo, texto: etiqueta })

  return crear('section', { clase: 'page-section' }, [
    crear('header', { clase: 'section-header' }, [
      crear('span', { clase: 'section-kicker', texto: 'Catálogo' }),
      crear('h1', { clase: 'section-title', texto: 'Ejercicios' }),
      crear('p', {
        clase: 'section-subtitle',
        texto: `${results.length} de ${exerciseStore.exercises.length} ejercicios`,
      }),
    ]),
    crear('div', { clase: 'filter-bar' }, [
      crear('input', {
        type: 'search',
        id: 'search-input',
        clase: 'filter',
        placeholder: 'Buscar ejercicio...',
        value: filters.search,
        'aria-label': 'Buscar ejercicio',
      }),
      crear('select', { id: 'body-part-filter', clase: 'filter', 'aria-label': 'Grupo corporal' }, [
        opcion('all', 'Todos los grupos', filters.bodyPart === 'all'),
        ...bodyParts.map((part) => opcion(part, bodyPartLabel(part), filters.bodyPart === part)),
      ]),
      crear('select', { id: 'equipment-filter', clase: 'filter', 'aria-label': 'Equipamiento' }, [
        opcion('all', 'Todo el equipamiento', filters.equipment === 'all'),
        ...equipment.map((item) => opcion(item, equipmentLabel(item), filters.equipment === item)),
      ]),
      crear('select', { id: 'sort-filter', clase: 'filter', 'aria-label': 'Ordenar' }, [
        opcion('name', 'Nombre', filters.sortBy === 'name'),
        opcion('body_part', 'Grupo corporal', filters.sortBy === 'body_part'),
        opcion('equipment', 'Equipamiento', filters.sortBy === 'equipment'),
      ]),
      crear('button', {
        type: 'button',
        clase: 'btn btn--outline btn-small',
        id: 'reset-filters',
        texto: 'Limpiar',
      }),
    ]),
    results.length === 0
      ? seccionVacia(
          { etiqueta: 'h2', texto: 'Sin resultados' },
          'Prueba con otra búsqueda o limpia los filtros.',
          null,
        )
      : crear('div', { clase: 'exercise-grid' }, results.map(exerciseCard)),
  ])
}

const renderExerciseDetail = (id) => {
  const exercise = exerciseStore.exercises.find((item) => item.id === id)

  if (!exercise) {
    return crear('section', { clase: 'page-section empty-state' }, [
      crear('h1', { clase: 'section-title', texto: 'Ejercicio no encontrado' }),
      crear('p', {
        clase: 'section-subtitle',
        texto: `No existe ningún ejercicio con el identificador ${id}.`,
      }),
      crear('a', { href: '#/ejercicios', clase: 'btn no-underline', texto: 'Volver al catálogo' }),
    ])
  }

  const muscles = asArray(exercise.muscle_group)
  const secondary = asArray(exercise.secondary_muscles)
  const media = exercise.gif_url || exercise.image
  const instructions = instructionText(exercise)
  const guardado = favoritesStore.has(exercise.id)
  const comparando = compareStore.has(exercise.id)

  return crear('section', { clase: 'detail-view' }, [
    crear('a', { href: '#/ejercicios', clase: 'back-link', texto: '← Volver al catálogo' }),
    crear('header', { clase: 'section-header' }, [
      crear('div', { clase: 'badge-row' }, [
        exercise.body_part
          ? crear('span', { clase: 'badge-primary', texto: bodyPartLabel(exercise.body_part) })
          : null,
        exercise.equipment
          ? crear('span', {
              clase: 'badge-secondary',
              texto: equipmentLabel(exercise.equipment),
            })
          : null,
      ]),
      crear('h1', { clase: 'section-title', texto: exercise.name }),
      crear('p', {
        clase: 'section-subtitle',
        texto: exercise.target ? `Objetivo: ${muscleLabel(exercise.target)}` : '',
      }),
    ]),
    crear('figure', { clase: 'detail-media' }, [
      crear('img', {
        src: media,
        alt: `Animación de ${exercise.name}`,
        clase: 'detail-image',
      }),
      exercise.attribution
        ? crear('figcaption', { clase: 'caption', texto: exercise.attribution })
        : null,
    ]),
    crear('div', { clase: 'detail-actions' }, [
      crear('button', {
        type: 'button',
        clase: 'btn btn--soft',
        'data-favorite': exercise.id,
        'aria-pressed': String(guardado),
        texto: guardado ? '★ Quitar de favoritos' : '☆ Guardar en favoritos',
      }),
      crear('button', {
        type: 'button',
        clase: 'btn btn--outline',
        'data-compare': exercise.id,
        'aria-pressed': String(comparando),
        texto: comparando ? 'Quitar del comparador' : 'Añadir al comparador',
      }),
    ]),
    crear('section', { clase: 'detail-block' }, [
      crear('h2', { clase: 'section-title', texto: 'Instrucciones' }),
      crear('p', {
        texto: instructions || 'No hay instrucciones disponibles para este ejercicio.',
      }),
    ]),
    crear('section', { clase: 'detail-block' }, [
      crear('h2', { clase: 'section-title', texto: 'Músculos implicados' }),
      crear(
        'div',
        { clase: 'badge-row' },
        muscles.map((muscle) => crear('span', { clase: 'badge', texto: muscleLabel(muscle) })),
      ),
      secondary.length
        ? crear('p', { clase: 'section-subtitle' }, [
            'Secundarios: ',
            ...secondary.flatMap((muscle, indice) => [
              indice ? ' ' : '',
              crear('span', { clase: 'badge-secondary', texto: muscleLabel(muscle) }),
            ]),
          ])
        : null,
    ]),
  ])
}

const renderFavorites = () => {
  const favorites = exerciseStore.exercises.filter((exercise) => favoritesStore.has(exercise.id))

  return crear('section', { clase: 'page-section' }, [
    crear('header', { clase: 'section-header' }, [
      crear('span', { clase: 'section-kicker', texto: 'Guardados' }),
      crear('h1', { clase: 'section-title', texto: 'Mis favoritos' }),
      crear('p', {
        clase: 'section-subtitle',
        texto: `${favorites.length} ${favorites.length === 1 ? 'ejercicio guardado' : 'ejercicios guardados'}`,
      }),
    ]),
    favorites.length === 0
      ? seccionVacia(
          { etiqueta: 'h2', texto: 'Aún no tienes favoritos' },
          'Marca ejercicios con el botón Guardar para tenerlos a mano.',
          crear('a', {
            href: '#/ejercicios',
            clase: 'btn no-underline',
            texto: 'Explorar ejercicios',
          }),
        )
      : crear('div', { clase: 'exercise-grid' }, favorites.map(exerciseCard)),
  ])
}

const renderComparator = () => {
  const selected = compareStore.ids
    .map((id) => exerciseStore.exercises.find((exercise) => exercise.id === id))
    .filter(Boolean)

  if (selected.length < 2) {
    return crear('section', { clase: 'page-section empty-state' }, [
      crear('h1', { clase: 'section-title', texto: 'Selecciona al menos dos ejercicios' }),
      crear('p', {
        clase: 'section-subtitle',
        texto: `Añade ejercicios con el botón Comparar del catálogo (máximo ${compareStore.limit}).`,
      }),
      crear('a', { href: '#/ejercicios', clase: 'btn no-underline', texto: 'Ir al catálogo' }),
    ])
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

  return crear('section', { clase: 'page-section' }, [
    crear('header', { clase: 'section-header' }, [
      crear('span', { clase: 'section-kicker', texto: 'Comparador' }),
      crear('h1', { clase: 'section-title', texto: 'Comparar ejercicios' }),
      crear('p', {
        clase: 'section-subtitle',
        texto: `${selected.length} de ${compareStore.limit} ejercicios seleccionados.`,
      }),
    ]),
    crear('div', { clase: 'table-wrapper' }, [
      crear('table', { clase: 'comparison-table' }, [
        crear('thead', {}, [
          crear('tr', {}, [
            crear('th', { scope: 'col', texto: 'Atributo' }),
            ...selected.map((exercise) => crear('th', { scope: 'col', texto: exercise.name })),
          ]),
        ]),
        crear(
          'tbody',
          {},
          rows.map((row) =>
            crear('tr', {}, [
              crear('th', { scope: 'row', texto: row.label }),
              ...selected.map((exercise) => crear('td', { texto: row.value(exercise) })),
            ]),
          ),
        ),
      ]),
    ]),
    crear('div', { clase: 'detail-actions' }, [
      crear('a', { href: '#/ejercicios', clase: 'btn no-underline', texto: 'Seguir explorando' }),
      crear('button', {
        type: 'button',
        clase: 'btn btn--outline',
        id: 'clear-compare',
        texto: 'Vaciar comparador',
      }),
    ]),
  ])
}

const renderNotFound = () =>
  crear('section', { clase: 'page-section empty-state' }, [
    crear('span', { clase: 'section-kicker', texto: '404' }),
    crear('h1', { clase: 'section-title', texto: 'No encontramos lo que buscas' }),
    crear('a', { href: '#/', clase: 'btn no-underline', texto: 'Volver al inicio' }),
  ])

const renderLoading = (message) =>
  crear('section', { clase: 'page-section empty-state' }, [
    crear('p', { clase: 'section-title', texto: message }),
  ])

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

  root.replaceChildren(
    crear('header', { clase: 'site-header' }, [
      crear('a', { clase: 'site-brand', href: '#/', texto: 'exerciness' }),
      crear('nav', { clase: 'site-nav', 'aria-label': 'Navegación principal' }, [
        crear('a', { clase: 'nav-link', href: '#/ejercicios', texto: 'Ejercicios' }),
        crear('a', { clase: 'nav-link', href: '#/favoritos', texto: 'Favoritos' }),
        crear('a', { clase: 'nav-link', href: '#/comparar', texto: 'Comparar' }),
      ]),
      crear('button', {
        type: 'button',
        clase: 'btn btn--outline btn-small',
        id: 'theme-toggle',
        texto: 'Modo oscuro',
      }),
    ]),
    crear('main', { id: 'app', clase: 'site-main' }),
    crear('footer', { clase: 'site-footer' }, [
      crear('p', { texto: 'exerciness · catálogo de ejercicios con datos de ejemplo' }),
    ]),
  )
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
    main.replaceChildren(renderLoading('Cargando ejercicios...'))
    return
  }

  if (exerciseStore.error) {
    main.replaceChildren(renderLoading(exerciseStore.error))
    return
  }

  const activeId = document.activeElement?.id || null
  const caret = document.activeElement?.selectionStart ?? null

  const route = parseRoute()
  let vista
  if (route.view === 'detail') vista = renderExerciseDetail(route.id)
  else if (routes[route.view]) vista = routes[route.view]()
  else vista = renderNotFound()

  main.replaceChildren(vista)
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
