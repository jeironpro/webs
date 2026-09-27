import { cn } from "@/lib/utils";

interface SparklineProps {
    values: number[];
    className?: string;
}

// Línea de tendencia estática (sin animación): orientación, no decoración.
export function Sparkline({ values, className }: SparklineProps) {
    const width = 120;
    const height = 32;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const points = values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = height - 4 - ((value - min) / range) * (height - 8);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className={cn("h-8 w-full", className)}
            aria-hidden="true"
            preserveAspectRatio="none"
        >
            <polyline
                points={points}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
