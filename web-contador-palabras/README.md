# Contador de palabras

## Descripción

Aplicación web que cuenta **palabras, caracteres y caracteres sin espacios** en el texto que escribes, pegas o subes desde un archivo. Las métricas se actualizan al instante mientras escribes.

Este proyecto forma parte del portafolio personal y demuestra buenas prácticas de programación, organización y documentación en GitHub. Se construye con **HTML, CSS y JavaScript Vanilla** (sin frameworks ni dependencias), siguiendo una arquitectura de módulos ES6.

## Requisitos

- Un navegador web moderno (Chrome, Firefox, Safari, Edge).
- Opcional: Node.js >= 18 o Python 3 para servir el proyecto en local.

## Instalación y ejecución

El proyecto usa **ES Modules**, por lo que no puede abrirse con doble clic sobre `index.html` (`file://`). Hay que servirlo por HTTP.

Con Python:

```bash
python3 -m http.server
```

Con Node (usando `npx serve` o similar):

```bash
npx serve
```

Después abre `http://localhost:8000` (o el puerto que indique la herramienta) en tu navegador.

## Uso

1. **Escribe o pega** tu texto en el área principal: el conteo se actualiza en vivo.
2. **Sube un archivo** de texto plano (`.txt`, `.md`, `.html`, `.csv`, …) soltándolo en la zona de subida o pulsando para elegirlo.
3. Las tres métricas se muestran bajo el texto: **palabras · caracteres · caracteres sin espacios**.
4. Usa **Copiar** para guardar el resumen, **Limpiar** para vaciar el área o **Ejemplo** para probar con texto de muestra.

Todo se procesa en el navegador: **no se envía nada a ningún servidor**.

## Estructura del proyecto

```
.
├── index.html          # Página principal (estructura semántica)
├── css/
│   ├── tokens.css      # Libro de estilo en custom properties
│   ├── reset.css       # Reseteo mínimo
│   ├── style.css       # Entrada: base + sistema de control
│   ├── components/     # Componentes (área de texto, métricas, subida)
│   └── pages/          # Layout de la página
├── js/
│   ├── app.js          # Punto de entrada (ES Modules)
│   ├── modules/        # Lógica de conteo y de subida de archivos
│   └── utils/          # Utilidades (DOM)
├── assets/
│   └── favicon.svg
└── docs/               # Documentación técnica
```

## Documentación

- [Arquitectura](docs/architecture.md)
- [Funcionamiento](docs/funcionamiento.md)
- [Infraestructura](docs/infraestructura.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Flujos y mapa de navegación](docs/flujos.md)
- [Wireframes](docs/wireframes.md)
- [Diseño UI/UX y libro de estilo](docs/diseno-ui-ux.md)
- [Despliegue](docs/deployment.md)

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.