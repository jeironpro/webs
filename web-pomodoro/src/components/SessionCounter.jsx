// Muestra el progreso de pomodoros: 4 puntos que se iluminan en cyan
// al completar cada ciclo. Al llegar a 4, muestra "★ Completo" en ámbar.
export default function SessionCounter({ count }) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: 4 }, (_, i) => (
                <div
                    key={i}
                    className="w-3 h-3 rounded-full transition-all duration-500"
                    style={
                        i < count
                            ? {
                                  backgroundColor: '#00d4ff',
                                  boxShadow: '0 0 8px rgba(0,212,255,0.4)',
                              }
                            : { backgroundColor: 'rgba(148,163,184,0.12)' }
                    }
                />
            ))}
            {count >= 4 && (
                <span className="ml-2 text-xs font-semibold text-[#f59e0b] tracking-wide">
                    ★ Completo
                </span>
            )}
        </div>
    )
}
