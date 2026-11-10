# Web Codelang Quiz

Aplicación web estática de preguntas y respuestas sobre programación. Plantea problemáticas de código con opciones A/B/C/D categorizadas por **lenguaje**, **dificultad** y **tipo**.

Es frontend-only: los datos viven como ficheros JSON en `public/data/` y el progreso se guarda en `localStorage`.

## Características

- Opciones A/B/C/D con feedback tras responder: al acertar muestra los puntos ganados y la explicación; al fallar, la respuesta correcta y la explicación.
- Detener la partida cuando quieras: confirma con un modal y la puntuación acumulada hasta ese momento se guarda en el historial.
- Score por dificultad (fácil +1, media +2, difícil +3): acierto suma, fallo resta.
- Filtros por lenguaje, dificultad y tipo.
- Historial de partidas y score acumulado persistidos en `localStorage`, con modal informativo en la barra de navegación que explica qué se guarda y dónde.
- Sistema de diseño **Hum** (skill Hallmark): papel crema, acentos pera/cian/coral, sans redondeada.
- Ruta oculta `/captura/:lenguaje/:id/:ratio` para generar piezas de redes sociales.

## Stack

- HTML, CSS y JavaScript vanilla.
- Datos JSON en `public/data/`.
- `localStorage` para score e historial.

## Uso

Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

## Estructura

```text
web-codelang-quiz/
├── index.html
├── styles.css
├── app.js
├── DESIGN.md
└── public/
    └── data/       Catálogo JSON de preguntas
```

## Dataset: cómo añadir preguntas

Cada lenguaje tiene un fichero en `public/data/<lenguaje>.json` con un array de preguntas. Esquema de cada pregunta:

```json
{
  "id": "js-001",
  "dificultad": "facil",
  "tipo": "output",
  "pregunta": "¿Qué muestra por consola este código?",
  "codigo": "console.log(typeof null);",
  "opciones": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "respuesta": "B",
  "explicacion": "Por qué es esa la respuesta."
}
```

- `dificultad`: `facil`, `media` o `dificil`.
- `tipo`: `output`, `sintaxis`, `bug` o `concepto`.
- `opciones` siempre usa claves `A`, `B`, `C`, `D`.
- `respuesta` debe existir en `opciones`.

## Documentación de diseño

El sistema visual completo está documentado en [DESIGN.md](./DESIGN.md).

## Licencia

MIT
