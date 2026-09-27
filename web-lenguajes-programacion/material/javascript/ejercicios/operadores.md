# Ejercicios — Operadores

**Operaciones en JavaScript**
Programa solicita al usuario dos números y permite realizar operaciones matemáticas básicas:
suma, resta, multiplicación, división y residuo. Cada operación se ejecuta cuando el usuario
presiona el botón correspondiente. Los resultados de las operaciones se muestran en el documento
utilizando la función document.write().

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Operaciones en JavaScript</title>
</head>
<body>
    

    <script>
        // En la misma fila se puede declarar más de una variable.
        var numeroUno, numeroDos;
        // El prompt permite introducir datos. De manera predeterminada los datos son cadenas de caracteres/Strings.
        // parseInt indica que es un entero. (convierte)
        // Dentro del prompt, después de indicar lo que queremos que se introduzca, podemos ponerle un mensaje con indicaciones de lo que se requiere con una coma y dentro de comillas.
        numeroUno = parseInt(prompt("Digite el primer numero:", "solo números"));
        numeroDos = parseInt(prompt("Digite el segundo numero:"));

        // Función para la suma
        function suma() {
            alert("Usted presionó el botón sumar");
            // Las variables no van dentro de comillas.
            // El <p> cerrador debe quedar fuera de los paréntesis porque las variables no pueden terminar dentro de comillas.
            document.write("<p>La suma de " + numeroUno + " + " + numeroDos + " es = " + (numeroUno + numeroDos) + "</p>");
        }

        // Función para la resta
        function resta() {
            alert("Usted presionó el botón restar");
            document.write("<p>La resta de " + numeroUno + " - " + numeroDos + " es = " + (numeroUno - numeroDos) + "</p>");
        }

        // Función para la división
        function division() {
            alert("Usted presionó el botón dividir");
            document.write("<p>La división de " + numeroUno + " / " + numeroDos + " es = " + (numeroUno / numeroDos) + "</p>");
        }

        // Función para la multiplicación
        function multiplicacion() {
            alert("Usted presionó el botón multiplicar");
            document.write("<p>La multiplicación de " + numeroUno + " * " + numeroDos + " es = " + (numeroUno * numeroDos) + "</p>");
        }

        // Función para el residuo
        function residuo() {
            alert("Usted presionó el botón residuo");
            document.write("<p>El residuo de " + numeroUno + " % " + numeroDos + " es = " + (numeroUno % numeroDos) + "</p>");
        }
    </script>

    <!-- Formularios para cada operación -->
    <form action="">
        <input type="button" onclick="suma()" value="Sumar">
    </form>
    <form action="">
        <input type="button" onclick="resta()" value="Restar">
    </form>
    <form action="">
        <input type="button" onclick="division()" value="Dividir">
    </form>
    <form action="">
        <input type="button" onclick="multiplicacion()" value="Multiplicar">
    </form>
    <form action="">
        <input type="button" onclick="residuo()" value="Residuo">
    </form>
</body>
</html>
```
