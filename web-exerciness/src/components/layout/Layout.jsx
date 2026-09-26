/* Hallmark · component: layout · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CompareBar from '@/components/common/CompareBar.jsx'
import { useCompareStore, selectCompareCount } from '@/store/compareStore.js'

// Layout principal: navbar, contenido enrutado (Outlet), footer y barra de
// comparación. Añade padding inferior al contenido mientras haya selecciones
// para que la barra flotante no lo tape.
export default function Layout() {
  const compareCount = useCompareStore(selectCompareCount)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 ${compareCount > 0 ? 'pb-24' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
    </div>
  )
}
