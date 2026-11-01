# Juego de carreras: investigación, arquitectura y hoja de ruta

Documento de diseño técnico de `juego-carreras`, el circuito arcade del monorepo. Resume la
investigación previa (octubre de 2026), fija las decisiones de stack y descompone la
implementación en pull requests independientes.

## 1. Objetivo

Un juego de carreras 3D jugable en el navegador, servido como página estática desde su
subdirectorio `juego-carreras/` (igual que el resto del catálogo), con:

- renderizado en **WebGPU** mediante `WebGPURenderer` de Three.js y caída automática a WebGL 2;
- **núcleo de simulación en WebAssembly** (circuito procedural determinista, física del coche y
  decisiones de los rivales);
- interfaz, menú, controles y lógica de carrera en **HTML, CSS y JavaScript** sin frameworks ni
  paso de compilación para la parte web.

## 2. Investigación

### 2.1 WebGPU en navegadores

WebGPU es una tecnología madura pero no universal, así que el juego **no puede apoyarse en ella
como único camino**. Estado a fecha de este documento:

| Motor                 | Escritorio                                                        | Móvil                        |
| --------------------- | ----------------------------------------------------------------- | ---------------------------- |
| Chrome / Edge / Opera | Completo desde Chrome 113; Linux desde 144 (Intel) y 147 (NVIDIA) | Android 12+ desde Chrome 121 |
| Firefox               | 141 (Windows), 145 (macOS 26+), 147 (macOS Apple Silicon)         | Tras flag                    |
| Safari                | 26 (macOS 26 Tahoe)                                               | iOS / iPadOS / visionOS 26   |
| Servo                 | En desarrollo (`dom.webgpu.enabled`)                              | —                            |

Cobertura global de caniuse: **~87 %** (85,8 % de soporte completo más soporte parcial).
Conclusión: se usa WebGPU como camino principal y se mantiene un fallback real, no un mensaje de
error.

