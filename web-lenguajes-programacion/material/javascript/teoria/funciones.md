# Funciones

**Funciones en JavaScript**
Una función es un bloque de código diseñado para realizar una tarea específica. Las funciones pueden aceptar valores de entrada (llamados parámetros) y pueden devolver un valor (el resultado de la operación). Las funciones permiten organizar el código, hacerlo más modular y reutilizable.

**Declaración de una Función**
En JavaScript, puedes declarar una función de varias maneras. La forma más común es utilizando la palabra clave function.

**// Sintaxis de declaración de función**

```javascript
function saludar(nombre) {
    console.log("Hola, " + nombre);
}
```

En este ejemplo, saludar es el nombre de la función, y nombre es un parámetro que la función recibe.

**Llamar a una Función**
Para ejecutar una función, simplemente debes "llamarla", pasando los argumentos (valores para los parámetros) cuando sea necesario.

```javascript
saludar("Jeiron");  // Hola, Jeiron
```

**Funciones con Valor de Retorno**
Una función puede devolver un valor utilizando la palabra clave return. Este valor puede ser utilizado en otras partes del código.

```javascript
function sumar(a, b) {
    return a + b;
}

let resultado = sumar(5, 3);
console.log(resultado);  // 8
```

**Expresiones de Función**
Además de declarar funciones de la forma tradicional, también puedes definir funciones como expresiones. Esto significa que la función se asigna a una variable.

```javascript
let multiplicar = function(a, b) {
    return a * b;
};

console.log(multiplicar(4, 5));  // 20
```

**Funciones Flecha (Arrow Functions)**
Las funciones flecha son una forma más corta de escribir funciones en JavaScript. Utilizan la sintaxis => y son especialmente útiles cuando se trabaja con funciones pequeñas o anónimas.

```javascript
let restar = (a, b) => a - b;

console.log(restar(10, 5));  // 5
```

Si la función tiene un solo parámetro, puedes omitir los paréntesis:

```javascript
    let cuadrado = x => x * x;

    console.log(cuadrado(4));  // 16
```

**Parámetros por Defecto**
En JavaScript, puedes asignar valores predeterminados a los parámetros de las funciones. Si no se proporciona un valor para un parámetro, se usará el valor predeterminado.

```javascript
function saludar(nombre = "Amigo") {
    console.log("Hola, " + nombre);
}

saludar();           // Hola, Amigo
saludar("Jeiron");   // Hola, Jeiron
```

**Funciones con Número Variable de Argumentos**
A veces, no sabes cuántos argumentos va a recibir una función. Para estos casos, puedes utilizar el objeto especial arguments (en funciones tradicionales) o el operador rest (...).

**Con arguments (solo en funciones tradicionales)**

```javascript
    function sumarTodo() {
        let total = 0;
        for (let i = 0; i < arguments.length; i++) {
            total += arguments[i];
        }
        return total;
    }

    console.log(sumarTodo(1, 2, 3, 4));  // 10
```

**Con el operador rest (...)**

```javascript
    function sumarTodo(...numeros) {
        return numeros.reduce((acc, num) => acc + num, 0);
    }

    console.log(sumarTodo(1, 2, 3, 4));  // 10
```

**Funciones Anidadas**
En JavaScript, puedes declarar funciones dentro de otras funciones. Las funciones internas pueden acceder a las variables y parámetros de la función externa.

```javascript
function exterior(a, b) {
    function interior(x) {
        return x * 2;
    }
    return interior(a) + interior(b);
}

console.log(exterior(2, 3));  // 10
```

**Funciones IIFE (Inmediatamente Invocadas)**
Una IIFE (Immediately Invoked Function Expression) es una función que se ejecuta tan pronto como se define. Se utiliza comúnmente para crear un ámbito local para evitar contaminar el espacio global.

```javascript
(function() {
    console.log("Esta es una función IIFE");
})();

// Ejemplos
var resultado;

// Primer conjunto de sumas
var num1 = 5;
var num2 = 6;

resultado = num1 + num2;
alert("El resultado de la suma es " + resultado);

var num1 = 8;
var num2 = 7;

resultado = num1 + num2;
alert("El resultado de la suma es " + resultado);

var num1 = 10;
var num2 = 15;

resultado = num1 + num2;
alert("El resultado de la suma es " + resultado);

// Función de suma
function suma() {
    resultado = num1 + num2;
    document.write("El resultado de la suma es " + resultado + "<br>");
}

var num1 = 18;
var num2 = 24;
suma();

var num1 = 180;
var num2 = 240;
suma();

// Función de estudiantes
function estudiantes() {
    var nomCompleto = nombre + " " + apellido;
    alert("Su nombre es " + nomCompleto);
}

var nombre = "Juanito";
var apellido = "Perez";
estudiantes();

nombre = "Antonio";
apellido = "Gonzalez";
estudiantes();

// Ámbitos de la variable
var contenido;

function mensaje() {
    // La variable contenido es global y se asigna dentro de la función
    contenido = "Este es un mensaje de prueba... mmm, ¿a qué sabe?";
    alert(contenido);
}

mensaje(); // Llamada a la función mensaje
// alert(contenido); // No es necesario aquí porque la variable ya es global

// Suma con parámetros
function suma(num1, num2) {
    resultado = num1 + num2;
    alert("El resultado de la suma es " + resultado);
}

suma(250, 750); // Llamada a la función suma con parámetros
```
