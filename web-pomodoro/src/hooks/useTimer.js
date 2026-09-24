import { useReducer, useEffect, useRef, useCallback } from 'react'

// Estado inicial del timer. Se usa función init para que useReducer
// evalúe el valor inicial correctamente si la duración cambia después.
function init(duration) {
    return {
        remaining: duration,
        duration,
        isRunning: false,
        isPaused: false,
        isFinished: false,
    }
}

// Reducer puro: todas las transiciones de estado del timer son manejadas aquí,
// evitando efectos secundarios (la causa del loop infinito con useState + React 19).
function reducer(state, action) {
    switch (action.type) {
        case 'TICK':
            // Si el tiempo restante es <= 1, marca como terminado en vez de llegar a -1
            if (state.remaining <= 1) {
                return {
                    ...state,
                    remaining: 0,
                    isRunning: false,
                    isPaused: false,
                    isFinished: true,
                }
            }
            return { ...state, remaining: state.remaining - 1 }

        case 'START':
            // Si ya había terminado, reinicia desde la duración actual antes de correr
            if (state.isFinished) {
                return {
                    ...state,
                    remaining: state.duration,
                    isFinished: false,
                    isRunning: true,
                    isPaused: false,
                }
            }
            return { ...state, isRunning: true, isPaused: false }

        case 'PAUSE':
            return { ...state, isRunning: false, isPaused: true }

        case 'RESET':
            return {
                ...state,
                remaining: state.duration,
                isRunning: false,
                isPaused: false,
                isFinished: false,
            }

        case 'SET_DURATION':
            return {
                remaining: action.seconds,
                duration: action.seconds,
                isRunning: false,
                isPaused: false,
                isFinished: false,
            }

        default:
            return state
    }
}

export function useTimer(initialDuration = 1500) {
    const [state, dispatch] = useReducer(reducer, initialDuration, init)
    const onFinishRef = useRef(null)

    // Registra un callback que se ejecutará cuando el timer llegue a 0
    const onFinish = useCallback((cb) => {
        onFinishRef.current = cb
    }, [])

    const start = useCallback(() => dispatch({ type: 'START' }), [])
    const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [])
    const reset = useCallback(() => dispatch({ type: 'RESET' }), [])
    const setDuration = useCallback((seconds) => {
        dispatch({ type: 'SET_DURATION', seconds })
    }, [])

    // setInterval cada 1 segundo, solo corre si isRunning y no está en pausa
    useEffect(() => {
        if (!state.isRunning || state.isPaused) return
        const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
        return () => clearInterval(id)
    }, [state.isRunning, state.isPaused])

    // Cuando el timer termina, llama al callback registrado en el siguiente ciclo
    useEffect(() => {
        if (state.isFinished) {
            setTimeout(() => onFinishRef.current?.(), 0)
        }
    }, [state.isFinished])

    return {
        remaining: state.remaining,
        duration: state.duration,
        isRunning: state.isRunning,
        isPaused: state.isPaused,
        isFinished: state.isFinished,
        start,
        pause,
        reset,
        setDuration,
        onFinish,
    }
}
