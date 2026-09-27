# Importa el módulo os para acceder a variables de entorno del sistema
import os

# Importa FastAPI para crear la aplicación web, Depends para inyección de dependencias,
# HTTPException para manejar errores HTTP, Header para capturar headers de la petición,
# File y UploadFile para recibir archivos en las peticiones
from fastapi import FastAPI, Depends, HTTPException, Header, File, UploadFile

# Importa CORSMiddleware para configurar qué orígenes pueden acceder a la API
from fastapi.middleware.cors import CORSMiddleware

# Importa SQLModel para la definición de tablas, Session para manejar la base de datos
# y select para construir consultas SQL
from sqlmodel import SQLModel, Session, select

# Importa asynccontextmanager para crear un manejador de ciclo de vida de la aplicación
from contextlib import asynccontextmanager

# Importa el motor de base de datos y la función para obtener una sesión
from database.connection import engine, obtener_db

# Importa la función de Supabase Storage para subir imágenes
from database.storage import subir_imagen_a_supabase

# Importa todos los modelos y esquemas de la base de datos
from models.Pokemon import Pokemon, PokemonRequest, TipoPokemon, TipoPokemonEnlace, EstadisticasPokemon, PokemonResponse

# Importa func para usar funciones SQL como lower() y joinedload para cargar relaciones
from sqlalchemy import func
from sqlalchemy.orm import joinedload


# Define un manejador de ciclo de vida asíncrono para la aplicación
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crea las tablas en la base de datos al iniciar la aplicación."""
    # Crea todas las tablas definidas con SQLModel si no existen
    SQLModel.metadata.create_all(engine)
    # Cede el control a la aplicación para que comience a recibir peticiones
    yield


# Crea la instancia principal de la aplicación FastAPI con título y versión
app = FastAPI(
    title="API Pokemón",
    version="1.0",
    lifespan=lifespan
)

# Define los orígenes permitidos para las peticiones CORS
origins = [
    os.getenv("FRONTEND_URL"),
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173"

]

# Agrega el middleware CORS a la aplicación para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define una función de dependencia que valida la API Key en cada petición
def verificar_api_key(x_api_key: str = Header(default=None)):
    """
    Valida que la petición incluya una API Key válida en el header X-API-Key.
    Retorna un error 401 si no se envía ninguna key.
    Retorna un error 500 si el servidor no tiene configurada la variable API_KEY.
    Retorna un error 403 si la key enviada no coincide con la configurada.
    """
    # Verifica si no se envió el header X-API-Key en la petición
    if x_api_key is None:
        # Responde con error 401 indicando que la API Key es obligatoria
        raise HTTPException(status_code=401, detail="API Key requerida")
    # Obtiene la API Key válida desde las variables de entorno
    api_key_valida = os.getenv("API_KEY")
    # Verifica si la variable de entorno API_KEY no está definida en el servidor
    if not api_key_valida:
        # Responde con error 500 indicando que falta la configuración del servidor
        raise HTTPException(status_code=500, detail="API_KEY no configurada en el servidor")
    # Compara la API Key recibida con la configurada en el servidor
    if x_api_key != api_key_valida:
        # Responde con error 403 si las claves no coinciden
        raise HTTPException(status_code=403, detail="API Key inválida")
    # Devuelve la API Key si la validación fue exitosa
    return x_api_key


# Define el endpoint POST para agregar un nuevo Pokémon a la base de datos
@app.post("/agregar_pokemon", response_model=dict, tags=["Agregar pokemon"])
async def agregar_pokemon(pokemon: PokemonRequest, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Crea un nuevo Pokémon con sus tipos y estadísticas."""
    # Crea una nueva instancia del modelo Pokemon con los datos recibidos
    nuevo_pokemon = Pokemon(nombre=pokemon.nombre, descripcion=pokemon.descripcion, generacion=pokemon.generacion)
    # Agrega el nuevo Pokémon a la sesión de base de datos
    db.add(nuevo_pokemon)
    # Ejecuta un flush para obtener el ID del nuevo Pokémon sin confirmar la transacción
    db.flush()

    # Itera sobre cada tipo recibido en la petición para asociarlo al Pokémon
    for tipo_pokemon in pokemon.tipos:
        # Busca si el tipo ya existe en la base de datos por su nombre
        tipo = db.exec(select(TipoPokemon).where(TipoPokemon.nombre == tipo_pokemon.nombre)).first()

        # Si el tipo no existe, lo crea y lo agrega a la base de datos
        if not tipo:
            tipo = TipoPokemon(nombre=tipo_pokemon.nombre, color=tipo_pokemon.color)
            db.add(tipo)
            # Ejecuta flush para obtener el ID del nuevo tipo
            db.flush()

        # Crea el registro de relación entre el Pokémon y el tipo en la tabla intermedia
        enlace = TipoPokemonEnlace(pokemon_id=nuevo_pokemon.id, tipo_id=tipo.id)
        db.add(enlace)

    # Crea las estadísticas del Pokémon con los valores recibidos
    estadisticas = EstadisticasPokemon(
        punto_salud=pokemon.estadisticas.punto_salud,
        ataque=pokemon.estadisticas.ataque,
        defensa=pokemon.estadisticas.defensa,
        ataque_especial=pokemon.estadisticas.ataque_especial,
        defensa_especial=pokemon.estadisticas.defensa_especial,
        velocidad=pokemon.estadisticas.velocidad,
        pokemon_id=nuevo_pokemon.id
    )
    
    # Agrega las estadísticas a la sesión de base de datos
    db.add(estadisticas)
    # Confirma todos los cambios en la base de datos
    db.commit()
    # Refresca la instancia del Pokémon con los datos actualizados de la base de datos
    db.refresh(nuevo_pokemon)

    # Retorna un mensaje de confirmación
    return {"msg": "Pokemon creado correctamente"}


