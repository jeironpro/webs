/* Hallmark · component: error-boundary · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import { Component } from 'react'

// Captura errores de renderizado y muestra un fallback en lugar de romper la app.
// Se usa como errorElement en el router para cualquier ruta de la aplicación.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // En futuras versiones se puede registrar el error en un servicio de monitorización.
    // eslint-disable-next-line no-console -- el registro del error es intencional
    console.error('Error de renderizado capturado:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-4">
          <span className="font-mono text-6xl font-bold text-accent-3">Error</span>
          <h1 className="font-display text-2xl font-semibold text-ink">Algo salió mal</h1>
          <p className="max-w-md text-center font-body text-sm text-ink-2">
            Hubo un error inesperado. Recarga la página para continuar.
          </p>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </main>
      )
    }
    return this.props.children
  }
}
