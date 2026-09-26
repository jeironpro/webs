import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

// Renderiza un componente dentro de un router de memoria para tests de rutas.
// - path: patrón de la ruta que renderiza el componente.
// - route: URL inicial de la navegación.
export function renderWithRouter(ui, options = {}) {
  const { route = '/', path = route, routes, ...renderOptions } = options
  const resolvedRoutes = routes ?? [{ path, element: ui }]
  const router = createMemoryRouter(resolvedRoutes, { initialEntries: [route] })
  return render(<RouterProvider router={router} />, renderOptions)
}
