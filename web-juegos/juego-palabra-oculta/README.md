# juego-palabra-oculta

Juego de adivinanza de palabras en la línea de Wordle: hay que descubrir la palabra oculta de cinco letras en un máximo de seis intentos.

## Características

- Tablero de 6 intentos por 5 letras con la palabra oculta seleccionada al azar.
- Teclado en pantalla y entrada por teclado físico.
- Comprobación de cada intento con retroalimentación visual letra a letra.
- Mensajes de estado que guian al jugador durante la partida.
- Banco de palabras cargado desde `json/palabras_ocultas.json`.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+), sin dependencias externas.
- Datos de palabras en formato JSON.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local.

No requiere instalación ni compilación.

## Estructura del proyecto

```
juego-palabra-oculta/
├── index.html
├── css/                   # estilos del tablero y el teclado
├── js/                    # lógica del juego
├── json/                  # banco de palabras
└── icon/                  # favicon
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
