import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout.jsx'
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx'
import Home from '@/pages/Home.jsx'
import Exercises from '@/pages/Exercises.jsx'
import ExerciseDetail from '@/pages/ExerciseDetail.jsx'
import Favorites from '@/pages/Favorites.jsx'
import Compare from '@/pages/Compare.jsx'
import NotFound from '@/pages/NotFound.jsx'

// La app se sirve desde un subdirectorio (p. ej. /web-exerciness/ en el
// monorepo de webs), asi que el basename se deriva en runtime recortando el
// pathname del bundle desde /assets/. En desarrollo no hay script de assets
// y el basename es ''.
const scriptSrc = document.querySelector('script[src*="assets/"]')?.src ?? ''
const basename = scriptSrc.includes('/assets/')
  ? new URL(scriptSrc).pathname.replace(/\/assets\/.*$/, '')
  : ''

// Definición central de rutas de la aplicación.
export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        { index: true, element: <Home /> },
        { path: 'ejercicios', element: <Exercises /> },
        { path: 'ejercicio/:id', element: <ExerciseDetail /> },
        { path: 'favoritos', element: <Favorites /> },
        { path: 'comparar', element: <Compare /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename },
)
