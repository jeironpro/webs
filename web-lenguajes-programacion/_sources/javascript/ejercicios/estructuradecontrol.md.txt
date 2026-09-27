# Ejercicios — Estructura de control

**Verificar edad**
Programa que pide al usuario que ingrese su edad.
Si la edad es mayor o igual a 16, se muestra un mensaje de felicitación.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificar edad</title>
</head>
<body>
    
    <script>
        // Condicional IF (condicional simple)
        var edadIngreso;
        edadIngreso = parseInt(prompt("Introduzca su edad:"));
        
        if (edadIngreso >= 16) {
            alert("Felicidades, tienes edad suficiente para estudiar en el INFOTEP");
        }

        // Condicional IF...ELSE (Condicional doble)
        // Se vuelve a pedir la edad y se evalúa si es mayor o igual a 16.
        // Si es así, se felicita al usuario; de lo contrario, se le informa que no tiene la edad suficiente.
        edadIngreso = parseInt(prompt("Introduzca su edad:"));

        if (edadIngreso >= 16) {
            alert("Felicidades, tienes edad suficiente para estudiar en el INFOTEP");
        } else {
            alert("Lo sentimos, pero aun no tienes la edad suficiente para estudiar en el INFOTEP");
        }

        // Condicional IF...ELSE IF...ELSE (Condicional múltiple)
        // El usuario ingresa dos números.
        // Dependiendo de cuál sea mayor, se muestra un mensaje indicándolo.
        // Si son iguales, se informa que ambos números son iguales.
        var num1;
        var num2;

        num1 = parseInt(prompt("Introduzca el primer numero:"));
        num2 = parseInt(prompt("Introduzca el segundo numero:"));

        if (num1 > num2) {
            alert("El valor de la variable num1 es mayor que el valor de variable num2.");
        } else if(num1 < num2) {
            alert("El valor de la variable num2 es mayor que el valor de la variable num1.");
        } else {
            alert("Los valores de las variables num1 y num2 son iguales.");
        }

        // Condicional IF...IF...ELSE...ELSE (Condicional anidada)
        // Se evalúa si el usuario tiene la edad suficiente (mayor o igual a 16) y si tiene el nivel académico de "Bachiller".
        // Dependiendo de estas condiciones, se muestra un mensaje apropiado.
        var edadIngreso;
        var educacion;

        edadIngreso = parseInt(prompt("Introduzca su edad:"));
        educacion = prompt("Escriba su nivel académico");

        if(edadIngreso >= 16) {
            if(educacion == "Bachiller") {
                alert("Felicidades, puedes estudiar en el INFOTEP.");
            } else {
                alert("Aun no es bachiller.");
            }
        } else {
            alert("Espere tener la edad minima requerida.");
        }

        // Estructura switch...case
        // Dependiendo del tipo de combustible ingresado, se muestra un mensaje sobre el precio de ese combustible.
        // Si el tipo no se encuentra, se muestra un mensaje de error.
        var combustible;
        combustible = prompt("Introduzca el tipo de combustible:");

        switch (combustible) {
            case "Gasolina":
                alert("La gasolina tiene un precio abusivo.");
                break;
            case "Gasoil":
                alert("El gasoil es mas barato que la gasolina.");
                break;
            case "GLP":
                alert("El GLP es el mas barato de todos los combustibles.");
                break;
            default:
                alert("El valor introducido no existe. Intente de nuevo.");
        }
    </script>
</body>
</html>
```
