# juego-7-letras

Juego de palabras tipo puzzle en el que cada ronda propone una letra central y seis letras a su alrededor, dispuestas en forma de panal. El objetivo es encontrar todas las palabras válidas que se pueden formar con ellas.

## Características

- Rondas aleatorias: cada partida elige al azar un bloque de palabras desde `json/siete_letras.json`.
- Tablero en panal (colmena) con una letra central y seis letras laterales.
- Reglas clásicas: la palabra debe tener al menos 3 letras, incluir la letra del centro y existir en el listado de la ronda.
- Botones Borrar, Cambiar (baraja las letras laterales) y Aplicar (valida la palabra formada).
- Retroalimentación inmediata con mensajes de acierto, aviso y error.
- Contador de progreso PA/TP (palabras acertadas / total de la ronda) y listado de palabras encontradas.

## Tecnologías

- HTML5, CSS3 y JavaScript (ES6+), sin dependencias externas.
- Datos del juego en formato JSON.
- Tipografías e iconos de Google Fonts.

## Uso

1. Clona el repositorio.
2. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático local (por ejemplo, `python -m http.server`).

No requiere instalación ni compilación.

## Estructura del proyecto

```
juego-7-letras/
├── index.html
├── css/                   # estilos del tablero en panal
├── js/                    # lógica del juego
├── json/                  # bloques de palabras de cada ronda
└── icon/                  # favicon
```

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
