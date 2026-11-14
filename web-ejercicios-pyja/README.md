# web-ejercicios-pyja

Sitio web estático de portafolio que recopila ejercicios de programación en Python y Java. Cada ejercicio incluye su enunciado, tareas a resolver, pistas y un ejemplo de entrada y salida; los ejercicios de Java orientados a objetos incorporan además su diagrama UML. Parte de los ejercicios cuentan con una solución de ejemplo que se puede consultar desde la propia página.

El sitio está construido con HTML, CSS y JavaScript puro, sin frameworks ni paso de compilación: los ejercicios se cargan desde archivos JSON y basta con servir la carpeta con cualquier servidor HTTP estático.

## Contenido

- 100 ejercicios de Python (`data/python.json`).
- 100 ejercicios de Java (`data/java.json`).
- Diagramas UML en SVG para los ejercicios de Java (`assets/images/uml/`).
- Soluciones de ejemplo para 57 ejercicios, distribuidas en `solutions/` (6 de Python y 51 de Java).

## Funcionalidades

- Página de inicio con acceso a las colecciones de Python y Java.
- Listado paginado (10 ejercicios por página), ordenado primero por tipo y después por nivel de dificultad.
- Etiquetas de nivel (fácil, medio, difícil) y de tipo (elementos básicos, básicos con `sys.argv`, orientada a objetos).
- Botón "Ver solución" en cada ejercicio: abre una modal con el código de la solución resaltado con sintaxis, números de línea y cierre con ESC, clic en el fondo o en el botón de cerrar.
- Los ejercicios que aún no tienen solución muestran el aviso "Solución próximamente".
- Cabecera fija con efecto de desplazamiento y diseño adaptable a móviles.

## Estructura del proyecto

```
web-ejercicios-pyja/
├── index.html                  Página de inicio con acceso a las colecciones
├── html/
│   ├── python.html             Colección de ejercicios de Python
│   └── java.html               Colección de ejercicios de Java
├── css/
│   └── styles.css              Estilos de todas las páginas
├── js/
│   ├── script.js               Efecto de desplazamiento y año del pie
│   ├── exercises.js            Renderizado, paginación y modal de soluciones
│   └── highlighter.js          Resaltado de sintaxis para Python y Java
├── data/
│   ├── python.json             Ejercicios de Python
│   ├── java.json               Ejercicios de Java
│   └── solutions.json          Manifest que asocia cada ejercicio con sus archivos
├── assets/
│   ├── icons/
│   │   └── favicon.svg         Favicon del sitio
│   └── images/
│       ├── java.png            Logo de Java
│       ├── python.png          Logo de Python
│       ├── pyja.png            Icono general del sitio
│       └── uml/                Diagramas UML de los ejercicios de Java
├── solutions/
│   ├── python/
│   │   └── basics/             Soluciones de Python (una carpeta por ejercicio)
│   └── java/
│       ├── basics/             Soluciones Java de elementos básicos
│       ├── object-oriented/    Soluciones Java orientadas a objetos
│       └── Entrada.java        Utilidad compartida de lectura de la entrada estándar
└── tools/
    └── generate-solutions.py   Regenera data/solutions.json
```

## Formato de los ejercicios

Cada ejercicio de `data/python.json` y `data/java.json` contiene:

- `id`: identificador numérico de dos dígitos.
- `title`: título del ejercicio.
- `level`: easy, medium o hard.
- `type`: basic, basic-cli u oop.
- `statement`: descripción del problema.
- `tasks`: lista de requisitos que debe cumplir el programa.
- `hints`: sugerencias para resolverlo.
- `example`: input y output de ejemplo.
- `uml` (solo ejercicios de Java): ruta al diagrama UML en SVG.

## Cómo ejecutar el sitio

El sitio requiere un servidor HTTP local porque los datos se cargan con `fetch` (abrir los archivos HTML directamente no funciona). Desde la raíz de esta web:

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000` en el navegador.

## Cómo agregar una solución

1. Crear la carpeta de la solución en `solutions/python/` o `solutions/java/` con el nombre `<id>_<slug>`, donde `<id>` coincide con el campo `id` del ejercicio (por ejemplo, `02_cifrado_escalonado`).
2. Regenerar el manifest:

```bash
python3 tools/generate-solutions.py
```

3. Confirmar los cambios.

El manifest `data/solutions.json` se genera a partir de las carpetas presentes en `solutions/`; los ejercicios sin carpeta muestran "Solución próximamente" en el sitio.

Las soluciones de Java que leen datos del usuario usan una utilidad compartida, `solutions/java/Entrada.java` (un único archivo para todas). Al ser común, no se incluye en el manifest ni se muestra en la modal, que muestra únicamente los archivos propios de cada solución.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](../LICENSE) para más detalles.
