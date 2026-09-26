import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.jsx'

// Componente raíz: delega el enrutado en RouterProvider.
export default function App() {
  return <RouterProvider router={router} />
}
