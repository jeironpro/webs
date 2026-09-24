import { getWeatherCode } from '@/utils/weatherCodes'
import { round, formatTime, formatWind, toUserTemp } from '@/utils/format'
import styles from './current-hero.module.css'

/**
 * Estadística principal de Stat-Led: temperatura actual acompañada de la
 * condición y de las métricas inmediatas.
 */
function CurrentHero({ place, data, unit = 'C' }) {
    const current = data.current
    const cond = getWeatherCode(current.weatherCode)
    const timezone = data.meta.timezone
    const temp = toUserTemp(current.temperature, unit)
    const feels = toUserTemp(current.apparentTemperature, unit)
    const tempUnit = unit === 'F' ? '°F' : '°C'

    return (
        <div className={styles.root}>
            <div
                className={`${styles.figure} tnum`}
                role="group"
                aria-label={`Temperatura actual en grados ${unit === 'F' ? 'Fahrenheit' : 'Celsius'}`}
            >
                <span className={styles.value}>{temp}</span>
                <span className={styles.unit} aria-hidden="true">
                    {tempUnit}
                </span>
            </div>

            <p className={styles.condition}>
                {cond.label} en <span className={styles.place}>{place.name}</span>
            </p>
            <p className={styles.qualifier}>
                Sensación {feels}° · viento {formatWind(current.windSpeed)} · humedad{' '}
                {round(current.humidity)}
                &nbsp;%
            </p>

            <ul className={styles.meta}>
                <li className={styles.metaItem}>Hora local · {formatTime(timezone)}</li>
                <li className={styles.metaItem}>
                    {current.isDay ? 'De día' : 'De noche'} · índice UV {current.uvIndex ?? '—'}
                </li>
            </ul>
        </div>
    )
}

export default CurrentHero
