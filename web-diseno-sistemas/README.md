# A Escala

Curso interactivo de diseño de sistemas en español. Recorre 40 lecciones organizadas en 9 módulos, desde cómo viaja una petición hasta el diseño de un chat, un feed o un acortador de URLs. Incluye un laboratorio de capacidad, una chuleta de repaso y un checkpoint con feedback.

## Qué incluye

- **9 módulos y 40 lecciones:** fundamentos, escalado, datos, comunicación, fiabilidad, arquitectura, seguridad, despliegue y sistemas completos.
- **239 pasos de lección:** cada lección combina escenario, mecanismo, trade-off, fallo y decisión, con una idea clave y objetivos de aprendizaje. Las lecciones más complejas añaden casos y cálculos explícitos.
- **Laboratorio de escala:** tráfico, acierto de caché, regiones y configuración de base de datos modifican p95, capacidad, desglose y diagnóstico.
- **Chuleta del curso:** las tres palancas clásicas (cachear, replicar, partir) y 27 ideas de bolsillo, tres por módulo.
- **Checkpoint de seis preguntas:** feedback inmediato, una explicación después de cada respuesta y una barra de progreso propia (`0/6`) separada del progreso de las 40 lecciones.
- **Progreso local:** una lección se completa cuando se visitan todos sus pasos. El total de lecciones es `0/40` y cada módulo muestra sus lecciones completadas; el checkpoint mantiene su propio contador acumulado.

## Cómo abrirla

No necesita build. Desde la raíz del monorepo:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
# → http://127.0.0.1:8000/web-diseno-sistemas/
```

## Dirección visual

Un shell de curso sobre papel crema: barra superior, índice lateral, hoja central y panel de paso. JetBrains Mono para la interfaz y titulares, DM Sans para los párrafos, bordes finos, badges pastel y controles de píldora. La estructura sigue la referencia de _System Design_ de Dilum Sanjaya, con contenido propio y una capa de respuesta móvil que convierte el índice en un drawer.

## Estructura

```text
web-diseno-sistemas/
├── assets/icons/favicon.svg
├── css/styles.css
├── index.html
├── js/
│   ├── app.js
│   ├── data.js
│   ├── scenes.js
│   ├── simulator.js
│   └── course/
│       ├── index.js
│       ├── extras.js
│       ├── foundations.js
│       ├── scaling.js
│       ├── storage.js
│       ├── communication.js
│       ├── reliability.js
│       ├── architecture.js
│       ├── security.js
│       ├── shipping.js
│       └── systems.js
└── README.md
```

`js/course/` contiene las lecciones por módulo; `js/course/index.js` las ensambla y añade la chuleta. `js/app.js` conecta el curso con la interfaz, el progreso y la navegación. `js/scenes.js` dibuja una topología distinta para colas, clústeres, despliegues, seguridad, feeds, chat y latencia, y la reconstruye en cada paso. `js/simulator.js` concentra el modelo determinista del laboratorio.

## Comprobaciones

```sh
npx eslint web-diseno-sistemas
npx prettier --check web-diseno-sistemas
npm run links:check
npm run capturas:check
```

La web es responsive, usa foco visible, controles nativos y respeta `prefers-reduced-motion`. El modelo del laboratorio es didáctico: no pretende dimensionar una infraestructura real.
