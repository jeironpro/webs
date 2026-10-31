# juego-carreras

Racer arcade 3D **Circuito Neón**: un circuito procedural, coches con derrape y cámaras de
persecución renderizados con Three.js sobre **WebGPU**, con un núcleo de simulación en
**WebAssembly**.

## Características

- Circuito cerrado generado a partir de una semilla: el mismo número produce siempre el mismo
  trazado, con elevación, peralte y bordillos neón.
- Renderizado con `WebGPURenderer` (Three.js `r187`); si la GPU o el navegador no exponen WebGPU,
  el motor cae a WebGL 2 sin cambiar la escena.
- Escena nocturna con sombras, niebla, luna, estrellas y perfil urbano instanciado con
  `InstancedMesh`.
- Cámara de persecución suavizada y órbita cinematográfica en el menú.
- HUD de velocidad y vuelta, control por teclado y aviso claro quando no hay contexto gráfico.

## Tecnologías

- WebGPU para hablar con la GPU del equipo; `WebGPURenderer` de Three.js como capa de escena,
  cámara, materiales y sombras.
- WebAssembly (AssemblyScript) para el núcleo de simulación determinista: PRNG, spline
  Catmull-Rom, remuestreo por longitud de arco, tangentes, peralte y proyección sobre la pista.
- HTML, CSS y JavaScript para la interfaz, el menú y el HUD, sin frameworks ni paso de compilación.

## Uso

Sirve la carpeta con un servidor estático (el módulo ES y el `import map` no funcionan desde
`file://`):

```sh
cd juego-carreras
python3 -m http.server 8080
```

Abre `http://localhost:8080/`. No requiere instalación: Three.js viaja vendorizado en
`vendor/three/` con su versión fijada y su licencia MIT.

## Núcleo WebAssembly

El trazado lo genera `wasm/nucleo.ts` (AssemblyScript) y se versiona compilado en
`wasm/nucleo.wasm`: para jugar no hace falta toolchain ni compilación en el navegador. Para cambiar el
núcleo:

```sh
cd juego-carreras
npm install
npm run build:wasm
```

`build:wasm` compila con `asc` y valida el binario antes de darlo por bueno: total de muestras,
equidistancia por longitud de arco, determinismo con la misma semilla, cambio de trazado con otra
semilla y proyección de un punto sobre la pista.

El módulo expone **un único bloque `Float32Array`** (10 floats por muestra: posición, tangente,
lateral y peralte) sobre su memoria lineal. La capa JS lo lee por índice, sin copiar objetos en
cada frame.

## Controles

| Acción   | Teclado            |
| -------- | ------------------ |
| Acelerar | `W` o `↑`          |
| Frenar   | `S` o `↓`          |
| Girar    | `A` / `D` o `←` / `→` |
| Derrape  | `Espacio` o `Shift` |
| Pausa    | `P` o `Esc`        |
| Reinicio | `R`                |

## Estructura del proyecto

```
juego-carreras/
├── index.html            # import map de three.js y estructura de menú/HUD
├── css/                  # tokens compartidos con el catálogo y estilos del juego
├── js/
│   ├── app.js            # arranque y bucle principal
│   ├── juego/            # renderizador, escena, circuito, coche, cámara, entrada y núcleo wasm
│   └── interfaz/         # HUD y, más adelante, menú, marcador y audio
├── wasm/
│   ├── nucleo.ts         # fuente AssemblyScript
│   └── nucleo.wasm       # binario compilado y versionado
├── scripts/              # compilación y validación del núcleo wasm
├── icon/                 # favicon
└── vendor/three/         # Three.js 0.187.0 (core, webgpu, tsl) + licencia
```

## Rendimiento

- Decorado instanciado para mantener bajo el número de draw calls, el punto débil de WebGPU con
  muchos objetos individuales.
- Sombras con un único mapa direccional y `pixelRatio` limitado a 2.
- El backend activo se muestra en el menú: WebGPU cuando está disponible, WebGL 2 en caso
  contrario.

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](../LICENSE) para más detalles.
