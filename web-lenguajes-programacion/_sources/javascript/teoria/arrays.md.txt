# Arrays

**Arrays en JavaScript**
Un array (o arreglo) es una estructura de datos que permite almacenar una colección de elementos en una sola variable. Los elementos dentro de un array pueden ser de cualquier tipo de dato, incluidos números, cadenas, objetos, e incluso otros arrays. Los arrays en JavaScript son dinámicos, lo que significa que su tamaño puede cambiar durante la ejecución.

**Declaración de un Array**
Un array se puede declarar de varias maneras:

**Usando corchetes []**

```javascript
let frutas = ["manzana", "naranja", "plátano"];
```

**Usando el constructor Array**

```javascript
let numeros = new Array(1, 2, 3, 4, 5);
```

**Acceso a los elementos de un Array**
Puedes acceder a los elementos de un array usando índices. Los índices en los arrays de JavaScript comienzan desde 0.

```javascript
let frutas = ["manzana", "naranja", "plátano"];

console.log(frutas[0]);  // manzana
console.log(frutas[2]);  // plátano
```

**Modificar elementos de un Array**
Puedes modificar el valor de un elemento en el array utilizando el índice:

```javascript
let frutas = ["manzana", "naranja", "plátano"];
frutas[1] = "kiwi";  // Modifica el segundo elemento
console.log(frutas);  // ["manzana", "kiwi", "plátano"]
```

**Métodos comunes de Arrays**
JavaScript ofrece varios métodos para manipular arrays. Algunos de los más comunes son:

- **1.** push(): Agrega un nuevo elemento al final de un array.

```javascript
let frutas = ["manzana", "naranja"];
frutas.push("plátano");

console.log(frutas);  // ["manzana", "naranja", "plátano"]
```

- **2.** pop(): Elimina el último elemento de un array y lo devuelve.

```javascript
let frutas = ["manzana", "naranja", "plátano"];
let ultimo = frutas.pop();

console.log(ultimo);  // plátano
console.log(frutas);  // ["manzana", "naranja"]
```

- **3.** shift(): Elimina el primer elemento de un array y lo devuelve.

```javascript
let frutas = ["manzana", "naranja", "plátano"];
let primero = frutas.shift();

console.log(primero);  // manzana
console.log(frutas);   // ["naranja", "plátano"]
```

- **4.** unshift(): Agrega un nuevo elemento al principio de un array.

```javascript
let frutas = ["naranja", "plátano"];
frutas.unshift("manzana");

console.log(frutas);  // ["manzana", "naranja", "plátano"]
```

- **5.** splice(): Permite eliminar, reemplazar o agregar elementos en cualquier posición de un array.

```javascript
let frutas = ["manzana", "naranja", "plátano"];
frutas.splice(1, 1, "kiwi", "mango");  // Elimina 1 elemento en el índice 1 y agrega "kiwi" y "mango"

console.log(frutas);  // ["manzana", "kiwi", "mango", "plátano"]
```

- **6.** concat(): Une dos o más arrays y devuelve un nuevo array.

```javascript
let frutas = ["manzana", "naranja"];
let masFrutas = ["kiwi", "plátano"];
let todasLasFrutas = frutas.concat(masFrutas);

console.log(todasLasFrutas);  // ["manzana", "naranja", "kiwi", "plátano"]
```

- **7.** slice(): Crea una copia superficial de una porción de un array.

```javascript
let frutas = ["manzana", "naranja", "plátano", "kiwi"];
let algunasFrutas = frutas.slice(1, 3);

console.log(algunasFrutas);  // ["naranja", "plátano"]
```

- **8.** forEach(): Ejecuta una función en cada elemento de un array.

```javascript
let frutas = ["manzana", "naranja", "plátano"];

frutas.forEach(function(fruta) {
    console.log(fruta);
});
```

**// manzana**
// naranja
// plátano

**Métodos de búsqueda**
1. indexOf(): Devuelve el primer índice en el que se encuentra un valor en un array, o -1 si no se encuentra.

```javascript
let frutas = ["manzana", "naranja", "plátano"];
console.log(frutas.indexOf("naranja"));  // 1
console.log(frutas.indexOf("kiwi"));     // -1
```

- **2.** includes(): Devuelve true si un array contiene un determinado valor, de lo contrario devuelve false.

```javascript
let frutas = ["manzana", "naranja", "plátano"];

console.log(frutas.includes("plátano"));  // true
console.log(frutas.includes("kiwi"));     // false
```

**Longitud de un Array**
Puedes obtener la longitud de un array usando la propiedad length:

```javascript
let frutas = ["manzana", "naranja", "plátano"];
console.log(frutas.length);  // 3

// Ejemplos
var alimentos = ["Plátanos con salami", "Yuca con Queso Frito", "Arroz con Camarones"];

alert(alimentos.length); // Muestra la longitud del array

alert(alimentos[1]); // Muestra el segundo elemento del array

// Otra forma de definir un array
var alimentos2 = new Array("Plátanos con salami", "Yuca con Queso Frito", "Arroz con Camarones");

document.write("Hoy vamos a comer" + "<br>");
document.write(alimentos[1] + "<br>");

document.write("<strong>El menú de hoy es:</strong><br>");

for(i in alimentos) {
    document.write(alimentos[i] + "<br>");
}

// El array, también conocido como vectores, matrices o arreglos, es una colección de variables que pueden ser todas del mismo tipo de datos o cada una de un tipo diferente.
// Para definir un array, se utilizan los caracteres [] para delimitar su comienzo y su final, y para separar sus elementos.
// La diferencia entre un array y una variable es que el array es un conjunto de variables que se almacenan dentro de una, y una variable es un espacio en memoria que puede ser utilizado luego, pero solo almacena una.

var dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

alert(dias[3]);

// Propiedades y métodos del Array
// Propiedad length, indica la longitud o número de elementos en el array
document.write("Hay un total de " + alimentos.length + " elementos." + "<br>");

// document.write(alimentos = alimentos.length + "<br>"); // Esta manera no es correcta

// Método push, permite agregar elementos al final de un array
alimentos.push("Queso");
document.write(alimentos + "<br>");

alimentos.push("Jamon","Mortadela","Salami");
document.write(alimentos + "<br>");

// Método unshift (igual a push), agrega elementos al inicio de un array
alimentos.unshift("Queso");
alimentos.unshift("Jamon","Mortadela","Salami");

document.write(alimentos + "<br>");

// Método shift, elimina elementos al principio de un array
alimentos.shift(); // no acepta valores

document.write(alimentos + "<br>");

// Método pop, elimina elementos al final de un array
alimentos.pop();

document.write(alimentos);
```
