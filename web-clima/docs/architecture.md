# Arquitectura del Frontend

## Visión general

`web-clima` es una aplicación SPA que consume la API pública de Open-Meteo para mostrar datos meteorológicos en tiempo real. El flujo de datos es unidireccional desde la API hasta la vista, con componentes presentacionales que renderizan los datos normalizados.

## Flujo de datos

1. **Inicio → App.jsx**
    - `App` envuelve la app con `UnitProvider` (unidad de temperatura) y `GeolocationProvider` (ubicación compartida).
    - Renderiza `Navbar`, `Home`, `Footer`.

2. **Home.jsx → Hooks**
    - `useLocalStorage` para persistir el lugar buscado.
    - `useUnit` para obtener la unidad (°C/°F) y el setter.
    - `useGeolocation` (desde `GeolocationContext`) para las coordenadas del usuario; las usa como lugar activo cuando no hay búsqueda.
    - `useWeather` y `useAirQuality`, ambos construidos sobre `useAsyncResource`:
        - Cancelan (ignoran) vuelos obsoletos al cambiar la ubicación.
        - `reload` reintenta tras un fallo.
        - Normalizan la respuesta a `{ meta, current, hourly, daily }` / `{ meta, index }`.

3. **Services**
    - `http.js`: Wrapper fetch con abort, timeout, normalización de errores.
    - `config.js`: ENDPOINTS y valores por defecto de VITE.
    - `weatherService.js`: `fetchWeather` normaliza datos de Open-Meteo.
    - `airQualityService.js`: `fetchAirQuality` para datos de calidad del aire.

4. **Utils**
    - `format.js`: funciones de formateo (temperatura, zona horaria, offset, días).
    - `weatherCodes.js`: mapeo WMO → { label, group }.
    - `aqi.js`: categorías de calidad del aire.

## Componentes principales

| Componente       | Prop                                           | Uso                                 |
| ---------------- | ---------------------------------------------- | ----------------------------------- |
| `CurrentHero`    | `place`, `data`                                | Titular con temperatura y condición |
| `HourlyChart`    | `hourly`, `timezone`, `unit`                   | SVG de 24 horas                     |
| `WeeklyForecast` | `daily`, `unit`                                | 7 tarjetas con mini íconos          |
| `LocationCard`   | `place`, `meta`                                | Especificaciones de coordenadas     |
| `AirQualityCard` | `data`                                         | Badges de AQI EU/US                 |
| `SearchBar`      | `onSelect`                                     | Combobox accesible                  |
| `WeatherIcon`    | `code`, `isDay`, `size`                        | SVG icon                            |
| `Skeleton`       | `className`, `style`                           | Esqueleto de carga                  |
| `Stat`           | `label`, `value`, `unit`, `caption`, `loading` | Métrica con estado de carga         |

## Zonas de pantalla

- **Hero**: sticky top, navigation pill anchor, centered content.
- **Metrics**: grid 4 cols > 2 cols móvil.
- **WeeklyForecast**: grid auto-fill mini cards.
- **AirQualityCard**: badges inline.
- **LocationCard**: definición lista (dl).

## Estados

| Estado            | Hero                                       | Métricas               |
| ----------------- | ------------------------------------------ | ---------------------- |
| Vacío (sin lugar) | `EmptyHero` (placeholder estático + ayuda) | —                      |
| Cargando          | Esqueleto (`Skeleton`)                     | 4 `Stat` con `loading` |
| Error             | `ErrorPanel` con reintento                 | —                      |
| Con datos         | `CurrentHero`                              | 4 estaciones (`Stat`)  |
