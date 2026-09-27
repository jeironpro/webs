# Estructuras de control

**Estructuras de control en JavaScript**
Las estructuras de control permiten controlar el flujo de ejecución del código según condiciones o repeticiones. En JavaScript, existen varios tipos de estructuras de control, como las condicionales y los bucles.

- **1.** Estructuras condicionales
  Las estructuras condicionales permiten ejecutar bloques de código dependiendo de si se cumple o no una condición.

**if**
La estructura if ejecuta un bloque de código solo si una condición es verdadera.

**Ejemplo**

```javascript
let edad = 18;

if (edad >= 18) {
    console.log("Eres mayor de edad");
}
```

**else**
El bloque else se ejecuta si la condición del if es falsa.

**Ejemplo**

```javascript
let edad = 16;

if (edad >= 18) {
    console.log("Eres mayor de edad");
} else {
    console.log("Eres menor de edad");
}
```

**else if**
Se utiliza para agregar múltiples condiciones a un if.

**Ejemplo**

```javascript
let edad = 20;

if (edad < 18) {
    console.log("Eres menor de edad");
} else if (edad === 18) {
    console.log("Justo mayor de edad");
} else {
    console.log("Eres mayor de edad");
}
```

**switch**
El switch se utiliza para comparar un valor con diferentes casos, de manera más eficiente que múltiples if-else.

**Ejemplo**

```javascript
let color = "rojo";

switch (color) {
```

**case "rojo"**

```javascript
        console.log("El color es rojo");
        break;
    case "azul":
        console.log("El color es azul");
        break;
```

default:

```javascript
        console.log("Color desconocido");
}
```

- **2.** Estructuras de repetición (Bucles)
  Los bucles permiten ejecutar un bloque de código repetidamente mientras se cumpla una condición.

**for**
El bucle for es ideal cuando se sabe cuántas veces se debe ejecutar un bloque de código.

**Sintaxis**

```javascript
for (inicialización; condición; actualización) {
```

// Código a ejecutar

```javascript
}
```

**Ejemplo**

```javascript
for (let i = 0; i < 5; i++) {
    console.log(i);  // Imprime 0, 1, 2, 3, 4
}
```

**while**
El bucle while ejecuta un bloque de código mientras se cumpla una condición. Si la condición es falsa desde el principio, el código puede no ejecutarse ni una vez.

**Sintaxis**

```javascript
while (condición) {
```

// Código a ejecutar

```javascript
}
```

**Ejemplo**

```javascript
let i = 0;
while (i < 5) {
    console.log(i);  // Imprime 0, 1, 2, 3, 4
    i++;
}
```

**do...while**
El bucle do...while es similar al while, pero garantiza que el bloque de código se ejecute al menos una vez, ya que la condición se evalúa después de ejecutar el código.

**Sintaxis**

```javascript
do {
```

// Código a ejecutar

```javascript
} while (condición);
```

**Ejemplo**

```javascript
let i = 0;
do {
    console.log(i);  // Imprime 0, 1, 2, 3, 4
    i++;
} while (i < 5);
```

- **3.** Control de flujo dentro de los bucles
  break
El break se utiliza para salir de un bucle o una estructura switch antes de que termine su ejecución.

**Ejemplo**

```javascript
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break;  // Sale del bucle cuando i es 5
    }
    console.log(i);  // Imprime 0, 1, 2, 3, 4
}
```

**continue**
El continue omite el resto del código dentro del bucle para la iteración actual y pasa a la siguiente iteración.

**Ejemplo**

```javascript
for (let i = 0; i < 5; i++) {
    if (i === 3) {
        continue;  // Salta la iteración cuando i es 3
    }
    console.log(i);  // Imprime 0, 1, 2, 4
}
```

**Ejemplo de uso combinado**

```javascript
let edad = 25;

if (edad >= 18) {
    console.log("Eres mayor de edad");
    for (let i = 0; i < 5; i++) {
        if (i === 3) {
            continue;  // Salta cuando i es 3
        }
        console.log(i);  // Imprime 0, 1, 2, 4
    }
} else {
    console.log("Eres menor de edad");
}
```

