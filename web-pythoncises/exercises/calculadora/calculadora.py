"""
    Programa que hace la funciones basica de una calculadora, 
    pidiendole al usuario dos operando y un operador,
    finalmente muestra el resultado de la operación.
"""

def calculo(primer_operando, operador, segundo_operando):
    if operador == "+":
        return  primer_operando + segundo_operando
    elif operador == "-":
        return primer_operando - segundo_operando
    elif operador == "*":
        return primer_operando * segundo_operando
    elif operador == "/":
        if segundo_operando != 0:
            return primer_operando / segundo_operando
        return ZeroDivisionError # Devolver excepción cuando intenta dividir por cero
    return None # Devolver None cuando el operador no es valido

primer_operando = input("Introduce el primer operando: ")
operador = input("Introduce el operador (+, -, *, /): ")
segundo_operando = input("Introduce el segundo operando: ")

# Diccionario de operador como clave y su respectiva operación como valor
operador_operacion = {
    "+": "suma",
    "-": "resta",
    "*": "multiplicación",
    "/": "división"
}

resultado = calculo(int(primer_operando), operador, int(segundo_operando))

# Verificar resultado y mostra mensaje de error o resultado de operacion
if resultado is ZeroDivisionError:
    print("No se puede dividir por cero")
elif resultado is None:
    print("El operador no es valido")
else:
    print(f"Resultado de la {operador_operacion.get(operador)} es: {resultado}")