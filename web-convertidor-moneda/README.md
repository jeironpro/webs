# web-convertidor-moneda

Convertidor de monedas que obtiene las tasas de cambio en tiempo real desde una API publica y calcula la conversión entre dos divisas.

## Características

- Selección de la divisa de origen y de la divisa de destino mediante listas desplegables.
- Tasas de cambio actualizadas desde la API pública open.er-api.com (`/v6/latest`).
- Conversion calculada al pulsar el botón correspondiente.
- Resultado mostrado con el importe convertido.
- Interfaz en español con diseño responsive.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+).
- API externa: open.er-api.com para las tasas de cambio.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local.
3. Selecciona las monedas e indica el importe; la conversión usa las tasas más recientes de la API.

## Estructura del proyecto

```
web-convertidor-moneda/
├── index.html
├── css/                   # estilos de la interfaz
├── js/                    # lógica de conversión y consulta a la API
└── icon/                  # favicon
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
