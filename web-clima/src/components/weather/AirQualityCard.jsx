import SectionTitle from '@/components/ui/SectionTitle'
import styles from './air-quality-card.module.css'

function classNameOf(key) {
    return key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

export default function AirQualityCard({ data }) {
    const { index } = data || {}
    const { european, us } = index || {}

    const badges = []

    if (european) {
        badges.push({ type: 'EU', ...european })
    }
    if (us) {
        badges.push({ type: 'US', ...us })
    }

    return (
        <section aria-labelledby="aq-title">
            <SectionTitle id="aq-title">Calidad del aire</SectionTitle>

            <div className={styles.grid}>
                {badges.map((b, i) => (
                    <span key={i} className={`${styles.meta} ${styles[classNameOf(b.key)]}`}>
                        {b.type}: {b.label}
                    </span>
                ))}
            </div>
        </section>
    )
}
