import { useEffect, useId, useRef, useState } from 'react'
import { useGeocoding } from '@/hooks/useGeocoding'
import styles from './search-bar.module.css'

function PlaceOption({ place, active, onSelect, optionId }) {
    return (
        <li
            id={optionId}
            role="option"
            aria-selected={active}
            className={`${styles.option} ${active ? styles.optionActive : ''}`}
            onPointerDown={(event) => {
                event.preventDefault()
                onSelect(place)
            }}
        >
            <span className={styles.optionName}>{place.name}</span>
            <span className={styles.optionMeta}>{place.country}</span>
        </li>
    )
}

function SearchBar({ onSelect }) {
    const [query, setQuery] = useState('')
    const [activeIndex, setActiveIndex] = useState(-1)
    const [open, setOpen] = useState(false)
    const inputRef = useRef(null)
    const listboxId = useId()
    const optionBaseId = useId()

    const { places, loading, error } = useGeocoding(query)
    const trimmed = query.trim()
    const showList = open && trimmed.length >= 2
    const hasOptions = showList && places.length > 0

    useEffect(() => {
        if (hasOptions && activeIndex > places.length - 1) setActiveIndex(-1)
    }, [hasOptions, activeIndex, places.length])

    function reset() {
        setQuery('')
        setActiveIndex(-1)
        setOpen(false)
    }

    function select(place) {
        onSelect(place)
        reset()
    }

    function onKeyDown(event) {
        if (!showList) {
            if (event.key === 'Enter' && trimmed.length < 2) return
            return
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                setActiveIndex((i) => (i + 1) % places.length)
                break
            case 'ArrowUp':
                event.preventDefault()
                setActiveIndex((i) => (i <= 0 ? places.length - 1 : i - 1))
                break
            case 'Enter': {
                event.preventDefault()
                const index = activeIndex >= 0 ? activeIndex : 0
                if (places[index]) select(places[index])
                break
            }
            case 'Escape':
                event.preventDefault()
                setActiveIndex(-1)
                setOpen(false)
                break
            default:
                break
        }
    }

    return (
        /* Combobox de búsqueda de lugares */
        <div className={styles.root}>
            <label className={styles.label} htmlFor={`${listboxId}-input`}>
                Buscar una ciudad o lugar
            </label>

            <div className={styles.field}>
                <input
                    id={`${listboxId}-input`}
                    ref={inputRef}
                    className={styles.input}
                    type="search"
                    role="combobox"
                    autoComplete="off"
                    spellCheck="false"
                    aria-autocomplete="list"
                    aria-expanded={hasOptions}
                    aria-controls={listboxId}
                    aria-activedescendant={
                        hasOptions && activeIndex >= 0
                            ? `${optionBaseId}-${activeIndex}`
                            : undefined
                    }
                    aria-busy={loading}
                    placeholder="p. ej. Madrid, Buenos Aires, Lisboa…"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value)
                        setOpen(true)
                        setActiveIndex(-1)
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    onKeyDown={onKeyDown}
                />

                {loading ? (
                    <span className={styles.spinner} aria-hidden="true" />
                ) : (
                    query.length >= 2 && (
                        <button
                            type="button"
                            className={styles.clear}
                            aria-label="Limpiar la búsqueda"
                            onClick={() => {
                                if (inputRef.current) inputRef.current.focus()
                                reset()
                            }}
                        >
                            ×
                        </button>
                    )
                )}
            </div>

            {showList ? (
                error ? (
                    <p className={styles.statusError} role="alert">
                        No se pudo completar la búsqueda. Inténtalo de nuevo en un momento.
                    </p>
                ) : loading && places.length === 0 ? (
                    <p className={styles.status} role="status">
                        Buscando «{trimmed}»…
                    </p>
                ) : places.length === 0 ? (
                    <p className={styles.status} role="status">
                        Sin resultados para «{trimmed}».
                    </p>
                ) : null
            ) : null}

            {hasOptions ? (
                <ul id={listboxId} role="listbox" className={styles.listbox}>
                    {places.map((place, index) => (
                        <PlaceOption
                            key={place.id}
                            place={place}
                            active={index === activeIndex}
                            onSelect={select}
                            optionId={`${optionBaseId}-${index}`}
                        />
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

export default SearchBar
