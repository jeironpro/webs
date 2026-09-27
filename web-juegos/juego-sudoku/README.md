# juego-sudoku

Juego de Sudoku clásico de 9x9 en el navegador: completa cada tablero sin repetir números en filas, columnas ni regiones.

## Características

- Tableros de 9x9 cargados desde `json/sudokus.json` y elegidos al azar.
- Selección de casilla con el ratón o el teclado y entrada de números con el teclado numerico en pantalla.
- Resaltado de la casilla activa para facilitar la lectura de la fila, la columna y la region.
- Comprobación de victoria al completar el tablero correctamente, con modal de felicitación.
- Botón de reinicio para volver a empezar el mismo tablero.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+), sin dependencias externas.
- Tableros de juego en formato JSON.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local.

No requiere instalación ni compilación.

## Estructura del proyecto

```
juego-sudoku/
├── index.html
├── css/                   # estilos del tablero
├── js/                    # lógica del juego
├── json/                  # tableros de sudoku
└── icon/                  # favicon
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
