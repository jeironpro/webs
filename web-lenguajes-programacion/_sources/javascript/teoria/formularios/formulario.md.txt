# Manejo de Formularios en Javascript

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manejo de Formularios en Javascript</title>
    <link rel="stylesheet" href="../css/estilosFormulario.css">
    <script src="../js/formulario.js" defer></script>
    <style>
        h3 {
            text-align: center;
        }

        form {
            margin: auto;
        }

        #formulario {
            background-color: #2c8f77;
            border: 2px solid #000;
            color: #fff;
            display: table;
            padding: 15px;
        }

        .fila {
            display: table-row;
        }

        .fila label {
            display: table-cell;
            padding: 12px;
            text-align: right;
        }

        .fila input {
            display: table-cell;
            padding: 2px;
        }
    </style>
</head>
<body>
    <h3>Llene el siguiente formulario y haga clic en el botón "Ordenar" para enviar el pedido</h3>
    <form action="mensaje.html" id="formulario" method="get" onsubmit="return validarCajaTexto()">
        <div class="fila">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="fila">
            <label for="dir">Dirección:</label>
            <input type="text" id="dir" name="direccion" required>
        </div>
        <div class="fila">
            <label for="tel">Teléfono:</label>
            <input type="tel" id="tel" name="telefono" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
            <small>Formato: 123-456-7890</small>
        </div>
        <div class="fila">
            <label for="correo">Correo:</label>
            <input type="email" id="correo" name="correo" required>
        </div>
        <input type="submit" value="Ordenar">
    </form>
</body>
</html>
```
