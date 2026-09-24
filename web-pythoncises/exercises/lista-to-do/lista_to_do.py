"""
    Programa que permite agregar, marcar, eliminar y ver tareas, para añadir tarea se pide al usuario el nombre y se guarda con un id que incrementa automaticamente al estilo de una base de datos y además, se marca como incompleta, para permitir al usuario la opción de marcarla completada posteriormente, finalmente la eliminación de las tareas se hacen mediante eliminar el ID. 
"""
import json
import os

ruta_archivo = "tareas.json"

# Verificar si el archivo no existe y crearlo
if not os.path.exists(ruta_archivo):
    with open(ruta_archivo, "w") as tareas:
        json.dump([], tareas)
    print(f"Creando el archivo {ruta_archivo}")

def cargar_tareas():
    with open(ruta_archivo, "r") as tareas:
        contenido = json.load(tareas)

    if contenido:
        return contenido
    else:
        return []

def guardar_tareas(lista):
    with open(ruta_archivo, "w") as tareas:
        tareas.write(json.dumps(lista, indent=4))

def mostrar_tareas(lista):
    if not lista:
        print("No hay tareas")
    else:
        print("\n--- TAREAS ---")
        for tarea in lista:
            estado = "✔" if tarea["completada"] else "✖"
            print(f"{tarea['id']}: {tarea['nombre']} ({estado})")
        print("----------------\n")

def agregar_tarea(lista):
    ultimo_id = max((tarea["id"] for tarea in lista), default=0)

    nombre = input("Ingrese el nombre de la tarea: ")

    nueva_tarea = {
        "id": ultimo_id + 1,
        "nombre": nombre,
        "completada": False
    }

    lista.append(nueva_tarea)
    guardar_tareas(lista)
    print("Tarea agregada correctamente")

def marcar_completada(lista):
    mostrar_tareas(lista)

    tarea_id = int(input("Ingrese el ID de la tarea: "))

    for tarea in lista:
        if tarea["id"] == tarea_id:
            tarea["completada"] = True
            guardar_tareas(lista)
            print("Tarea marcada como completada")
        else:
            print("El ID es inválido")

def eliminar_tarea(lista):
    mostrar_tareas(lista)

    tarea_id = int(input("Ingrese el ID de la tarea: "))

    for tarea in lista:
        if tarea["id"] == tarea_id:
            lista.remove(tarea)
            guardar_tareas(lista)
            print("Tarea eliminada correctamente")
        else:
            print("El ID es inválido")

def mostrar_menu():
    print("--- LISTA TO-DO ---")
    print("1. Ver tareas")
    print("2. Agregar tarea")
    print("3. Marcar tarea como completada")
    print("4. Eliminar tarea")
    print("5. Salir")    

LISTA_TAREAS = cargar_tareas()

while True:
    mostrar_menu()

    opcion = input("Elige una opcion: ")

    if opcion == "1":
        mostrar_tareas(LISTA_TAREAS)
    elif opcion == "2":
        agregar_tarea(LISTA_TAREAS)
    elif opcion == "3":
        marcar_completada(LISTA_TAREAS)
    elif opcion == "4":
        eliminar_tarea(LISTA_TAREAS)
    elif opcion == "5":
        print("Adios")
        break
    else:
        print("Opción no válida")