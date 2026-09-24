# web-clima

Aplicación web del tiempo (SPA) que muestra el clima actual y el pronóstico de cualquier localización del mundo, con datos de la API abierta de Open-Meteo.

## Características

- Búsqueda de ciudades mediante el geocodificador de Open-Meteo.
- Uso de la ubicación del dispositivo (geolocalización).
- Clima actual: condición, sensación termica, viento, humedad, radiación UV, presión y visibilidad.
- Pronóstico horario (gráfica SVG) y pronóstico para los proximos días.
- Ficha de la ubicación: coordenadas, elevación, zona horaria, hora local y población.
- Conversor de unidades y persistencia de la última ubicación consultada.
- Diseño responsive y accesible, con fondo animado y soporte de `prefers-reduced-motion`.

## Tecnologías

- React + Vite como stack principal.
- CSS Modules con variables CSS (tokens de diseño).
- Vitest para los tests.
- Tipografías locales con @fontsource.
- Datos meteorologicos de Open-Meteo (geocoding, forecast y air quality).

## Instalación y desarrollo

```bash
npm install       # instala las dependencias
npm run dev       # servidor de desarrollo con HMR
npm run build     # genera la build de producción en dist/
npm run preview   # previsualiza la build de producción
npm run lint      # ejecuta ESLint
npm run test:run  # ejecuta los tests (Vitest)
npm run format    # formatea el código con Prettier
```

## Estructura del proyecto

```
web-clima/
├── index.html
├── vite.config.js
├── public/                # favicon, robots.txt
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/            # tokens y estilos globales
│   ├── pages/             # Home
│   ├── components/        # layout, ui y efectos
│   └── services/          # clientes de Open-Meteo
└── docs/                  # documentación del proyecto
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
