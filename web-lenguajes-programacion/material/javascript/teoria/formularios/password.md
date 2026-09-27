# Formularios: Password en JavaScript

Aquí se mostrará el mensaje de validación

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formularios: Password en JavaScript</title>
</head>
<body>
    <script>
        function verificar() {
            var clave = document.getElementById("clave").value;
            var mensaje = document.getElementById("mensaje");
            
            // Limpiar el mensaje anterior
            mensaje.innerHTML = "";

            if(clave.length < 8) {
                mensaje.innerHTML = "<span style='color: red;'>La contraseña no puede tener menos de 8 caracteres.</span>";
            } else {
                mensaje.innerHTML = "<span style='color: green;'>La cantidad de caracteres de la contraseña es correcta.</span>";
            }

            // Opcionalmente, restablecer el campo de entrada de la contraseña
            // document.getElementById("clave").value = ""; // Si quieres limpiar el campo después de verificar
        }
    </script>
    <form>
        <label for="clave">Ingrese una contraseña:</label>
        <input type="password" id="clave">
        <br>
        <input type="button" value="Confirmar" onclick="verificar()">
    </form>

    <p id="mensaje"></p> 
</body>
</html>
```