# Define el endpoint GET para obtener todos los Pokémon registrados
@app.get("/pokemones", response_model=list[PokemonResponse], tags=["Obtener pokemones"])
async def obtener_pokemones(db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve todos los Pokémon con sus tipos y estadísticas."""
    # Construye una consulta para seleccionar todos los Pokémon
    consulta = (
        select(Pokemon)
        # Carga las relaciones de tipos y estadísticas para evitar consultas adicionales
        .options(
            joinedload(Pokemon.tipos),
            joinedload(Pokemon.estadisticas)
        )
    )

    # Ejecuta la consulta y obtiene todos los resultados evitando duplicados
    pokemones = db.exec(consulta).unique().all()
    # Retorna la lista de Pokémon encontrados
    return pokemones


# Define el endpoint GET para obtener un Pokémon específico por su ID
@app.get("/pokemones/{id}", response_model=PokemonResponse, tags=["Obtener pokemon por id"])
async def obtener_pokemon_id(id: int, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve un Pokémon específico por su ID. Lanza 404 si no existe."""
    # Construye una consulta para buscar un Pokémon por su ID
    consulta = (
        select(Pokemon)
        .where(Pokemon.id == id)
        # Carga las relaciones de tipos y estadísticas
        .options(
            joinedload(Pokemon.tipos),
            joinedload(Pokemon.estadisticas)
        )
    )
    # Ejecuta la consulta y obtiene el primer resultado
    pokemon = db.exec(consulta).first()
    # Si no se encontró el Pokémon, lanza un error 404
    if not pokemon:
        raise HTTPException(status_code=404, detail="Pokemon no encontrado")
    # Retorna el Pokémon encontrado
    return pokemon


# Define el endpoint GET para filtrar Pokémon por su tipo
@app.get("/pokemones/tipo/{tipo}", response_model=list[PokemonResponse], tags=["Obtener pokemones por tipo"])
async def obtener_pokemon_tipo(tipo: str, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve todos los Pokémon que coinciden con un tipo (búsqueda insensible a mayúsculas)."""
    # Construye una consulta para buscar Pokémon por tipo
    consulta = (
        select(Pokemon)
        # Realiza un JOIN con la tabla de tipos a través de la relación
        .join(Pokemon.tipos)
        # Filtra por nombre de tipo ignorando mayúsculas y minúsculas
        .where(func.lower(TipoPokemon.nombre) == tipo.lower())
        # Carga las relaciones de tipos y estadísticas
        .options(
            joinedload(Pokemon.tipos),
            joinedload(Pokemon.estadisticas)
        )
    )

    # Ejecuta la consulta y obtiene los resultados evitando duplicados
    pokemones = db.exec(consulta).unique().all()
    # Retorna la lista de Pokémon encontrados
    return pokemones


# Define el endpoint POST para subir una imagen a un Pokémon existente
@app.post("/pokemones/{id}/imagen", tags=["Subir imagen"])
async def subir_imagen(id: int, file: UploadFile = File(...), db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Sube una imagen para un Pokémon y la almacena en Supabase Storage."""
    # Verifica que el archivo tenga un nombre (que no esté vacío)
    if not file.filename:
        raise HTTPException(status_code=400, detail="No se envió ningún archivo")

    # Busca el Pokémon en la base de datos por su ID
    pokemon = db.get(Pokemon, id)
    # Lanza un error 404 si el Pokémon no existe
    if not pokemon:
        raise HTTPException(status_code=404, detail="Pokemon no encontrado")

    # Lee el contenido del archivo subido
    contenido = await file.read()

    # Verifica que el archivo no esté vacío
    if not contenido:
        raise HTTPException(status_code=400, detail="El archivo está vacío")

    # Obtiene la extensión del archivo a partir del nombre original
    extension = f".{file.filename.rsplit('.', 1)[-1]}" if "." in file.filename else ""

    try:
        # Sube la imagen a Supabase Storage y obtiene la URL pública
        url_imagen = subir_imagen_a_supabase(
            file_content=contenido,
            file_extension=extension,
            content_type=file.content_type or "image/png"
        )
    except RuntimeError as error:
        # Lanza un error 500 si Supabase no está configurado
        raise HTTPException(status_code=500, detail=str(error))

    # Guarda la URL de la imagen en el registro del Pokémon
    pokemon.imagen_url = url_imagen
    # Confirma el cambio en la base de datos
    db.commit()
    # Refresca la instancia del Pokémon con los datos actualizados
    db.refresh(pokemon)

    # Retorna la URL de la imagen subida
    return {"imagen_url": url_imagen}
