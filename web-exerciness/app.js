// Vanilla JS app for exerciness migration
// Replaces React + Vite + Tailwind

// ===== Theme Store (vanilla Zustand replacement) =====
const THEMES = { LIGHT: 'light', DARK: 'dark' }

const getSystemTheme = () => {
    if (typeof window === 'undefined') return THEMES.LIGHT
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

const applyThemeClass = (theme) => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === THEMES.DARK)
}

const loadTheme = () => {
    const stored = localStorage.getItem('exerciness-theme')
    const theme = stored
        ? JSON.parse(stored).state.theme === THEMES.DARK
            ? THEMES.DARK
            : THEMES.LIGHT
        : getSystemTheme()
    applyThemeClass(theme)
    return theme
}

const saveTheme = (theme) => {
    applyThemeClass(theme)
    localStorage.setItem('exerciness-theme', JSON.stringify({ state: { theme } }))
}

// Initialize theme
const currentTheme = loadTheme()

// ===== Store factories =====
const createExerciseStore = () => {
    let exercises = []
    let loading = false
    let error = null

    const load = async () => {
        if (exercises.length > 0 || loading) return
        loading = true
        try {
            // Fetch exercises from local JSON
            const response = await fetch('data/exercises.json')
            exercises = await response.json()
            loading = false
        } catch (err) {
            error = err.message
            loading = false
        }
    }

    return { exercises, loading, error, load }
}

const createFilterStore = () => {
    const DEFAULT_FILTERS = {
        search: '',
        bodyPart: 'all',
        equipment: 'all',
        target: 'all',
        muscleGroup: 'all',
        sortBy: 'name',
    }

    let state = { ...DEFAULT_FILTERS }

    const setSearch = (search) => { state = { ...state, search }; render() }
    const setBodyPart = (bodyPart) => { state = { ...state, bodyPart }; render() }
    const setEquipment = (equipment) => { state = { ...state, equipment }; render() }
    const setTarget = (target) => { state = { ...state, target }; render() }
    const setMuscleGroup = (muscleGroup) => { state = { ...state, muscleGroup }; render() }
    const setSortBy = (sortBy) => { state = { ...state, sortBy }; render() }
    const reset = () => { state = { ...DEFAULT_FILTERS }; render() }

    const getFilters = () => ({ ...state })

    return {
        state: getFilters,
        setSearch, setBodyPart, setEquipment, setTarget,
        setMuscleGroup, setSortBy, reset,
    }
}

const createFavoritesStore = () => {
    const loadFromLocalStorage = () => {
        const stored = localStorage.getItem('exerciness-favorites')
        return stored ? JSON.parse(stored).ids : []
    }

    let ids = loadFromLocalStorage()

    const toggleFavorite = (id) => {
        if (ids.includes(id)) {
            ids = ids.filter((x) => x !== id)
        } else {
            ids = [...ids, id]
        }
        saveFavorites()
        render()
    }

    const clear = () => {
        ids = []
        localStorage.removeItem('exerciness-favorites')
        render()
    }

    const saveFavorites = () => {
        localStorage.setItem('exerciness-favorites', JSON.stringify({ ids }))
    }

    const getIds = () => [...ids]

    return {
        ids,
        toggleFavorite,
        clear,
        getIds,
        saveFavorites,
    }
}

// ===== Render functions =====
const renderExercisesGrid = (exercises, filters) => {
    const { search, bodyPart, equipment, target, muscleGroup, sortBy } = filters

    // Filter exercises
    let filtered = exercises.filter((ex) => {
        const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase())
        const matchBodyPart = bodyPart === 'all' || ex.body_part === bodyPart
        const matchEquipment = equipment === 'all' || ex.equipment === equipment
        const matchTarget = target === 'all' || ex.target === target
        const matchMuscleGroup =
            muscleGroup === 'all' ||
            (ex.muscle_group && ex.muscle_group.some((g) => g.toLowerCase().includes(muscleGroup.toLowerCase())))

        return matchSearch && matchBodyPart && matchEquipment && matchTarget && matchMuscleGroup
    })

    // Sort
    if (sortBy === 'name') {
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'body_part') {
        filtered = filtered.sort((a, b) => {
            const aPart = a.body_part || ''
            const bPart = b.body_part || ''
            return aPart.localeCompare(bPart)
        })
    }

    return filtered.map((ex, i) => `
        <article class="exercise-card" data-id="${ex.id}">
            <img src="${ex.image}" alt="${ex.name}" loading="lazy" class="exercise-card-image" />
            <div class="exercise-card-info">
                <h3 class="exercise-card-name">${ex.name}</h3>
                <div class="exercise-card-badges">
                    ${ex.body_part ? `<span class="badge">${bodyPartLabel(ex.body_part)}</span>` : ''}
                    ${ex.equipment ? `<span class="badge">${equipmentLabel(ex.equipment)}</span>` : ''}
                </div>
            </div>
        </article>
    `).join('')
}

