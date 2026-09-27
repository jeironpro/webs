import { useEffect, useRef } from 'react'
import { animate, createScope, stagger } from 'animejs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AGENTES } from '@/lib/mock'
import { formatearIniciales } from '@/lib/format'

const USUARIO = AGENTES[0]

export function ProfilePage() {
    const rootRef = useRef<HTMLElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate('.profile-entrance', {
                opacity: [0, 1],
                translateY: [12, 0],
                duration: 400,
                delay: stagger(80, { start: 100 }),
                ease: 'out(3)',
            })
        })
        return () => scopeRef.current?.revert()
    }, [])

    return (
        <section ref={rootRef} className="flex flex-col gap-6">
            <div className="profile-entrance flex items-center gap-4" style={{ opacity: 0 }}>
                <Avatar size="lg">
                    <AvatarFallback>{formatearIniciales(USUARIO.nombre)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                        {USUARIO.nombre}
                    </h1>
                    <p className="text-sm text-muted-foreground">{USUARIO.rol}</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="profile-entrance" style={{ opacity: 0 }}>
                    <CardHeader>
                        <CardTitle className="text-base">Información personal</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{USUARIO.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Especialidad</span>
                            <span>{USUARIO.especialidad}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Disponible</span>
                            <span>{USUARIO.disponible ? 'Sí' : 'No'}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="profile-entrance" style={{ opacity: 0 }}>
                    <CardHeader>
                        <CardTitle className="text-base">Estadísticas</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tickets resueltos</span>
                            <span className="font-medium">{USUARIO.tickets_resueltos}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">CSAT promedio</span>
                            <span className="font-medium">{USUARIO.satisfaccion_promedio} / 5</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
