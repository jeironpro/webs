# web-convertidor-moneda

Convertidor de monedas que obtiene las tasas de cambio desde una API pública y calcula la conversión entre dos divisas.

## Características

- Selección de la divisa de origen y de destino mediante listas desplegables.
- Tasas de cambio desde la API pública `open.er-api.com` (`/v6/latest`).
- Conversión al pulsar el botón correspondiente.
- Intercambio rápido de las divisas seleccionadas.
- Resultado con el importe convertido y manejo de errores de red.
- Interfaz responsive en español.

## Tecnologías

- HTML5 semántico.
- CSS3 con custom properties, mobile-first y nomenclatura BEM.
- JavaScript como módulo ES nativo.
- API externa: `open.er-api.com`.

## Uso

1. Clona el repositorio.
2. Sirve la carpeta con un servidor estático local:

```bash
python3 -m http.server 8000
```

3. Abre `http://localhost:8000/web-convertidor-moneda/`.

Los módulos ES requieren abrir la página mediante HTTP, no con `file://`.

## Estructura

```
web-convertidor-moneda/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
