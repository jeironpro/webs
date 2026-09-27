const MARQUEE_ITEMS = [
    'Dashboard operativo',
    'Nébula',
    'Datos de demostración',
    'KPIs · tendencias · reportes',
    '2026',
]

/**
 * Pie de página: banda marquee (arquetipo Ft8, default del género playful)
 * y una línea de créditos (Ft2). El marquee se pausa en hover y se
 * desactiva con prefers-reduced-motion.
 */
export function Footer() {
    return (
        <footer className="mt-auto border-t border-border/70">
            <div className="overflow-hidden border-b border-border/50 py-3" aria-hidden="true">
                <div className="marquee-track">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex gap-8 pr-8">
                            {MARQUEE_ITEMS.map((item) => (
                                <span
                                    key={`${copy}-${item}`}
                                    className="mono-label whitespace-nowrap"
                                >
                                    {item}
                                    <span className="ml-8 inline-block size-1.5 rounded-full bg-coral" />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-1 px-4 py-4 sm:flex-row sm:px-6">
                <p className="text-xs text-muted-foreground">
                    © 2026 Nébula · Dashboard operativo analítico
                </p>
                <p className="text-xs text-muted-foreground">
                    Hecho con React, Vite y shadcn/ui · datos de demostración
                </p>
            </div>
        </footer>
    )
}
