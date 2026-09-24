import styles from './section-title.module.css'

function SectionTitle({ children, id }) {
    return (
        <h2 id={id} className={styles.title}>
            {children}
        </h2>
    )
}

export default SectionTitle