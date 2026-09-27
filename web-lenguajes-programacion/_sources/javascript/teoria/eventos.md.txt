# Eventos

**Eventos en JavaScript**
Los eventos son acciones o sucesos que ocurren en el navegador y que pueden ser capturados y gestionados por JavaScript. Los eventos pueden ser causados por el usuario (como hacer clic en un botón o escribir en un campo de texto) o por el navegador (como la carga de una página o el cambio de un valor en un campo de formulario).

**Tipos de Eventos Comunes**
Algunos de los eventos más comunes son:
- Eventos de usuario:
- click: Ocurre cuando el usuario hace clic en un elemento.

- mouseover: Ocurre cuando el usuario mueve el ratón sobre un elemento.

- keydown: Ocurre cuando el usuario presiona una tecla.

- input: Ocurre cuando el valor de un campo de entrada cambia.

- Eventos de la página:
- load: Ocurre cuando una página se ha cargado completamente.

- resize: Ocurre cuando el tamaño de la ventana cambia.

- scroll: Ocurre cuando se desplaza la página.

**Añadir un Event Listener**
En JavaScript, puedes añadir un event listener (escucha de evento) a un elemento del DOM para que ejecute una función cuando ocurra un evento.

La forma más común de añadir un event listener es con el método addEventListener.

**Sintaxis**

```javascript
element.addEventListener("evento", funcion);
```

**Ejemplo**
// Seleccionar un botón

```javascript
let boton = document.getElementById("miBoton");
```

**// Añadir un event listener para el evento "click"**

```javascript
boton.addEventListener("click", function() {
    alert("¡Botón clickeado!");
});
```

**Eventos con Funciones Anónimas**
Puedes usar funciones anónimas (es decir, funciones sin nombre) directamente dentro del addEventListener.

```javascript
boton.addEventListener("click", function() {
    console.log("El botón ha sido clickeado");
});
```

**Eliminar un Event Listener**
Si en algún momento deseas eliminar un event listener que has agregado, puedes hacerlo con el método removeEventListener. Este método solo funcionará si pasas exactamente la misma función que fue añadida.

```javascript
function mensaje() {
    alert("¡Hola!");
}
```

**// Añadir el event listener**

```javascript
boton.addEventListener("click", mensaje);
```

**// Eliminar el event listener**

```javascript
boton.removeEventListener("click", mensaje);
```

**Tipos de Eventos Comunes**
Algunos eventos comunes que puedes manejar incluyen:
- click

- dblclick (doble clic)

- mouseenter y mouseleave

- keydown, keyup y keypress

- focus y blur

- submit (en formularios)

- change (en campos de formulario)

**Eventos de Formulario**
Puedes usar eventos para gestionar interacciones con formularios, como cuando el usuario envía un formulario o cambia un valor de campo.

**Ejemplo**
// Seleccionar un formulario

```javascript
let formulario = document.getElementById("miFormulario");
```

**// Añadir un event listener para el evento "submit"**

```javascript
formulario.addEventListener("submit", function(event) {
```

// Evitar que el formulario se envíe de inmediato

```javascript
    event.preventDefault();
    console.log("Formulario enviado");
});
```

**Evitar el Comportamiento por Defecto**
Usando event.preventDefault() puedes evitar que un evento realice su acción predeterminada. Esto es útil, por ejemplo, para evitar que un formulario se envíe automáticamente cuando el usuario hace clic en el botón de enviar.

```javascript
formulario.addEventListener("submit", function(event) {
    event.preventDefault();  // Evita que el formulario se envíe
    alert("Formulario bloqueado");
});

// Ejemplo de onmouse / overout
function pintar(col) {
    document.getElementById("cuadrado").style.backgroundColor = col;
}

// Ejemplo de onfocus / onblur
function vaciar(control) {
    control.value = '';
}

function verificarEntrada(control) {
    if(control.value == '') {
        alert("El campo no puede estar vació.");
    }
}
```
