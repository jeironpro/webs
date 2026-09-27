# Formularios: Checkbox en JavaScript

El mensaje será mostrado aquí

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Formularios: Checkbox en JavaScript</title>
</head>
<body>
    <script>
        function contarSeleccionados() {
            var checkboxes = document.querySelectorAll('input[type="checkbox"]');
            var cant = 0;

            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    cant++;
                }
            });

            // Mostrar el mensaje en la página
            document.getElementById("mensaje").innerHTML = "Usted conoce " + cant + " lenguajes de programación.";
        }
    </script>

    <h4>Uso de los checkbox</h4>
    <form>
        <input type="checkbox" id="checkbox1">JavaScript<br>
        <input type="checkbox" id="checkbox2">PHP<br>
        <input type="checkbox" id="checkbox3">Python<br>
        <input type="checkbox" id="checkbox4">C#<br>
        <input type="button" value="Mostrar" onclick="contarSeleccionados()">
    </form>

    <p id="mensaje"></p> 
</body>
</html>
```
