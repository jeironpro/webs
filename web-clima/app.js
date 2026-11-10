const STORAGE_UNIT = "web-clima:unit";
const STORAGE_PLACE = "web-clima:last-place";
const RAYS_COLOR = "#55ecff";
const REQUEST_TIMEOUT_MS = 12000;
const AIR_QUALITY_TIMEOUT_MS = 10000;
const SEARCH_DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;

const ENDPOINTS = {
    forecast: "https://api.open-meteo.com/v1/forecast",
    geocoding: "https://geocoding-api.open-meteo.com/v1/search",
    airQuality: "https://air-quality-api.open-meteo.com/v1/air-quality",
};

const GEOLOCATION_ERRORS = {
    1: "Permiso denegado para acceder a tu ubicación.",
    2: "No se pudo obtener tu posición.",
    3: "La solicitud de ubicación tardó demasiado.",
};

const WEATHER_CODES = {
    0: { label: "Despejado", group: "clear" },
    1: { label: "Mayormente despejado", group: "clear" },
    2: { label: "Parcialmente nublado", group: "partly" },
    3: { label: "Nublado", group: "cloud" },
    45: { label: "Niebla", group: "fog" },
    48: { label: "Niebla engelante", group: "fog" },
    51: { label: "Llovizna suave", group: "drizzle" },
    53: { label: "Llovizna", group: "drizzle" },
    55: { label: "Llovizna intensa", group: "drizzle" },
    56: { label: "Llovizna engelante", group: "drizzle" },
    57: { label: "Llovizna engelante", group: "drizzle" },
    61: { label: "Lluvia suave", group: "rain" },
    63: { label: "Lluvia", group: "rain" },
    65: { label: "Lluvia fuerte", group: "rain" },
    66: { label: "Lluvia helada", group: "rain" },
    67: { label: "Lluvia helada", group: "rain" },
    71: { label: "Nieve suave", group: "snow" },
    73: { label: "Nieve", group: "snow" },
    75: { label: "Nieve fuerte", group: "snow" },
    77: { label: "Granos de nieve", group: "snow" },
    80: { label: "Chubascos suaves", group: "rain" },
    81: { label: "Chubascos moderados", group: "rain" },
    82: { label: "Chubascos violentos", group: "rain" },
    85: { label: "Chubascos de nieve", group: "snow" },
    86: { label: "Chubascos de nieve fuertes", group: "snow" },
    95: { label: "Tormenta", group: "storm" },
    96: { label: "Tormenta con granizo", group: "storm" },
    99: { label: "Tormenta con granizo fuerte", group: "storm" },
};

const WEATHER_ICON_LABELS = {
    clear: "cielo despejado",
    partly: "parcialmente nublado",
    cloud: "nublado",
    fog: "niebla",
    drizzle: "llovizna",
    rain: "lluvia",
    snow: "nieve",
    storm: "tormenta",
    unknown: "condición desconocida",
};

const COMPASS = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSO",
    "SO",
    "OSO",
    "O",
    "ONO",
    "NO",
    "NNO",
];

const EU_AQI_LEVELS = [
    { key: "good", label: "Muy buena" },
    { key: "good", label: "Buena" },
    { key: "fair", label: "Aceptable" },
    { key: "poor", label: "Deficiente" },
    { key: "very-poor", label: "Muy deficiente" },
    { key: "extremely-poor", label: "Extremadamente deficiente" },
];

const US_AQI_LEVELS = [
    { key: "good", label: "Buena" },
    { key: "moderate", label: "Moderada" },
    { key: "sensitive", label: "Insalubre para grupos" },
    { key: "unhealthy", label: "Insalubre" },
    { key: "very-unhealthy", label: "Muy insalubre" },
    { key: "hazardous", label: "Peligrosa" },
];

const state = {
    unit: readStorage(STORAGE_UNIT, "C") === "F" ? "F" : "C",
    place: readStorage(STORAGE_PLACE, null),
    geolocation: { coords: null, loading: false, error: null },
    weather: { data: null, loading: false, error: null, attempt: 0 },
    airQuality: { data: null, loading: false, error: null, attempt: 0 },
    search: {
        query: "",
        places: [],
        loading: false,
        error: null,
        activeIndex: -1,
        open: false,
        timer: null,
        controller: null,
        request: 0,
    },
    now: new Date(),
};

let elements = {};

function readStorage(key, initialValue) {
    try {
        const stored = window.localStorage.getItem(key);
        return stored === null ? initialValue : JSON.parse(stored);
    } catch {
        return initialValue;
    }
}

