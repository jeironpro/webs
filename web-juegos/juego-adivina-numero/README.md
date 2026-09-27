# Adivina el número

## Descripción

Pequeño juego web donde debes adivinar el número secreto que elige el navegador entre 1 y 100, usando la menor cantidad de intentos posibles.

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

1. Escribe tu suposición en el campo de texto y pulsa **Adivinar**.
2. El juego te dirá si el número secreto es más alto o más bajo.
3. Cada fallo revienta uno de los **10 globos**; si se agotan los 10, la partida termina. Si aciertas, los globos restantes vuelan.
4. El mejor récord (menor cantidad de intentos) se guarda en el navegador mediante `localStorage`.
5. Pulsa **Nuevo juego** para reiniciar cuando quieras.
6. Pulsa el botón **?** (junto a la tarjeta) para ver cómo y dónde se guardan tus datos.

## Estructura del proyecto

```
.
├── index.html          # Página principal (estructura semántica)
├── css/
│   ├── tokens.css      # Libro de estilo en custom properties
│   ├── reset.css       # Reseteo mínimo
│   ├── style.css       # Entrada: base + sistema de botones
│   ├── components/     # Componentes (tarjeta, modal de datos, globos)
│   └── pages/          # Layout de la página
├── js/
│   ├── app.js          # Punto de entrada (ES Modules)
│   ├── modules/        # Lógica del juego, globos y modal
│   └── utils/          # Utilidades (DOM, localStorage)
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
