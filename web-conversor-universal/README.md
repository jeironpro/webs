# web-conversor-universal

Conversor de unidades en el navegador que permite convertir valores entre más de 130 unidades agrupadas en 14 categorías, con resultados en tiempo real.

## Características

- 14 categorías disponibles: consumo de combustible, energía, frecuencia, longitud, masa, presión, tamaño de datos, tasa de transmisión de datos, temperatura, tiempo, velocidad, volumen, ángulo plano y área.
- Menú lateral para elegir la categoría y dos listas desplegables para la unidad de origen y la de destino.
- Conversion automática mientras se escribe el valor, sin recargar la página.
- Resultado formateado con dos decimales y separador de miles.
- Datos de conversión declarativos: cada unidad define su factor sobre la unidad base de la categoría.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+), sin dependencias externas.
- Tipografia Montserrat (Google Fonts).

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o usa un servidor estático local (por ejemplo, `python -m http.server`).

No requiere instalación ni compilación.

## Estructura del proyecto

```
web-conversor-universal/
├── index.html
├── css/                   # estilos de la interfaz
├── js/                    # unidades y lógica de conversión
└── icon/                  # favicon y logo
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
