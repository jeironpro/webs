import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartCardProps {
    title: string
    description: string
    /** elemento opcional a la derecha del título (badge, total...) */
    action?: ReactNode
    className?: string
    children: ReactNode
}

/** Card contenedora de un gráfico con cabecera consistente. */
export function ChartCard({ title, description, action, className, children }: ChartCardProps) {
    return (
        <Card className={cn('border-0', className)}>
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    {action}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
