export default function CircularTimer({ remaining, duration, mode, isFinished }) {
    const radius = 120
    const circumference = 2 * Math.PI * radius
    const progress = duration > 0 ? remaining / duration : 0
    // strokeDasharray controla la longitud visible del arco. El resto queda transparente.
    const dashLength = circumference * progress

    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    const accentColor = mode === 'focus' ? '#00d4ff' : '#f59e0b'
    const ringColor = mode === 'focus' ? '#00d4ff' : '#f59e0b'

    return (
        <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300">
                <defs>
                    <filter id="ringGlow">
                        <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="6"
                            floodColor={accentColor}
                            floodOpacity="0.4"
                        />
                    </filter>
                </defs>

                {/*
          Se invierte el eje X (scale(-1,1)) para que la barra vacíe en sentido
          horario. Con rotate(-90) el arranque queda en la parte superior.
        */}
                <g transform="translate(300, 0) scale(-1, 1)">
                    <g transform="rotate(-90, 150, 150)">
                        {/* Círculo de fondo (pista) */}
                        <circle
                            cx="150"
                            cy="150"
                            r={radius}
                            fill="none"
                            stroke="rgba(148,163,184,0.08)"
                            strokeWidth="8"
                        />
                        {/* Círculo de progreso: strokeDasharray define el tramo visible */}
                        <circle
                            cx="150"
                            cy="150"
                            r={radius}
                            fill="none"
                            stroke={ringColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${dashLength} ${circumference}`}
                            strokeDashoffset="0"
                            filter={isFinished ? 'none' : 'url(#ringGlow)'}
                        />
                    </g>
                </g>
            </svg>

            {/* Tiempo superpuesto en el centro del SVG */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    className="font-mono text-6xl font-bold tracking-wider"
                    style={{
                        color: '#f1f5f9',
                        textShadow: `0 0 30px ${accentColor}33, 0 0 60px ${accentColor}11`,
                    }}
                >
                    {timeStr}
                </span>
                {isFinished && (
                    <span
                        className="mt-1 text-xs font-semibold uppercase tracking-widest animate-pulse-ring"
                        style={{ color: accentColor }}
                    >
                        Tiempo
                    </span>
                )}
            </div>
        </div>
    )
}
