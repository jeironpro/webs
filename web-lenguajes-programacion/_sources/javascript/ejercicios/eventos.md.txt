# Ejercicios — Eventos

**Cambiar el color de fondo al pasar el ratón**
Programa que crea una tabla con celdas que cambian su color de fondo cuando el usuario pasa el ratón sobre ellas.
Al salir el puntero de la celda, el color de fondo vuelve a ser blanco.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambiar el color de fondo al pasar el ratón</title>
    <style>
        table {
            border-collapse: collapse;
            width: 50%;
            margin: 20px auto;
            text-align: center;
        }
        td {
            padding: 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    
    <script>
        // Función para cambiar el color de fondo de un elemento
        function pintar(objeto, col) {
            objeto.style.backgroundColor = col;
        }
    </script>
    
    <!-- Tabla con celdas interactivas -->
    <table border="1">
        <tr>
            <td onmouseover="pintar(this, '#ff0000')" onmouseout="pintar(this, '#ffffff')">Rojo</td>
            <td onmouseover="pintar(this, '#00ff00')" onmouseout="pintar(this, '#ffffff')">Verde</td>
            <td onmouseover="pintar(this, '#0000ff')" onmouseout="pintar(this, '#ffffff')">Azul</td>
        </tr>
    </table>
</body>
</html>
```
