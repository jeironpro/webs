import { formatNumber, formatOffset, formatDateTime } from '@/utils/format'
import { useNow } from '@/hooks/useNow'
import SectionTitle from '@/components/ui/SectionTitle'
import styles from './location-card.module.css'

export default function LocationCard({ place, meta }) {
    const now = useNow(60_000)
    const timezone = meta?.timezone || 'UTC'
    const localDateTime = formatDateTime(timezone, now)

    const { latitude, longitude, name, country, population } = place || {}

    const offset = meta?.utcOffsetSeconds != null ? formatOffset(meta.utcOffsetSeconds) : null
    const elevation = place?.elevation ?? meta?.elevation

    return (
        <section aria-labelledby="location-title">
            <SectionTitle id="location-title">Ubicación</SectionTitle>

            <dl className={styles.grid}>
                <div className={styles.item}>
                    <dt className={styles.label}>Ciudad</dt>
                    <dd className={styles.value}>{name}</dd>
                </div>

                {country && (
                    <div className={styles.item}>
                        <dt className={styles.label}>País</dt>
                        <dd className={styles.value}>{country}</dd>
                    </div>
                )}

                <div className={styles.item}>
                    <dt className={styles.label}>Coordenadas</dt>
                    <dd className={styles.value}>
                        {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                    </dd>
                </div>

                {elevation != null && (
                    <div className={styles.item}>
                        <dt className={styles.label}>Elevación</dt>
                        <dd className={styles.value}>{formatNumber(elevation)} m</dd>
                    </div>
                )}

                <div className={styles.item}>
                    <dt className={styles.label}>Zona horaria</dt>
                    <dd className={styles.value}>
                        {timezone} {offset}
                    </dd>
                </div>

                <div className={styles.item}>
                    <dt className={styles.label}>Hora local</dt>
                    <dd className={styles.value}>{localDateTime}</dd>
                </div>

                {population != null && (
                    <div className={styles.item}>
                        <dt className={styles.label}>Población</dt>
                        <dd className={styles.value}>{formatNumber(population)}</dd>
                    </div>
                )}
            </dl>
        </section>
    )
}