function writeStorage(key, value) {
    try {
        if (value === null || value === undefined) {
            window.localStorage.removeItem(key);
        } else {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    } catch {
        return;
    }
}

function round(value) {
    return Math.round(value);
}

function toUserTemp(celsius, unit) {
    if (celsius === null || celsius === undefined) return null;
    return unit === "F" ? round((celsius * 9) / 5 + 32) : round(celsius);
}

function tempLabel(celsius, unit = "C") {
    const value = toUserTemp(celsius, unit);
    if (value === null) return null;
    return `${round(value)}°${unit}`;
}

function formatWind(kmh, unit = "km/h") {
    if (kmh === null || kmh === undefined) return null;
    const value = unit === "mph" ? kmh * 0.621371 : kmh;
    return `${round(value)} ${unit}`;
}

function windDirection(degrees) {
    if (degrees === null || degrees === undefined) return null;
    return COMPASS[Math.round(degrees / 22.5) % 16];
}

function formatTime(timezone, date = new Date()) {
    return formatHourLabel(date.toISOString(), timezone);
}

function formatHourLabel(iso, timezone = "UTC") {
    if (!iso) return null;
    try {
        return new Intl.DateTimeFormat("es-ES", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(iso));
    } catch {
        return iso.slice(11, 16);
    }
}

function formatDateTime(timezone, date = new Date()) {
    if (!date) return null;
    try {
        const day = new Intl.DateTimeFormat("es-ES", {
            timeZone: timezone,
            weekday: "long",
            day: "numeric",
            month: "short",
        }).format(date);
        const time = new Intl.DateTimeFormat("es-ES", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
        return `${day} · ${time}`;
    } catch {
        return null;
    }
}

function formatOffset(utcOffsetSeconds) {
    if (utcOffsetSeconds === null || utcOffsetSeconds === undefined) return null;
    const sign = utcOffsetSeconds < 0 ? "-" : "+";
    const abs = Math.abs(utcOffsetSeconds);
    const hours = Math.floor(abs / 3600);
    const minutes = Math.round((abs % 3600) / 60);
    const pad = (value) => String(value).padStart(2, "0");
    return `UTC${sign}${pad(hours)}:${pad(minutes)}`;
}

function formatNumber(value) {
    if (value === null || value === undefined) return null;
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDayLabel(dateString, index = 0) {
    if (index === 0) return "Hoy";
    if (index === 1) return "Mañana";
    try {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        const weekday = new Intl.DateTimeFormat("es-ES", {
            timeZone: "UTC",
            weekday: "long",
        }).format(date);
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
    } catch {
        return dateString;
    }
}

function uvCategory(value) {
    if (value === null || value === undefined) return null;
    if (value < 3) return "Bajo";
    if (value < 6) return "Moderado";
    if (value < 8) return "Alto";
    if (value < 11) return "Muy alto";
    return "Extremo";
}

function getWeatherCode(code) {
    return WEATHER_CODES[code] ?? { label: "Desconocido", group: "unknown" };
}

function pickCategory(value, levels, steps) {
    if (value === null || value === undefined) return null;
    for (let index = 0; index < steps.length; index += 1) {
        if (value <= steps[index]) return levels[index];
    }
    return levels[levels.length - 1];
}

function aqiCategoryEU(value) {
    return pickCategory(value, EU_AQI_LEVELS, [20, 40, 60, 80, 100]);
}

function aqiCategoryUS(value) {
    return pickCategory(value, US_AQI_LEVELS, [50, 100, 150, 200, 300]);
}

function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[character]
    );
}

function getGeoPlace() {
    if (!state.geolocation.coords) return null;
    return {
        name: "Tu ubicación",
        latitude: state.geolocation.coords.latitude,
        longitude: state.geolocation.coords.longitude,
    };
}

function getActivePlace() {
    return state.place ?? getGeoPlace();
}

async function getJson(url, { signal } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let abortedByCaller = false;

    const onExternalAbort = () => {
        abortedByCaller = true;
        controller.abort();
    };
    signal?.addEventListener("abort", onExternalAbort);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
        });

        if (!response.ok) {
            const error = new Error(`HTTP ${response.status} consultando ${url}`);
            error.name = "FetchError";
            error.kind = "http";
            error.status = response.status;
            throw error;
        }

        try {
            return await response.json();
        } catch {
            const error = new Error("La respuesta no es JSON válido");
            error.name = "FetchError";
            error.kind = "parse";
            throw error;
        }
    } catch (error) {
        if (error?.name === "AbortError" && abortedByCaller) return null;
        if (error?.name === "AbortError") {
            const timeoutError = new Error("La petición superó el tiempo límite");
            timeoutError.name = "FetchError";
            timeoutError.kind = "timeout";
            throw timeoutError;
        }
        if (error?.name === "FetchError") throw error;
        const networkError = new Error("No se pudo contactar con el servidor");
        networkError.name = "FetchError";
        networkError.kind = "network";
        throw networkError;
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", onExternalAbort);
    }
}

function dedupePlaces(places) {
    const seen = new Map();
    for (const place of places) {
        const key = `${place.name.toLowerCase()}|${place.countryCode ?? ""}`;
        const current = seen.get(key);
        if (!current || (place.population ?? -1) > (current.population ?? -1)) {
            seen.set(key, place);
        }
    }
    return [...seen.values()];
}

function placeFromApi(raw) {
    const bits = [raw.name];
    if (raw.admin1) bits.push(raw.admin1);
    if (raw.country) bits.push(raw.country);
    return {
        id: raw.id,
        name: raw.name,
        country: raw.country,
        countryCode: raw.country_code,
        admin1: raw.admin1 ?? null,
        latitude: raw.latitude,
        longitude: raw.longitude,
        elevation: raw.elevation ?? null,
        timezone: raw.timezone ?? "UTC",
        population: raw.population ?? null,
        featureCode: raw.feature_code ?? null,
        label: bits.join(", "),
    };
}

async function searchPlaces(name, { count = 8, signal } = {}) {
    const params = new URLSearchParams({
        name,
        count: String(count),
        format: "json",
        language: "es",
    });

    const payload = await getJson(`${ENDPOINTS.geocoding}?${params.toString()}`, { signal });
    if (payload === null) return null;

    const results = Array.isArray(payload?.results) ? payload.results : [];
    return dedupePlaces(results.map(placeFromApi));
}

async function fetchWeather(place, { signal } = {}) {
    const search = new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        current: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
            "is_day",
            "surface_pressure",
            "uv_index",
            "visibility",
        ].join(","),
        hourly: [
            "temperature_2m",
            "apparent_temperature",
            "precipitation_probability",
            "weather_code",
            "wind_speed_10m",
        ].join(","),
        daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "sunrise",
            "sunset",
            "precipitation_sum",
            "precipitation_probability_max",
            "wind_speed_10m_max",
            "uv_index_max",
        ].join(","),
        timezone: "auto",
        forecast_days: "7",
        temperature_unit: "celsius",
        wind_speed_unit: "kmh",
        precipitation_unit: "mm",
    });

    const payload = await getJson(`${ENDPOINTS.forecast}?${search.toString()}`, { signal });
    if (payload === null) return null;

    const current = payload.current ?? {};
    const hourly = payload.hourly ?? {};
    const daily = payload.daily ?? {};

    return {
        meta: {
            latitude: payload.latitude,
            longitude: payload.longitude,
            timezone: payload.timezone ?? "UTC",
            utcOffsetSeconds: payload.utc_offset_seconds ?? 0,
            units: {
                temperature: payload.current_units?.temperature_2m ?? "°C",
                wind: payload.current_units?.wind_speed_10m ?? "km/h",
                pressure: payload.current_units?.surface_pressure ?? "hPa",
            },
            elevation: payload.elevation ?? null,
        },
        current: {
            time: current.time ?? null,
            temperature: current.temperature_2m ?? null,
            apparentTemperature: current.apparent_temperature ?? null,
            humidity: current.relative_humidity_2m ?? null,
            precipitation: current.precipitation ?? null,
            weatherCode: current.weather_code ?? null,
            windSpeed: current.wind_speed_10m ?? null,
            windDirection: current.wind_direction_10m ?? null,
            isDay: current.is_day ?? 1,
            pressure: current.surface_pressure ?? null,
            uvIndex: current.uv_index ?? null,
            visibility: current.visibility ?? null,
        },
        hourly: {
            time: hourly.time ?? [],
            temperature: hourly.temperature_2m ?? [],
            apparentTemperature: hourly.apparent_temperature ?? [],
            precipitationProbability: hourly.precipitation_probability ?? [],
            weatherCode: hourly.weather_code ?? [],
            windSpeed: hourly.wind_speed_10m ?? [],
        },
        daily: {
            time: daily.time ?? [],
            weatherCode: daily.weather_code ?? [],
            temperatureMax: daily.temperature_2m_max ?? [],
            temperatureMin: daily.temperature_2m_min ?? [],
            sunrise: daily.sunrise ?? [],
            sunset: daily.sunset ?? [],
            precipitationSum: daily.precipitation_sum ?? [],
            precipitationProbabilityMax: daily.precipitation_probability_max ?? [],
            windSpeedMax: daily.wind_speed_10m_max ?? [],
            uvIndexMax: daily.uv_index_max ?? [],
        },
    };
}

