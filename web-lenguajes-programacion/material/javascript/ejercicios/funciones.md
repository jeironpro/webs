# Ejercicios — Funciones

**Cálculos matemáticos**
Programa que realiza cálculos matemáticos usando diferentes funciones:
1. Una operación combinada con 5 números.
2. Operaciones básicas (suma, resta, multiplicación, división) con dos números.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cálculos matemáticos</title>
</head>
<body>
    
    <script>
        // Función para realizar una operación combinada con 5 números
        function calculo(num1, num2, num3, num4, num5) {
            let resultado = ((num1 + num2) * num3 - num4) / num5;
            document.write("El resultado del cálculo es " + resultado + "<br>");
        }

        // Llamada a la función con valores fijos
        calculo(250, 750, 2, 1950, 4);

        // Solicitar números al usuario
        let num1 = parseInt(prompt("Introduzca el primer número:"));
        let num2 = parseInt(prompt("Introduzca el segundo número:"));
        let num3 = parseInt(prompt("Introduzca el tercer número:"));
        let num4 = parseInt(prompt("Introduzca el cuarto número:"));
        let num5 = parseInt(prompt("Introduzca el quinto número:"));

        // Llamada a la función con valores ingresados por el usuario
        calculo(num1, num2, num3, num4, num5);

        // Función para realizar operaciones básicas con dos números
        function calculosBasicos(a, b) {
            document.write("El resultado de la suma es " + (a + b) + "<br>");
            document.write("El resultado de la resta es " + (a - b) + "<br>");
            document.write("El resultado de la multiplicación es " + (a * b) + "<br>");
            document.write("El resultado de la división es " + (a / b) + "<br>");
        }

        // Variables para operaciones básicas
        let numero1 = 20;
        let numero2 = 13;

        // Llamada a la función para operaciones básicas
        calculosBasicos(numero1, numero2);
    </script>
</body>
</html>
```
