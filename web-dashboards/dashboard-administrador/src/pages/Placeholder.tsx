import { Construction } from "lucide-react";

interface PlaceholderProps {
    title: string;
    description?: string;
}

export function Placeholder({ title, description }: PlaceholderProps) {
    return (
        <div className="surface-hairline flex min-h-[50vh] flex-col items-center justify-center gap-3 p-10 text-center">
            <Construction className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
                {description ?? "Esta vista se incorpora en su propio PR."}
            </p>
        </div>
    );
}
