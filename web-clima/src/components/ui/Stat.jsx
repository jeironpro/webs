import Skeleton from '@/components/ui/Skeleton'
import styles from './stat.module.css'

function Stat({ label, value, unit, caption, loading = false }) {
    return (
        <div className={styles.card}>
            <span className={styles.label}>{label}</span>

            {loading ? (
                <div className={styles.valueLoading}>
                    <Skeleton style={{ width: '4.5rem', height: '2.5rem' }} />
                </div>
            ) : (
                <div className={`${styles.value} tnum`}>
                    {value}
                    {unit ? <span className={styles.unit}>{unit}</span> : null}
                </div>
            )}

            {caption ? <p className={styles.caption}>{caption}</p> : null}
        </div>
    )
}

export default Stat
