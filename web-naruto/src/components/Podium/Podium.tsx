// Podio de los 3 mejores personajes con animaciones. Muestra 2.º, 1.º y 3.º en ese orden visual.
import { useState } from 'react';
import type { CharacterWithScore } from '../../utils/types';
import './Podium.css';

interface PodiumProps {
    top3: CharacterWithScore[];
}

const RANK_STYLES = [
    {
        key: 'first',
        label: '1',
        color: '#FFD700',
        streamBg: 'linear-gradient(180deg, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.02) 100%)',
        glow: 'rgba(255,215,0,0.25)',
    },
    {
        key: 'second',
        label: '2',
        color: '#94A3B8',
        streamBg: 'linear-gradient(180deg, rgba(148,163,184,0.3) 0%, rgba(148,163,184,0.02) 100%)',
        glow: 'rgba(148,163,184,0.15)',
    },
    {
        key: 'third',
        label: '3',
        color: '#CD7F32',
        streamBg: 'linear-gradient(180deg, rgba(205,127,50,0.3) 0%, rgba(205,127,50,0.02) 100%)',
        glow: 'rgba(205,127,50,0.15)',
    },
];

function PodiumImage({ src, alt }: { src: string; alt: string }) {
    const [error, setError] = useState(false);
    if (error) {
        return <div className="ascension-img ascension-img--fallback"><span>{alt[0]}</span></div>;
    }
    return <img src={src} alt={alt} className="ascension-img" loading="lazy" onError={() => setError(true)} />;
}

export function Podium({ top3 }: PodiumProps) {
    if (top3.length < 3) return null;

    const items = [
        { char: top3[1], rank: RANK_STYLES[1] },
        { char: top3[0], rank: RANK_STYLES[0] },
        { char: top3[2], rank: RANK_STYLES[2] },
    ];

    return (
        <section className="podium">
            <h2 className="podium-title">
                <span className="podium-title-bg">TOP 3</span>
            </h2>

            <div className="ascension">
                {items.map(({ char, rank }) => (
                    <div key={char.id} className={`ascension-item ascension-item--${rank.key}`}>
                        <div className="ascension-particles" aria-hidden="true">
                            <span /><span /><span /><span /><span /><span />
                        </div>

                        <div
                            className="ascension-frame"
                            style={{ borderColor: rank.color, boxShadow: `0 0 24px ${rank.glow}` }}
                        >
                            {rank.key === 'first' && (
                                <div className="ascension-halo" style={{ borderColor: 'rgba(255,215,0,0.12)' }} />
                            )}
                            <div
                                className="ascension-glow"
                                style={{ background: `radial-gradient(circle, ${rank.glow} 0%, transparent 70%)` }}
                            />
                            <PodiumImage src={char.imagen} alt={char.nombre} />
                        </div>

                        <div className="ascension-badge" style={{ background: rank.color, color: '#0D1B3E' }}>
                            {rank.label}
                        </div>

                        <div className="ascension-stream" style={{ background: rank.streamBg }}>
                            <div className="ascension-stream-inner" style={{ background: rank.color }} />
                        </div>

                        <div className="ascension-info">
                            <span className="ascension-name" style={{ color: rank.color }}>
                                {char.nombre}
                            </span>
                            <span className="ascension-score" aria-label={`Puntuación: ${char.scoreTotal}`}>{char.scoreTotal}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
