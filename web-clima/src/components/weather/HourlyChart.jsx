import { formatHourLabel, tempLabel } from '@/utils/format'
import { useNow } from '@/hooks/useNow'
import SectionTitle from '@/components/ui/SectionTitle'
import styles from './hourly-chart.module.css'

export default function HourlyChart({ hourly, timezone, unit = 'C' }) {
    const now = useNow(30_000)

    const points = hourly.time.slice(0, 24).map((t, i) => ({
        time: t,
        hourLabel: formatHourLabel(t, timezone),
        temp: hourly.temperature[i],
        pop: hourly.precipitationProbability[i],
        isNow: now && Math.abs(new Date(t) - now) < 3600_000,
    }))

    const temps = points.map((p) => p.temp).filter((v) => v != null)
    const minTemp = Math.min(...temps)
    const maxTemp = Math.max(...temps)

    const chartW = 300
    const chartH = 120
    const paddingTop = 20
    const paddingBottom = 30
    const innerH = chartH - paddingTop - paddingBottom

    const stepX = chartW / (points.length - 1)

    const linePoints = points
        .map((p, i) => {
            const y = paddingTop + ((maxTemp - p.temp) / (maxTemp - minTemp || 1)) * innerH
            return `${stepX * i},${y}`
        })
        .join(' ')

    return (
        <section aria-labelledby="hourly-title">
            <SectionTitle id="hourly-title">Próximas 24 h</SectionTitle>
            <div className={styles.chartWrapper}>
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className={styles.chart}>
                    <polygon
                        className={styles.tempArea}
                        points={
                            points
                                .map((p, i) => {
                                    const y =
                                        paddingTop +
                                        ((maxTemp - p.temp) / (maxTemp - minTemp || 1)) * innerH
                                    return `${stepX * i},${y}`
                                })
                                .join(' ') + ` ${chartW},${chartH} 0,${chartH}`
                        }
                    />
                    <polyline points={linePoints} className={styles.tempLine} fill="none" />
                    {points.map((p, i) => {
                        const cx = stepX * i
                        const cy =
                            paddingTop + ((maxTemp - p.temp) / (maxTemp - minTemp || 1)) * innerH
                        return (
                            <g key={i}>
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={p.isNow ? 3 : 2}
                                    className={p.isNow ? styles.nowPoint : styles.point}
                                >
                                    <title>{`${p.hourLabel} · ${tempLabel(p.temp, unit)} · ${p.pop}% precip.`}</title>
                                </circle>
                            </g>
                        )
                    })}
                    {points.map((p, i) => {
                        const x = stepX * i - 3
                        const barHeight = (p.pop / 100) * (paddingBottom - 4)
                        const y = chartH - barHeight - 2
                        return (
                            <rect
                                key={i}
                                x={x}
                                y={y}
                                width="6"
                                height={barHeight}
                                className={styles.popBar}
                            >
                                <title>{`${p.hourLabel} · ${p.pop}% precip.`}</title>
                            </rect>
                        )
                    })}
                </svg>
            </div>
            <ul className={styles.srOnly}>
                {points.map((p, i) => (
                    <li key={i}>
                        {p.hourLabel}: {tempLabel(p.temp, unit)} - {p.pop}% precip.
                    </li>
                ))}
            </ul>
        </section>
    )
}
