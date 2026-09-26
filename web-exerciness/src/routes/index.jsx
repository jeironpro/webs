import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout.jsx'
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx'
import Home from '@/pages/Home.jsx'
import Exercises from '@/pages/Exercises.jsx'
import ExerciseDetail from '@/pages/ExerciseDetail.jsx'
import Favorites from '@/pages/Favorites.jsx'
import Compare from '@/pages/Compare.jsx'
import NotFound from '@/pages/NotFound.jsx'

// Definición central de rutas de la aplicación.
export const router = createBrowserRouter([
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
])
