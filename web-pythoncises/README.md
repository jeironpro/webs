# web-pythoncises

Sitio web con 32 ejercicios de Python para estudiantes y entusiastas del
lenguaje. Cada ejercicio tiene su propia página: se puede ver el código,
copiarlo al portapapeles y descargar el archivo `.py` original. Los
programas interactivos incluyen además una salida de ejemplo capturada
ejecutándolos de verdad.

## Descripción

Este proyecto forma parte de un portafolio personal. Reúne 32 ejercicios
organizados en nueve categorías: juegos, patrones, calculadoras, web y
API, texto y cadenas, archivos y PDF, tiempo y hábitos, visión por
computador y correo.

El sitio usa el tema Hum de Hallmark: papel crema, tres acentos
simultáneos (pera, cian y coral), tipografía redondeada Plus Jakarta
Sans, botones con grosor físico, movimiento suave al hacer scroll y una
serpiente que reacciona al copiar. Es estático: funciona al abrirlo con
un servidor HTTP local o al alojarlo en GitHub Pages.

## Estructura

```text
index.html                  portada: hero, método, cifras e índice
html/<slug>.html            una página por ejercicio (código, copiar, descargar, salida)
css/tokens.css              tokens del tema Hum
css/styles.css              estilos del sitio
js/boot.js                  activa las mejoras progresivas
js/app.js                   navegación, contadores, filtros, copiar y descargar
assets/icons/               favicons (SVG de la serpiente + PNGs)
data/salidas.json           transcripciones de la salida real de cada programa
tools/build_site.py         genera el sitio desde las carpetas de ejercicios
exercises/<ejercicio>/      código fuente de cada ejercicio
```

## Regenerar el sitio

El código de los ejercicios vive en `exercises/`; las páginas HTML se
generan con:

```bash
python3 tools/build_site.py
```

Esto produce `index.html` y las páginas de `html/`. Si se añade un
ejercicio nuevo hay que registrarlo en `CATEGORIAS` y `TITULOS` dentro
de `tools/build_site.py`.

Las salidas de ejemplo viven en `data/salidas.json` (un mapa de slug a
transcripción). Se capturaron ejecutando cada programa con entradas de
ejemplo. Si el archivo no existe o falta un ejercicio, el sitio se
genera igualmente, simplemente sin la sección de salida para ese
programa.

## Ejercicios

| #   | Ejercicio                  | Carpeta                                       |
| --- | -------------------------- | --------------------------------------------- |
| 01  | Adivina el número          | `exercises/adivina-numero/`                   |
| 02  | El ahorcado                | `exercises/ahorcado/`                         |
| 03  | Piedra, papel o tijera     | `exercises/piedra-papel-tijera/`              |
| 04  | Dados aleatorios           | `exercises/dados-aleatorios/`                 |
| 05  | Patrón triángulo           | `exercises/patron-triangulo/`                 |
| 06  | Patrón triángulo invertido | `exercises/patron-triangulo-invertido/`       |
| 07  | Patrón rombo               | `exercises/patron-rombo/`                     |
| 08  | Calculadora                | `exercises/calculadora/`                      |
| 09  | Calculadora de IMC         | `exercises/calculadora-indice-masa-corporal/` |
| 10  | Calculadora de propina     | `exercises/calculadora-propina/`              |
| 11  | Convertidor de moneda      | `exercises/convertidor-moneda/`               |
| 12  | Acortador de URLs          | `exercises/corta-url/`                        |
| 13  | Generador de contraseñas   | `exercises/generador-contraseñas/`            |
| 14  | Generador de chistes       | `exercises/generador-chiste-random/`          |
| 15  | Historias divertidas       | `exercises/historias-divertidas/`             |
| 16  | Partes de un correo        | `exercises/partes-correo/`                    |
| 17  | Markdown a HTML            | `exercises/convertir-markdown-html/`          |
| 18  | Combinar PDFs              | `exercises/combinar-pdfs/`                    |
| 19  | Marca de agua              | `exercises/marca-agua/`                       |
| 20  | OCR sobre PDF              | `exercises/extraer-texto-pdf-ocr/`            |
| 21  | Renombrador de archivos    | `exercises/herramienta-renombra-archivo/`     |
| 22  | Organizador de archivos    | `exercises/organizador-archivos/`             |
| 23  | Convertidor de vídeos      | `exercises/convertir-videos/`                 |
| 24  | Cuenta atrás               | `exercises/cuenta-tiempo-atras/`              |
| 25  | Pomodoro                   | `exercises/pomodoro/`                         |
| 26  | Reloj alarma               | `exercises/reloj-alarma/`                     |
| 27  | Reloj digital              | `exercises/reloj-digital/`                    |
| 28  | Rastreador de hábitos      | `exercises/rastreador-habitos-diarios/`       |
| 29  | Lista de tareas            | `exercises/lista-to-do/`                      |
| 30  | Detector de caras          | `exercises/detector-cara-opencv/`             |
| 31  | Reconocimiento facial      | `exercises/sistema-reconocimiento-facial/`    |
| 32  | Envío de correos desde CSV | `exercises/enviar-correo-csv/`                |

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo
[LICENSE](../LICENSE) para más detalles.
