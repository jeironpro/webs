"""
    Programa que calcula la propina y el monto total de una cuenta.
    Pide al usuario el monto de la cuenta y el porcentaje de la propina 
    y muestra el monto total de la cuenta y la propina a pagar
"""
monto_cuenta = input("Introduce el monto de la cuenta: ")
porcentaje_propina = input("Introduce el porcentaje de la propina: ")

monto_cuenta_entero = float(monto_cuenta)
porcentaje_propina_entero = float(porcentaje_propina)

propina = (porcentaje_propina_entero / 100) * monto_cuenta_entero # Calculo de la propina

monto_total_cuenta = monto_cuenta_entero + propina

print(f"Monto total: {monto_total_cuenta}")
print(f"Propina: {propina}")