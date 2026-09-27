# Importa el módulo os para acceder a variables de entorno del sistema
import os

# Importa FastAPI para crear la aplicación web, Depends para inyección de dependencias,
# HTTPException para manejar errores HTTP, Header para capturar headers de la petición
from fastapi import FastAPI, Depends, HTTPException, Header

# Importa CORSMiddleware para configurar qué orígenes pueden acceder a la API
from fastapi.middleware.cors import CORSMiddleware

# Importa SQLModel para la definición de tablas, Session para manejar la base de datos
# y select para construir consultas SQL
from sqlmodel import SQLModel, Session, select

# Importa asynccontextmanager para crear un manejador de ciclo de vida de la aplicación
from contextlib import asynccontextmanager

# Importa el motor de base de datos y la función para obtener una sesión
from database.connection import engine, obtener_db

# Importa todos los modelos y esquemas de la base de datos
from models.Naruto import (
    Personaje, PersonajeRequest, PersonajeResponse,
    Habilidad, Debilidad, Fortaleza,
    EstadisticasPersonaje, EstadisticasPersonajeResponse
)

# Importa func para usar funciones SQL como lower()
from sqlalchemy import func

# Importa joinedload para cargar relaciones en una sola consulta
from sqlalchemy.orm import joinedload


# Función auxiliar que convierte un objeto Personaje ORM a un dict
# para evitar problemas de serialización con las relaciones
def personaje_a_response(personaje: Personaje) -> dict:
    """Convierte un Personaje ORM en un diccionario serializable para la respuesta."""
    return {
        "id": personaje.id,
        "nombre": personaje.nombre,
        "aldea": personaje.aldea,
        "equipo": personaje.equipo,
        "rango": personaje.rango,
        "imagen_url": personaje.imagen_url,
        "habilidades": [h.nombre for h in (personaje.habilidades or [])],
        "debilidades": [d.nombre for d in (personaje.debilidades or [])],
        "fortalezas": [f.nombre for f in (personaje.fortalezas or [])],
        "estadisticas": {
            "fuerza": personaje.estadisticas.fuerza,
            "habilidad": personaje.estadisticas.habilidad,
            "resistencia": personaje.estadisticas.resistencia,
            "estrategia": personaje.estadisticas.estrategia,
        } if personaje.estadisticas else None,
    }


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
    title="API Naruto",
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


