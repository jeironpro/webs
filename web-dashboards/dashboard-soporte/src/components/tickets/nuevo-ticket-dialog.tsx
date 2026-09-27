/**
 * Dialog para crear nuevos tickets.
 * Formulario con campos de asunto, descripción, categoría, prioridad y canal.
 * Responsive: grid de 1 columna en móvil, 3 en desktop.
 */
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    ETIQUETAS_CATEGORIA,
    ETIQUETAS_PRIORIDAD,
    ETIQUETAS_CANAL,
} from '@/components/tickets/badges'

interface NuevoTicketDialogProps {
    colapsado?: boolean
}

export function NuevoTicketDialog({ colapsado }: NuevoTicketDialogProps) {
    const [abierto, setAbierto] = useState(false)

    return (
        <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogTrigger
                render={
                    <Button
                        variant="outline"
                        className={colapsado ? 'w-full aspect-square p-0' : 'w-full'}
                    />
                }
            >
                <Plus className="size-4" />
                {!colapsado && <span>Nuevo ticket</span>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Crear nuevo ticket</DialogTitle>
                    <DialogDescription>
                        Completa los datos para abrir un nuevo ticket de soporte.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        setAbierto(false)
                    }}
                    className="grid gap-4 py-2"
                >
                    <div className="grid gap-2">
                        <label htmlFor="asunto" className="text-sm font-medium">
                            Asunto
                        </label>
                        <Input id="asunto" placeholder="Describe brevemente el problema" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="descripcion" className="text-sm font-medium">
                            Descripción
                        </label>
                        <Textarea
                            id="descripcion"
                            placeholder="Detalla el problema o solicitud..."
                            rows={4}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Categoría</label>
                            <Select defaultValue="consulta">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ETIQUETAS_CATEGORIA).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Prioridad</label>
                            <Select defaultValue="media">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ETIQUETAS_PRIORIDAD).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Canal</label>
                            <Select defaultValue="chat">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ETIQUETAS_CANAL).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setAbierto(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Crear ticket</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
