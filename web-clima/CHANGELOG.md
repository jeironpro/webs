# CHANGELOG

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/).

## [Unreleased]

### Changed

#### PR-4: Refactorización y acciones del header

- Patrón de petición de datos unificado en el hook `useAsyncResource` (usado por `useWeather` y `useAirQuality`).
- Geolocalización compartida vía `GeolocationContext`: el botón "Usar mi ubicación" ahora carga el clima y muestra sus errores.
- El toggle °C/°F ahora convierte también la temperatura y la sensación térmica del hero.
- Componentes renombrados a PascalCase (`LocationCard`, `AirQualityCard`) y separación de estados vacío/carga: al entrar ya no se muestran skeletons sin datos en vuelo.
- Búsqueda sin resultados duplicados de la misma ciudad y país.
- Footer reducido a marca y atribución de datos.
- **Tarjeta de Ubicación mejorada**: datos en tarjetas (4 + 3 en desktop, 2/1 columnas en responsive), zona horaria IANA completa (`Europe/Madrid`) con offset UTC, hora local con fecha y reloj en vivo, y elevación con respaldo de Open-Meteo.
- Títulos de sección unificados en el componente `SectionTitle` (elimina CSS duplicado en 4 módulos) y footer fijado sobre las capas de fondo en móvil.

### Removed

#### PR-4

- Código muerto: `store/unitStore.js`, `constants.js` y utilidades sin uso (`formatTemp`, `formatVisibility`, `formatPercent`) junto con sus tests.
- Clase CSS sin uso `searchWrapper` y texto poco relevante del footer (`© año — Libre`).

### Fixed

#### PR-4

- Colores de los tramos "muy deficiente", "extremadamente deficiente" y "muy insalubre" de la calidad del aire (mismatch entre claves kebab y nombres camelCase de los módulos CSS).
- `aria-labelledby` de `LocationCard` y `AirQualityCard` apuntando a ids inexistentes.
- Hueco excesivo antes del footer en móvil que lo hacía parecer inexistente.

### Added

#### PR-2: API real y datos meteorológicos

- Scaffolding de la aplicación con **React + Vite**, alias de import `@/`, ESLint y Prettier.
- Sistema de diseño **Aurora** (papel oscuro, acento cian) como tokens en `src/styles/tokens.css`.
- Fondo animado **LightRays** (WebGL con `ogl`) adaptado del componente React Bits, con soporte de `prefers-reduced-motion`.
- Estructura de página Stat-Led: navegación flotante (N5), footer tipo statement (Ft5) y hero con carga Esqueleto.
- Pipeline de **CI** (lint, tests y build) para pull requests sobre `main`.
- Servicios **Open-Meteo**: geocodificación de lugares, pronóstico (current + hourly + daily) y capa `http` con abort/errores normalizados.
- Hooks: `useDebounce`, `useGeocoding`, `useWeather` y `useGeolocation`.
- **Búsqueda** de lugares con lista de resultados accesible (combobox) y botón **Usar mi ubicación**.
- Hero con **condición actual real**: temperatura, sensación, viento, humedad, hora local e índice UV.
- Grid de métricas (viento, humedad, UV, visibilidad) alimentada con datos reales.
- Tests unitarios de utilidades y mapeos de servicios (`weatherCodes`, `format`, `geocodingService`, `weatherService`) con `vitest`.

#### PR-3: Pulido y funcionalidades avanzadas

- **Pronóstico 7 días** con componentes `WeeklyForecast.jsx` y WeatherIcon SVG personalizado.
- **Gráfica horaria** (`HourlyChart.jsx`) con línea de temperatura, área de color y barras de precipitación.
- **Tarjeta de ubicación** (`LocationCard.jsx`) con coordenadas, zona horaria, offset UTC, hora local (reloj en vivo), elevación y población.
- **Calidad del aire** (`AirQualityCard.jsx`) con Badges EU y US basados en API Open-Meteo.
- **Toggle de unidades** °C/°F en la barra de navegación, con persistencia en `localStorage`.
- **Hooks nuevos**: `useNow` (reloj en vivo), `useLocalStorage` (persistencia), `useAirQuality`.
- **Utils ampliados**: `toUserTemp`, `tempLabel`, `formatHourLabel`, `formatOffset`, `formatNumber`, `aqiCategoryEU`, `aqiCategoryUS`.
- **Persistencia de búsqueda**: el último lugar buscado se guarda y restaura en `localStorage`.
- Documentación: `CHANGELOG.md` actualizado, estructura de componentes clara.
