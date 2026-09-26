// Insignia circular que muestra la puntuación numérica con un color según el rango (oro/plata/bronce/base).
import './ScoreBadge.css';

interface ScoreBadgeProps {
    score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
    const clamped = Math.min(10, Math.max(0, score || 0));
    const color = clamped >= 8 ? 'gold' : clamped >= 6 ? 'silver' : clamped >= 4 ? 'bronze' : 'base';

    return (
        <div className={`score-badge score-badge--${color}`} role="img" aria-label={`Puntuación: ${clamped}`}>
            <span className="score-value" aria-hidden="true">{clamped}</span>
        </div>
    );
}
