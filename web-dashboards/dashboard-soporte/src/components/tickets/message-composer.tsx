/**
 * Compositor de mensajes.
 * Formulario para enviar mensajes con validación y animaciones.
 * Actualmente deshabilitado (simulación de functionality).
 */
import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { animate, createScope } from 'animejs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MessageComposerProps {
    onEnviar?: (mensaje: string) => void
    deshabilitado?: boolean
}

export function MessageComposer({ onEnviar, deshabilitado }: MessageComposerProps) {
    const [mensaje, setMensaje] = useState('')
    const rootRef = useRef<HTMLFormElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef })
        return () => scopeRef.current?.revert()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!mensaje.trim() || deshabilitado) return

        onEnviar?.(mensaje)
        setMensaje('')

        if (rootRef.current) {
            animate(rootRef.current, {
                scale: [1, 0.98, 1],
                duration: 200,
                ease: 'out(2)',
            })
        }
    }

    return (
        <form
            ref={rootRef}
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-xl border border-border bg-card p-3"
        >
            <Input
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder={deshabilitado ? 'No hay conexión...' : 'Escribe un mensaje...'}
                disabled={deshabilitado}
                className="flex-1"
            />
            <Button
                type="submit"
                variant="default"
                size="icon"
                disabled={!mensaje.trim() || deshabilitado}
                aria-label="Enviar mensaje"
            >
                <Send className="size-4" />
            </Button>
        </form>
    )
}
