/* Hallmark · genre: playful · macrostructure: statement · theme: Hum · design-system: design.md · designed-as-app */
import { Link } from 'react-router-dom'

// Página 404: mensaje breve y enlace de vuelta al inicio.
export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-24 text-center">
      <span className="font-mono text-6xl font-bold text-accent-3">404</span>
      <p className="font-body text-lg text-ink-2">No encontramos lo que buscas.</p>
      <Link to="/" className="btn no-underline">
        Volver al inicio
      </Link>
    </section>
  )
}
