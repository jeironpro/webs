# Importa SQLModel para la definición de modelos de base de datos,
# Field para definir columnas con restricciones y Relationship para relaciones entre tablas
from sqlmodel import SQLModel, Field, Relationship

# Importa Optional para permitir valores nulos en campos opcionales
from typing import Optional




# Define el modelo para la tabla de habilidades de los personajes
class Habilidad(SQLModel, table=True):
    """Modelo que representa una habilidad de un personaje (Ej: Rasengan, Chidori)."""
    # Identificador único de la habilidad, se genera automáticamente
    id: Optional[int] = Field(default=None, primary_key=True)
    # Nombre de la habilidad
    nombre: str
    # ID del personaje al que pertenece esta habilidad
    personaje_id: int = Field(foreign_key="personaje.id")
    # Relación inversa con la tabla Personaje
    personaje: Optional["Personaje"] = Relationship(back_populates="habilidades")


# Define el modelo para la tabla de debilidades de los personajes
class Debilidad(SQLModel, table=True):
    """Modelo que representa una debilidad de un personaje (Ej: Impaciencia, Arrogancia)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    personaje_id: int = Field(foreign_key="personaje.id")
    personaje: Optional["Personaje"] = Relationship(back_populates="debilidades")


# Define el modelo para la tabla de fortalezas de los personajes
class Fortaleza(SQLModel, table=True):
    """Modelo que representa una fortaleza de un personaje (Ej: Voluntad, Velocidad)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    personaje_id: int = Field(foreign_key="personaje.id")
    personaje: Optional["Personaje"] = Relationship(back_populates="fortalezas")


# Define el modelo principal para la tabla de personajes de Naruto
class Personaje(SQLModel, table=True):
    """Modelo principal que representa un personaje del universo Naruto."""
    # Identificador único del personaje, se genera automáticamente
    id: Optional[int] = Field(default=None, primary_key=True)
    # Nombre del personaje, debe ser único y está indexado para búsquedas rápidas
    nombre: str = Field(index=True, unique=True)
    # Aldea de origen del personaje (Ej: Konoha, Sunagakure), indexada para búsquedas
    aldea: str = Field(index=True)
    # Equipo al que pertenece el personaje (Ej: Equipo 7, Equipo 10)
    equipo: str
    # Rango ninja del personaje (Ej: Genin, Jōnin, Hokage)
    rango: str
    # URL pública de la imagen del personaje almacenada en Supabase Storage (opcional)
    imagen_url: Optional[str] = Field(default=None)

    # Relación uno a muchos con la tabla Habilidad
    habilidades: list["Habilidad"] = Relationship(
        back_populates="personaje",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    # Relación uno a muchos con la tabla Debilidad
    debilidades: list["Debilidad"] = Relationship(
        back_populates="personaje",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    # Relación uno a muchos con la tabla Fortaleza
    fortalezas: list["Fortaleza"] = Relationship(
        back_populates="personaje",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    # Relación uno a uno con la tabla EstadisticasPersonaje
    estadisticas: Optional["EstadisticasPersonaje"] = Relationship(
        back_populates="personaje",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "uselist": False}
    )


# Define el modelo para la tabla de estadísticas de personajes
class EstadisticasPersonaje(SQLModel, table=True):
    """Estadísticas de combate de un personaje. Todos los valores deben ser mayores o iguales a cero."""
    # Identificador único de las estadísticas, se genera automáticamente
    id: Optional[int] = Field(default=None, primary_key=True)
    # Fuerza física del personaje, debe ser mayor o igual a 0
    fuerza: int = Field(ge=0)
    # Habilidad técnica del personaje, debe ser mayor o igual a 0
    habilidad: int = Field(ge=0)
    # Resistencia del personaje, debe ser mayor o igual a 0
    resistencia: int = Field(ge=0)
    # Estrategia del personaje, debe ser mayor o igual a 0
    estrategia: int = Field(ge=0)
    # ID del personaje al que pertenecen estas estadísticas, debe ser único
    personaje_id: int = Field(foreign_key="personaje.id", unique=True)

    # Relación inversa con la tabla Personaje
    personaje: Optional["Personaje"] = Relationship(back_populates="estadisticas")


# Reconstruye las relaciones forward-reference entre los modelos
Habilidad.model_rebuild()
Debilidad.model_rebuild()
Fortaleza.model_rebuild()
Personaje.model_rebuild()
EstadisticasPersonaje.model_rebuild()


# --- Modelos Pydantic para request y response ---

# Define el esquema de entrada para las estadísticas al crear un personaje
class EstadisticasPersonajeRequest(SQLModel):
    """Esquema de entrada para las estadísticas de un personaje."""
    # Todos los campos deben ser mayores o iguales a 0
    fuerza: int = Field(ge=0)
    habilidad: int = Field(ge=0)
    resistencia: int = Field(ge=0)
    estrategia: int = Field(ge=0)


# Define el esquema de salida para las estadísticas al consultar un personaje
class EstadisticasPersonajeResponse(SQLModel):
    """Esquema de salida para las estadísticas de un personaje."""
    fuerza: int
    habilidad: int
    resistencia: int
    estrategia: int


# Define el esquema de entrada para crear un nuevo personaje
class PersonajeRequest(SQLModel):
    """Esquema de entrada para crear un nuevo personaje."""
    nombre: str
    aldea: str
    equipo: str
    rango: str
    habilidades: list[str]
    debilidades: list[str]
    fortalezas: list[str]
    estadisticas: EstadisticasPersonajeRequest


# Define el esquema de salida con la información completa de un personaje
class PersonajeResponse(SQLModel):
    """Esquema de salida con la información completa de un personaje."""
    id: int
    nombre: str
    aldea: str
    equipo: str
    rango: str
    imagen_url: Optional[str] = None
    habilidades: list[str] = []
    debilidades: list[str] = []
    fortalezas: list[str] = []
    estadisticas: EstadisticasPersonajeResponse | None = None


