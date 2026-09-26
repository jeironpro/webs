// Componente raíz de la aplicación. Gestiona filtros, paginación, top 3 y estado de carga.
import { useState, useCallback } from 'react';
import { useNarutoData } from './hooks/useNarutoData';
import { Header } from './components/Header/Header';
import { FilterBar } from './components/FilterBar/FilterBar';
import { Card } from './components/Card/Card';
import { Podium } from './components/Podium/Podium';
import { Pagination } from './components/Pagination/Pagination';
import { Modal } from './components/Modal/Modal';
import { Footer } from './components/Footer/Footer';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

import type { FilterState } from './utils/types';
import { personajesPorPuntaje } from './utils/characters';
import './App.css';

function BackgroundKunai() {
    return (
        <div className="background-kunai" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
                <svg key={i} className="kunai" width="32" height="44" viewBox="0 0 60 200" fill="none">
                    <defs>
                        <linearGradient id={`blade-${i}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8B929A" />
                            <stop offset="30%" stopColor="#B0B5BA" />
                            <stop offset="50%" stopColor="#D1D5DB" />
                            <stop offset="70%" stopColor="#B0B5BA" />
                            <stop offset="100%" stopColor="#8B929A" />
                        </linearGradient>
                        <linearGradient id={`handle-${i}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#5C6065" />
                            <stop offset="30%" stopColor="#8B8F94" />
                            <stop offset="70%" stopColor="#8B8F94" />
                            <stop offset="100%" stopColor="#5C6065" />
                        </linearGradient>
                    </defs>
                    <path d="M30 14 C24 32 12 44 11 56 C10 68 16 76 20 80 L28 84 L30 86 Z" fill={`url(#blade-${i})`} stroke="#5C6065" strokeWidth="0.5" />
                    <path d="M30 14 C36 32 48 44 49 56 C50 68 44 76 40 80 L32 84 L30 86 Z" fill={`url(#blade-${i})`} stroke="#5C6065" strokeWidth="0.5" />
                    <line x1="30" y1="14" x2="30" y2="86" stroke="#5C6065" strokeWidth="1.5" opacity="0.8" />
                    <rect x="24" y="84" width="12" height="4" rx="1" fill="#6B7278" />
                    <rect x="26" y="88" width="8" height="48" rx="2" fill={`url(#handle-${i})`} />
                    <g stroke="#4A4D52" strokeWidth="1.2" opacity="0.6">
                        <line x1="26" y1="94" x2="34" y2="95" />
                        <line x1="26" y1="100" x2="34" y2="101" />
                        <line x1="26" y1="106" x2="34" y2="107" />
                        <line x1="26" y1="112" x2="34" y2="113" />
                        <line x1="26" y1="118" x2="34" y2="119" />
                        <line x1="26" y1="124" x2="34" y2="125" />
                    </g>
                    <ellipse cx="30" cy="150" rx="8" ry="6" fill="none" stroke="#8B929A" strokeWidth="3" />
                </svg>
            ))}
        </div>
    );
}

const POR_PAGINA = 24;

function App() {
    const [filtros, setFiltros] = useState<FilterState>({
        aldea: 'todas',
        clan: 'todos',
        equipo: 'todos',
        rango: 'todos',
        sort: 'score-desc',
        search: '',
    });
    const [paginaActual, setPaginaActual] = useState(1);
    const [top3Open, setTop3Open] = useState(false);

    const { datos, totalPaginas } = useNarutoData({
        pagina: paginaActual,
        porPagina: POR_PAGINA,
        busqueda: filtros.search,
        aldea: filtros.aldea === 'todas' ? '' : filtros.aldea,
        clan: filtros.clan === 'todos' ? '' : filtros.clan,
        equipo: filtros.equipo === 'todos' ? '' : filtros.equipo,
        rango: filtros.rango === 'todos' ? '' : filtros.rango,
        ordenar: filtros.sort,
    });

    // Lista pre-ordenada por puntaje descendente: el top 3 son los 3 primeros.
    const top3 = personajesPorPuntaje.slice(0, 3);

    const actualizarFiltro = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFiltros((prev) => ({ ...prev, [key]: value }));
        setPaginaActual(1);
    }, []);

    const resetearFiltros = useCallback(() => {
        setFiltros({ aldea: 'todas', clan: 'todos', equipo: 'todos', rango: 'todos', sort: 'score-desc', search: '' });
        setPaginaActual(1);
    }, []);

    const closeTop3 = useCallback(() => setTop3Open(false), []);
    const openTop3 = useCallback(() => setTop3Open(true), []);

    return (
        <div className="app">
            <BackgroundKunai />
            <Header />
            <main className="main-content">
                <Modal open={top3Open} onClose={closeTop3}>
                    <Podium top3={top3} />
                </Modal>
                <FilterBar
                    filters={filtros}
                    onFilterChange={actualizarFiltro}
                    onReset={resetearFiltros}
                    onTop3={openTop3}
                />
                {datos.length === 0 ? (
                    <p className="empty-state" aria-live="polite">No se encontraron personajes con esos filtros.</p>
                ) : (
                        <>
                            <div className="characters-grid">
                                <ErrorBoundary>
                                    {datos.map((char) => (
                                        <Card key={char.id} character={char} />
                                    ))}
                                </ErrorBoundary>
                            </div>
                            <Pagination currentPage={paginaActual} totalPages={totalPaginas} onPageChange={setPaginaActual} />
                        </>
                    )}
            </main>
            <Footer />
        </div>
    );
}

export default App;
