# Ejercicios — Salario

**Cálculo del sueldo neto**
Programa que calcula el sueldo neto de un empleado en base a las horas trabajadas
y el pago por hora. Aplica un descuento del 10% al sueldo bruto para determinar el sueldo neto.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cálculo del sueldo neto</title>
</head>
<body>
    
    <script>
        // Declaración de variables
        var horasTrabajadas;
        var pagoHora;
        var sueldoBruto;
        var porcentajeDescuento = 10; // Porcentaje del descuento (10%)
        var descuento;
        var sueldoNeto;

        // Solicitar datos al usuario
        horasTrabajadas = parseInt(prompt("¿Cuántas horas trabajó usted?:"));
        pagoHora = parseInt(prompt("¿Cuál es el pago por cada hora?:"));

        // Cálculos
        sueldoBruto = horasTrabajadas * pagoHora; // Sueldo bruto antes del descuento
        descuento = (sueldoBruto * porcentajeDescuento) / 100; // Cálculo del descuento
        sueldoNeto = sueldoBruto - descuento; // Sueldo neto después del descuento

        // Mostrar resultados
        document.write(
            "Usted trabajó " + horasTrabajadas + 
            " horas en la semana a un precio de " + pagoHora + 
            " pesos la hora, para un total de " + sueldoBruto + 
            " pesos. Además, se le realizó un descuento del " + porcentajeDescuento + 
            "% (equivalente a " + descuento + 
            " pesos). Por lo que su total a cobrar es de " + sueldoNeto + " pesos."
        );
    </script>
</body>
</html>
```
