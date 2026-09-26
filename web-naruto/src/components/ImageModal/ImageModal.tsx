// Modal dedicado a mostrar la imagen ampliada de un personaje con fallback y metadatos.
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CharacterWithScore } from '../../utils/types';
import '../Modal/Modal.css';
import './ImageModal.css';

// Props: personaje a mostrar, control de apertura y callback de cierre.
interface ImageModalProps {
    character: CharacterWithScore;
    open: boolean;
    onClose: () => void;
}

// Modal de imagen ampliada con fallback si la URL falla, cierre con Escape y bloqueo de scroll.
export function ImageModal({ character, open, onClose }: ImageModalProps) {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="modal-overlay imodal-overlay" onClick={onClose}>
            <div
                className="imodal"
                role="dialog"
                aria-modal="true"
                aria-label={`Imagen de ${character.nombre}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="imodal-bg" />
                <button type="button" className="modal-close imodal-close" onClick={onClose} aria-label="Cerrar">
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <div className="imodal-image-wrap">
                    <div className="imodal-image-glow" />
                    {imgError ? (
                        <div className="imodal-fallback">
                            <span className="imodal-initial">{character.nombre?.[0] ?? '?'}</span>
                        </div>
                    ) : (
                        <img
                            className="imodal-image"
                            src={character.imagen}
                            alt={character.nombre}
                            onError={() => setImgError(true)}
                            loading="lazy"
                        />
                    )}
                </div>
                <div className="imodal-info">
                    <h2 className="imodal-name">{character.nombre}</h2>
                    <div className="imodal-meta">
                        <span className="imodal-tag">{character.aldea}</span>
                        <span className="imodal-dot">{'\u2022'}</span>
                        <span className="imodal-tag">{character.rango}</span>
                        <span className="imodal-dot">{'\u2022'}</span>
                        <span className="imodal-tag">{character.equipo}</span>
                    </div>
                </div>
                <div className="imodal-corner imodal-corner--tl" />
                <div className="imodal-corner imodal-corner--tr" />
                <div className="imodal-corner imodal-corner--bl" />
                <div className="imodal-corner imodal-corner--br" />
            </div>
        </div>,
        document.body,
    );
}
