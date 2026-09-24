import styles from '@/components/layout/footer.module.css'

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.shell}>
                <span className={styles.meta}>clima&nbsp;° · MIT</span>
                <span className={styles.meta}>Datos: Open-Meteo · CC BY 4.0</span>
            </div>
        </footer>
    )
}

export default Footer
