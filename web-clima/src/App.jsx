import LightRaysBackground from '@/components/effects/LightRaysBackground'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Home from '@/pages/Home'
import { UnitProvider } from '@/context/UnitContext'
import { GeolocationProvider } from '@/context/GeolocationContext'
import styles from '@/App.module.css'

const RAYS_COLOR = '#55ecff'

function App() {
    return (
        <UnitProvider>
            <GeolocationProvider>
                <div className={styles.app}>
                    <LightRaysBackground raysColor={RAYS_COLOR} />
                    <div className={styles.scrim} aria-hidden="true" />
                    <Navbar />
                    <main className={styles.main} id="contenido" tabIndex={-1}>
                        <Home />
                    </main>
                    <Footer />
                </div>
            </GeolocationProvider>
        </UnitProvider>
    )
}

export default App
