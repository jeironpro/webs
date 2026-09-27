# Objetos

**Objetos en JavaScript**
En JavaScript, un objeto es una colección de datos y funcionalidades relacionadas. Un objeto es una estructura de datos que almacena propiedades y métodos.

**Crear Objetos**
Puedes crear objetos de dos maneras principales:

- **1.** Usando la notación literal de objetos:

```javascript
let persona = {
```

  nombre: "Juan",
edad: 30,

```javascript
    saludar: function() {
        console.log("Hola, " + this.nombre);
    }
};
```

**En este ejemplo**
- Propiedades: nombre y edad.
- Método: saludar, que es una función dentro del objeto.

- **2.** Usando el constructor de objetos new Object():

```javascript
let persona = new Object();
persona.nombre = "Juan";
persona.edad = 30;
persona.saludar = function() {
    console.log("Hola, " + this.nombre);
};
```

**Acceder a las Propiedades del Objeto**
Puedes acceder a las propiedades de un objeto de dos maneras:

- **1.** Usando la notación de punto:

```javascript
console.log(persona.nombre);  // Juan
```

- **2.** Usando la notación de corchetes:

```javascript
console.log(persona["edad"]);  // 30
```

**Modificar Propiedades de un Objeto**
Puedes modificar las propiedades de un objeto directamente:

```javascript
persona.edad = 31;
persona.nombre = "Carlos";
console.log(persona.nombre);  // Carlos
```

**Añadir Nuevas Propiedades**
Puedes añadir nuevas propiedades a un objeto en cualquier momento:

```javascript
persona.direccion = "Calle Falsa 123";
console.log(persona.direccion);  // Calle Falsa 123
```

**Eliminar Propiedades**
Puedes eliminar una propiedad de un objeto usando el operador delete:

```javascript
delete persona.direccion;
console.log(persona.direccion);  // undefined
```

**Métodos en Objetos**
Un objeto puede tener métodos, que son funciones asociadas al objeto. Estos métodos pueden acceder y modificar las propiedades del objeto.

```javascript
let coche = {
```

marca: "Toyota",
modelo: "Corolla",

```javascript
    mostrarInformacion: function() {
        return "Marca: " + this.marca + ", Modelo: " + this.modelo;
    }
};

console.log(coche.mostrarInformacion());  // Marca: Toyota, Modelo: Corolla
```

**El Operador this**
Dentro de un objeto, el operador this se refiere al propio objeto. Es útil cuando deseas acceder a las propiedades del objeto desde dentro de sus métodos.

```javascript
let persona = {
```

nombre: "Ana",

```javascript
    saludar: function() {
        console.log("Hola, " + this.nombre);
    }
};

persona.saludar();  // Hola, Ana
```

**Objetos Anidados**
Los objetos en JavaScript pueden contener otros objetos como propiedades. Esto se llama anidamiento de objetos.

```javascript
let persona = {
```

nombre: "Laura",

```javascript
    direccion: {
```

calle: "Av. Siempre Viva",
ciudad: "Springfield"

```javascript
    }
};

console.log(persona.direccion.ciudad);  // Springfield
```

**Recorrer las Propiedades de un Objeto**
Puedes usar un bucle for...in para recorrer todas las propiedades de un objeto.

```javascript
let coche = {
```

marca: "Honda",
modelo: "Civic",
año: 2020

```javascript
};

for (let propiedad in coche) {
    console.log(propiedad + ": " + coche[propiedad]);
}
```

**Métodos Object.keys(), Object.values() y Object.entries()**
Estos métodos te permiten obtener las claves, los valores o las entradas (pares clave-valor) de un objeto.

```javascript
let persona = {
```

nombre: "Miguel",
edad: 25

```javascript
};
```

**// Obtener todas las claves**

```javascript
console.log(Object.keys(persona));  // ["nombre", "edad"]
```

**// Obtener todos los valores**

```javascript
console.log(Object.values(persona));  // ["Miguel", 25]
```

**// Obtener las entradas (pares clave-valor)**

