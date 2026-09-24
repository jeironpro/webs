import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const GeolocationContext = createContext(null)

const GEOLOCATION_ERRORS = {
    1: 'Permiso denegado para acceder a tu ubicación.',
    2: 'No se pudo obtener tu posición.',
    3: 'La solicitud de ubicación tardó demasiado.',
}

/**
 * Proporciona la geolocalización del dispositivo a toda la app, de modo que
 * el botón del navbar y la página compartan el mismo estado.
 */
export function GeolocationProvider({ children }) {
    const [coords, setCoords] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(() => {
        if (!navigator.geolocation) {
            setError(new Error('Tu navegador no soporta geolocalización.'))
            return
        }

        setLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                })
                setLoading(false)
            },
            (positionError) => {
                const message =
                    GEOLOCATION_ERRORS[positionError.code] ?? 'No se pudo obtener tu ubicación.'
                setError(new Error(message))
                setLoading(false)
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        )
    }, [])

    const value = useMemo(
        () => ({ coords, loading, error, request }),
        [coords, loading, error, request]
    )

    return <GeolocationContext.Provider value={value}>{children}</GeolocationContext.Provider>
}

export function useGeolocation() {
    const context = useContext(GeolocationContext)
    if (!context) throw new Error('useGeolocation debe usarse dentro de <GeolocationProvider>')
    return context
}
