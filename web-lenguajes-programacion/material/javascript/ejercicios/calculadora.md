# Ejercicios — Calculadora

**Operaciones Básicas**
Programa que solicita al usuario dos números, y mediante botones permite realizar
diferentes operaciones: suma, resta, multiplicación, división y cálculo del residuo.
Las operaciones se muestran dinámicamente en la página web.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Operaciones en básicas</title>
</head>
<body>
    

    <script>
        var numeroUno, numeroDos;

        // Solicitar números al usuario
        numeroUno = parseInt(prompt("Digite el primer número:", "Solo números"));
        numeroDos = parseInt(prompt("Digite el segundo número:", "Solo números"));

        // Validación de entrada
        if (isNaN(numeroUno) || isNaN(numeroDos)) {
            alert("Error: Debe ingresar solo números. Recargue la página e intente nuevamente.");
            throw new Error("Entrada inválida. Solo se permiten números.");
        }

        // Función para realizar y mostrar la suma
        function suma() {
            alert("Usted presionó el botón sumar.");
            document.write("<p>La suma de " + numeroUno + " + " + numeroDos + " es = " + (numeroUno + numeroDos) + ".</p>");
        }

        // Función para realizar y mostrar la resta
        function resta() {
            alert("Usted presionó el botón restar.");
            document.write("<p>La resta de " + numeroUno + " - " + numeroDos + " es = " + (numeroUno - numeroDos) + ".</p>");
        }

        // Función para realizar y mostrar la división
        function division() {
            alert("Usted presionó el botón dividir.");
            if (numeroDos === 0) {
                document.write("<p>Error: La división entre 0 no está definida.</p>");
            } else {
                document.write("<p>La división de " + numeroUno + " / " + numeroDos + " es = " + (numeroUno / numeroDos) + ".</p>");
            }
        }

        // Función para realizar y mostrar la multiplicación
        function multiplicacion() {
            alert("Usted presionó el botón multiplicar.");
            document.write("<p>La multiplicación de " + numeroUno + " * " + numeroDos + " es = " + (numeroUno * numeroDos) + ".</p>");
        }

        // Función para realizar y mostrar el residuo
        function residuo() {
            alert("Usted presionó el botón residuo.");
            document.write("<p>El residuo de " + numeroUno + " % " + numeroDos + " es = " + (numeroUno % numeroDos) + ".</p>");
        }
    </script>

    <!-- Botones para las operaciones -->
    <div>
        <button onclick="suma()">Sumar</button>
        <button onclick="resta()">Restar</button>
        <button onclick="division()">Dividir</button>
        <button onclick="multiplicacion()">Multiplicar</button>
        <button onclick="residuo()">Residuo</button>
    </div>
</body>
</html>
```
