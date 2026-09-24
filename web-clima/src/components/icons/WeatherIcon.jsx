import { getWeatherCode } from '@/utils/weatherCodes'
import styles from './weather-icon.module.css'

const LABELS = {
    clear: 'cielo despejado',
    partly: 'parcialmente nublado',
    cloud: 'nublado',
    fog: 'niebla',
    drizzle: 'llovizna',
    rain: 'lluvia',
    snow: 'nieve',
    storm: 'tormenta',
    unknown: 'condición desconocida',
}

function WeatherIcon({ code, isDay = true, size = 64, className = '' }) {
    const { group } = getWeatherCode(code)
    const label = !isDay && group === 'clear' ? 'noche despejada' : LABELS[group]

    return (
        <svg
            viewBox="0 0 48 48"
            width={size}
            height={size}
            role="img"
            aria-label={label}
            className={`${styles.icon} ${styles[`icon-${group}`]} ${className || ''}`.trim()}
        >
            <SkyBody isDay={isDay} />

            <g className={styles.cloudDrift}>
                <ellipse className={styles.cloudSoft} cx="14" cy="18" rx="7" ry="5.5" />
                <ellipse className={styles.cloudTop} cx="22" cy="15.5" rx="9" ry="7.5" />
                <ellipse className={styles.cloudSoft} cx="32" cy="18" rx="6.5" ry="5" />
                <rect className={styles.cloudSoft} x="11" y="14.5" width="24" height="9" rx="4.5" />
            </g>

            {group === 'fog' ? <Fog /> : null}
            {group === 'drizzle' ? <Drizzle /> : null}
            {group === 'rain' || group === 'storm' ? <Rain /> : null}
            {group === 'snow' ? <Snow /> : null}
            {group === 'storm' ? <Bolt /> : null}
        </svg>
    )
}

function SkyBody({ isDay }) {
    if (!isDay) {
        return (
            <g>
                <path className={styles.moon} d="M21 9a10.5 10.5 0 1 0 9 12.6A11 11 0 0 1 21 9z" />
                <circle className={styles.star} cx="34" cy="11" r="1.4" />
                <circle className={styles.starTwinkle} cx="28" cy="19" r="1" />
            </g>
        )
    }
    return (
        <g>
            <circle className={styles.sun} cx="20" cy="16" r="7" />
            <g className={styles.rays} stroke="currentColor" strokeWidth="1.6">
                <line x1="20" y1="4" x2="20" y2="7.5" />
                <line x1="20" y1="24.5" x2="20" y2="28" />
                <line x1="9" y1="16" x2="12.5" y2="16" />
                <line x1="27.5" y1="16" x2="31" y2="16" />
                <line x1="12.2" y1="8.2" x2="14.7" y2="10.7" />
                <line x1="25.3" y1="21.3" x2="27.8" y2="23.8" />
                <line x1="12.2" y1="23.8" x2="14.7" y2="21.3" />
                <line x1="25.3" y1="10.7" x2="27.8" y2="8.2" />
            </g>
        </g>
    )
}

function Fog() {
    return (
        <g className={styles.fogLines} stroke="currentColor" strokeLinecap="round">
            <line x1="13" y1="33" x2="35" y2="33" strokeWidth="1.6" />
            <line x1="16" y1="37.5" x2="32" y2="37.5" strokeWidth="1.4" />
        </g>
    )
}

function Drizzle() {
    return (
        <g className={styles.fall} stroke="currentColor" strokeLinecap="round" strokeWidth="1.6">
            <line x1="18" y1="32" x2="15.4" y2="37" />
            <line x1="25" y1="32" x2="22.4" y2="37" />
            <line x1="32" y1="32" x2="29.4" y2="37" />
        </g>
    )
}

function Rain() {
    return (
        <g className={styles.fall} stroke="currentColor" strokeLinecap="round" strokeWidth="1.6">
            <line x1="16" y1="32" x2="13" y2="38" />
            <line x1="23" y1="33" x2="20" y2="39" />
            <line x1="30" y1="32" x2="27" y2="38" />
        </g>
    )
}

function Snow() {
    return (
        <g className={styles.snow}>
            <circle className={styles.snowDot} cx="16" cy="34" r="1.5" />
            <circle className={styles.snowDot} cx="24" cy="38" r="1.5" />
            <circle className={styles.snowDot} cx="31" cy="34" r="1.5" />
        </g>
    )
}

function Bolt() {
    return <path className={styles.bolt} d="M26 26l-5 8h4l-2 6 7-9h-4z" fill="currentColor" />
}

export default WeatherIcon
