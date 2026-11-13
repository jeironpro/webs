# web-conversor-universal

Conversor de unidades en el navegador que permite convertir valores entre más de 130 unidades agrupadas en 14 categorías, con resultados en tiempo real.

## Características

- 14 categorías: consumo de combustible, energía, frecuencia, longitud, masa, presión, tamaño de datos, tasa de transmisión de datos, temperatura, tiempo, velocidad, volumen, ángulo plano y área.
- Menú lateral para elegir la categoría y listas desplegables para la unidad de origen y destino.
- Conversión automática mientras se escribe, sin recargar la página.
- Resultado formateado con dos decimales y separador de miles.
- Datos declarativos: cada unidad define su factor sobre la unidad base de su categoría.

## Tecnologías

- HTML5 semántico.
- CSS3 con custom properties, mobile-first y nomenclatura BEM.
- JavaScript como módulos ES nativos, sin dependencias de ejecución.
- Tipografía Montserrat de Google Fonts.

## Uso

1. Clona el repositorio.
2. Sirve la carpeta con un servidor estático local:

```bash
python3 -m http.server 8000
```

3. Abre `http://localhost:8000/web-conversor-universal/`.

Los módulos ES requieren abrir la página mediante HTTP, no con `file://`.

## Estructura

```
web-conversor-universal/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── data.js
└── assets/
    └── icons/
        ├── conversion.png
        └── favicon.svg
```

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
