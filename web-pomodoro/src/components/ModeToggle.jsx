// Toggle de dos estados: Focus (cyan) / Break (ámbar). Se deshabilita
// cuando el timer está corriendo o en pausa para evitar cambios en medio de un ciclo.
export default function ModeToggle({ mode, onModeChange, disabled }) {
    return (
        <div
            className="flex rounded-full p-0.5"
            style={{
                backgroundColor: '#1a2332',
                border: '1px solid rgba(148,163,184,0.12)',
            }}
        >
            <button
                onClick={() => onModeChange('focus')}
                disabled={disabled}
                className="px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-300"
                style={{
                    backgroundColor: mode === 'focus' ? '#00d4ff' : 'transparent',
                    color: mode === 'focus' ? '#0c1222' : '#64748b',
                    boxShadow: mode === 'focus' ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
                }}
            >
                Focus
            </button>
            <button
                onClick={() => onModeChange('break')}
                disabled={disabled}
                className="px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-300"
                style={{
                    backgroundColor: mode === 'break' ? '#f59e0b' : 'transparent',
                    color: mode === 'break' ? '#0c1222' : '#64748b',
                    boxShadow: mode === 'break' ? '0 0 12px rgba(245,158,11,0.3)' : 'none',
                }}
            >
                Break
            </button>
        </div>
    )
}
