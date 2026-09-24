"""
    Programa que pide una cantidad, una moneda de origen, una moneda destino al usuario,
    y utiliza la API de frankfurter para obtener los datos de la conversion,
    finalmente muestra el resultado
"""
import requests

def convertir_moneda(cantidad, origen, destino):
    url = f"https://api.frankfurter.app/latest?amount={cantidad}&from={origen}&to={destino}"

    respuesta = requests.get(url) # Petición get a la API
    datos = respuesta.json() # Convertir la respuesta a JSON
    return datos

cantidad = input("Introduce la cantidad: ")
moneda_origen = input("Introduce la moneda origen: ").upper()
moneda_destino = input("Introduce la moneda destino: ").upper()

conversion = convertir_moneda(cantidad, moneda_origen, moneda_destino)

if 'not found' in conversion.values():
    print("Lo sentimos. No hay datos para esta conversión")
else:
    resultado = conversion['rates'][moneda_destino]
    print(f"{cantidad} {moneda_origen} = {resultado:.2f} {moneda_destino}")