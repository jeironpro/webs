import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CATALOGO, cargarTodasLasPreguntas } from '../services/questionsService';

const RATIOS = {
    '4-5': { w: 1080, h: 1350, label: 'Instagram/Threads/Facebook' },
    '1-1': { w: 1080, h: 1080, label: 'Feed cuadrado' },
    '9-16': { w: 1080, h: 1920, label: 'Reels/TikTok/Stories' },
    '1-91': { w: 1200, h: 628, label: 'Facebook/X' },
};

const PALETTE = {
    javascript: 'accent',
    typescript: 'accent-2',
    python: 'accent-3',
    html: 'lavender',
    css: 'mint',
    sql: 'accent-2',
    java: 'accent-3',
    go: 'mint',
    rust: 'accent-3',
    php: 'lavender',
    csharp: 'accent-2',
    cpp: 'accent-3',
};

const TIPO_LABEL = {
    output: 'Que imprime?',
    sintaxis: 'Sintaxis',
    bug: 'Bug',
    concepto: 'Concepto',
};

const DIFICULTAD_LABEL = {
    facil: 'Facil',
    media: 'Media',
    dificil: 'Dificil',
};

export default function Captura() {
    const { lenguaje = '', id = '', ratio = '4-5' } = useParams();
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState('');
    // La cantidad de datos ya cargados marca el listo para la captura.
    const [listo, setListo] = useState(false);

    const objetivo = RATIOS[ratio] || RATIOS['4-5'];
    const ancho = objetivo.w;
    const alto = objetivo.h;

    const langMeta = CATALOGO.find((l) => l.id === lenguaje);
    const chipColor = PALETTE[lenguaje] || 'accent';

    useEffect(() => {
        let cancel = false;
        cargarTodasLasPreguntas().then((ds) => {
            if (cancel) return;
            const found = ds
                .flatMap((d) =>
                    d.preguntas.map((p) => ({
                        ...p,
                        lenguaje: d.lenguaje,
                    })),
                )
                .find((p) => p.lenguaje === lenguaje && p.id === id);
            if (!found) setError('Pregunta no encontrada.');
            else setDatos(found);
        });
        return () => {
            cancel = true;
        };
    }, [lenguaje, id]);

    // Marca el contenido como encuadrado una vez cargadas las fuentes y estable el layout.
    useEffect(() => {
        if (!datos) return;
        let activo = true;
        const encuadrar = async () => {
            await document.fonts.ready;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (activo) setListo(true);
                });
            });
        };
        encuadrar();
        return () => {
            activo = false;
        };
    }, [datos]);

    if (error) {
        return (
            <div className="captura captura--error" style={{ width: ancho, height: alto }}>
                <p className="mono-label">No encontrada</p>
            </div>
        );
    }
    if (!datos) {
        return <div className="captura captura--loading" style={{ width: ancho, height: alto }} />;
    }

    const columns = ratio === '1-91' ? 2 : 1;

    return (
        <div
            className="captura"
            data-fit={listo ? 'ready' : 'busy'}
            style={{ width: ancho, height: alto }}
        >
            <div className="captura__frame">
                <div className="captura__fill">
                    <CapturaContenido
                        datos={datos}
                        langMeta={langMeta}
                        chipColor={chipColor}
                        columns={columns}
                    />
                </div>
            </div>
        </div>
    );
}

function CapturaContenido({ datos, langMeta, chipColor, columns }) {
    const dificultad = DIFICULTAD_LABEL[datos.dificultad] || datos.dificultad;
    return (
        <>
            <header className="captura__header">
                <span className="captura__brand mono-label">Codelang · Quiz</span>
                <span
                    className="captura__chip mono-label"
                    style={{
                        background: `var(--color-${chipColor})`,
                        color: `var(--color-ink)`,
                    }}
                    aria-hidden="true"
                >
                    {langMeta?.nombre || datos.lenguaje} · {TIPO_LABEL[datos.tipo] || datos.tipo} ·{' '}
                    {dificultad}
                </span>
            </header>

            <div className="captura__columnas">
                <article className="captura__pregunta">
                    <h2 className="captura__texto">{datos.pregunta}</h2>

                    {datos.codigo ? (
                        <div className="captura__code code-card">
                            <span className="code-card__lang mono-label">{datos.lenguaje}</span>
                            <pre className="captura__pre code-card__pre">
                                <code>{datos.codigo}</code>
                            </pre>
                        </div>
                    ) : null}
                </article>

                <div
                    className={`captura__opciones${columns === 2 ? ' captura__opciones--cols2' : ''}`}
                    role="group"
                    aria-label="Opciones"
                >
                    {['A', 'B', 'C', 'D'].map((letra) => (
                        <div key={letra} className="opcion">
                            <span className="opcion__letra mono-label">{letra}</span>
                            <span className="opcion__texto">{datos.opciones[letra]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="captura__footer mono-label" aria-hidden="true">
                codelang.quiz
            </footer>
        </>
    );
}
