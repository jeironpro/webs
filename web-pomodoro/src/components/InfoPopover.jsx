import { useState, useRef, useEffect } from 'react'

const STEPS = [
    { label: '1. Planifica', desc: 'Elige una tarea específica en la que quieras trabajar.' },
    {
        label: '2. Enfoque',
        desc: 'Trabaja sin interrupciones durante el tiempo del pomodoro (por defecto 25 min).',
    },
    { label: '3. Descanso', desc: 'Cuando el timer suene, tómate un descanso corto de 5 minutos.' },
    {
        label: '4. Repite',
        desc: 'Cada 4 pomodoros completados, tómate un descanso largo de 15-30 min.',
    },
]

// Modal centrado que explica el método Pomodoro en 4 pasos.
// Se abre al hacer clic en el icono "info" y se cierra al hacer clic fuera o en la X.
export default function InfoPopover() {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                style={{ color: '#64748b' }}
                aria-label="Cómo funciona Pomodoro"
            >
                <span className="material-symbols-rounded text-xl">info</span>
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4">
                    <div
                        ref={ref}
                        className="w-full max-w-sm p-6 rounded-2xl animate-slide-up"
                        style={{
                            backgroundColor: '#1a2332',
                            border: '1px solid rgba(148,163,184,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-[#f1f5f9] flex items-center gap-2">
                                <span className="material-symbols-rounded text-base" style={{ color: '#00d4ff' }}>timer</span>
                                ¿Cómo funciona?
                            </h3>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                                style={{ color: '#64748b' }}
                                aria-label="Cerrar"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {STEPS.map((step) => (
                                <div key={step.label} className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#00d4ff' }} />
                                    <div>
                                        <p className="text-xs font-semibold text-[#f1f5f9]">{step.label}</p>
                                        <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(148,163,184,0.08)' }}>
                            <p className="text-xs" style={{ color: '#64748b' }}>
                                Creada por Francesco Cirillo en los 80.<br />
                                «Pomodoro» significa «tomate» en italiano.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
