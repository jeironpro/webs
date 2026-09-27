# Formularios

**Formularios en JavaScript**
Los formularios son una parte fundamental de las aplicaciones web, ya que permiten a los usuarios enviar información a un servidor. En JavaScript, puedes interactuar con formularios para obtener, validar y enviar datos de manera dinámica.

**Acceder a los Elementos de un Formulario**
Puedes acceder a los elementos de un formulario de la misma manera que accedes a otros elementos del DOM, usando getElementById, querySelector, etc. A continuación, te muestro cómo acceder a los diferentes tipos de campos dentro de un formulario:

**// Acceder a un formulario por su id**

```javascript
let formulario = document.getElementById("miFormulario");
```

**// Acceder a un campo de texto dentro del formulario**

```javascript
let campoTexto = formulario.elements["nombre"];
```

**// Acceder a un campo de tipo checkbox**

```javascript
let checkbox = formulario.elements["terminos"];
```

**// Acceder a un campo de tipo radio**

```javascript
let radio = formulario.elements["genero"];
```

**Obtener los Valores de los Campos del Formulario**
Puedes obtener los valores de los campos de un formulario utilizando la propiedad value.

**// Obtener el valor de un campo de texto**

```javascript
let nombre = campoTexto.value;
```

**// Obtener el valor de un checkbox (true o false)**

```javascript
let aceptado = checkbox.checked;
```

// Obtener el valor de un campo radio (el valor del radio seleccionado)

```javascript
let generoSeleccionado = radio.value;
```

**Envío de Formularios**
Puedes enviar un formulario con el método submit(). Sin embargo, debes tener en cuenta que si no realizas ninguna validación o personalización, el formulario se enviará al servidor y recargará la página.

**// Enviar el formulario de manera programática**

```javascript
formulario.submit();
```

Para evitar que el formulario se envíe de inmediato (por ejemplo, si quieres realizar validaciones), puedes usar el método preventDefault():

```javascript
formulario.addEventListener("submit", function(event) {
    event.preventDefault();  // Evita que el formulario se envíe
    alert("Formulario enviado");
});
```

**Validación de Formularios**
La validación de formularios se puede realizar de dos formas: usando las propiedades de validación HTML o realizando validación manual en JavaScript.
Validación Automática con HTML5

HTML5 proporciona una forma simple de validar campos de formulario utilizando atributos como required, minlength, maxlength, pattern, etc.

**<form id="miFormulario">**
<input type="text" name="nombre" required>
<input type="email" name="email" required>
<button type="submit">Enviar</button>
</form>

Con solo los atributos required, el formulario no se enviará hasta que todos los campos obligatorios sean completados.
Validación Manual con JavaScript

Si necesitas realizar una validación más compleja o personalizada, puedes hacerlo con JavaScript antes de enviar el formulario:

```javascript
formulario.addEventListener("submit", function(event) {
    event.preventDefault();  // Evitar el envío del formulario por defecto
```

**// Validar el campo nombre**

```javascript
    let nombre = formulario.elements["nombre"].value;
    if (nombre === "") {
        alert("El nombre es obligatorio.");
    } else {
```

// Si todo es válido, puedes enviar el formulario

```javascript
        formulario.submit();
    }
});
```

**Eventos Comunes en Formularios**
- submit: Se dispara cuando el formulario se envía.

- input: Se dispara cuando el valor de un campo de
entrada cambia.

- change: Se dispara cuando el valor de un campo de entrada cambia y pierde el foco.

- focus: Se dispara cuando un campo recibe el foco.

- blur: Se dispara cuando un campo pierde el foco.

**Acción del Formulario (action)**
El atributo action de un formulario determina a qué URL se enviarán los datos del formulario cuando se envíe. Si no se establece un action, el formulario se enviará a la misma URL.

**<form action="/procesarFormulario" method="POST">**
<!-- Campos del formulario -->
</form>

**Método del Formulario (method)**
El atributo method especifica cómo se enviarán los datos del formulario. Los valores más comunes son:
- GET: Los datos del formulario se envían en la URL.

- POST: Los datos del formulario se envían en el cuerpo de la solicitud HTTP (más seguro para enviar datos sensibles).

**<form method="POST">**
<!-- Campos del formulario -->
</form>

```javascript
// Ejemplo práctico
function validarCajaTexto() {
    // Obtén los elementos
    var campos = [
        { elemento: document.getElementById("nombre"), mensaje: "El campo no puede estar en blanco." },
        { elemento: document.getElementById("dir"), mensaje: "El campo no puede estar en blanco." },
        { elemento: document.getElementById("tel"), mensaje: "El campo no puede estar en blanco." },
        { elemento: document.getElementById("correo"), mensaje: "El campo no puede estar en blanco." }
    ];

    // Limpiar bordes antes de la validación
    campos.forEach(function(campo) {
        campo.elemento.style.border = "1px solid #ccc"; // Establecer el borde normal
    });

    // Validar cada campo
    for (let i = 0; i < campos.length; i++) {
        let campo = campos[i];
        
        if (campo.elemento.value == "") {
            alert(campo.mensaje);
            campo.elemento.focus();
            campo.elemento.style.border = "3px solid #f00"; // Bordes en rojo
            return false; // Detener la ejecución si hay un error
        }
    }

    return true; // Todos los campos son válidos
}
```
