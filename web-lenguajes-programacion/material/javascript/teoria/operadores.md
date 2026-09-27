# Operadores

**Operadores en JavaScript**
En JavaScript, los operadores son símbolos o palabras clave que se utilizan para realizar operaciones sobre valores o variables. Se dividen en varias categorías según su funcionalidad.

- **1.** Operadores aritméticos
  Se usan para realizar cálculos matemáticos.

Operador   Descripción                     Ejemplo   Resultado
+          Suma                            5 + 2     7
-          Resta                           5 - 2     3
*          Multiplicación                  5 * 2     10
/          División                        5 / 2     2.5
%          Módulo (resto de la división)   5 % 2     1
**         Exponenciación                  5 ** 2    25

- **2.** Operadores de asignación
  Se usan para asignar valores a las variables.

Operador   Descripción                   Ejemplo   Resultado
=          Asignación simple             x = 5     x es 5
+=         Suma y asignación             x += 2    x = x + 2
-=         Resta y asignación            x -= 2    x = x - 2
*=         Multiplicación y asignación   x *= 2    x = x * 2
/=         División y asignación         x /= 2    x = x / 2
%=         Módulo y asignación           x %= 2    x = x % 2

- **3.** Operadores de comparación
  Se usan para comparar valores y devuelven un valor booleano (true o false).

**Operador   Descripción               Ejemplo     Resultado**
==         Igualdad                  5 == "5"    true
===        Estrictamente igual       5 === "5"   false
!=         Diferente                 5 != "5"    false
!==        Estrictamente diferente   5 !== "5"   true
>          Mayor que                 5 > 2       true
<          Menor que                 5 < 2       false
>=         Mayor o igual que         5 >= 5      true
<=         Menor o igual que         5 <= 4      false

- **4.** Operadores lógicos
  Se usan para combinar expresiones lógicas.

**Operador   Descripción   Ejemplo         Resultado**
&&         AND(y)        true && false   false
||         OR(o)         true || false   true
!          NOT(no)       !true           false

- **5.** Operadores de incremento y decremento
  Se usan para aumentar o disminuir el valor de una variable en 1.

**Operador   Descripción   Ejemplo   Resultado**
++         Incremento    x++       Incrementa después de usar
--         Decremento    x--       Decrementa después de usar

**Ejemplo**

```javascript
let x = 5;
console.log(x++); // Imprime 5, luego x es 6
console.log(++x); // Incrementa primero, luego imprime 7
```

- **6.** Operadores de tipo
  Se usan para verificar o convertir tipos de datos.

Operador     Descripción                Ejemplo               Resultado
typeof       Devuelve el tipo de dato   typeof 5              "number"
instanceof   Verifica si es instancia   x instanceof Object   true/false

- **7.** Operador ternario
  Se utiliza como una forma abreviada de la instrucción if-else.

**Sintaxis**

```javascript
condición ? valor_si_verdadero : valor_si_falso;
```

**Ejemplo**

```javascript
let edad = 18;
let mensaje = (edad >= 18) ? "Mayor de edad" : "Menor de edad";
console.log(mensaje); // "Mayor de edad"
```

- **8.** Operadores de cadenas
  Se usan para manipular cadenas de texto.

Operador   Descripción                Ejemplo              Resultado
+          Concatenación de cadenas   "Hola" + " Mundo"    "Hola Mundo"
+=         Concatenar y asignar       mensaje += "Mundo"   mensaje = mensaje + "Mundo"

```javascript
// Ejemplos
// Operador de asignación (=): Se utiliza para asignar valores a las variables
var num = 15;

document.write("El valor de la variable es: " + num + "<br>");

// Operadores de Incremento y Decremento
// PosIncremento (variable++)
var num2 = 8;
var num3 = 9;
// Los incrementos se utilizan mejor en bucles.
num2++;

resPosIncremento = num2 + num3;

// alert("El resultado del PosIncremento es " + resPosIncremento);

// PreIncremento (++variable)
var num4 = 8;
var num5 = 9;

resPreIncremento = ++num4 + num5;

// alert("El resultado del PreIncremento es " + resPreIncremento);

// PostDecremento (variable--)
var num6 = 8;
var num7 = 9;
num6--;

resPostDecremento = num6 + num7;

// alert("El resultado del PostDecremento es " + resPostDecremento);

// PreDecremento (--variable)
var num8 = 8;
var num9 = 9;

resPreDecremento = --num8 + num9;

// alert("El resultado del PreDecremento es " + resPreDecremento);

/* OPERADORES LÓGICOS: Se utilizan al momento de realizar operaciones complejas, pues permiten tomar decisiones acerca de las instrucciones que debe ejecutar el programa bajo ciertas condiciones. */
// Operador de negación (!), se utiliza para obtener el valor contrario al valor de la variable
var califica = false;

// alert("El resultado del operador de negación es " + !califica + ", aunque el valor anterior era " + califica);

/* Operador AND (&&), es verdadero solo cuando ambas condiciones son verdaderas */
// Si ambas condiciones no son verdaderas, el resultado será falso (false)
var valor1 = true;
var valor2 = true;
resultado = valor1 && valor2;

// alert("El resultado del operador AND es " + resultado);

/* Operador OR (||), es verdadero cuando una o ambas condiciones son verdaderas */
// Si ambas condiciones no son verdaderas, el resultado será falso (false)
// En este caso, aunque tengamos una variable con el mismo nombre, se sobreescribe.
var valor1 = false;
var valor2 = false;
resultado = valor1 || valor2;

// alert("El resultado del operador OR es " + resultado);

// OPERADORES DE RELACIÓN
// Operador Mayor que (>)
var numMayor1 = 120;
var numMayor2 = 80;
resMayor = numMayor1 > numMayor2;

alert("El resultado del operador Mayor que es " + resMayor);

// Operador Menor que (<)
var numMenor1 = 120;
var numMenor2 = 80;
resMenor = numMenor1 < numMenor2;

alert("El resultado del operador Menor que es " + resMenor);

// Operador Diferente que (!=) 
var numDiferente1 = 120;
var numDiferente2 = 80;
resDiferente = numDiferente1 != numDiferente2;

alert("El resultado del operador Diferente que es " + resDiferente);

// Operador Idéntico que (===)
var numIdentico1 = 120;
var numIdentico2 = "120";
resIdentico = numIdentico1 === numIdentico2;

alert("El resultado del operador Idéntico que es " + resIdentico);
```
