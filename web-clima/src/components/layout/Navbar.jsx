import { useGeolocation } from '@/context/GeolocationContext'
import { useUnit } from '@/context/UnitContext'
import styles from '@/components/layout/navbar.module.css'

function Navbar() {
    const geolocation = useGeolocation()
    const { unit, setUnit } = useUnit()

    const toggleUnit = () => setUnit((prev) => (prev === 'C' ? 'F' : 'C'))

    return (
        <header className={styles.header}>
            <nav className={styles.pill} aria-label="Navegación principal">
                <a className={styles.brand} href="#" aria-label="clima — inicio">
                    <span className={styles.brandMark}>Clima</span>
                    <span className={styles.brandDegree} aria-hidden="true">
                        °
                    </span>
                </a>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.geo}
                        onClick={() => geolocation.request()}
                        disabled={geolocation.loading}
                        aria-label="Usar mi ubicación"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className={styles.unitToggle}
                        onClick={toggleUnit}
                        aria-label={`Cambiar a ${unit === 'C' ? 'F' : 'C'}°`}
                    >
                        {unit}°
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
