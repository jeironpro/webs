import LightRays from '@/components/effects/LightRays'
import styles from '@/components/effects/LightRaysBackground.module.css'

function LightRaysBackground({ raysColor }) {
    return (
        <div className={styles.canvas} aria-hidden="true">
            <LightRays raysColor={raysColor} />
        </div>
    )
}

export default LightRaysBackground
