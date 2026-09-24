import { useState, useRef, useEffect } from 'react'

const PRESETS = [5, 15, 25, 30, 60]

export default function DurationSelector({ minutes, onMinutesChange, mode }) {
    const [showPopup, setShowPopup] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowPopup(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const accentColor = mode === 'focus' ? '#00d4ff' : '#f59e0b'

    function adjust(delta) {
        const newVal = Math.max(1, Math.min(99, minutes + delta))
        onMinutesChange(newVal)
    }

    return (
        <div className="relative flex items-center gap-4" ref={containerRef}>
            <button
                onClick={() => adjust(-1)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                style={{ color: '#94a3b8' }}
                aria-label="Disminuir minutos"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14" />
                </svg>
            </button>

            <div className="relative flex flex-col items-center">
                <input
                    type="number"
                    min={1}
                    max={99}
                    value={minutes}
                    onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') { onMinutesChange(1); return }
                        const val = Number(raw)
                        if (!isNaN(val)) {
                            const newVal = Math.max(1, Math.min(99, val))
                            onMinutesChange(newVal)
                        }
                    }}
                    onFocus={() => setShowPopup(true)}
                    className="text-5xl font-bold font-mono bg-transparent border-none text-center outline-none"
                    style={{ color: '#f1f5f9', textShadow: `0 0 20px ${accentColor}33` }}
                />
                <span className="block text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#64748b' }}>
                    minutos
                </span>
            </div>

            <button
                onClick={() => adjust(1)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                style={{ color: '#94a3b8' }}
                aria-label="Aumentar minutos"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </button>

            {showPopup && (
                <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-2 rounded-2xl z-20 animate-fade-in flex gap-1.5"
                    style={{
                        backgroundColor: '#1a2332',
                        border: '1px solid rgba(148,163,184,0.15)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                >
                    {PRESETS.map((p) => (
                        <button
                            key={p}
                            onClick={() => { onMinutesChange(p); setShowPopup(false) }}
                            className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                                backgroundColor: minutes === p ? accentColor : 'transparent',
                                color: minutes === p ? '#0c1222' : '#94a3b8',
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
