import styles from './error-panel.module.css'

function ErrorPanel({ message, onRetry, retryLabel = 'Reintentar' }) {
    return (
        <div className={styles.panel} role="alert">
            <p className={styles.message}>{message}</p>
            {onRetry ? (
                <button type="button" className={styles.retry} onClick={onRetry}>
                    {retryLabel}
                </button>
            ) : null}
        </div>
    )
}

export default ErrorPanel