async function fetchAirQuality(place, { signal } = {}) {
    const search = new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        current: "european_aqi,us_aqi",
        timezone: "auto",
    });

    const payload = await getJson(`${ENDPOINTS.airQuality}?${search.toString()}`, { signal });
    if (payload === null) return null;

    const current = payload.current ?? {};
    const european = current.european_aqi ?? null;
    const us = current.us_aqi ?? null;

    return {
        meta: {
            timezone: payload.timezone ?? "UTC",
            utcOffsetSeconds: payload.utc_offset_seconds ?? 0,
        },
        index: {
            european: european === null ? null : { value: european, ...aqiCategoryEU(european) },
            us: us === null ? null : { value: us, ...aqiCategoryUS(us) },
        },
    };
}

function loadWeather() {
    const place = getActivePlace();
    const attempt = (state.weather.attempt += 1);
    state.weather.loading = true;
    state.weather.error = null;

    if (!place) {
        state.weather.data = null;
        state.weather.loading = false;
        renderDynamic();
        return;
    }

    renderDynamic();

    fetchWeather(place)
        .then((result) => {
            if (attempt !== state.weather.attempt) return;
            state.weather.data = result;
        })
        .catch((error) => {
            if (attempt !== state.weather.attempt) return;
            state.weather.error = error;
        })
        .finally(() => {
            if (attempt !== state.weather.attempt) return;
            state.weather.loading = false;
            renderDynamic();
        });
}

function loadAirQuality() {
    const place = getActivePlace();
    const attempt = (state.airQuality.attempt += 1);
    state.airQuality.loading = true;
    state.airQuality.error = null;

    if (!place) {
        state.airQuality.data = null;
        state.airQuality.loading = false;
        return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AIR_QUALITY_TIMEOUT_MS);

    fetchAirQuality(place, { signal: controller.signal })
        .then((result) => {
            if (attempt !== state.airQuality.attempt) return;
            state.airQuality.data = result;
        })
        .catch((error) => {
            if (attempt !== state.airQuality.attempt) return;
            if (error?.name === "AbortError") return;
            state.airQuality.error = error;
        })
        .finally(() => {
            clearTimeout(timer);
            if (attempt !== state.airQuality.attempt) return;
            state.airQuality.loading = false;
            renderDynamic();
        });
}

function loadAll() {
    loadWeather();
    loadAirQuality();
}

