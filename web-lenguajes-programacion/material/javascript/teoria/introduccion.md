# Introducción

**Introducción a JavaScript**
JavaScript es un lenguaje de programación interpretado, ligero y de alto nivel que se utiliza principalmente para el desarrollo web. Fue creado por Brendan Eich en 1995 y ha evolucionado hasta convertirse en uno de los pilares fundamentales del desarrollo web moderno junto con HTML y CSS.

**Características principales de JavaScript**
1. Lenguaje del lado del cliente y del servidor:
- En su origen, JavaScript fue diseñado para ejecutarse en el navegador (lado del cliente), permitiendo crear páginas web interactivas.

- Con el tiempo, se extendió al lado del servidor gracias a entornos como Node.js, permitiendo desarrollar aplicaciones completas con JavaScript.

- **2.** Basado en eventos y orientado a objetos:
- Soporta programación orientada a objetos y está diseñado para responder a eventos como clics, movimientos del ratón, cambios en formularios, entre otros.

- **3.** Dinámico y débilmente tipado:
- Las variables no requieren declaración de tipo (por ejemplo, var x = 5, es válido, y x puede cambiar el tipo posteriormente).

- **4.** Independiente de la plataforma:
- Puede ejecutarse en cualquier navegador moderno sin necesidad de instalación adicional.

- **5.** Lenguaje interpretado:
- El código JavaScipt es leído y ejecutado directamente por el navegador.

**Uso de JavaScript**
1. Interactividad en páginas web:
- Validación de formularios.
- Mostrar mensajes dinámicos.
- Animaciones y efectos visuales.

- **2.** Desarrollo de aplicaciones web:
- Creación de aplicaciones de una pagina (SPA) con frameworks como React, Vue.js y Angular.

- **3.** Desarrollo de backend:
- Gracias a Node.js, JavaScript se utiliza para crear servidores y manejar bases de datos.

- **4.** Aplicaciones móviles y de escrito:
- Frameworks como React Native y Electron permiten usar JavaScript para crear aplicaciones nativas.

**Ventajas de JavaScript**
- Compatibilidad universal: funciona en casi todos los navegadores modernos.

- Velocidad: es ejecutado directamente por el navegador, lo que reduce el tiempo de carga.

- Fácil de aprender: su sintaxis es similar a otros lenguajes como Java Y C.

- Ecosistema rico: cuenta con una vasta cantidad de bibliotecas y frameworks.

La jerarquía de los scripts o archivos JavaScript se organiza de la siguiente manera: primero se cargan los archivos externos, luego los scripts dentro del documento HTML, dependiendo de si están en la etiqueta <head> o en <body>. En este caso, primero se ejecuta el que está en la etiqueta <body> y después el que está en la etiqueta <head>. Finalmente, se consideran los atributos de un script utilizados en los elementos de un documento HTML.

**Ejemplos de jerarquía**
1. Directamente en el HTML: Puedes incluir JavaScript dentro de un archivo HTML utilizando la etiqueta <script>:

**<html>**
<head>
<title>Mi primera página JavaScript</title>
</head>
<body>
<h1>¡Hola Mundo!</h1>
<!-- Los elementos que se incluyan dentro de la etiqueta <noscript> no serán mostrados en el navegador si JavaScript está habilitado, indicando que falta JavaScript. -->

**<noscript>**
<h1>Bienvenido a mi sitio web</h1>
<p>La página que estás viendo requiere JavaScript para su correcto funcionamiento.</p>
</noscript>

<!-- Atributo onclick: se utiliza para que, al hacer clic dentro del contenido de la etiqueta, se muestre una alerta en una ventana. -->

<!-- No se pueden utilizar las mismas comillas más de una vez. -->
<h3 onclick="alert('Este es un mensaje que está dentro de una etiqueta HTML')">Introducción a JavaScript</h3>

**<script>**
// Alert se utiliza para mostrar una ventana emergente antes de cargar el contenido del documento HTML.

```javascript
        alert('Este otro texto se muestra en una ventana usando alert()');

        console.log("Hola desde JavaScript");
```

**</script>**
</body>
</html>

- **2.** En archivos externos: Se recomienda separar el código JavaScript en un archivo .js y enlazarlo desde el HTML:

**Archivo HTML**
<html>
<head>
<script src="script.js"></script>
</head>
<body>
<h1>Hola Mundo</h1>
</body>
</html>

**Archivo script.js**

```javascript
console.log("Hola desde un archivo externo");

// Primeros pasos con JavaScipt
// Imprimir por consola:
console.log("Bienvenido a JavaScript");

// Declara variables:
let nombre = "Jeiron";
const PI = 3.14159;
var edad = 21;

// Crear una función simple:
function saludar() {
    console.log("Hola, este es un saludo desde una función.");
}
saludar();
```
