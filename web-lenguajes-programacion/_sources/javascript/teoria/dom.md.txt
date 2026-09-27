# DOM

**El DOM (Document Object Model)**
El Dom es una interfaz de programación que permite a los lenguajes de programación como JavaScript interactuar con el contenido de una página web. Representa la estructura de los documentos HTML y XML en forma de un árbol de nodos y objetos estructurados que tienen propiedades y métodos, donde cada nodo es una parte del contenido o estrucutra del documento, como elementos, atributos y texto. Facilita una representación estructurada del documento y define de qué manera los programas pueden acceder, con el fin de modificar, tanto su estructura, estilo, como contenido. Es decir, conecta las páginas web con scripts y lenguajes de programación.

**Acceder a Elementos del DOM**
En JavaScript, puedes acceder a los elementos del DOM para manipular el contenido o la estructura de una página web. Algunos de los métodos más comunes para acceder a los elementos del DOM son:
- getElementById: Accede a un elemento por su atributo id.

- getElementsByClassName: Accede a los elementos que comparten una misma clase.

- getElementsByTagName: Accede a los elementos que coinciden con un nombre de etiqueta (como div, p, h1, etc.).

- querySelector: Accede al primer elemento que coincide con un selector CSS.

- querySelectorAll: Accede a todos los elementos que coinciden con un selector CSS.

**Ejemplo de Acceso al DOM**
// Acceder a un elemento por id

```javascript
let elemento = document.getElementById("miElemento");
```

**// Acceder a todos los elementos con una clase**

```javascript
let elementos = document.getElementsByClassName("miClase");
```

**// Acceder al primer elemento con una etiqueta**

```javascript
let primerDiv = document.getElementsByTagName("div")[0];
```

// Usar querySelector para obtener el primer elemento que coincida con el selector CSS

```javascript
let primerBoton = document.querySelector(".boton");
```

// Usar querySelectorAll para obtener todos los elementos que coincidan con el selector CSS

```javascript
let todosLosBotones = document.querySelectorAll(".boton");
```

**Manipulación de Elementos**
Una vez que has accedido a los elementos del DOM, puedes modificarlos de diversas maneras:

- Cambiar el contenido de un elemento: innerHTML, textContent.

- Modificar atributos de un elemento: setAttribute, getAttribute.

- Cambiar el estilo de un elemento: style.

**Ejemplo de Manipulación del DOM**
// Cambiar el texto de un elemento

```javascript
let titulo = document.getElementById("titulo");
titulo.textContent = "Nuevo Título";
```

**// Cambiar el color de fondo de un elemento**
let caja = document

```javascript
// Ejemplos del Dom
function mostrarId() {
    var nombre = document.getElementById("nombre").value;
    var edad = document.getElementById("edad").value;

    alert("El nombre ingresado es " + nombre + ". Y tiene " + edad + " años.");
}

function cambiarEstilo() {
    var parrafos = document.getElementsByTagName("p");

    // Usar el bucle para cambiar el estilo de todos los párrafos
    for (var i = 0; i < parrafos.length; i++) {
        parrafos[i].style.fontWeight = "bold"; // No es necesario usar una variable adicional
    }
}

function parrafoByName() {
    var parrafos = document.getElementsByName("segundo");

    // Usar el bucle para cambiar el estilo de los párrafos con el nombre 'segundo'
    for (var i = 0; i < parrafos.length; i++) {
        parrafos[i].style.fontStyle = "italic"; // No es necesario usar una variable adicional
    }
}

// Ejemplos de carga HTML
// Ejecutar esta función cuando se cargue el documento.
window.onload = function() {
    // Crear dinámicamente un par de elementos HTML en una página vacía.
    
    // Crear un elemento <h1>
    var heading = document.createElement("h1");

    // Crear un nodo de texto con el contenido deseado
    var heading_text = document.createTextNode("Introducción a JavaScript");

    // Añadir el nodo de texto al elemento <h1>
    heading.appendChild(heading_text);

    // Añadir el elemento <h1> al cuerpo del documento
    document.body.appendChild(heading);
}

// Ejemplo de innerHTML
// innerHTML: Es una propiedad que permite leer o asignar el contenido de un div u otro control. Facilita la asignación de valores a controles.

function cambiarEstilo() {
    // Confirmar si los cambios serán permanentes.
    var confirmacion = confirm("¿Los cambios serán permanentes?");

    // Verificar si se realizará el cambio.
    if (confirmacion) {
        // Obtener los párrafos con la clase "parrafo".
        var parrafo = document.getElementsByClassName("parrafo");

        // Leer el contenido de los primeros dos párrafos.
        var primerParrafo = parrafo[0].innerHTML;
        var segundoParrafo = parrafo[1].innerHTML;

        // Combinar el contenido de los dos párrafos en el tercer párrafo.
        parrafo[2].innerHTML = primerParrafo + segundoParrafo;

        // Limpiar el contenido de los dos primeros párrafos.
        parrafo[0].innerHTML = " ";
        parrafo[1].innerHTML = " ";

        // Ocultar el botón luego de hacer clic.
        document.getElementById("ocultar").style.visibility = "hidden"; 
    }
}
```
