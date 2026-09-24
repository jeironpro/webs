"""
    Programa que simula el juego del ahorcado.
    Toma una palabra aleatoria de una lista,
    muestra el estado inicial del juego,
    pide y valida una letra al usuario,
    muestra el estado en cada intento indicando cuando haya ganado.
"""
import random

# Representación del estado del ahorcado en cada intento
PARTES_AHORCADO = [
    """
    +---+
    |   |
        |
        |
        |
        |
    =========
    """,
    """
    +---+
    |   |
    O   |
        |
        |
        |
    =========
    """,
    """
    +---+
    |   |
    O   |
    |   |
        |
        |
    =========
    """,
    """
     +---+
     |   |
     O   |
    /|   |
         |
         |
    =========
    """,
    """
     +---+
     |   |
     O   |
    /|\\  |
         |
         |
    =========
    """,
    """
     +---+
     |   |
     O   |
    /|\\  |
    /    |
         |
    =========
    """,
    """
     +---+
     |   |
     O   |
    /|\\  |
    / \\  |
         |
    =========
    """
]

# Lista de palabras de longitud igual a 7
PALABRAS = [
    "amapola","bandera","botella","caballo","caminar","cuchara","familia","gallina","glaciar",
    "hormiga","lagarto","lavanda","limones","manzana","medalla","mensual","militar","mirador","montana",
    "narices","nublado","palmera","patinar","peluche","perfume","pintura","piragua","plumero","portada",
    "pradera","ratones","recoger","regalos","rejilla","remover","resumen","rosales","sabores","sandias",
    "sardina","semilla","soldado","sombrio","teatral","temblor","tiburon","tortuga","trabajo","trenzas",
    "triunfo","trompas","valores","ventana","viajero","volador","zapatos","acechar","acordar","actuaba",
    "ajedrez","anzuelo","apretar","arenoso","armario","arrojar","atender","aventar","azucena","balanza",
    "barrera","bateria","bordado","brillar","buscaba","cabello","camello","cansado","caretas","carpeta",
    "cartera","celular","cenizas","cerdito","cerezas","charcos","corazon","cristal","cuadros","culebra",
    "delgado","dientes","dibujos","esferas","fragata","frontal","gigante","granero","habitos","heraldo",
    "joyeria"
]

# Pedir y validar letra al usuario
def pedir_letra(letras_adivinadas):
    while True:
        letra_usuario = input("Introduce una letra: ").strip().lower()

        if len(letra_usuario) != 1 or not letra_usuario.isalpha:
            print("Introduce una sola letra (a-z)")
            continue

        if letra_usuario in letras_adivinadas:
            print("La letra ya ha sido adivinada")
            continue
        return letra_usuario

# Muestra el estado de la palabra en cada intento
def mostrar_intento(palabra, letras_adivinadas):
    intento = [letra.upper() if letra in letras_adivinadas else "_" for letra in palabra]
    print(' '.join(intento))

# Logica principal del juego
def jugar(palabras):
    print("============================")
    print("     JUEGO DEL AHORCADO     ")
    print("============================")

    palabra = random.choice(palabras)
    letras_adivinadas = set()
    intentos = len(palabra)-1

    while intentos > 0:
        print(PARTES_AHORCADO[len(PARTES_AHORCADO) - 1 - intentos])
        mostrar_intento(palabra, letras_adivinadas)
        
        if all(letra in letras_adivinadas for letra in palabra):
            print("Has ganado!")

        letra_usuario = pedir_letra(letras_adivinadas)
        letras_adivinadas.add(letra_usuario)

        if letra_usuario not in palabra:
            intentos -= 1
            print(f"La letra no esta en la palabra. Te quedan {intentos} intentos")

    print(PARTES_AHORCADO[-1])
    print(f"Has perdido. La palabra era: {palabra}")

# Iniciar el juego
jugar(PALABRAS)