// Modal genérico reutilizable con overlay, cierre por tecla Escape y renderizado vía portal.
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

// Props: control de apertura, callback de cierre y contenido hijo.
interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

let openModals = 0;

// Modal renderizado mediante portal al body. Bloquea scroll del body y cierra con Escape.
export function Modal({ open, onClose, children }: ModalProps) {
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (open) {
            triggerRef.current = document.activeElement as HTMLButtonElement;
            openModals++;
            document.body.style.overflow = 'hidden';
        } else {
            openModals--;
            if (openModals <= 0) {
                openModals = 0;
                document.body.style.overflow = '';
            }
        }
        return () => {
            openModals--;
            if (openModals <= 0) {
                openModals = 0;
                document.body.style.overflow = '';
            }
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            const el = document.querySelector<HTMLElement>('.modal-content');
            el?.focus();
        } else if (triggerRef.current) {
            triggerRef.current.focus();
        }
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
            >
                <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                {children}
            </div>
        </div>,
        document.body,
    );
}
