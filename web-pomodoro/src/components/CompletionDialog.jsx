// Diálogo modal que aparece al terminar un segmento (focus o break).
// onPrimary: acción principal (cambiar de modo, puede o no auto-iniciar)
// onSecondary: acción secundaria (continuar en el mismo modo)
export default function CompletionDialog({ mode, onPrimary, onSecondary }) {
    const isFocus = mode === 'focus'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                className="rounded-3xl p-10 mx-4 max-w-sm w-full animate-slide-up"
                style={{
                    backgroundColor: '#1a2332',
                    border: '1px solid rgba(148,163,184,0.12)',
                    boxShadow: '0 0 60px rgba(0,212,255,0.08)',
                }}
            >
                <div className="flex flex-col items-center text-center gap-6">
                    {/* Icono de estrella: cyan para focus, ámbar para break */}
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: isFocus ? '#00d4ff' : '#f59e0b',
                            boxShadow: isFocus
                                ? '0 0 20px rgba(0,212,255,0.3)'
                                : '0 0 20px rgba(245,158,11,0.3)',
                        }}
                    >
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="#0c1222">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
                            {isFocus ? '¡Pomodoro completado!' : 'Descanso terminado'}
                        </h2>
                        <p className="mt-2 text-sm" style={{ color: '#94a3b8' }}>
                            {isFocus
                                ? '¿Quieres tomar un descanso de 5 minutos?'
                                : '¿Listo para volver al trabajo?'}
                        </p>
                    </div>

                    <div className="flex gap-3 w-full">
                        {/* Botón principal: cambia al otro modo e inicia el timer */}
                        <button
                            onClick={onPrimary}
                            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                backgroundColor: isFocus ? '#f59e0b' : '#00d4ff',
                                color: '#0c1222',
                                boxShadow: isFocus
                                    ? '0 0 16px rgba(245,158,11,0.3)'
                                    : '0 0 16px rgba(0,212,255,0.3)',
                            }}
                        >
                            {isFocus ? 'Sí, descansar' : 'Sí, trabajar'}
                        </button>
                        {/* Botón secundario: cierra el diálogo sin iniciar timer */}
                        <button
                            onClick={onSecondary}
                            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                backgroundColor: 'transparent',
                                color: '#94a3b8',
                                border: '1px solid rgba(148,163,184,0.15)',
                            }}
                        >
                            {isFocus ? 'No, seguir' : 'No, descansar más'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
