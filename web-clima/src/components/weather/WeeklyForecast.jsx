import WeatherIcon from '@/components/icons/WeatherIcon'
import { formatDayLabel, tempLabel } from '@/utils/format'
import SectionTitle from '@/components/ui/SectionTitle'
import styles from './weekly-forecast.module.css'

/**
 * Muestra una fila de 7 tarjetas con el pronóstico diario.
 */
export default function WeeklyForecast({ daily, unit = 'C' }) {
    // Limita a los 7 primeros días (incluye hoy)
    const days = daily.time.slice(0, 7).map((date, i) => ({
        date,
        label: formatDayLabel(date, i),
        code: daily.weatherCode[i],
        tempMin: daily.temperatureMin[i],
        tempMax: daily.temperatureMax[i],
        pop: daily.precipitationProbabilityMax[i],
    }))

    return (
        <section aria-labelledby="weekly-title">
            <SectionTitle id="weekly-title">Pronóstico 7 días</SectionTitle>
            <div className={styles.grid}>
                {days.map((d, idx) => (
                    <article key={idx} className={styles.card}>
                        <div className={styles.dayLabel}>{d.label}</div>
                        <WeatherIcon code={d.code} isDay={true} size={48} />
                        <div className={styles.temps}>
                            <span className={styles.max}>{tempLabel(d.tempMax, unit)}</span>
                            <span className={styles.min}>{tempLabel(d.tempMin, unit)}</span>
                        </div>
                        <div className={styles.pop}>Precip {d.pop}%</div>
                    </article>
                ))}
            </div>
        </section>
    )
}
