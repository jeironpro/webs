"""
    Programa que pide palabras al usuario y genera una historia divertida con esa palabras y se la muestra al usuario
"""
import random

templates = [
    "Hoy fui al {lugar} para {verbo1}. Allí vi un {animal} muy {adjetivo}. Me sentí tan {emocion} que decidí {verbo2} con él.",
    "Nunca pensé que ir al {lugar} para {verbo1} sería tan divertido. Un {animal} {adjetivo} apareció y me hizo sentir {emocion}. Al final, tuve que {verbo2}.",
    "En {lugar}, mientras intentaba {verbo1}, un {animal} {adjetivo} cruzó mi camino. Esto me hizo sentir {emocion} y terminé {verbo2}.",
    "Mi día en {lugar} empezó intentando {verbo1}, pero todo cambió cuando un {animal} {adjetivo} apareció. Me puse {emocion} y decidí {verbo2}.",
    "Fui al {lugar} con la intención de {verbo1}. Entonces vi un {animal} {adjetivo} que me hizo sentir {emocion}. Sin pensarlo, empecé a {verbo2}.",
    "Mientras estaba en {lugar}, intentando {verbo1}, un {animal} {adjetivo} apareció de la nada. Me sentí {emocion} y tuve que {verbo2}.",
    "El {animal} {adjetivo} en {lugar} me sorprendió mientras quería {verbo1}. Esto me hizo sentir {emocion} y no pude evitar {verbo2}.",
    "Fui a {lugar} para {verbo1} y encontré un {animal} {adjetivo}. Me llenó de {emocion} y terminé {verbo2}.",
    "Qué día en {lugar}: estaba {verbo1} cuando un {animal} {adjetivo} apareció. Me sentí {emocion} y decidí {verbo2}.",
    "Mientras {verbo1} en {lugar}, un {animal} {adjetivo} me hizo sentir {emocion}. Así que tuve que {verbo2} inmediatamente.",
    "Nunca olvidaré cuando fui a {lugar} a {verbo1}. Un {animal} {adjetivo} me vio y de repente me sentí {emocion}. Terminé {verbo2} sin pensar.",
    "Hoy en {lugar} decidí {verbo1}. De repente apareció un {animal} {adjetivo}, y me sentí tan {emocion} que tuve que {verbo2}.",
    "Estaba {verbo1} en {lugar} cuando un {animal} {adjetivo} se cruzó en mi camino. Sentí {emocion} y terminé {verbo2}.",
    "Fui a {lugar} solo para {verbo1}, pero un {animal} {adjetivo} apareció. Me puse {emocion} y tuve que {verbo2}.",
    "En {lugar}, mientras intentaba {verbo1}, un {animal} {adjetivo} hizo que me sintiera {emocion}. Sin pensarlo, empecé a {verbo2}.",
    "Hoy, al llegar a {lugar} para {verbo1}, un {animal} {adjetivo} me sorprendió. Me sentí {emocion} y decidí {verbo2}.",
    "Nunca imaginé que {verbo1} en {lugar} terminaría con un {animal} {adjetivo} y tanta {emocion}. Finalmente, tuve que {verbo2}.",
    "Mientras {verbo1} en {lugar}, apareció un {animal} {adjetivo}. Me llenó de {emocion} y no pude evitar {verbo2}.",
    "El día comenzó normal en {lugar}, intentaba {verbo1} hasta que apareció un {animal} {adjetivo}. Me sentí {emocion} y terminé {verbo2}.",
    "Fui a {lugar} para {verbo1}, pero un {animal} {adjetivo} hizo que todo cambiara. Me puse {emocion} y terminé {verbo2}."
]

# Pedir palabras al usuario
lugar = input("Ingresa un lugar: ")
verbo1 = input("Ingresa un verbo: ")
animal = input("Ingresa un animal: ")
adjetivo = input("Ingresa un adjetivo: ")
emocion = input("Ingresa una emoción: ")
verbo2 = input("Ingresa otro verbo: ")

# Obtener un template random de la lista
template = random.choice(templates)

# formatear el template con las palabras del usuario
historia = template.format(
    lugar=lugar,
    verbo1=verbo1,
    animal=animal,
    adjetivo=adjetivo,
    emocion=emocion,
    verbo2=verbo2
)

# Mostrar la historia
print("Historia generada:\n")
print(historia)