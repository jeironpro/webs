# web-pythoncises

Sitio web con ejercicios de Python para estudiantes de programacion y entusiastas del lenguaje. Cada ejercicio tiene su propia pagina: se puede ver el codigo, copiarlo al portapapeles y descargar el archivo `.py` original. Los programas interactivos incluyen ademas una salida de ejemplo capturada ejecutandolos de verdad.

## Descripcion

Este proyecto forma parte de un portafolio personal. Reune 32 ejercicios de Python organizados en nueve categorias: juegos, patrones, calculadoras, web y API, texto y cadenas, archivos y PDF, tiempo y habitos, vision por computador y correo.

El sitio usa el tema Hum de Hallmark (referencia visual hum-07): papel crema, tres acentos simultaneos (pera, cian y coral), tipografia redondeada Plus Jakarta Sans, botones con grosor fisico, movimiento suave al hacer scroll y una serpiente que reacciona al copiar. Es estatico: funciona abriendo `index.html` directamente en el navegador o alojado en GitHub Pages.

## Estructura

```
index.html                  landing: hero, metodo, cifras e indice
html/<slug>.html            una pagina por ejercicio (codigo, copiar, descargar, salida)
css/                        tokens del tema Hum y estilos
js/app.js                   interacciones: nav flotante, contadores, filtros, copiar
icons/                      favicons (SVG de la serpiente + PNGs)
data/salidas.json           transcripciones de la salida real de cada programa
script/build_site.py        genera el sitio a partir de las carpetas de ejercicios
exercises/<ejercicio>/      codigo fuente de cada ejercicio
```

## Regenerar el sitio

El codigo de los ejercicios vive en `exercises/`; las paginas HTML se generan con:

```bash
python3 script/build_site.py
```

Esto produce `index.html` y las paginas de `html/`. Si se anade un ejercicio nuevo hay que registrarlo en `CATEGORIAS` y `TITULOS` dentro de `script/build_site.py`.

Las salidas de ejemplo viven en `data/salidas.json` (un mapa de slug a transcripcion). Se capturaron ejecutando cada programa con entradas de ejemplo. Si el archivo no existe o falta un ejercicio, el sitio se genera igualmente, simplemente sin la seccion de salida para ese programa.

## Ejercicios

| # | Ejercicio | Carpeta |
|---|---|---|
| 01 | Adivina el numero | `exercises/adivina-numero/` |
| 02 | El ahorcado | `exercises/ahorcado/` |
| 03 | Piedra, papel o tijera | `exercises/piedra-papel-tijera/` |
| 04 | Dados aleatorios | `exercises/dados-aleatorios/` |
| 05 | Patron triangulo | `exercises/patron-triangulo/` |
| 06 | Patron triangulo invertido | `exercises/patron-triangulo-invertido/` |
| 07 | Patron rombo | `exercises/patron-rombo/` |
| 08 | Calculadora | `exercises/calculadora/` |
| 09 | Calculadora de IMC | `exercises/calculadora-indice-masa-corporal/` |
| 10 | Calculadora de propina | `exercises/calculadora-propina/` |
| 11 | Convertidor de moneda | `exercises/convertidor-moneda/` |
| 12 | Acortador de URLs | `exercises/corta-url/` |
| 13 | Generador de contrasenas | `exercises/generador-contraseñas/` |
| 14 | Generador de chistes | `exercises/generador-chiste-random/` |
| 15 | Historias divertidas | `exercises/historias-divertidas/` |
| 16 | Partes de un correo | `exercises/partes-correo/` |
| 17 | Markdown a HTML | `exercises/convertir-markdown-html/` |
| 18 | Combinar PDFs | `exercises/combinar-pdfs/` |
| 19 | Marca de agua | `exercises/marca-agua/` |
| 20 | OCR sobre PDF | `exercises/extraer-texto-pdf-ocr/` |
| 21 | Renombrador de archivos | `exercises/herramienta-renombra-archivo/` |
| 22 | Organizador de archivos | `exercises/organizador-archivos/` |
| 23 | Convertidor de videos | `exercises/convertir-videos/` |
| 24 | Cuenta atras | `exercises/cuenta-tiempo-atras/` |
| 25 | Pomodoro | `exercises/pomodoro/` |
| 26 | Reloj alarma | `exercises/reloj-alarma/` |
| 27 | Reloj digital | `exercises/reloj-digital/` |
| 28 | Rastreador de habitos | `exercises/rastreador-habitos-diarios/` |
| 29 | Lista de tareas | `exercises/lista-to-do/` |
| 30 | Detector de caras | `exercises/detector-cara-opencv/` |
| 31 | Reconocimiento facial | `exercises/sistema-reconocimiento-facial/` |
| 32 | Envio de correos desde CSV | `exercises/enviar-correo-csv/` |

## Licencia

Este proyecto esta bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para mas detalles.
