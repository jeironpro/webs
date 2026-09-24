export default function Controls({ isRunning, isPaused, hasStarted, onStart, onPause, onReset }) {
    return (
        <div className="flex items-center justify-center gap-5">
            {/* Botón principal: ▶ iniciar / ⏸ pausar. Cambia de color y glow según estado. */}
            <button
                onClick={isRunning ? onPause : onStart}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                    backgroundColor: isRunning ? '#1e293b' : '#00d4ff',
                    boxShadow: isRunning
                        ? '0 0 0 2px rgba(148,163,184,0.2)'
                        : '0 0 20px rgba(0,212,255,0.3)',
                }}
                aria-label={isRunning ? 'Pausar' : isPaused ? 'Reanudar' : 'Iniciar'}
            >
                {isRunning ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#f1f5f9">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0c1222">
                        <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                )}
            </button>

            {/* Botón ⏹ detener: solo visible después de iniciar el timer */}
            {hasStarted && (
                <button
                    onClick={onReset}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(148,163,184,0.15)',
                    }}
                    aria-label="Detener"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                </button>
            )}
        </div>
    )
}
