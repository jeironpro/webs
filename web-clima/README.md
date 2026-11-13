# web-clima

Aplicación web del tiempo (SPA) que muestra el clima actual y el pronóstico de cualquier localización del mundo, con datos de la API abierta de Open-Meteo.

## Características

- Búsqueda de ciudades mediante el geocodificador de Open-Meteo.
- Uso de la ubicación del dispositivo (geolocalización).
- Clima actual: condición, sensación térmica, viento, humedad, radiación UV, presión y visibilidad.
- Pronóstico horario (gráfica SVG) y pronóstico para los próximos días.
- Ficha de la ubicación: coordenadas, elevación, zona horaria, hora local y población.
- Conversor de unidades y persistencia de la última ubicación consultada.
- Diseño responsive y accesible, con fondo animado y soporte de `prefers-reduced-motion`.

## Stack

| Capa      | Tecnología                                                             |
| --------- | ---------------------------------------------------------------------- |
| Framework | HTML / CSS / JavaScript vanilla                                        |
| Build     | Ninguno (estático, sin bundler)                                        |
| Estilo    | CSS con variables y tokens de color                                    |
| Tests     | Vitest (raíz del repositorio)                                          |
| Datos     | Datos meteorologicos de Open-Meteo (geocoding, forecast y air quality) |

## Uso

Servir con cualquier servidor HTTP estático:

```bash
python3 -m http.server 8000
```

El lint, el formato y los tests se ejecutan desde la raíz del repositorio con
`npm run lint`, `npm run format:check` y `npm test`.

## Estructura del proyecto

```
web-clima/
├── index.html
├── assets/
│   ├── icons/favicon.svg     # Favicon
│   └── fonts/                # Variables de las fuentes locales
├── css/
│   └── styles.css            # Tokens y estilos globales
└── js/
    ├── app.js                # Render de la web y clientes de Open-Meteo
    └── consent.js            # Consentimiento y bloqueo del almacenamiento local
```

## Licencia

Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](../LICENSE) para más detalles.
