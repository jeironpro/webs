"""
    Programa que permite al usuario agregar, registrar, marcar y mostrar hábitos diarios. Además, permite ver el progreso de cada hábito registrado.
"""
"""
Estos datos no son persistentes, se debería usar un JSON o una base de datos para que los datos permanezcan guardados
"""
habitos = {}

def agregar_habito(nombre):
    if nombre not in habitos:
        habitos[nombre] = []
        print("Hábito agregado correctamente")
    else:
        print("Este hábito ya existe")

def registrar_habito(nombre, fecha):
    fechas = habitos[nombre]
    fechas.append(fecha)
    print(f"Hábito registrado para {fecha}")

def mostrar_progreso(nombre):
    if nombre in habitos:
        fechas = habitos[nombre]
        total_dias = len(fechas)
        print(f"Has cumplido este hábito {total_dias} {"vez" if total_dias == 1 else "veces"}")
        print(f"Fechas: {', '.join(fechas)}")
    else:
        print("Este hábito no existe")

def listar_habitos():
    if habitos:
        print("Tus hábitos son:")

        for habito in habitos.keys():
            print(f"- {habito}")
    else:
        print("Aún no tienes hábitos registrados")

# Función principal
def menu():
    while True:
        print("Rastreador de hábitos")
        print("1. Agregar hábito")
        print("2. Registrar hábito cumplido")
        print("3. Mostrar progreso")
        print("4. Listar hábitos")
        print("5. Salir")

        opcion = input("Elige una opción: ")

        if opcion == "1":
            nombre_habito = input("Ingresa el nombre del habito: ")
            agregar_habito(nombre_habito)
        elif opcion == "2":
            nombre_habito = input("Ingresa el nombre del habito: ")

            if nombre_habito in habitos:
                fecha = input("Fecha (YYYY-MM-DD): ")
                registrar_habito(nombre_habito, fecha)
            else:
                print("Este hábito no existe")
        elif opcion == "3":
            nombre_habito = input("Ingresa el nombre del habito: ")
            mostrar_progreso(nombre_habito)
        elif opcion == "4":
            listar_habitos()
        elif opcion == "5":
            print("Adios")
            break
        else:
            print("Opción inválida")

menu() # Iniciar el programa