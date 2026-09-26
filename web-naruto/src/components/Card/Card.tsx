// Tarjeta de personaje con stats, habilidades, fortalezas/debilidades y modal de imagen.
import { useState, memo } from 'react';
import type { CharacterWithScore } from '../../utils/types';
import { ScoreBadge } from '../ScoreBadge/ScoreBadge';
import { ImageModal } from '../ImageModal/ImageModal';
import './Card.css';

// Props del componente: recibe un personaje con su puntuación calculada.
interface CardProps {
    character: CharacterWithScore;
}

// Nodo individual de estadística (fuerza, habilidad, etc.). Muestra valor con color específico.
const StatNode = memo(function StatNode({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="snode">
            <div className="snode-value" style={{ color }}>
                {value}
            </div>
            <div className="snode-label">{label}</div>
        </div>
    );
});

// Tarjeta expandible con banner (con fallback si la imagen falla), stats, habilidades, fortalezas y debilidades.
export const Card = memo(function Card({ character }: CardProps) {
    const [imgError, setImgError] = useState(false);
    const [expandOpen, setExpandOpen] = useState(false);

    return (
        <article className="card">
            <div className="card-banner">
                {imgError ? (
                    <div className="card-banner-fallback">
                        <span className="card-banner-initial">{character.nombre?.[0] ?? '?'}</span>
                    </div>
                ) : (
                    <img
                        className="card-banner-img"
                        src={character.imagen}
                        alt={character.nombre}
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                )}
                <button type="button" className="card-expand" onClick={() => setExpandOpen(true)} aria-label="Ver imagen completa">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                </button>
                {expandOpen && <ImageModal character={character} open={expandOpen} onClose={() => setExpandOpen(false)} />}
                <div className="card-banner-overlay">
                    <h2 className="card-name">{character.nombre}</h2>
                </div>
                <div className="card-banner-score">
                    <ScoreBadge score={character.scoreTotal} />
                </div>
            </div>

            <div className="card-body">
                <div className="card-meta">
                    <span>{character.aldea}</span>
                    <span className="meta-div">|</span>
                    <span>{character.clan}</span>
                    <span className="meta-div">|</span>
                    <span>{character.rango}</span>
                    <span className="meta-div">|</span>
                    <span>{character.equipo}</span>
                </div>

                {character.estadisticas && (
                    <>
                        <div className="card-divider"></div>
                        <div className="card-stats-grid" aria-label="Estadísticas">
                            <StatNode label="Fuerza" value={character.estadisticas.fuerza} color="#E8832C" />
                            <StatNode label="Habilidad" value={character.estadisticas.habilidad} color="#60A5FA" />
                            <StatNode label="Resistencia" value={character.estadisticas.resistencia} color="#4ADE80" />
                            <StatNode label="Estrategia" value={character.estadisticas.estrategia} color="#FACC15" />
                        </div>
                    </>
                )}

                {(character.habilidades ?? []).length > 0 && (
                    <>
                        <div className="card-divider"></div>
                        <div className="card-abilities">
                            <span className="card-section-label">Habilidades</span>
                            <ul className="card-ability-list">
                                {(character.habilidades ?? []).slice(0, 3).map((h, i) => (
                                    <li key={`${character.id}-hab-${i}`} className="ability-tag">
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {((character.fortalezas ?? []).length > 0 || (character.debilidades ?? []).length > 0) && (
                    <>
                        <div className="card-divider"></div>
                        <div className="card-sides">
                            {(character.fortalezas ?? []).length > 0 && (
                                <div className="card-side">
                                    <span className="card-section-label card-section-label--green">Fortalezas</span>
                                    <ul>
                                        {(character.fortalezas ?? []).slice(0, 2).map((f, i) => (
                                            <li key={`${character.id}-for-${i}`} className="side-item side-item--pos">
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {(character.debilidades ?? []).length > 0 && (
                                <div className="card-side">
                                    <span className="card-section-label card-section-label--red">Debilidades</span>
                                    <ul>
                                        {(character.debilidades ?? []).slice(0, 2).map((d, i) => (
                                            <li key={`${character.id}-deb-${i}`} className="side-item side-item--neg">
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </article>
    );
});