function weatherIcon(code, isDay = true, size = 64) {
    const { group } = getWeatherCode(code);
    const label = !isDay && group === "clear" ? "noche despejada" : WEATHER_ICON_LABELS[group];

    const skyBody = isDay
        ? `<g>
            <circle class="wicon-sun" cx="20" cy="16" r="7" />
            <g class="wicon-rays" stroke="currentColor" stroke-width="1.6">
                <line x1="20" y1="4" x2="20" y2="7.5" />
                <line x1="20" y1="24.5" x2="20" y2="28" />
                <line x1="9" y1="16" x2="12.5" y2="16" />
                <line x1="27.5" y1="16" x2="31" y2="16" />
                <line x1="12.2" y1="8.2" x2="14.7" y2="10.7" />
                <line x1="25.3" y1="21.3" x2="27.8" y2="23.8" />
                <line x1="12.2" y1="23.8" x2="14.7" y2="21.3" />
                <line x1="25.3" y1="10.7" x2="27.8" y2="8.2" />
            </g>
        </g>`
        : `<g>
            <path class="wicon-moon" d="M21 9a10.5 10.5 0 1 0 9 12.6A11 11 0 0 1 21 9z" />
            <circle class="wicon-star" cx="34" cy="11" r="1.4" />
            <circle class="wicon-starTwinkle" cx="28" cy="19" r="1" />
        </g>`;

    const fog =
        group === "fog"
            ? `<g class="wicon-fogLines" stroke="currentColor" stroke-linecap="round">
                <line x1="13" y1="33" x2="35" y2="33" stroke-width="1.6" />
                <line x1="16" y1="37.5" x2="32" y2="37.5" stroke-width="1.4" />
            </g>`
            : "";

    const drizzle =
        group === "drizzle"
            ? `<g class="wicon-fall" stroke="currentColor" stroke-linecap="round" stroke-width="1.6">
                <line x1="18" y1="32" x2="15.4" y2="37" />
                <line x1="25" y1="32" x2="22.4" y2="37" />
                <line x1="32" y1="32" x2="29.4" y2="37" />
            </g>`
            : "";

    const rain =
        group === "rain" || group === "storm"
            ? `<g class="wicon-fall" stroke="currentColor" stroke-linecap="round" stroke-width="1.6">
                <line x1="16" y1="32" x2="13" y2="38" />
                <line x1="23" y1="33" x2="20" y2="39" />
                <line x1="30" y1="32" x2="27" y2="38" />
            </g>`
            : "";

    const snow =
        group === "snow"
            ? `<g class="wicon-snow">
                <circle cx="16" cy="34" r="1.5" />
                <circle cx="24" cy="38" r="1.5" />
                <circle cx="31" cy="34" r="1.5" />
            </g>`
            : "";

    const bolt =
        group === "storm"
            ? `<path class="wicon-bolt" d="M26 26l-5 8h4l-2 6 7-9h-4z" fill="currentColor" />`
            : "";

    return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" role="img" aria-label="${escapeHtml(
        label
    )}" class="wicon-icon wicon-icon-${group}">
        ${skyBody}
        <g class="wicon-cloudDrift">
            <ellipse class="wicon-cloudSoft" cx="14" cy="18" rx="7" ry="5.5" />
            <ellipse class="wicon-cloudTop" cx="22" cy="15.5" rx="9" ry="7.5" />
            <ellipse class="wicon-cloudSoft" cx="32" cy="18" rx="6.5" ry="5" />
            <rect class="wicon-cloudSoft" x="11" y="14.5" width="24" height="9" rx="4.5" />
        </g>
        ${fog}${drizzle}${rain}${snow}${bolt}
    </svg>`;
}

function sectionTitle(id, text) {
    return `<h2${id ? ` id="${id}"` : ""} class="section-title">${escapeHtml(text)}</h2>`;
}

function errorPanel(message) {
    return `<div class="error-panel" role="alert">
        <p class="error-message">${escapeHtml(message)}</p>
        <button type="button" class="error-retry" data-action="retry-weather">Reintentar</button>
    </div>`;
}

function heroHTML(activePlace, weather, unit) {
    if (weather.error) {
        return errorPanel(
            "No se pudo cargar el clima de esta ubicación. Revisa la conexión e inténtalo de nuevo."
        );
    }

    const isLoading = Boolean(activePlace) && weather.loading;
    if (isLoading) {
        return `<div class="home-stage">
            <div class="home-figure" aria-hidden="true">
                <span aria-hidden="true" class="skeleton-skeleton home-figureSkeleton"></span>
            </div>
        </div>`;
    }

    if (activePlace && weather.data) {
        return currentHeroHTML(activePlace, weather.data, unit);
    }

    return `<div class="home-stage">
        <div class="home-figure" aria-hidden="true">
            <div class="home-figurePlaceholder"></div>
        </div>
        <p class="home-qualifier">Busca una ciudad o usa tu ubicación: aquí aparecerán su temperatura, condición y pronóstico.</p>
    </div>`;
}

function currentHeroHTML(place, data, unit) {
    const current = data.current;
    const condition = getWeatherCode(current.weatherCode);
    const temp = toUserTemp(current.temperature, unit);
    const feels = toUserTemp(current.apparentTemperature, unit);
    const tempUnit = unit === "F" ? "°F" : "°C";

    return `<div class="hero-root">
        <div class="hero-figure tnum" role="group" aria-label="Temperatura actual en grados ${
            unit === "F" ? "Fahrenheit" : "Celsius"
        }">
            <span class="hero-value">${temp ?? ""}</span>
            <span class="hero-unit" aria-hidden="true">${tempUnit}</span>
        </div>
        <p class="hero-condition">${escapeHtml(condition.label)} en <span class="hero-place">${escapeHtml(
            place.name
        )}</span></p>
        <p class="hero-qualifier">Sensación ${feels ?? ""}° · viento ${escapeHtml(
            formatWind(current.windSpeed) ?? ""
        )} · humedad ${round(current.humidity)}&nbsp;%</p>
        <ul class="hero-meta">
            <li class="hero-metaItem">Hora local · ${escapeHtml(
                formatTime(data.meta.timezone) ?? ""
            )}</li>
            <li class="hero-metaItem">${
                current.isDay ? "De día" : "De noche"
            } · índice UV ${current.uvIndex ?? "—"}</li>
        </ul>
    </div>`;
}

function statHTML({ label, value, unit = "", caption, loading = false }) {
    if (loading) {
        return `<div class="stat-card">
            <span class="stat-label">${escapeHtml(label)}</span>
            <div class="stat-valueLoading">
                <span aria-hidden="true" class="skeleton-skeleton" style="width:4.5rem;height:2.5rem"></span>
            </div>
        </div>`;
    }

    return `<div class="stat-card">
        <span class="stat-label">${escapeHtml(label)}</span>
        <div class="stat-value tnum">${value ?? ""}${
            unit ? `<span class="stat-unit">${escapeHtml(unit)}</span>` : ""
        }</div>
        ${caption ? `<p class="stat-caption">${escapeHtml(caption)}</p>` : ""}
    </div>`;
}

function airQualityHTML(data) {
    const index = data?.index ?? {};
    const { european, us } = index;
    const badges = [];
    if (european) badges.push({ type: "EU", ...european });
    if (us) badges.push({ type: "US", ...us });

    const classNameOf = (key) => key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    return `<section aria-labelledby="aq-title">
        ${sectionTitle("aq-title", "Calidad del aire")}
        <div class="aqi-grid">
            ${badges
                .map(
                    (badge) =>
                        `<span class="aqi-meta aqi-${classNameOf(
                            badge.key
                        )}">${escapeHtml(badge.type)}: ${escapeHtml(badge.label)}</span>`
                )
                .join("")}
        </div>
    </section>`;
}

function metricsHTML(activePlace, weather, airQuality) {
    const data = weather.data;
    const isLoading = Boolean(activePlace) && weather.loading;
    let cards = "";

    if (data) {
        const category = uvCategory(data.current.uvIndex);
        cards = [
            statHTML({
                label: "Viento",
                value: round(data.current.windSpeed),
                unit: "km/h",
                caption: windDirection(data.current.windDirection) ?? "—",
            }),
            statHTML({
                label: "Humedad",
                value: round(data.current.humidity),
                unit: "%",
                caption: "Relativa en el aire",
            }),
            statHTML({
                label: "Índice UV",
                value: category ? round(data.current.uvIndex) : null,
                unit: "",
                caption: category ?? "—",
            }),
            statHTML({
                label: "Visibilidad",
                value: round(data.current.visibility / 1000),
                unit: "km",
                caption: "Horizontal",
            }),
        ].join("");
    } else if (isLoading) {
        cards = [
            statHTML({ label: "Viento", loading: true }),
            statHTML({ label: "Humedad", loading: true }),
            statHTML({ label: "Índice UV", loading: true }),
            statHTML({ label: "Visibilidad", loading: true }),
        ].join("");
    }

    const showAirQuality = airQuality.data && !airQuality.loading && !airQuality.error;
    const quality = showAirQuality
        ? `<div class="home-airQualityWrapper">${airQualityHTML(airQuality.data)}</div>`
        : "";

    return `<section id="datos" class="home-metrics" aria-labelledby="titulo-datos">
        ${sectionTitle(
            "titulo-datos",
            activePlace
                ? `Condiciones actuales en ${activePlace.name}`
                : "Con el tiempo, llegan los datos"
        )}
        <div class="home-metricsGrid">${cards}</div>
        ${quality}
    </section>`;
}

function hourlySectionHTML(hourly, timezone, unit, now) {
    const points = hourly.time.slice(0, 24).map((time, index) => ({
        time,
        hourLabel: formatHourLabel(time, timezone),
        temp: hourly.temperature[index],
        pop: hourly.precipitationProbability[index],
        isNow: now && Math.abs(new Date(time) - now) < 3600000,
    }));

    if (points.length === 0) return "";

    const temps = points.map((point) => point.temp).filter((value) => value != null);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const chartW = 300;
    const chartH = 120;
    const paddingTop = 20;
    const paddingBottom = 30;
    const innerH = chartH - paddingTop - paddingBottom;
    const stepX = chartW / (points.length - 1);

    const yFor = (point) =>
        paddingTop + ((maxTemp - point.temp) / (maxTemp - minTemp || 1)) * innerH;

    const linePoints = points.map((point, index) => `${stepX * index},${yFor(point)}`).join(" ");
    const areaPoints = `${linePoints} ${chartW},${chartH} 0,${chartH}`;

    const circles = points
        .map((point, index) => {
            const title = `${point.hourLabel} · ${tempLabel(point.temp, unit) ?? ""} · ${
                point.pop
            }% precip.`;
            return `<g><circle cx="${stepX * index}" cy="${yFor(point)}" r="${
                point.isNow ? 3 : 2
            }" class="${point.isNow ? "hourly-nowPoint" : "hourly-point"}"><title>${escapeHtml(
                title
            )}</title></circle></g>`;
        })
        .join("");

    const bars = points
        .map((point, index) => {
            const x = stepX * index - 3;
            const barHeight = (point.pop / 100) * (paddingBottom - 4);
            const y = chartH - barHeight - 2;
            const title = `${point.hourLabel} · ${point.pop}% precip.`;
            return `<rect x="${x}" y="${y}" width="6" height="${barHeight}" class="hourly-popBar"><title>${escapeHtml(
                title
            )}</title></rect>`;
        })
        .join("");

    const list = points
        .map(
            (point) =>
                `<li>${escapeHtml(point.hourLabel)}: ${
                    tempLabel(point.temp, unit) ?? ""
                } - ${point.pop}% precip.</li>`
        )
        .join("");

    return `<section aria-labelledby="hourly-title">
        ${sectionTitle("hourly-title", "Próximas 24 h")}
        <div class="hourly-chartWrapper">
            <svg viewBox="0 0 ${chartW} ${chartH}" class="hourly-chart">
                <polygon class="hourly-tempArea" points="${areaPoints}" />
                <polyline points="${linePoints}" class="hourly-tempLine" fill="none" />
                ${circles}
                ${bars}
            </svg>
        </div>
        <ul class="hourly-srOnly">${list}</ul>
    </section>`;
}

function weeklyHTML(daily, unit) {
    const days = daily.time.slice(0, 7).map((date, index) => ({
        date,
        label: formatDayLabel(date, index),
        code: daily.weatherCode[index],
        tempMin: daily.temperatureMin[index],
        tempMax: daily.temperatureMax[index],
        pop: daily.precipitationProbabilityMax[index],
    }));

    return `<section aria-labelledby="weekly-title">
        ${sectionTitle("weekly-title", "Pronóstico 7 días")}
        <div class="weekly-grid">
            ${days
                .map(
                    (day) => `<article class="weekly-card">
                        <div class="weekly-dayLabel">${escapeHtml(day.label)}</div>
                        ${weatherIcon(day.code, true, 48)}
                        <div class="weekly-temps">
                            <span class="weekly-max">${tempLabel(day.tempMax, unit) ?? ""}</span>
                            <span class="weekly-min">${tempLabel(day.tempMin, unit) ?? ""}</span>
                        </div>
                        <div class="weekly-pop">Precip ${day.pop}%</div>
                    </article>`
                )
                .join("")}
        </div>
    </section>`;
}

function locationHTML(place, meta, now) {
    const timezone = meta?.timezone || "UTC";
    const localDateTime = formatDateTime(timezone, now);
    const latitude = place?.latitude;
    const longitude = place?.longitude;
    const name = place?.name;
    const country = place?.country;
    const population = place?.population;
    const offset = meta?.utcOffsetSeconds != null ? formatOffset(meta.utcOffsetSeconds) : null;
    const elevation = place?.elevation ?? meta?.elevation;

    const coordinates = `${
        latitude !== null && latitude !== undefined ? latitude.toFixed(4) : ""
    }, ${longitude !== null && longitude !== undefined ? longitude.toFixed(4) : ""}`;

    return `<section aria-labelledby="location-title">
        ${sectionTitle("location-title", "Ubicación")}
        <dl class="location-grid">
            <div class="location-item">
                <dt class="location-label">Ciudad</dt>
                <dd class="location-value">${escapeHtml(name)}</dd>
            </div>
            ${
                country
                    ? `<div class="location-item">
                        <dt class="location-label">País</dt>
                        <dd class="location-value">${escapeHtml(country)}</dd>
                    </div>`
                    : ""
            }
            <div class="location-item">
                <dt class="location-label">Coordenadas</dt>
                <dd class="location-value">${escapeHtml(coordinates)}</dd>
            </div>
            ${
                elevation != null
                    ? `<div class="location-item">
                        <dt class="location-label">Elevación</dt>
                        <dd class="location-value">${formatNumber(elevation)} m</dd>
                    </div>`
                    : ""
            }
            <div class="location-item">
                <dt class="location-label">Zona horaria</dt>
                <dd class="location-value">${escapeHtml(timezone)} ${offset ?? ""}</dd>
            </div>
            <div class="location-item">
                <dt class="location-label">Hora local</dt>
                <dd class="location-value">${escapeHtml(localDateTime ?? "")}</dd>
            </div>
            ${
                population != null
                    ? `<div class="location-item">
                        <dt class="location-label">Población</dt>
                        <dd class="location-value">${formatNumber(population)}</dd>
                    </div>`
                    : ""
            }
        </dl>
    </section>`;
}

function pageSectionsHTML(activePlace, weather, airQuality, unit, now) {
    const data = weather.data;
    const isLoading = Boolean(activePlace) && weather.loading;
    const isReady = Boolean(data) && !isLoading;
    const showHourly = isReady && data?.hourly && activePlace;
    const showWeekly = isReady && data?.hourly?.time?.length && data?.daily?.time?.length;

    let sections = "";

    if (!weather.error) {
        sections += metricsHTML(activePlace, weather, airQuality);
    }

    if (showHourly) {
        sections += `<section>${sectionTitle(null, "Pronóstico por horas")}${hourlySectionHTML(
            data.hourly,
            data.meta.timezone,
            unit,
            now
        )}</section>`;
    }

    if (showWeekly) {
        sections += weeklyHTML(data.daily, unit);
    }

    if (isReady && activePlace) {
        sections += locationHTML(activePlace, data?.meta, now);
    }

    return sections;
}

function renderDynamic() {
    if (!elements.hero || !elements.sections) return;
    const activePlace = getActivePlace();
    elements.hero.innerHTML = heroHTML(activePlace, state.weather, state.unit);
    elements.sections.innerHTML = pageSectionsHTML(
        activePlace,
        state.weather,
        state.airQuality,
        state.unit,
        state.now
    );
}

function renderNavbar() {
    if (!elements.unitToggle || !elements.geoButton) return;
    elements.geoButton.disabled = state.geolocation.loading;
    elements.unitToggle.textContent = `${state.unit}°`;
    elements.unitToggle.setAttribute(
        "aria-label",
        `Cambiar a ${state.unit === "C" ? "F" : "C"}°`
    );
}

function renderGeoError() {
    if (!elements.toolbar) return;
    const error = state.geolocation.error;
    if (!error) {
        if (elements.geoError) {
            elements.geoError.remove();
            elements.geoError = null;
        }
        return;
    }

    if (!elements.geoError) {
        elements.geoError = document.createElement("p");
        elements.geoError.className = "home-geoError";
        elements.geoError.setAttribute("role", "alert");
        elements.toolbar.appendChild(elements.geoError);
    }
    elements.geoError.textContent = error.message;
}

function searchHasOptions() {
    const trimmed = state.search.query.trim();
    return state.search.open && trimmed.length >= MIN_QUERY_LENGTH && state.search.places.length > 0;
}

function showSearchList() {
    return state.search.open && state.search.query.trim().length >= MIN_QUERY_LENGTH;
}

function renderSearch() {
    const search = state.search;
    if (!elements.searchInput) return;

    if (elements.searchInput.value !== search.query) {
        elements.searchInput.value = search.query;
    }

    const hasOptions = searchHasOptions();
    const showList = showSearchList();
    const activeDescendant =
        hasOptions && search.activeIndex >= 0 ? `search-option-${search.activeIndex}` : null;

    elements.searchInput.setAttribute("aria-expanded", String(hasOptions));
    elements.searchInput.setAttribute("aria-busy", String(search.loading));
    if (activeDescendant) {
        elements.searchInput.setAttribute("aria-activedescendant", activeDescendant);
    } else {
        elements.searchInput.removeAttribute("aria-activedescendant");
    }

    elements.spinner.hidden = !search.loading;
    elements.clearButton.hidden = search.loading || search.query.length < 2;

    let status = "";
    let statusError = "";
    if (showList) {
        if (search.error) {
            statusError =
                "No se pudo completar la búsqueda. Inténtalo de nuevo en un momento.";
        } else if (search.loading && search.places.length === 0) {
            status = `Buscando «${search.query.trim()}»…`;
        } else if (search.places.length === 0) {
            status = `Sin resultados para «${search.query.trim()}».`;
        }
    }

    elements.status.hidden = !status;
    elements.status.textContent = status;
    elements.statusError.hidden = !statusError;
    elements.statusError.textContent = statusError;

    if (hasOptions) {
        elements.listbox.hidden = false;
        elements.listbox.innerHTML = search.places
            .map(
                (place, index) =>
                    `<li id="search-option-${index}" role="option" aria-selected="${
                        index === search.activeIndex
                    }" class="search-option${
                        index === search.activeIndex ? " search-optionActive" : ""
                    }" data-index="${index}">
                        <span class="search-optionName">${escapeHtml(place.name)}</span>
                        <span class="search-optionMeta">${escapeHtml(place.country)}</span>
                    </li>`
            )
            .join("");
    } else {
        elements.listbox.hidden = true;
        elements.listbox.innerHTML = "";
    }
}

function cancelSearchRequest() {
    state.search.request += 1;
    state.search.controller?.abort();
    state.search.controller = null;
}

function runSearch() {
    const query = state.search.query.trim();

    if (query.length < MIN_QUERY_LENGTH) {
        cancelSearchRequest();
        state.search.places = [];
        state.search.loading = false;
        state.search.error = null;
        renderSearch();
        return;
    }

    cancelSearchRequest();
    const controller = new AbortController();
    const request = state.search.request;
    state.search.controller = controller;
    state.search.loading = true;
    state.search.error = null;
    renderSearch();

    searchPlaces(query, { signal: controller.signal })
        .then((places) => {
            if (request !== state.search.request) return;
            state.search.places = places ?? [];
        })
        .catch((error) => {
            if (request !== state.search.request) return;
            if (error?.name === "AbortError") return;
            state.search.places = [];
            state.search.error = error;
        })
        .finally(() => {
            if (request !== state.search.request) return;
            state.search.loading = false;
            renderSearch();
        });
}

function scheduleSearch() {
    clearTimeout(state.search.timer);
    state.search.timer = setTimeout(runSearch, SEARCH_DEBOUNCE_MS);
}

function resetSearch() {
    clearTimeout(state.search.timer);
    cancelSearchRequest();
    state.search.query = "";
    state.search.places = [];
    state.search.loading = false;
    state.search.error = null;
    state.search.activeIndex = -1;
    state.search.open = false;
    renderSearch();
}

function selectSearchPlace(place) {
    state.place = place;
    writeStorage(STORAGE_PLACE, place);
    window.scrollTo({ top: 0, behavior: "smooth" });
    resetSearch();
    loadAll();
}

function handleSearchKeyDown(event) {
    const search = state.search;
    if (!showSearchList()) return;

    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            if (search.places.length === 0) return;
            search.activeIndex = (search.activeIndex + 1) % search.places.length;
            renderSearch();
            break;
        case "ArrowUp":
            event.preventDefault();
            if (search.places.length === 0) return;
            search.activeIndex =
                search.activeIndex <= 0 ? search.places.length - 1 : search.activeIndex - 1;
            renderSearch();
            break;
        case "Enter": {
            event.preventDefault();
            const index = search.activeIndex >= 0 ? search.activeIndex : 0;
            const place = search.places[index];
            if (place) selectSearchPlace(place);
            break;
        }
        case "Escape":
            event.preventDefault();
            search.activeIndex = -1;
            search.open = false;
            renderSearch();
            break;
        default:
            break;
    }
}

function toggleUnit() {
    state.unit = state.unit === "C" ? "F" : "C";
    writeStorage(STORAGE_UNIT, state.unit);
    renderNavbar();
    renderDynamic();
}

function requestGeolocation() {
    if (!navigator.geolocation) {
        state.geolocation.error = new Error("Tu navegador no soporta geolocalización.");
        renderGeoError();
        return;
    }

    state.geolocation.loading = true;
    state.geolocation.error = null;
    renderNavbar();
    renderGeoError();

    navigator.geolocation.getCurrentPosition(
        (position) => {
            state.geolocation.coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
            };
            state.geolocation.loading = false;
            renderNavbar();
            if (!state.place) loadAll();
        },
        (positionError) => {
            const message =
                GEOLOCATION_ERRORS[positionError.code] ?? "No se pudo obtener tu ubicación.";
            state.geolocation.error = new Error(message);
            state.geolocation.loading = false;
            renderNavbar();
            renderGeoError();
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
}

function getAnchorAndDir(origin, width, height) {
    const outside = 0.2;
    switch (origin) {
        case "top-left":
            return { anchor: [0, -outside * height], dir: [0, 1] };
        case "top-right":
            return { anchor: [width, -outside * height], dir: [0, 1] };
        case "left":
            return { anchor: [-outside * width, 0.5 * height], dir: [1, 0] };
        case "right":
            return { anchor: [(1 + outside) * width, 0.5 * height], dir: [-1, 0] };
        case "bottom-left":
            return { anchor: [0, (1 + outside) * height], dir: [0, -1] };
        case "bottom-center":
            return { anchor: [0.5 * width, (1 + outside) * height], dir: [0, -1] };
        case "bottom-right":
            return { anchor: [width, (1 + outside) * height], dir: [0, -1] };
        default:
            return { anchor: [0.5 * width, -outside * height], dir: [0, 1] };
    }
}

function hexToRgb(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return match
        ? [
              parseInt(match[1], 16) / 255,
              parseInt(match[2], 16) / 255,
              parseInt(match[3], 16) / 255,
          ]
        : [1, 1, 1];
}

function initLightRays(container) {
    if (!container) return;

    const canvas = document.createElement("canvas");
    const attributes = {
        alpha: true,
        depth: true,
        stencil: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "default",
    };
    const gl = canvas.getContext("webgl2", attributes) || canvas.getContext("webgl", attributes);
    if (!gl) return;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const vertexSource = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

    const fragmentSource = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;

    const compileShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn("WebGL shader error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn("WebGL program error:", gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
        iTime: gl.getUniformLocation(program, "iTime"),
        iResolution: gl.getUniformLocation(program, "iResolution"),
        rayPos: gl.getUniformLocation(program, "rayPos"),
        rayDir: gl.getUniformLocation(program, "rayDir"),
        raysColor: gl.getUniformLocation(program, "raysColor"),
        raysSpeed: gl.getUniformLocation(program, "raysSpeed"),
        lightSpread: gl.getUniformLocation(program, "lightSpread"),
        rayLength: gl.getUniformLocation(program, "rayLength"),
        pulsating: gl.getUniformLocation(program, "pulsating"),
        fadeDistance: gl.getUniformLocation(program, "fadeDistance"),
        saturation: gl.getUniformLocation(program, "saturation"),
        mousePos: gl.getUniformLocation(program, "mousePos"),
        mouseInfluence: gl.getUniformLocation(program, "mouseInfluence"),
        noiseAmount: gl.getUniformLocation(program, "noiseAmount"),
        distortion: gl.getUniformLocation(program, "distortion"),
    };

    const config = {
        raysOrigin: "top-center",
        raysColor: hexToRgb(RAYS_COLOR),
        raysSpeed: 1.2,
        lightSpread: 0.8,
        rayLength: 1.2,
        pulsating: false,
        fadeDistance: 1.0,
        saturation: 0.9,
        followMouse: true,
        mouseInfluence: 0.08,
        noiseAmount: 0.18,
        distortion: 0.03,
    };

    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    let width = 1;
    let height = 1;
    let animationId = null;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gl.uniform3fv(uniforms.raysColor, config.raysColor);
    gl.uniform1f(uniforms.raysSpeed, config.raysSpeed);
    gl.uniform1f(uniforms.lightSpread, config.lightSpread);
    gl.uniform1f(uniforms.rayLength, config.rayLength);
    gl.uniform1f(uniforms.pulsating, config.pulsating ? 1 : 0);
    gl.uniform1f(uniforms.fadeDistance, config.fadeDistance);
    gl.uniform1f(uniforms.saturation, config.saturation);
    gl.uniform1f(uniforms.mouseInfluence, config.mouseInfluence);
    gl.uniform1f(uniforms.noiseAmount, config.noiseAmount);
    gl.uniform1f(uniforms.distortion, config.distortion);

    const updatePlacement = () => {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const widthCss = container.clientWidth;
        const heightCss = container.clientHeight;
        width = widthCss * dpr;
        height = heightCss * dpr;
        canvas.width = Math.max(1, Math.round(width));
        canvas.height = Math.max(1, Math.round(height));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.iResolution, width, height);
        const { anchor, dir } = getAnchorAndDir(config.raysOrigin, width, height);
        gl.uniform2f(uniforms.rayPos, anchor[0], anchor[1]);
        gl.uniform2f(uniforms.rayDir, dir[0], dir[1]);
    };

    const draw = (time = 0) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1f(uniforms.iTime, time * 0.001);

        if (config.followMouse && config.mouseInfluence > 0) {
            const smoothing = 0.92;
            smoothMouse.x = smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
            smoothMouse.y = smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
            gl.uniform2f(uniforms.mousePos, smoothMouse.x, smoothMouse.y);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (time) => {
        try {
            draw(time);
            animationId = requestAnimationFrame(loop);
        } catch (error) {
            console.warn("WebGL rendering error:", error);
        }
    };

    const handleMouseMove = (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = (event.clientX - rect.left) / rect.width;
        mouse.y = (event.clientY - rect.top) / rect.height;
    };

    const startAnimation = () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (!reducedMotion) animationId = requestAnimationFrame(loop);
        else draw(0);
    };

    window.addEventListener("resize", updatePlacement);
    window.addEventListener("mousemove", handleMouseMove);
    updatePlacement();
    draw(0);
    startAnimation();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", (event) => {
        reducedMotion = event.matches;
        if (reducedMotion && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            draw(0);
        } else {
            startAnimation();
        }
    });
}

function renderShell(root) {
    root.innerHTML = `<div class="app-app">
        <div class="rays-canvas" aria-hidden="true"><div class="light-rays-container"></div></div>
        <div class="app-scrim" aria-hidden="true"></div>
        <header class="navbar-header">
            <nav class="navbar-pill" aria-label="Navegación principal">
                <a class="navbar-brand" href="#" aria-label="clima — inicio">
                    <span class="navbar-brandMark">Clima</span>
                    <span class="navbar-brandDegree" aria-hidden="true">°</span>
                </a>
                <div class="navbar-actions">
                    <button type="button" class="navbar-geo" aria-label="Usar mi ubicación">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2" />
                        </svg>
                    </button>
                    <button type="button" class="navbar-unitToggle" aria-label="Cambiar a F°">C°</button>
                </div>
            </nav>
        </header>
        <main class="app-main" id="contenido" tabindex="-1">
            <div class="home-page">
                <section class="home-hero" aria-labelledby="titulo-hero">
                    <h1 id="titulo-hero" class="home-heroTitle">El tiempo de <span class="home-heroAccent">cualquier lugar</span>.</h1>
                    <div class="home-toolbar">
                        <div class="search-root">
                            <label class="search-label" for="search-input">Buscar una ciudad o lugar</label>
                            <div class="search-field">
                                <input id="search-input" class="search-input" type="search" role="combobox" autocomplete="off" spellcheck="false" aria-autocomplete="list" aria-expanded="false" aria-controls="search-listbox" placeholder="p. ej. Madrid, Buenos Aires, Lisboa…" />
                                <span class="search-spinner" aria-hidden="true" hidden></span>
                                <button type="button" class="search-clear" aria-label="Limpiar la búsqueda" hidden>×</button>
                            </div>
                            <p id="search-status" class="search-status" role="status" hidden></p>
                            <p id="search-status-error" class="search-statusError" role="alert" hidden></p>
                            <ul id="search-listbox" role="listbox" class="search-listbox" hidden></ul>
                        </div>
                    </div>
                    <div id="hero-content"></div>
                </section>
                <div id="page-sections" style="display: contents"></div>
                <section class="home-statement">
                    <p>El tiempo cambia. Las coordenadas, no.</p>
                    <p>Clima&nbsp;° trae la previsión y los datos de cada lugar a tu pantalla.</p>
                </section>
            </div>
        </main>
        <footer class="footer-footer">
            <div class="footer-shell">
                <span class="footer-meta">clima&nbsp;° · MIT</span>
                <span class="footer-meta">Datos: Open-Meteo · CC BY 4.0</span>
            </div>
        </footer>
    </div>`;

    elements = {
        root,
        hero: root.querySelector("#hero-content"),
        sections: root.querySelector("#page-sections"),
        toolbar: root.querySelector(".home-toolbar"),
        geoButton: root.querySelector(".navbar-geo"),
        unitToggle: root.querySelector(".navbar-unitToggle"),
        searchInput: root.querySelector("#search-input"),
        spinner: root.querySelector(".search-spinner"),
        clearButton: root.querySelector(".search-clear"),
        status: root.querySelector("#search-status"),
        statusError: root.querySelector("#search-status-error"),
        listbox: root.querySelector("#search-listbox"),
        geoError: null,
    };
}

function bindEvents() {
    elements.geoButton.addEventListener("click", requestGeolocation);
    elements.unitToggle.addEventListener("click", toggleUnit);

    elements.searchInput.addEventListener("input", (event) => {
        state.search.query = event.target.value;
        state.search.open = true;
        state.search.activeIndex = -1;
        scheduleSearch();
        renderSearch();
    });
    elements.searchInput.addEventListener("focus", () => {
        state.search.open = true;
        renderSearch();
    });
    elements.searchInput.addEventListener("blur", () => {
        state.search.open = false;
        renderSearch();
    });
    elements.searchInput.addEventListener("keydown", handleSearchKeyDown);

    elements.clearButton.addEventListener("click", () => {
        elements.searchInput.focus();
        resetSearch();
    });

    elements.listbox.addEventListener("pointerdown", (event) => {
        const option = event.target.closest("[data-index]");
        if (!option) return;
        event.preventDefault();
        const place = state.search.places[Number(option.dataset.index)];
        if (place) selectSearchPlace(place);
    });

    elements.root.addEventListener("click", (event) => {
        if (event.target.closest('[data-action="retry-weather"]')) loadWeather();
    });
}

function startClock() {
    setInterval(() => {
        state.now = new Date();
        renderDynamic();
    }, 30000);
}

function init() {
    const root = document.getElementById("root");
    renderShell(root);
    bindEvents();
    renderNavbar();
    renderSearch();
    renderGeoError();
    renderDynamic();
    initLightRays(document.querySelector(".light-rays-container"));
    if (getActivePlace()) loadAll();
    startClock();
}

init();
