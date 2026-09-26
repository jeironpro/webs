// Barra de filtros con búsqueda textual, selects (aldea, equipo, rango, orden) y botones de acción.
import type { FilterState, SortOption } from '../../utils/types';
import './FilterBar.css';

// Props: estado actual de filtros, callback genérico para cambiar cualquier filtro, reset y ver top 3.
interface FilterBarProps {
    filters: FilterState;
    onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    onReset: () => void;
    onTop3: () => void;
}

// Opciones estáticas para los filtros de aldea, equipo, rango y ordenación.
const ALDEAS = [
    'todas',
    'Konohagakure',
    'Sunagakure',
    'Kirigakure',
    'Otogakure',
    'Iwagakure',
    'Hoshigakure',
    'Kumogakure',
    'Ishigakure',
    'Takumi',
    'S/A',
];
const CLANES = [
    'todos',
    'Uchiha',
    'Uzumaki',
    'Hyûga',
    'Nara',
    'Yamanaka',
    'Akimichi',
    'Inuzuka',
    'Aburame',
    'Hatake',
    'Sarutobi',
    'Senju',
    'Katô',
    'Momochi',
    'Yuki',
    'Hoshigaki',
    'Kaguya',
    'Yamashiro',
    'Namiashi',
    'Kamizuru',
    'Fûma',
    'Kurama',
    'Shiin',
    'Kazekage',
    'Lee',
    'S/C',
];
const EQUIPOS = [
    'todos',
    'Akatsuki',
    'Equipo 7',
    'Equipo 8',
    'Equipo 10',
    'Equipo Dosu',
    'Equipo Guy',
    'Equipo Konohamaru',
    'Equipo Kabuto',
    'Equipo Watari',
    'Equipo Hiruzen', 
    'Equipo Minato',
    'Equipo Oboro',
    'Shinobazu', 
    'Hermanos Criminales',
    'Hermanos Diabólicos',
    'Cuatro Hombres de los Símbolos Celestiales',
    'Hermanos de la Arena', 
    'Siete Espadachines de la Niebla',
    'Consejeros del Hokage',
    'Familia Kurosuki',
    'Legendarios Hermanos Estupidos',
    'Tres Hermanos Ryûdôin',
    'Cuatro del Sonido',
    'S/E'
];
const RANGOS = [
    'todos',
    'Estudiante',
    'Genin',
    'Chûnin',
    'Tokubetsu Jônin',
    'Jônin',
    'ANBU',
    'Sannin',
    'Hokage',
    'Kazekage',
    'Mizukage',
    'Hoshikage',
    'Especialista Médico',
    'S/R'
];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'score-desc', label: 'Mejor puntuación' },
    { value: 'score-asc', label: 'Peor puntuación' },
    { value: 'nombre-asc', label: 'Nombre A-Z' },
    { value: 'nombre-desc', label: 'Nombre Z-A' },
];

export function FilterBar({ filters, onFilterChange, onReset, onTop3 }: FilterBarProps) {
    return (
        <div className="filter-bar">
            <div className="filter-search">
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Buscar personaje..."
                    aria-label="Buscar personaje"
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                />
            </div>

            <div className="filter-controls">
                <div className="filter-group">
                    <label className="filter-label">Aldea</label>
                    <select
                        className="filter-select"
                        value={filters.aldea}
                        onChange={(e) => onFilterChange('aldea', e.target.value)}
                    >
                        {ALDEAS.map((a) => (
                            <option key={a} value={a}>
                                {a === 'todas' ? 'Todas' : a}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Clan</label>
                    <select
                        className="filter-select"
                        value={filters.clan}
                        onChange={(e) => onFilterChange('clan', e.target.value)}
                    >
                        {CLANES.map((c) => (
                            <option key={c} value={c}>
                                {c === 'todos' ? 'Todos' : c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Equipo</label>
                    <select
                        className="filter-select"
                        value={filters.equipo}
                        onChange={(e) => onFilterChange('equipo', e.target.value)}
                    >
                        {EQUIPOS.map((e) => (
                            <option key={e} value={e}>
                                {e === 'todos' ? 'Todos' : e}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Rango</label>
                    <select
                        className="filter-select"
                        value={filters.rango}
                        onChange={(e) => onFilterChange('rango', e.target.value)}
                    >
                        {RANGOS.map((r) => (
                            <option key={r} value={r}>
                                {r === 'todos' ? 'Todos' : r}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Ordenar</label>
                    <select
                        className="filter-select"
                        value={filters.sort}
                        onChange={(e) => onFilterChange('sort', e.target.value as SortOption)}
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="button" className="filter-top3" onClick={onTop3}>
                    Ver top 3
                </button>
                <button type="button" className="filter-reset" onClick={onReset}>
                    Reiniciar
                </button>
            </div>
        </div>
    );
}