// ===== Helper functions for labels =====
const bodyPartLabels = {
    'estómago': 'Abdominales',
    'pecho': 'Pecho',
    'hombros': 'Hombros',
    'bíceps': 'Bíceps',
    'tríceps': 'Tríceps',
    'espalda': 'Espalda',
    'gemelos': 'Gemelos',
    'gemelo': 'Gemelos',
    'cuello': 'Cuello',
    'cuello': 'Cuello',
    'cuadriceps': 'Cuádriceps',
    'isquiotibiales': 'Isquiotibiales',
    'femoral': 'Femoral',
    'gemelo': 'Gemelos',
    'pernaparto': 'Período parto',
    'plantar': 'Plantar',
    'tobillo': 'Tobillo',
    'tobillos': 'Tobillos',
    'tobillo y pie': 'Tobillo y pie',
    'tobillo, pie y tobillo': 'Tobillo, pie y tobillo',
    'tobillo, pie y gemelo': 'Tobillo, pie y gemelo',
    'tobillo, pie y gemelos': 'Tobillo, pie y gemelos',
    'tobillo, pie y gemelo': 'Tobillo, pie y gemelo',
    'tobillo, pie y gemelos': 'Tobillo, pie y gemelos',
    'tobillo y pie': 'Tobillo y pie',
    'tobillo, pie y tobillo': 'Tobillo, pie y tobillo',
    'tobillo, pie y gemelo': 'Tobillo, pie y gemelo',
    'tobillo, pie y gemelos': 'Tobillo, pie y gemelos',
}

const equipmentLabels = {
    'body weight': 'Peso corporal',
    'dumbbell': 'Mancuernas',
    'kettlebell': 'Kettlebell',
    'barbell': 'Barra',
    'ez barbell': 'Barra Z',
    'olympic barbell': 'Barra Olímpica',
    'trap bar': 'Barra Trampa',
    'cable': 'Poleas',
    'resistance band': 'Banda de resistencia',
    'loop band': 'Banda elástica',
    'therapy band': 'Banda de terapia',
    'band': 'Banda',
    'bosu ball': 'Bosu',
    'stability ball': 'Balón de estabilidad',
    'medicine ball': 'Balón medicinal',
    'slider': 'Slider',
    'foam roller': 'Rodillo de espuma',
    'ab wheel': 'Rueda abdominal',
    'grip trainer': 'Entrenador de agarre',
    'chair': 'Silla',
    'bench': 'Banca',
    'incline bench': 'Banca inclinada',
    'decline bench': 'Banca declinada',
    'pull-up bar': 'Barra para dominadas',
    'monkey bars': 'Barras chinas',
    'rings': 'Anillas',
    'rope': 'Cuerda',
    'sled': 'Trineo',
    'tire': 'Neumático',
    'assisted pull-up': 'Máquina asistida para dominadas',
    'assisted dip': 'Máquina asistida para fondos',
    'leg press': 'Prensa de piernas',
    'hack squat': 'Sentadilla hack',
    'extension': 'Extensor',
    'curl': 'Curl',
    'extension machine': 'Máquina de extensión',
    'leg extension': 'Extensión de piernas',
    'leg curl': 'Curl de piernas',
    'leg press horizontal': 'Prensa horizontal',
    'leg adduction': 'Aducción de piernas',
    'leg abduction': 'Abducción de piernas',
    'hip thrust': 'Thrust',
    'glute bridge': 'Puente de glúteos',
    'abductor': 'Aductor',
    'adductor': 'Aductor',
    'cross-over': 'Cruce',
    'pullover': 'Pullover',
    'dip': 'Fondo',
    'push-up': 'Flexión',
    'pull-over': 'Pullover',
}