# Define el endpoint POST para agregar un nuevo personaje a la base de datos
@app.post("/personajes", response_model=dict, tags=["Agregar personaje"])
async def agregar_personaje(personaje: PersonajeRequest, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Crea un nuevo personaje con sus habilidades, debilidades, fortalezas y estadísticas."""
    # Crea una nueva instancia del modelo Personaje con los datos recibidos
    nuevo_personaje = Personaje(
        nombre=personaje.nombre,
        aldea=personaje.aldea,
        equipo=personaje.equipo,
        rango=personaje.rango
    )
    # Agrega el nuevo personaje a la sesión de base de datos
    db.add(nuevo_personaje)
    # Ejecuta un flush para obtener el ID del nuevo personaje sin confirmar la transacción
    db.flush()

    # Itera sobre cada habilidad recibida en la petición para asociarla al personaje
    for nombre_habilidad in personaje.habilidades:
        # Crea un registro de habilidad asociado al personaje
        habilidad = Habilidad(nombre=nombre_habilidad, personaje_id=nuevo_personaje.id)
        db.add(habilidad)

    # Itera sobre cada debilidad recibida para asociarla al personaje
    for nombre_debilidad in personaje.debilidades:
        debilidad = Debilidad(nombre=nombre_debilidad, personaje_id=nuevo_personaje.id)
        db.add(debilidad)

    # Itera sobre cada fortaleza recibida para asociarla al personaje
    for nombre_fortaleza in personaje.fortalezas:
        fortaleza = Fortaleza(nombre=nombre_fortaleza, personaje_id=nuevo_personaje.id)
        db.add(fortaleza)

    # Crea las estadísticas del personaje con los valores recibidos
    estadisticas = EstadisticasPersonaje(
        fuerza=personaje.estadisticas.fuerza,
        habilidad=personaje.estadisticas.habilidad,
        resistencia=personaje.estadisticas.resistencia,
        estrategia=personaje.estadisticas.estrategia,
        personaje_id=nuevo_personaje.id
    )

    # Agrega las estadísticas a la sesión de base de datos
    db.add(estadisticas)
    # Confirma todos los cambios en la base de datos
    db.commit()
    # Refresca la instancia del personaje con los datos actualizados de la base de datos
    db.refresh(nuevo_personaje)

    # Retorna un mensaje de confirmación
    return {"msg": "Personaje creado correctamente"}


# Define el endpoint GET para obtener todos los personajes registrados
@app.get("/personajes", response_model=list[PersonajeResponse], tags=["Obtener personajes"])
async def obtener_personajes(db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve todos los personajes con sus habilidades, debilidades, fortalezas y estadísticas."""
    # Construye una consulta para seleccionar todos los personajes
    consulta = (
        select(Personaje)
        # Carga las relaciones de habilidades, debilidades, fortalezas y estadísticas
        # para evitar consultas adicionales (N+1 problem)
        .options(
            joinedload(Personaje.habilidades),
            joinedload(Personaje.debilidades),
            joinedload(Personaje.fortalezas),
            joinedload(Personaje.estadisticas)
        )
    )

    # Ejecuta la consulta y obtiene todos los resultados evitando duplicados
    personajes = db.exec(consulta).unique().all()
    # Retorna la lista de personajes convertidos a dicts (evita problemas con relaciones ORM)
    return [personaje_a_response(p) for p in personajes]


# Define el endpoint GET para obtener un personaje específico por su ID
@app.get("/personajes/{id}", response_model=PersonajeResponse, tags=["Obtener personaje por id"])
async def obtener_personaje_id(id: int, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve un personaje específico por su ID. Lanza 404 si no existe."""
    # Construye una consulta para buscar un personaje por su ID
    consulta = (
        select(Personaje)
        .where(Personaje.id == id)
        # Carga las relaciones de habilidades, debilidades, fortalezas y estadísticas
        .options(
            joinedload(Personaje.habilidades),
            joinedload(Personaje.debilidades),
            joinedload(Personaje.fortalezas),
            joinedload(Personaje.estadisticas)
        )
    )
    # Ejecuta la consulta y obtiene el primer resultado
    personaje = db.exec(consulta).first()
    # Si no se encontró el personaje, lanza un error 404
    if not personaje:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    # Retorna el personaje convertido a dict (evita problemas con relaciones ORM)
    return personaje_a_response(personaje)


# Define el endpoint GET para filtrar personajes por su aldea
@app.get("/personajes/aldea/{aldea}", response_model=list[PersonajeResponse], tags=["Obtener personajes por aldea"])
async def obtener_personajes_aldea(aldea: str, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve todos los personajes que coinciden con una aldea (búsqueda insensible a mayúsculas)."""
    # Construye una consulta para buscar personajes por aldea
    consulta = (
        select(Personaje)
        # Filtra por nombre de aldea ignorando mayúsculas y minúsculas
        .where(func.lower(Personaje.aldea) == aldea.lower())
        # Carga las relaciones para evitar consultas adicionales
        .options(
            joinedload(Personaje.habilidades),
            joinedload(Personaje.debilidades),
            joinedload(Personaje.fortalezas),
            joinedload(Personaje.estadisticas)
        )
    )

    # Ejecuta la consulta y obtiene los resultados evitando duplicados
    personajes = db.exec(consulta).unique().all()
    # Retorna la lista de personajes convertidos a dicts
    return [personaje_a_response(p) for p in personajes]


# Define el endpoint GET para filtrar personajes por su rango
@app.get("/personajes/rango/{rango}", response_model=list[PersonajeResponse], tags=["Obtener personajes por rango"])
async def obtener_personajes_rango(rango: str, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve todos los personajes que coinciden con un rango (búsqueda insensible a mayúsculas)."""
    consulta = (
        select(Personaje)
        .where(func.lower(Personaje.rango) == rango.lower())
        .options(
            joinedload(Personaje.habilidades),
            joinedload(Personaje.debilidades),
            joinedload(Personaje.fortalezas),
            joinedload(Personaje.estadisticas)
        )
    )
    personajes = db.exec(consulta).unique().all()
    return [personaje_a_response(p) for p in personajes]


# Define el endpoint GET para filtrar personajes por su equipo
@app.get("/personajes/equipo/{equipo}", response_model=list[PersonajeResponse], tags=["Obtener personajes por equipo"])
async def obtener_personajes_equipo(equipo: str, db: Session = Depends(obtener_db), _: str = Depends(verificar_api_key)):
    """Devuelve todos los personajes que coinciden con un equipo (búsqueda insensible a mayúsculas)."""
    consulta = (
        select(Personaje)
        .where(func.lower(Personaje.equipo) == equipo.lower())
        .options(
            joinedload(Personaje.habilidades),
            joinedload(Personaje.debilidades),
            joinedload(Personaje.fortalezas),
            joinedload(Personaje.estadisticas)
        )
    )
    personajes = db.exec(consulta).unique().all()
    return [personaje_a_response(p) for p in personajes]
