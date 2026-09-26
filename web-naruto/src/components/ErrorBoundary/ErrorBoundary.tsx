// Error boundary que captura errores de renderizado y muestra un fallback amigable.
import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error) {
        console.error('ErrorBoundary caught:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#f5f5f5' }}>
                        <h2 style={{ fontFamily: "'Bangers', sans-serif", marginBottom: '1rem', color: '#e8832c' }}>
                            Algo salió mal
                        </h2>
                        <p style={{ marginBottom: '1rem' }}>Ha ocurrido un error inesperado.</p>
                        <button
                            type="button"
                            onClick={() => this.setState({ hasError: false, error: null })}
                            style={{
                                padding: '0.5rem 1.5rem',
                                background: '#e8832c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}
