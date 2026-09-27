# Formularios: Radio en JavaScript

Aquí se mostrará el mensaje

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formularios: Radio en JavaScript</title>
</head>
<body>
    <script>
        function contarSeleccionados() {
            var radios = document.querySelectorAll('input[name="estudios"]');
            var mensaje = "Debes seleccionar una opción";

            radios.forEach(function(radio) {
                if (radio.checked) {
                    if (radio.id === 'radio1') {
                        mensaje = "No tienes estudios.";
                    } else if (radio.id === 'radio2') {
                        mensaje = "Tienes estudios primarios.";
                    } else if (radio.id === 'radio3') {
                        mensaje = "Tienes estudios secundarios.";
                    } else if (radio.id === 'radio4') {
                        mensaje = "Tienes estudios universitarios.";
                    }
                }
            });

            // Mostrar el mensaje en la página
            document.getElementById("mensaje").innerHTML = mensaje;
        }
    </script>

    <h4>Uso de los radio button</h4>
    <form>
        <input type="radio" id="radio1" name="estudios">Sin estudios<br>
        <input type="radio" id="radio2" name="estudios">Primarios<br>
        <input type="radio" id="radio3" name="estudios">Secundarios<br>
        <input type="radio" id="radio4" name="estudios">Universitarios<br>
        <input type="button" value="Mostrar" onclick="contarSeleccionados()">
    </form>

    <p id="mensaje"></p> 
</body>
</html>
```
