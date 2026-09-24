import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useUnit } from '@/context/UnitContext'
import { useGeolocation } from '@/context/GeolocationContext'
import { useWeather } from '@/hooks/useWeather'
import { useAirQuality } from '@/hooks/useAirQuality'
import { windDirection, round } from '@/utils/format'
import SearchBar from '@/components/search/SearchBar'
import CurrentHero from '@/components/weather/CurrentHero'
import ErrorPanel from '@/components/ui/ErrorPanel'
import Stat from '@/components/ui/Stat'
import Skeleton from '@/components/ui/Skeleton'
import HourlyChart from '@/components/weather/HourlyChart'
import WeeklyForecast from '@/components/weather/WeeklyForecast'
import LocationCard from '@/components/weather/LocationCard'
import AirQualityCard from '@/components/weather/AirQualityCard'
import SectionTitle from '@/components/ui/SectionTitle'
import styles from './home.module.css'

function uvCategory(value) {
    if (value === null || value === undefined) return null
    if (value < 3) return 'Bajo'
    if (value < 6) return 'Moderado'
    if (value < 8) return 'Alto'
    if (value < 11) return 'Muy alto'
    return 'Extremo'
}

function EmptyHero() {
    return (
        <div className={styles.stage}>
            <div className={styles.figure} aria-hidden="true">
                <div className={styles.figurePlaceholder} />
            </div>
            <p className={styles.qualifier}>
                Busca una ciudad o usa tu ubicación: aquí aparecerán su temperatura, condición y
                pronóstico.
            </p>
        </div>
    )
}

function Home() {
    const [place, setPlace] = useLocalStorage('web-clima:last-place', null)
    const { unit } = useUnit()
    const geolocation = useGeolocation()

    const geoPlace = geolocation.coords
        ? {
              name: 'Tu ubicación',
              latitude: geolocation.coords.latitude,
              longitude: geolocation.coords.longitude,
          }
        : null
    const activePlace = place ?? geoPlace

    const { data, loading, error, reload } = useWeather(activePlace)
    const { data: aqiData, loading: aqiLoading, error: aqiError } = useAirQuality(activePlace)

    const isLoading = Boolean(activePlace) && loading
    const isReady = Boolean(data) && !isLoading

    function handlePlace(nextPlace) {
        setPlace(nextPlace)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const showWeekly = isReady && data?.hourly?.time?.length && data?.daily?.time?.length
    const showAirQuality = aqiData && !aqiLoading && !aqiError
    const showHourly = isReady && data?.hourly && activePlace

    return (
        <div className={styles.page}>
            <section className={styles.hero} aria-labelledby="titulo-hero">
                <h1 id="titulo-hero" className={styles.heroTitle}>
                    El tiempo de <span className={styles.heroAccent}>cualquier lugar</span>.
                </h1>

                <div className={styles.toolbar}>
                    <SearchBar onSelect={handlePlace} />
                    {geolocation.error ? (
                        <p className={styles.geoError} role="alert">
                            {geolocation.error.message}
                        </p>
                    ) : null}
                </div>

                {error ? (
                    <ErrorPanel
                        message="No se pudo cargar el clima de esta ubicación. Revisa la conexión e inténtalo de nuevo."
                        onRetry={reload}
                    />
                ) : isLoading ? (
                    <div className={styles.stage}>
                        <div className={styles.figure} aria-hidden="true">
                            <Skeleton className={styles.figureSkeleton} />
                        </div>
                    </div>
                ) : activePlace && data ? (
                    <CurrentHero place={activePlace} data={data} unit={unit} />
                ) : (
                    <EmptyHero />
                )}
            </section>

            {!error ? (
                <section id="datos" className={styles.metrics} aria-labelledby="titulo-datos">
                    <SectionTitle id="titulo-datos">
                        {activePlace
                            ? `Condiciones actuales en ${activePlace.name}`
                            : 'Con el tiempo, llegan los datos'}
                    </SectionTitle>

                    <div className={styles.metricsGrid}>
                        {data ? (
                            <>
                                <Stat
                                    label="Viento"
                                    value={round(data.current.windSpeed)}
                                    unit="km/h"
                                    caption={windDirection(data.current.windDirection) ?? '—'}
                                />
                                <Stat
                                    label="Humedad"
                                    value={round(data.current.humidity)}
                                    unit="%"
                                    caption="Relativa en el aire"
                                />
                                <Stat
                                    label="Índice UV"
                                    value={
                                        uvCategory(data.current.uvIndex)
                                            ? round(data.current.uvIndex)
                                            : null
                                    }
                                    unit=""
                                    caption={uvCategory(data.current.uvIndex) ?? '—'}
                                />
                                <Stat
                                    label="Visibilidad"
                                    value={round(data.current.visibility / 1000)}
                                    unit="km"
                                    caption="Horizontal"
                                />
                            </>
                        ) : isLoading ? (
                            <>
                                <Stat label="Viento" loading />
                                <Stat label="Humedad" loading />
                                <Stat label="Índice UV" loading />
                                <Stat label="Visibilidad" loading />
                            </>
                        ) : null}
                    </div>

                    {showAirQuality && (
                        <div className={styles.airQualityWrapper}>
                            <AirQualityCard data={aqiData} />
                        </div>
                    )}
                </section>
            ) : null}

            {showHourly && (
                <section>
                    <SectionTitle>Pronóstico por horas</SectionTitle>
                    <HourlyChart hourly={data.hourly} timezone={data.meta.timezone} unit={unit} />
                </section>
            )}

            {showWeekly && <WeeklyForecast daily={data.daily} unit={unit} />}

            {isReady && activePlace && <LocationCard place={activePlace} meta={data?.meta} />}

            <section className={styles.statement}>
                <p>El tiempo cambia. Las coordenadas, no.</p>
                <p>Clima&nbsp;° trae la previsión y los datos de cada lugar a tu pantalla.</p>
            </section>
        </div>
    )
}

export default Home