const bodyPartLabel = (bp) => bodyPartLabels[bp] || bp || '—'
const equipmentLabel = (eq) => equipmentLabels[eq] || eq || '—'

// ===== Route handler (vanilla replacement for React Router) =====
const routes = {
    '/': renderHome,
    '/ejercicios': renderExercisesList,
    '/ejercicio/:id': renderExerciseDetail,
    '/favoritos': renderFavorites,
    '/comparar': renderComparator,
    '*': renderNotFound,
}

const resolveRoute = (pathname) => {
    // Match /ejercicio/:id
    const match = pathname.match(/^\/ejercicio\/([^/]+)$/)
    if (match) {
        routes['/ejercicio/:id'](match[1])
        return
    }
    // Exact match
    if (routes[pathname]) {
        routes[pathname]()
    } else {
        routes['*']()
    }
}

// ===== Page renderers =====
const renderHome = () => {
    const { exercises, loading } = exerciseStore.state
    if (loading || exercises.length === 0) {
        document.getElementById('root').innerHTML = `
            <section class="min-h-screen flex items-center justify-center p-4 text-center">
                <p class="text-2xl text-ink-2">Cargando ejercicios...</p>
            </section>
        `
        return
    }

    const featured = exercises.slice(0, 6)
    const filters = filterStore.state

    const grid = renderExercisesGrid(featured, filters)

    document.getElementById('root').innerHTML = `
        <section class="min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-4 text-center">
            <h1 class="font-display text-[clamp(2.5rem,6vw+1rem,5.5rem)] font-semibold leading-none text-ink">
                Tu catálogo de
                <br /><span class="relative">ejercicios</span>
            </h1>
            <p class="mt-6 max-w-lg font-body text-lg text-ink-2">
                Más de 1.300 movimientos. Busca, filtra, guarda y compara. El gimnasio empieza aquí.
            </p>
            <div class="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
                <a href="/ejercicios" class="btn no-underline">Explorar ahora</a>
                <a href="/favoritos" class="btn btn--outline no-underline">Tus favoritos</a>
            </div>
        </section>
        <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div class="mb-8 flex items-baseline gap-3">
                <span class="font-mono text-xs font-medium uppercase tracking-widest text-ink-2">01 · DESTACADOS</span>
                <h2 class="font-display text-2xl font-semibold text-ink">Seis para empezar</h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                ${grid}
            </div>
        </section>
    `
}

const renderExercisesList = () => {
    const { exercises, loading } = exerciseStore.state
    if (loading || exercises.length === 0) {
        document.getElementById('root').innerHTML = `
            <section class="min-h-screen flex items-center justify-center p-4 text-center">
                <p class="text-2xl text-ink-2">Cargando ejercicios...</p>
            </section>
        `
        return
    }

    const filters = filterStore.state
    const search = filters.search
    const bodyPart = filters.bodyPart
    const equipment = filters.equipment
    const target = filters.target
    const muscleGroup = filters.muscleGroup
    const sortBy = filters.sortBy

    // Filter
    let filtered = exercises.filter((ex) => {
        const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase())
        const matchBodyPart = bodyPart === 'all' || ex.body_part === bodyPart
        const matchEquipment = equipment === 'all' || ex.equipment === equipment
        const matchTarget = target === 'all' || ex.target === target
        const matchMuscleGroup =
            muscleGroup === 'all' ||
            (ex.muscle_group && ex.muscle_group.some((g) => g.toLowerCase().includes(muscleGroup.toLowerCase())))

        return matchSearch && matchBodyPart && matchEquipment && matchTarget && matchMuscleGroup
    })

    // Sort
    if (sortBy === 'name') {
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    const grid = renderExercisesGrid(filtered, filters)

    document.getElementById('root').innerHTML = `
        <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header class="mb-8">
                <span class="font-mono text-xs font-medium uppercase tracking-widest text-ink-2">CATÁLOGO</span>
                <h1 class="font-display text-3xl font-semibold text-ink">Ejercicios</h1>
                <p class="mt-1 font-body text-sm text-ink-2">${exercises.length} ejercicios en total.</p>
            </header>
            <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    ${grid}
                </div>
            </div>
        </section>
    `
}

