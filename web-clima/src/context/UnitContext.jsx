import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const UnitContext = createContext(null)

const STORAGE_KEY = 'web-clima:unit'

/**
 * Provee la unidad de temperatura ("C" o "F"), persistida en localStorage.
 */
export function UnitProvider({ children }) {
    const [unit, setUnitStore] = useLocalStorage(STORAGE_KEY, 'C')
    const setUnit = useCallback(
        (next) => setUnitStore(typeof next === 'function' ? next : () => next),
        [setUnitStore]
    )

    const value = useMemo(() => ({ unit, setUnit }), [unit, setUnit])
    return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>
}

export function useUnit() {
    const context = useContext(UnitContext)
    if (!context) throw new Error('useUnit debe usarse dentro de <UnitProvider>')
    return context
}
