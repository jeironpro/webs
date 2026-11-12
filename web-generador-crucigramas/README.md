# web-generador-crucigramas

Generador de patrones de crucigramas que crea y descarga 100 plantillas de cuadrícula desde el navegador.

## Características

- Generación de 100 patrones distintos de 13×13 con 25 casillas negras.
- Simetría central (rotación de 180°) y comprobación de que todas las casillas blancas estén conectadas.
- Sin casillas blancas aisladas ni secuencias blancas de más de 10 casillas.
- Descarga de los patrones como `crosswords.json`, con la estructura `{ id, board }`.
- Generación local: no se envían datos a ningún servidor.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+), sin librerías externas.
- Fuentes de Google Fonts.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local.
3. Pulsa el botón para generar y descargar los 100 patrones.

## Estructura del proyecto

```
web-generador-crucigramas/
├── index.html
├── css/                   # estilos del generador
├── js/generator.js        # generación y validación de patrones
└── icon/                  # favicon
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](../LICENSE) para más detalles.