Tipo         Descripción                                                    Ejemplo

```javascript
if           Ejecuta código si la condición es verdadera                    if (edad >= 18) {}
else         Ejecuta código si la condición del if es falsa                 else {}
else if      Evalúa condiciones adicionales en una estructura if            else if (edad === 18)
switch       Selecciona entre múltiples posibles valores                    switch (color)
for          Repite un bloque de código un número determinado de veces      for (let i = 0; i < 5; i++) {}
while        Ejecuta un bloque de código mientras se cumpla una condición   while (i < 5) {}
do...while   Ejecuta un bloque de código al menos una vez                   do {}
break        Sale de un bucle o switch anticipadamente                      break;
continue     Salta una iteración en un bucle                                continue;

// Ejemplos
// Condicional IF (condicional simple)
var edadIngreso = 16;

if (edadIngreso >= 16) {
    alert("Felicidades, tienes edad suficiente para estudiar en el INFOTEP");
}

// Condicional IF...ELSE (Condicional doble)
var edadIngreso = 15;

if (edadIngreso >= 16) {
    alert("Felicidades, tienes edad suficiente para estudiar en el INFOTEP");
} else {
    alert("Lo sentimos, pero aún no tienes la edad suficiente para estudiar en el INFOTEP");
}

// Condicional IF...ELSE IF...ELSE (Condicional múltiple)
var num1 = 13;
var num2 = 15;

if (num1 > num2) {
    alert("El valor de la variable num1 es mayor que el valor de la variable num2.");
} else if(num1 < num2) {
    alert("El valor de la variable num2 es mayor que el valor de la variable num1.");
} else {
    alert("Los valores de las variables num1 y num2 son iguales.");
}

// Condicional IF...IF...ELSE...ELSE (Condicional anidada)
var edadIngreso = 16;
var educacion = "Bachiller";

if(edadIngreso >= 16) { // Primero se ejecuta esta condición, y si se cumple, se ejecuta la que está dentro. En caso de que esta condición no se cumpla, pasará a ejecutar el else que hace parte de ella.
    if(educacion == "Bachiller") {
        alert("Felicidades, puedes estudiar en el INFOTEP.");
    } else {
        alert("Aún no es bachiller.");
    }
} else {
    alert("Espere tener la edad mínima requerida.");
}

// Sentencia break / continue
// continue
var cadenaTexto = "Estamos estudiando el Técnico en Diseño y Creación de Software en el INFOTEP";
var caracteres = cadenaTexto.split(""); // split() divide el texto en un array de caracteres.
var resultado = "";

for(i in caracteres) {
    if(caracteres[i] == "n") {
        continue; // Continúa ejecutando el código y omite lo que se indique.
    } else {
        resultado = resultado + caracteres[i];
    }
}

alert(resultado);

// break
var cadenaTexto = "Estamos estudiando el Técnico en Diseño y Creación de Software en el INFOTEP";
var caracteres = cadenaTexto.split(""); // split() divide el texto en un array de caracteres.
var resultado = "";

for(i in caracteres) {
    if(caracteres[i] == "n") {
        break; // Detiene la ejecución del código cuando se cumple la condición.
    } else {
        resultado = resultado + caracteres[i];
    }
}

alert(resultado);

// Estructura switch...case
var combustible = "Gasolina";
switch(combustible) {
    case "Gasolina":
        alert("La gasolina tiene un precio abusivo.");
        break;
    case "Gasoil":
        alert("El gasoil es más barato que la gasolina.");
        break;
    case "GLP":
        alert("El GLP es el más barato de todos los combustibles.");    
        break;
    default:
        alert("El valor introducido no existe. Intente de nuevo.");
}

// CICLOS O BÚCLES
// Ciclo o Bucle For
for(i = 1; i <= 100; i++) {
    document.write(i + "<br>");
}

// Ciclo o bucle While
var resultado = 0;
var num = 5;
var i = 0;

while(i < num) {
    // resultado = resultado + i;
    resultado += i;
    i++;
}
alert("El resultado es " + resultado);
```
