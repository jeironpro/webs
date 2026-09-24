"""
    Programa que genera un chiste por petición, muestra un menu de dos opciones al usuario, permitiendo generar un chiste y salir del generador.
"""
import random
import os
import time

def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')

def obtener_chiste(lista):
    return random.choice(lista)

lista_chistes = [
    "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.",
    "¿Cómo se despiden los químicos? Ácido un placer.",
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
    "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
    "¿Qué le dice un jardinero a otro? ¡Disfruta tu día, hoja!",
    "¿Qué hace una vaca cuando sale el sol? Sombra.",
    "¿Por qué los esqueletos no pelean entre ellos? Porque no tienen agallas.",
    "¿Cómo se llama un boomerang que no vuelve? Palo.",
    "¿Cuál es el café más peligroso del mundo? El ex-preso.",
    "¿Por qué los peces no usan computadoras? Porque les da miedo el net.",
    "¿Qué hace un programador cuando tiene frío? Se pone un 'loop'.",
    "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 = DEC 25.",
    "¿Cuántos programadores hacen falta para cambiar una bombilla? Ninguno, eso es un problema de hardware.",
    "¿Por qué Python es tan tranquilo? Porque no tiene punteros.",
    "¿Qué le dice un bit a otro bit? Nos vemos en el bus.",
    "¿Cómo llamas a un gato que sabe programar? Un purr-ogramador.",
    "¿Qué hace un HTML en una fiesta? Se divierte en línea.",
    "¿Por qué Java es tan optimista? Porque siempre encuentra una excepción.",
    "¿Cómo se llama un programador sin novia? Soltero (null pointer).",
    "¿Qué le dice un array vacío a otro array vacío? '¿Nos encontramos en la memoria?'",
    "¿Por qué los pájaros no usan el ordenador? Porque les da miedo el ratón.",
    "¿Cómo se despiden los programadores? ¡Hasta el próximo ciclo!",
    "¿Qué hace un electricista en la computadora? Toma un byte.",
    "¿Por qué los esqueletos no pelean en línea? Porque se les cae el backbone.",
    "¿Qué le dice un bug a otro bug? ¡Corre que nos van a depurar!",
    "¿Cuál es el colmo de un jardinero? Que siempre lo planten.",
    "¿Qué hace una computadora en la playa? Surf en la web.",
    "¿Por qué los programadores aman el café? Porque les da Java.",
    "¿Qué hace un bit triste? Se convierte en un 0 solitario.",
    "¿Cuál es el colmo de un carpintero? Que siempre lo claven.",
    "¿Por qué los fantasmas aman el ascensor? Porque les sube el espíritu.",
    "¿Qué le dice un diodo a otro? 'No me pases corriente.'",
    "¿Cuál es el animal más antiguo? La cebra, porque está en blanco y negro.",
    "¿Cómo se despiden los químicos? Ácido un gusto.",
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
    "¿Por qué los peces no usan internet? Porque les da miedo la red.",
    "¿Cuál es el colmo de un electricista? Que no tenga corriente.",
    "¿Qué hace un programador en el desierto? Busca la función oasis().",
    "¿Por qué los programadores aman el teclado? Porque les da espacio.",
    "¿Qué le dice un bug a un programador? 'Nos vemos en producción.'",
    "¿Cuál es el colmo de un astronauta? Que siempre esté en las nubes.",
    "¿Qué hace un matemático en la playa? Suma arena.",
    "¿Por qué los programadores odian la playa? Porque tiene demasiadas arenas de bits.",
    "¿Cómo llamas a un programador dormido? Un thread inactivo.",
    "¿Qué hace un router en la fiesta? Dirige el tráfico.",
    "¿Por qué el ordenador fue al doctor? Porque tenía un virus.",
    "¿Cuál es el colmo de un panadero? Que siempre lo amasen.",
    "¿Qué hace un array en el gimnasio? Se estira.",
    "¿Por qué los programadores aman los videojuegos? Porque siempre tienen loops infinitos.",
    "¿Qué hace un bit en la fiesta? Se mezcla con otros bits.",
    "¿Cómo se llama un gato que sabe usar Git? Un commit felino.",
    "¿Qué hace un ordenador en la cocina? Procesa datos.",
    "¿Por qué los programadores usan lentes? Para ver el código claro.",
    "¿Cuál es el colmo de un fotógrafo? Que siempre lo enfoquen.",
    "¿Qué hace un HTML triste? Se queda sin estilo.",
    "¿Por qué los programadores aman Python? Porque no tiene problemas de sintaxis.",
    "¿Qué hace un electricista en la fiesta? Se conecta.",
    "¿Cómo se despiden los químicos? Hasta la reacción.",
    "¿Qué hace un matemático en el parque? Integra.",
    "¿Por qué los fantasmas no mienten? Porque se les ve a través.",
    "¿Qué hace un programador en la cocina? Depura la receta.",
    "¿Cuál es el colmo de un panadero? Que siempre lo amasen.",
    "¿Qué hace un array feliz? Se llena de valores.",
    "¿Por qué los programadores aman los loops? Porque nunca terminan.",
    "¿Qué hace un bug en vacaciones? Se esconde.",
    "¿Cómo se llama un dinosaurio programador? Dino-code.",
    "¿Qué hace un router triste? Se desconecta.",
    "¿Por qué los programadores aman el chocolate? Porque es sweet y tiene bytes.",
    "¿Qué le dice un cero a un ocho? ¡Bonito cinturón!",
    "¿Cuál es el colmo de un carnicero? Que siempre lo corten.",
    "¿Qué hace un bug en el ordenador? Se multiplica.",
    "¿Por qué los programadores odian los ascensores? Porque prefieren los bucles.",
    "¿Cómo se llama un ordenador lento? Tortu-PC.",
    "¿Qué hace un matemático en la fiesta? Suma amigos.",
    "¿Por qué los fantasmas aman los puzzles? Porque encajan perfectamente.",
    "¿Qué hace un bit rebelde? Cambia su valor.",
    "¿Cómo se despiden los hackers? Ctrl+Alt+Adiós.",
    "¿Qué hace un array vacío? Nada.",
    "¿Por qué JavaScript es travieso? Porque siempre cambia de tipo.",
    "¿Qué hace un bug en la red? Intercepta paquetes.",
    "¿Cuál es el colmo de un cartero? Que nunca le lleguen cartas.",
    "¿Qué hace un programador en la playa? Debuggea la arena.",
    "¿Por qué los ordenadores nunca tienen hambre? Porque siempre tienen bytes.",
    "¿Qué hace un bit en la playa? Nada, es un 0.",
    "¿Cómo se llama un programador valiente? Code-hero.",
    "¿Qué hace un router feliz? Distribuye alegría.",
    "¿Por qué los programadores aman Linux? Porque es libre.",
    "¿Qué hace un bug en un programa? Rompe la diversión.",
    "¿Cuál es el colmo de un músico? Que siempre lo desafinen.",
    "¿Qué hace un array enojado? Se sale de rango.",
    "¿Por qué los fantasmas aman el código? Porque es transparente.",
    "¿Qué hace un programador romántico? Le declara amor al código.",
    "¿Cómo se despiden los programadores? ¡Nos vemos en el próximo commit!",
    "¿Qué hace un bug en el servidor? Espera para atacar.",
    "¿Por qué Python es feliz? Porque todo es un objeto.",
    "¿Qué hace un electricista en la playa? Se conecta al sol.",
    "¿Cuál es el colmo de un pintor? Que siempre lo borren.",
    "¿Qué hace un array divertido? Se llena de risas.",
    "¿Por qué los programadores aman los loops infinitos? Porque nunca quieren salir del código.",
    "¿Qué hace un bug juguetón? Se esconde entre líneas.",
    "¿Cómo se llama un programador que canta? Code-ardo.",
    "¿Qué hace un router aburrido? Se desconecta.",
    "¿Por qué los ordenadores aman el chocolate? Porque tienen bytes dulces.",
    "¿Qué hace un bug en vacaciones? Se esconde y descansa.",
    "¿Cuál es el colmo de un jardinero? Que lo planten todos los días."
]

while True:
    print("Bienvenido al generador de chistes")
    print("1. Generar chiste")
    print("2. Salir")

    opcion = input("Elige una opcion: ")

    if opcion == "1":
        chiste = obtener_chiste(lista_chistes)
        print(f"Chiste: {chiste}")
        time.sleep(10) # Espera de 10 segundos
        limpiar_pantalla()
    elif opcion == "2":
        print("Adios")
        break