import styles from '@/components/ui/skeleton.module.css'

function Skeleton({ className = '', style }) {
    return (
        <span
            aria-hidden="true"
            className={`${styles.skeleton} ${className}`.trim()}
            style={style}
        />
    )
}

export default Skeleton