Fuentes: [Implementation Status (W3C GPU for the Web)](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status),
[caniuse.com/webgpu](https://caniuse.com/webgpu),
[web.dev: WebGPU en los principales navegadores](https://web.dev/blog/webgpu-supported-major-browsers).

### 2.2 Motor 3D: Three.js

- Versión fijada: **three 0.187.0** (`r187`). Entradas relevantes: `three/webgpu`
  (`build/three.webgpu.js`) y `three/tsl` (Three Shading Language).
- `WebGPURenderer` **intenta WebGPU y cae a WebGL 2 automáticamente** (`getFallback` interno,
  opción `forceWebGL`). No hay que mantener dos rutas de render.
- `renderer.init()` es asíncrono: la pantalla de carga espera a la inicialización real del backend.
- La detección previa fiable es `three/addons/capabilities/WebGPU.js` (`isAvailable()` comprueba
  `navigator.gpu.requestAdapter()`), que a su vez permite mostrar al jugador qué backend se usa.
- TSL compila a WGSL y a GLSL ES 3.0; `ShaderMaterial` y `onBeforeCompile` **no** funcionan en
  WebGPU, por lo que el juego se limita a materiales de nodo estándar y a efectos por vértice
  declarativos.
- Rendimiento: WebGPU no es automáticamente más rápido. Con muchos objetos individuales puede ir
  peor que WebGL, así que el decorado usa **`InstancedMesh`** desde el primer día y el presupuesto
  de draw calls se vigila con `renderer.info`.

Descartado **Babylon.js** (9.x, también WebGPU con `WebGPUEngine`): su ventaja aquí —snapshot
rendering para escenas estáticas— no compensa el peso del bundle tree-shakeado ni la necesidad de
un bundler para aprovecharlo, y el repositorio sirve páginas estáticas sin build. Three.js cubre
escena, luces, instancing, sombras y HUD 3D con un único import map local.

Fuentes: [WebGPURenderer](https://threejs.org/docs/pages/WebGPURenderer.html),
[WebGPU helper](https://threejs.org/docs/pages/WebGPU.html),
[docs ES6 de Babylon.js](https://doc.babylonjs.com/setup/frameworkPackages/es6Support).

### 2.3 WebAssembly: AssemblyScript

- **AssemblyScript 0.28.x** compila TypeScript-like a WASM con `asc`, distribuido por npm: no
  requiere toolchain del sistema (Rust, Emscripten) y encaja con un repositorio Node 24.
- Se descarta Rust + wasm-pack y Emscripten: ninguno de los dos está instalado y ambos añaden una
  cadena de compilación pesada para un módulo de simulación pequeño.
- Regla de oro del boundary: **un único `Float32Array` en memoria lineal wasm** por frame, con
  funciones `void step(dt)` y lecturas por índices; nunca objetos JS por frame.
- La física del vehículo ya vive en JS o WASM, no se duplica: se elige WASM porque el circuito
  (miles de muestras de spline), la proyección del coche sobre la pista y la IA de los rivales son
  el bucle caliente y deben ser deterministas (misma semilla, misma carrera).

Fuentes: [assemblyscript.org](https://www.assemblyscript.org/),
[wasm-pack](https://rustwasm.github.io/docs/wasm-pack/).

### 2.4 Física arcade de vehículo

No se simula un coche realista con rigid bodies y joints. El modelo es el clásico **raycast
vehicle**: un cuerpo para el chasis y ruedas resueltas como rayos con muelle de suspensión. Para
una pista procedural con peralte y elevación se simplifica a:

- proyección del coche sobre la línea central (posición `s` a lo largo del circuito y desvío
  lateral) mediante búsqueda local sobre las muestras;
- longitud: fuerza de motor, arrastre cuadrático, resistencia a la rodadura y freno;
- lateral: grip que cae con la velocidad y con el freno de mano, generando derrape controlable;
- altura y orientación tomadas de la pista, con suspensión visual en las ruedas.

Este modelo es el mismo enfoque que recomienda la documentación de Rapier para vehículos arcade,
sin añadir un motor de física completo.

Fuente: [Rapier · vehicle controller](https://rapier.rs/docs/user_guides/javascript/vehicle_controller/).

## 3. Arquitectura

Tres capas con fronteras explícitas:

```
┌──────────────────────────────────────────────────────────────┐
│ interfaz (DOM/CSS)   menú · HUD · marcador · controles        │
│   js/interfaz/*.js   → lee estado, emite acciones             │
├──────────────────────────────────────────────────────────────┤
│ lógica + render (JS)  escena, cámara, materiales, carrera     │
│   js/juego/*.js       → consume el núcleo wasm y dibuja       │
├──────────────────────────────────────────────────────────────┤
│ núcleo de simulación (WebAssembly)                            │
│   wasm/nucleo.ts → wasm/nucleo.wasm                           │
│   circuito · proyección · física · IA · vueltas               │
└──────────────────────────────────────────────────────────────┘
```

Flujo de un frame:

1. `controles` produce un input normalizado (acelerar, frenar, girar, derrape).
2. `nucleo.step(dt, input)` avanza coche, rivales y cronometraje; escribe el estado en memoria
   lineal wasm.
3. `escena` lee ese estado (posiciones, giros, RPM) y actualiza mallas, cámara y luces.
4. `interfaz` refresca velocímetro, vuelta, posición y minimapa a 10 Hz, no cada frame.
5. `WebGPURenderer` dibuja.

### Estructura de archivos

```
juego-carreras/
├── index.html
├── css/
│   ├── tokens.css          # identidad arcade-neon compartida con docs/style-guide.md
│   └── estilos.css         # layout, menú, HUD, controles táctiles
├── js/
│   ├── app.js              # arranque y bucle principal
│   ├── juego/              # escena, pista, coche, rivales, carrera, camara
│   └── interfaz/           # menu, hud, controles, audio, marcador
├── wasm/
│   ├── nucleo.ts           # fuente AssemblyScript
│   └── nucleo.wasm         # binario compilado y versionado
├── scripts/build-wasm.mjs  # npm run build:wasm
└── vendor/three/           # three 0.187.0 (core, webgpu, tsl) + LICENSE
```

El juego se sirve sin bundler: `index.html` carga `js/app.js` como módulo y usa un **import map**
que resuelve `three/webgpu` y `three/tsl` contra `vendor/three/` (las importaciones relativas internas
las resuelve el propio build de Three.js). El WASM se instancia con
`WebAssembly.instantiateStreaming`, con caída a `arrayBuffer`, y JS lee su memoria lineal.

## 4. Modelo de juego

- **Circuito procedural determinista**: semilla → puntos de control → spline Catmull-Rom
  muestreada por longitud de arco. Ancho, peralte, elevación y decorado derivan de la misma
  semilla, así que el mismo número de circuito produce siempre la misma pista.
- **Carrera**: 3 vueltas, 3 rivales con línea de carrera, velocidad objetivo por curvatura y
  _rubber-banding_ suave; dificultad fácil / normal / difícil.
- **Dirección con radio de giro**: el volante gira el morro a una tasa que baja con la velocidad
  (`~34 m/s²` de agarre lateral), así que el coche no trompea en recta ni se queda sin girar en las
  curvas lentas. Sin volante mantiene el rumbo: el jugador traza, el coche no se conduce solo.
- **Salidas de pista**: la hierba suma arrastre y la valla roza (pierde punta y empuja de vuelta)
  sin recolocar el morro ni detener el coche.
- **Vueltas**: el progreso se mide proyectando el coche sobre la muestra más cercana y cruzando la
  meta al pasar de 0,7 a 0,3; el cronómetro y la mejor vuelta viven en el núcleo wasm.
- **Puntuación**: tiempo total, mejor vuelta, choques y adelantamientos; mejor marca por circuito
  en `localStorage`.
- **Controles**: WASD o flechas, espacio para derrape, `P` pausa, `R` reinicio; gamepad estándar y
  botones en pantalla para táctil.

## 5. Rendimiento y degradación

- `InstancedMesh` para árboles, vallas, farolas y gradas; malla de pista única por segmento.
- Escala de resolución dinámica (0,6–1,0) según el tiempo de frame, ajustable en opciones.
- Sombras: una luz direccional con mapa contenido; sin sombras en calidad baja.
- `prefers-reduced-motion` reduce el temblor de cámara y las animaciones de la interfaz.
- Sin WebGPU → WebGL 2 con las mismas escenas; sin WebGL → aviso claro con opciones de
  accesibilidad en texto.

## 6. Accesibilidad

- Menú y HUD con elementos nativos (`button`, `input`, `select`), foco visible y etiquetas
  `aria-live` para cuenta atrás, vuelta y resultado.
- Contraste mínimo 4,5:1 y tipografía del sistema de diseño (`tokens`: Space Grotesk, Inter,
  JetBrains Mono).
- Alternativa de teclado completa; los controles táctiles aparecen solo en punteros gruesos.

## 7. Hoja de ruta de pull requests

Cada pieza llega en su propia rama y su propia pull request, con `npm test`, `npm run lint` y
`npm run format:check` en verde antes del merge.

| #   | Rama                              | Alcance                                                                                                                                             |
| --- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `docs/juego-carreras-plan`        | Este documento: investigación, arquitectura y hoja de ruta                                                                                          |
| 2   | `feature/juego-carreras-motor`    | Andamiaje del juego, three.js vendorizado, `WebGPURenderer` con fallback, escena, pista, coche, cámara y registro en el catálogo (estado pendiente) |
| 3   | `feature/juego-carreras-wasm`     | Núcleo AssemblyScript: PRNG, circuito por spline, proyección sobre la pista, compilación y carga                                                    |
| 4   | `feature/juego-carreras-fisica`   | Física del coche en WASM, rivales con línea de carrera, colisiones, vueltas y cronometraje                                                          |
| 5   | `feature/juego-carreras-interfaz` | Menú, HUD, minimapa, cuenta atrás, pausa, resultados, audio, táctil y gamepad                                                                       |
| 6   | `feature/juego-carreras-catalogo` | Captura final, ficha `live` y destacada, README del juego y sincronización de datos                                                                 |

## 8. Riesgos

| Riesgo                                     | Mitigación                                                        |
| ------------------------------------------ | ----------------------------------------------------------------- |
| WebGPU ausente o bloqueado en el equipo    | Fallback WebGL 2 y aviso de backend en el menú de opciones        |
| Capturas del catálogo en Chrome headless   | Pantalla de carga y HUD en DOM, visibles sin contexto GPU         |
| Boundary JS↔WASM por frame                 | Un `Float32Array` compartido y lecturas por índice                |
| Bundle de three.js (~3,9 MB sin comprimir) | Vendorizado local con versión fijada; carga diferida tras el menú |