```javascript
console.log(Object.entries(persona));  // [["nombre", "Miguel"], ["edad", 25]]

// Ejemplos de uso de la clase Math
// Exponente: Eleva 2 a la potencia de 3
document.write("El exponente es " + Math.pow(2, 3) + "<br>");

// Raíz cuadrada: Calcula la raíz cuadrada de 25
document.write("La raíz cuadrada del número introducido es " + Math.sqrt(25) + "<br>");

// Valor aleatorio: Genera un número aleatorio entre 0 y 1
document.write("El valor aleatorio obtenido es " + Math.random() + "<br>");

// Ejemplo 1: Solicitar un número entre 1 y 10 al usuario
var seleccion = parseInt(prompt("Ingrese un número entre 1 y 10", ""));

/* Al multiplicar Math.random() por 10, obtenemos un valor aleatorio entre 0 y 10 (sin incluir el 10). 
   Luego, con Math.floor(), convertimos este valor en un número entero entre 0 y 9.
   Finalmente, sumamos 1 para obtener un número entre 1 y 10. */
var num = Math.floor(Math.random() * 10) + 1;

// Comprobamos si el número seleccionado por el usuario es igual al número aleatorio
if (num == seleccion) {
    document.write("¡Usted ha ganado con el número " + num + "!");
} else {
    document.write("Lo sentimos, pero el número ganador es el " + num + ", y usted eligió el número " + seleccion + ".");
}

// Ejemplos de fecha
// Arreglos de días y meses
listaDia = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
listaMes = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

// Obtener la fecha y hora actuales
hoy = new Date();
diaN = hoy.getDate(); // Día del mes
dia = listaDia[hoy.getDay()]; // Día de la semana
mes = listaMes[hoy.getMonth()]; // Mes actual
año = hoy.getFullYear(); // Año actual

// Mostrar la fecha en formato "Día, Día de mes de Año"
document.write(dia + ", " + diaN + " de " + mes + " del " + año);
document.write(", ");

// Mostrar la hora en formato "hh:mm:ss", asegurando que los minutos y segundos tengan dos dígitos
document.write(hoy.getHours().toString().padStart(2, '0') + ":" + hoy.getMinutes().toString().padStart(2, '0') + ":" + hoy.getSeconds().toString().padStart(2, '0'));

// Ejemplos de setInterval
/* El método setInterval llama a una función o evalúa una expresión en intervalos específicos, en milisegundos. 
   El método seguirá llamando a la función hasta que clearInterval() sea llamado o la ventana sea cerrada. */

// Iniciar la ejecución del reloj
let intervalo = setInterval(miReloj, 1000);

function miReloj() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("hora").innerHTML = t;
} 

// Detener la ejecución del reloj
function detenerFuncion() {
    clearInterval(intervalo);
    document.getElementById("ocultar").style.visibility = "hidden";
}

// Crear una barra de progreso
function mover() {
    var elemento = document.getElementById("miBarra");
    var ancho = 0;
    
    // Iniciar el intervalo para mover la barra
    let id = setInterval(cuadro, 100);

    function cuadro() {
        if (ancho == 100) {
            clearInterval(id);  // Detener la barra de progreso cuando llega al 100%
        } else {
            ancho++;
            elemento.style.width = ancho + "%";
        }
    }
}

// Cambiar entre dos colores de fondo
let colorFondo = setInterval(configurarColor, 300);

function configurarColor() {
    var x = document.body;
    x.style.backgroundColor = x.style.backgroundColor == "orange" ? "yellow" : "orange";
}

// Detener el cambio de color
function detenerColor() {
    clearInterval(colorFondo);
}

// Ejemplos de setTimeout
// El método setTimeout llama a una función o evalúa una expresión después de un número específico de milisegundos. 

// La función se ejecuta solo una vez.
// Sintaxis: setTimeout(function, milisegundos, param1, param2...)

function miAlerta() {
    // Llamar a la función funcionAlerta después de 3000 milisegundos (3 segundos)
    setTimeout(funcionAlerta, 3000);
}

function funcionAlerta() {
    // Mostrar la alerta después de 3 segundos
    alert("Diseño y Creación de Software");
}
```
