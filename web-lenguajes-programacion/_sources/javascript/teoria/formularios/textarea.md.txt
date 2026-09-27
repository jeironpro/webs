# Formularios: textarea en JavaScript

Aquí se mostrará el mensaje

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formularios: textarea en JavaScript</title>
</head>
<body>
    <script>
        function restrigirCaracteres() {
            var textarea = document.getElementById("curriculum");
            var mensaje = document.getElementById("mensaje");
            var maxCaracteres = 20;

            if (textarea.value.length > maxCaracteres) {
                mensaje.innerHTML = "Curriculum muy largo, el máximo son " + maxCaracteres + " caracteres.";
                textarea.value = textarea.value.substring(0, maxCaracteres); // Limitar el texto a 20 caracteres
            } else {
                mensaje.innerHTML = "Ha introducido la cantidad correcta de caracteres. Quedan " + (maxCaracteres - textarea.value.length) + " caracteres.";
            }
        }
    </script>

    <form>
        <textarea id="curriculum" cols="50" rows="10" oninput="restrigirCaracteres()"></textarea>
        <br>
        <input type="button" value="Mostrar" onclick="restrigirCaracteres()">
    </form>

    <p id="mensaje"></p> 
</body>
</html>
```
