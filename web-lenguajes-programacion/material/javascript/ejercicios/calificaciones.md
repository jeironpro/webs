# Ejercicios — Calificaciones

**Obtener promedio de calificaciones**
programa que solicita al usuario que introduzca su nombre y las calificaciones obtenidas en tres materias: HTML, CSS y JavaScript. Calcula el promedio de estas calificaciones y, según el resultado, muestra un mensaje indicando si el usuario ha aprobado o no.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Obtener promedio de calificaciones</title>
</head>
<body>
    
    <script>
        var nombre;
        var html;
        var css;
        var javascript;
        var promedio;

        nombre = prompt("Introduzca su nombre:");
        html = parseInt(prompt("Introduzca su calificación en HTML:"));
        css = parseInt(prompt("Introduzca su calificación en CSS:"));
        javascript = parseInt(prompt("Introduzca su calificación en JavaScript:"));
        
        promedio = parseInt((html + css + javascript) / 3); // redondea totalmente

        if (promedio < 60) {
            alert("Hola " + nombre + ". Sus notas en Diseño y Creación de Software son las siguientes: HTML = " + html +
            ", CSS = " + css + ", JavaScript = " + javascript + ". Por lo que su promedio es de " + promedio + ". Por lo tanto, usted no ha aprobado.");
        } else {
            alert("Hola " + nombre + ". Sus notas en Diseño y Creación de Software son las siguientes: HTML = " + html +
            ", CSS = " + css + ", JavaScript = " + javascript + ". Por lo que su promedio es de " + promedio + ". Por lo tanto, usted ha aprobado.");
        }
    </script>
</body>
</html>
```