const renderExerciseDetail = (id) => {
    const { exercises, loading } = exerciseStore.state
    if (loading || exercises.length === 0) {
        document.getElementById('root').innerHTML = `
            <section class="flex flex-col items-center gap-4 py-24" aria-live="polite">
                <p class="text-2xl text-accent">Cargando...</p>
            </section>
        `
        return
    }

    const exercise = exercises.find((ex) => ex.id === id)
    if (!exercise) {
        document.getElementById('root').innerHTML = `
            <section class="text-center py-24">
                <p class="text-2xl text-ink-2">Ejercicio no encontrado</p>
                <a href="/ejercicios" class="btn no-underline">Volver al catálogo</a>
            </section>
        `
        return
    }

    const instructionsES = exercise.instruction_steps?.es || exercise.instructions?.es || ''
    const muscleGroups = exercise.muscle_group || []
    const secondaryMuscles = exercise.secondary_muscles || []

    // Build muscles string
    const primaryMuscles = muscleGroups.map((g) => `<span class="badge">${g}</span>`).join(' ')
    const secondaryHtml = secondaryMuscles.length
        ? `<span class="font-body text-sm text-ink-2">Secundarios: ${secondaryMuscles.map((g) => `<span class="badge-secondary">${g}</span>`).join(' ')}</span>`
        : ''

    // Build target label
    const targetLabel = exercise.target ? `Objetivo: ${exercise.target}` : ''

    // Build equipment label
    const equipmentLabelHTML = exercise.equipment ? `<span class="badge-secondary">${equipmentLabel(exercise.equipment)}</span>` : ''

    // Build body part label
    const bodyPartHTML = exercise.body_part ? `<span class="badge-primary">${bodyPartLabel(exercise.body_part)}</span>` : ''

    // GIF/image handling
    const hasGif = exercise.gif_url && exercise.gif_url !== ''
    const videoSrc = hasGif ? exercise.gif_url : exercise.image

    document.getElementById('root').innerHTML = `
        <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <header class="mt-6 flex flex-wrap gap-2">
                ${exercise.body_part ? `<span class="badge-primary">${bodyPartLabel(exercise.body_part)}</span>` : ''}
                ${exercise.equipment ? `<span class="badge-secondary">${equipmentLabel(exercise.equipment)}</span>` : ''}
            </header>
            <div class="mt-6">
                <figure class="flex flex-col items-center gap-4">
                    <div class="w-full max-w-[280px] overflow-hidden rounded-card border border-rule bg-paper-2 shadow-soft">
                        <img
                            src="${videoSrc}"
                            alt="Animación de " + exercise.name
                            class="aspect-square w-full object-contain"
                        />
                    </div>
                    <button
                        type="button"
                        class="btn btn--soft inline-flex items-center gap-2"
                        onclick="toggleVideoPlay()"
                    >
                        <span id="playIcon" class="material-symbols-rounded select-none text-base" aria-hidden="true">play_arrow</span>
                        ${hasGif ? 'Pausar' : 'Reproducir'}
                    </button>
                    ${exercise.attribution && `
                        <figcaption class="font-body text-xs text-ink-2">${exercise.attribution}</figcaption>
                    `}
                </figure>
            </div>
            <div class="mt-8 space-y-10">
                <section>
                    <h2 class="font-body text-lg font-semibold text-ink">Instrucciones</h2>
                    ${instructionsES ? `<p class="font-body leading-relaxed text-ink-2" style="max-width: 65ch">${instructionsES}</p>` : '<p class="font-body text-sm text-ink-2">No hay instrucciones disponibles.</p>'}
                </section>
                <section>
                    <h2 class="font-body text-base font-semibold text-ink">Músculos implicados</h2>
                    <div class="mt-3 space-y-3 font-body text-sm">
                        ${primaryMuscles ? `<div class="flex flex-wrap items-center gap-2">${primaryMuscles}</div>` : ''}
                        ${secondaryHtml}
                    </div>
                </section>
                <section>
                    <h2 class="font-body text-base font-semibold text-ink">${targetLabel}</h2>
                    ${equipmentLabelHTML}
                </section>
            </section>
        </section>
    `
}

