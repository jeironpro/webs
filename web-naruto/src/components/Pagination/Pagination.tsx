// Navegación de páginas con botones anterior/siguiente, números de página y elipsis.
import { useMemo } from 'react';
import './Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <nav className="pagination" role="navigation" aria-label="Paginación">
            <button
                type="button"
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M10 12L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="pagination-ellipsis" aria-hidden="true">…</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        className={`pagination-btn pagination-btn--page ${p === currentPage ? 'pagination-btn--active' : ''}`}
                        onClick={() => onPageChange(p)}
                        aria-label={`Página ${p}`}
                        aria-current={p === currentPage ? 'page' : undefined}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                type="button"
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M6 4L10 8L6 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </nav>
    );
}
