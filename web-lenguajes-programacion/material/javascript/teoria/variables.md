# Variables

**Variables en JavaScipt**
Una variable es un contenedor que se utiliza para almacenar datos que pueden ser usados o modificados más adelante en un programa. En JavaScript, hay tres formas principales de declarar variables: var, let y const.

**Declaración de variables**
ara declarar una variable en JavaScript, se utilizan las siguientes palabras clave:
1. var:
- Forma tradicional de declarar variables.
- Su uso está en desuso en favor de let y const.

- **2.** let:
- Introducido en ES6 (2015), proporciona un alcance más controlado.

- **3.** const:
- También introducido en ES6, se utiliza para declarar constantes (valores que no cambian).

**Reglas de nomenclatura para variables**
Al nombrar variables, debes seguir estas reglas:
1. Los nombres pueden contener letras, dígitos, el símbolo _ y $.

- **2.** No pueden comenzar con un número.

- **3.** No puedes usar palabras reservadas de JavaScript (como if, for, return).

- **4.** Por convención, los nombres de variables suelen seguir la notación camelCase.
- Ejemplo: miVariable, edadUsuario.

**Declarar y asignar valores**
1. Declaración simple:

```javascript
    let edad; // Declarar una variable sin asignar un valor
```

- **2.** Declaración y asignación simultánea:

```javascript
    const nombre = "Juan"; // Declarar y asignar un valor
```

- **3.** Reasignación de valores:
  Solo es posible con var y let, no con const.

```javascript
    let x = 5;
    x = 10; // Cambiar el valor de la variable
```

**Inicialización y valores por defecto**
- Si declaras una variable pero no le asignas un valor, su valor será undefined.

```javascript
    let a;
    console.log(a); // undefined
```

**Tipos de variables**
Las variables en JavaScript no tienen un tipo fijo. Pueden almacenar diferentes tipos de datos y cambiar de tipo durante la ejecución del programa.

**Ejemplo**

```javascript
let variable = 5; // Número
variable = "Hola"; // Ahora es un string
```

**Ámbito de las variables**
El alcance (o ámbito) determina dónde puede accederse a una variable en el código.

- **1.** Global:
- Una variable declarada fuera de cualquier función o bloque tiene alcance global.

```javascript
        var global = "Soy global";
```

- **2.** Funcional:
- Las variables declaradas con let y const tienen un alcance limitado al bloque {} donde se declaran.

```javascript
        {
            let y = 20;
            const z = 30;
            console.log(y, z); // 20, 30
        }
        console.log(y, z); // Error
```

**Declaración de variables en JavaScript: let, const y var**
En JavaScript, las variables se pueden declarar usando las palabras clave var, let y const. Aunque las tres permiten declarar variables, tienen diferencias importantes en cuanto a su alcance, inmutabilidad y comportamiento.

- **1.** var
  var es la forma más antigua de declarar variables en JavaScript. Su uso ha disminuido debido a la introducción de let y const en ES6 (2015), que son más seguras y predecibles.

**Características principales**
- Ámbito:
- El ámbito de var es funcional, lo que significa que si declaras una variable con var dentro de una función, será accesible solo dentro de esa función.

- Sin embargo, si declaras una variable var fuera de una función, se convierte en una variable global.

```javascript
        function ejemploVar() {
            var x = 10;
            console.log(x); // 10
        }
        console.log(x); // Error: x no está definida
```

- Re-declaración: Puedes volver a declarar una variable con var sin errores.

```javascript
        var x = 5;
        var x = 10; // No genera error
        console.log(x); // 10
```

- Hoisting:
- Las variables declaradas con var son elevadas (hoisted) al inicio de su ámbito. Esto significa que puedes usar una variable antes de declararla.

```javascript
        console.log(x); // undefined (hoisting)
        var x = 10;
```

- **2.** let
  Introducido en ES6, let resuelve muchos de los problemas de var. Se usa para declarar variables cuyo valor puede cambiar.

**Características principales**
- Ámbito:
- El ámbito de let es de bloque, lo que significa que solo está disponible dentro del bloque {} donde se declara.

```javascript
        {
            let y = 20;
            console.log(y); // 20
        }
        console.log(y); // Error: y no está definida
```

- Re-declaración: No puedes volver a declarar la misma variable dentro del mismo ámbito.

```javascript
        let z = 30;
        // let z = 40; // Error: la variable ya está declarada
        z = 40; // Esto sí es válido
```

- No hay hoisting completo:
- Aunque let también se eleva al inicio del ámbito, no se puede usar antes de declararla debido a la "zona muerta temporal".

```javascript
        console.log(a); // Error: Cannot access 'a' before initialization
        let a = 50;
```

- **3.** const
  También introducido en ES6, const se usa para declarar variables que no se pueden reasignar (son constantes).

**Características principales**
- Ámbito:
- Igual que let, const tiene un ámbito de bloque.

```javascript
        {
            const PI = 3.14;
            console.log(PI); // 3.14
        }
        console.log(PI); // Error: PI no está definida
```

- Inmutabilidad:
- La referencia de la variable no puede cambiar, pero si la variable es un objeto o un array, sus propiedades o elementos sí pueden modificarse.

```javascript
        const num = 10;
        // num = 20; // Error: no se puede reasignar

        const arr = [1, 2, 3];
        arr.push(4); // Esto es válido
        console.log(arr); // [1, 2, 3, 4]
```

- No hay hoisting completo:
- Igual que con let, no puedes usar una variable declarada con const antes de declararla.

**Diferencias clave entre var, let y const**
Característica   var                   let                          const
Ámbito           Función o global      Bloque                       Bloque
Re-declaración   Permitida             No permitida                 No permitida
Reasignación     Permitida             Permitida                    No permitida
Hoisting         Sí (como undefined)   Sí (zona muerta temporarl)   Sí (zona muerta temporarl)

**¿Cuándo usar let, const y var?**
1. Usa const siempre que sea posible:
- Declara las variables con const si no necesitas reasignarles un nuevo valor.

- **2.** Usa let para variables que cambien su valor:
- Ideal para bucles y valores dinámicos.

- **3.** Evita usar var:
- Su comportamiento impredecible puede causar errores difíciles de depurar.

**Buenas prácticas**
1. Usa nombres descriptivos para tus variables:

```javascript
    let numeroDeEstudiantes = 25; // Claro y entendible
```

- **2.** Declara variables en el ámbito más limitado posible:
- Prefiere let y const en lugar de var.

- **3.** Inicializa las variables al momento de declararlas, siempre que sea posible.

```javascript
// Ejemplos
var num1 = 10;
var num2 = 5;

var resultadoSuma = num1 + num2;
// Para comentar en un archivo JavaScript, se utiliza doble barra (//).
// El alert tiene más prioridad que el document.write.
// Para hacer un salto de línea, concatenamos la etiqueta HTML <br>.
document.write("El resultado de la suma es: " + resultadoSuma + "<br>");
// El signo de más (+), en este caso, se usa para concatenar el mensaje con la variable.
// alert("El resultado de la suma es: " + resultadoSuma);

var nombre = "Jeiron";
var apellido = "Espinal";

var nombreCompleto = nombre + " " + apellido;

document.write("Su nombre completo es " + nombreCompleto);
// alert("Su nombre completo es " + nombreCompleto);
```