const renderFavorites = () => {
    const { ids: favoriteIds } = favoritesStore.state
    const { exercises, loading } = exerciseStore.state

    if (loading || exercises.length === 0) {
        document.getElementById('root').innerHTML = `
            <section class="flex flex-col items-center gap-4 py-24" aria-live="polite">
                <p class="text-2xl text-accent">Cargando tus favoritos...</p>
            </section>
        `
        return
    }

    // Resolve favorites
    const favorites = exercises.filter((ex) => favoriteIds.includes(ex.id))

    document.getElementById('root').innerHTML = `
        <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header class="mb-8">
                <span class="font-mono text-xs font-medium uppercase tracking-widest text-ink-2">GUARDADOS</span>
                <h1 class="font-display text-3xl font-semibold text-ink">Mis favoritos</h1>
                <p class="mt-1 font-body text-sm text-ink-2">
                    ${favorites.length} ${favorites.length === 1 ? 'ejercicio guardado' : 'ejercicios guardados'}.
                </p>
            </header>
            ${favorites.length === 0 ? `
                <div class="text-center py-20">
                    <span class="material-symbols-rounded text-4xl text-ink-2" aria-hidden="true">favorite_border</span>
                    <h2 class="font-display text-lg font-semibold text-ink mt-4">Aún no tienes favoritos</h2>
                    <p class="font-body text-sm text-ink-2 mt-2">Marca ejercicios como favoritos para tenerlos siempre a mano.</p>
                    <a href="/ejercicios" class="btn no-underline mt-4">Explorar ejercicios</a>
                </div>
            ` : `
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    ${favorites.map((ex) => `
                        <article class="exercise-card" data-id="${ex.id}">
                            <img src="${ex.image}" alt="${ex.name}" loading="lazy" class="exercise-card-image" />
                            <div class="exercise-card-info">
                                <h3 class="exercise-card-name">${ex.name}</h3>
                                <div class="exercise-card-badges">
                                    ${ex.body_part ? `<span class="badge">${bodyPartLabel(ex.body_part)}</span>` : ''}
                                    ${ex.equipment ? `<span class="badge">${equipmentLabel(ex.equipment)}</span>` : ''}
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>

        </section>
    `
}

const renderComparator = () => {
    const { ids: compareIds } = compareStore.state
    if (loading || exercises.length === 0) {
        const el = document.createElement('section');
        el.className = 'flex flex-col items-center gap-4 py-24';
        el.setAttribute('aria-live', 'polite');
        const p = document.createElement('p');
        p.className = 'text-2xl text-accent';
        p.textContent = 'Cargando...';
        el.appendChild(p);
        document.getElementById('root').innerHTML = '';
        document.getElementById('root').appendChild(el);
        return
    }
        return

    if (selected.length < 2) {
        document.getElementById('root').innerHTML = ' STRING_START<section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div class="text-center py-20"><span class="material-symbols-rounded text-4xl text-accent" aria-hidden="true">compare_arrows</span><h2 class="font-display text-lg font-semibold text-ink mt-4">Selecciona al menos dos ejercicios</h2><p class="font-body text-sm text-ink-2 mt-2">Añade ejercicios con el botón de comparación en el catálogo.</p><a href="/ejercicios" class="btn no-underline mt-4">Ir al catálogo</a></div></section> STRING_END';
    }
    const attributes = {
        bodyPart: selected.map((ex) => ({ label: 'Grupo corporal', value: ex.body_part })),
        equipment: selected.map((ex) => ({ label: 'Equipo', value: ex.equipment })),
        target: selected.map((ex) => ({ label: 'Objetivo', value: ex.target })),
        muscleGroup: selected.map((ex) => ({ label: 'Músculo principal', value: ex.muscle_group ? ex.muscle_group.join(', ') : '' })),
    }

    const rows = []

    // Header
    const headerRow = ' STRING_START<tr><th class="sticky left-0 z-20 bg-paper p-4 text-left font-mono text-xs font-medium uppercase tracking-widest text-ink-2">Atributo</th>' + selected.map((_, i) => '<th class="p-4 text-left align-top font-body text-ink">' + selected[i].name + '</th>').join('') + '</tr> STRING_END';
    rows.push(headerRow)
    // Header

    // Header
    const headerRow2 = ' STRING_START<tr><th class="sticky left-0 z-20 bg-paper p-4 text-left font-mono text-xs font-medium uppercase tracking-widest text-ink-2">Atributo</th>' + selected.map((_, i) => '<th class="p-4 text-left align-top font-body text-ink">' + selected[i].name + '</th>').join('') + '</tr> STRING_END';
    rows.push(headerRow2)

    const headerRow = ' STRING_START<tr><th class="sticky left-0 z-20 bg-paper p-4 text-left font-mono text-xs font-medium uppercase tracking-widest text-ink-2">Atributo</th>' + selected.map((_, i) => '<th class="p-4 text-left align-top font-body text-ink">' + selected[i].name + '</th>').join('') + '</tr> STRING_END';
    rows.push(headerRow)
    const headerRow = `<tr>
        <th class="sticky left-0 z-20 bg-paper p-4 text-left font-mono text-xs font-medium uppercase tracking-widest text-ink-2">Atributo</th>
        ${selected.map((_, i) => `<th class="p-4 text-left align-top font-body text-ink"">${selected[i].name}</th>`).join('')}
    </tr>`
    rows.push(headerRow)

    // Data rows
    for (const [attrKey, attrData] of Object.entries(attributes)) {
        const rowCells = attrData.map((item, i) => {
            const val = item.value ? `<img src="${selected[i].image}" alt="" class="aspect-square w-10 object-cover" /> ${item.value}` : ''
            return `<td class="p-4 align-top font-body text-ink">${val}</td>`
        })
        rows.push(`<tr class="border-b border-rule last:border-b-0">${rowCells.join('')}</tr>`)
    }

    document.getElementById('root').innerHTML = `
        <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header class="mb-8">
                <span class="font-mono text-xs font-medium uppercase tracking-widest text-ink-2">COMPARADOR</span>
                <h1 class="font-display text-3xl font-semibold text-ink">Comparar ejercicios</h1>
                <p class="mt-1 font-body text-sm text-ink-2">Hasta 4 ejercicios lado a lado.</p>
            </header>
            <div class="overflow-x-auto rounded-card border border-rule bg-paper shadow-soft">
                <table class="w-full border-collapse font-body text-sm">
                    ${rows.join('')}
                    <tbody>
                        ${selected.map((ex) => `
                            <tr>
                                <th scope="row" class="sticky left-0 z-10 w-36 bg-paper p-4 text-left font-mono text-xs font-medium uppercase tracking-widest text-ink-2">${ex.body_part || '—'}</th>
                                ${selected.map((s, i) => `<td class="p-4 align-top font-body text-ink">${s.name}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="mt-6 text-center">
                <a href="/ejercicios" class="btn no-underline">Volver al catálogo</a>
            </div>
        </section>
    `
}

const renderNotFound = () => {
    document.getElementById('root').innerHTML = `
        <section class="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-24 text-center">
            <span class="font-mono text-6xl font-bold text-accent-3">404</span>
            <p class="font-body text-lg text-ink-2">No encontramos lo que buscas.</p>
            <a href="/" class="btn no-underline">Volver al inicio</a>
        </section>
    `
}

// ===== Video toggle =====
let currentVideoState = false
const toggleVideoPlay = () => {
    const exercise = document.querySelector('.exercise-detail-article')
    if (!exercise) return

    const img = exercise.querySelector('img')
    if (!img) return

    currentVideoState = !currentVideoState
    img.src = currentVideoState ? exercise.gif_url : exercise.image
    const playIcon = exercise.querySelector('.material-symbols-rounded')
    if (playIcon) {
        playIcon.textContent = currentVideoState ? 'pause' : 'play_arrow'
    }
    const btnText = exercise.querySelector('button span')
    if (btnText) {
        btnText.textContent = currentVideoState ? 'Pausar' : 'Reproducir'
    }
}

// ===== Initial render =====
const exerciseStore = createExerciseStore()
const filterStore = createFilterStore()
const favoritesStore = createFavoritesStore()
const compareStore = createComparatorStore()

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme()
    exerciseStore.load().then(() => {
        // Read route from URL
        const pathname = window.location.pathname || '/'
        resolveRoute(pathname)

        // Set up navigation
        initNavigation()
    })
})

const initNavigation = () => {
    // Simple nav button handlers
    const navButtons = document.querySelectorAll('nav a, .nav-link')
    navButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            const href = btn.getAttribute('href')
            resolveRoute(href)
            // Update URL without full page reload
            window.history.pushState({}, '', href)
        })
    })
}

// Export helpers for inline use
window.bodyPartLabel = bodyPartLabel
window.equipmentLabel = equipmentLabel
window.toggleVideoPlay = toggleVideoPlay
window.resolveRoute = resolveRoute

