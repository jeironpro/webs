# Importa SQLModel para la definición de modelos de base de datos,
# Field para definir columnas con restricciones y Relationship para relaciones entre tablas
from sqlmodel import SQLModel, Field, Relationship

# Importa Optional para permitir valores nulos en campos opcionales
from typing import Optional


# Define la tabla intermedia para la relación muchos a muchos entre Pokémon y Tipo
class TipoPokemonEnlace(SQLModel, table=True):
    """Tabla intermedia que asocia Pokémon con sus tipos."""
    # Columna que referencia el ID del Pokémon en la tabla pokemon
    pokemon_id: int = Field(foreign_key="pokemon.id", primary_key=True)
    # Columna que referencia el ID del tipo en la tabla tipopokemon
    tipo_id: int = Field(foreign_key="tipopokemon.id", primary_key=True)


# Define el modelo para la tabla de tipos de Pokémon
class TipoPokemon(SQLModel, table=True):
    """Modelo que representa un tipo de Pokémon (Ej: Fuego, Agua, Eléctrico)."""
    # Identificador único del tipo, se genera automáticamente
    id: Optional[int] = Field(default=None, primary_key=True)
    # Nombre del tipo, debe ser único y está indexado para búsquedas rápidas
    nombre: str = Field(index=True, unique=True)
    # Color para cada tipo
    color: str = Field()

    # Relación muchos a muchos con la tabla Pokemon a través de TipoPokemonEnlace
    pokemons: list["Pokemon"] = Relationship(
        back_populates="tipos", 
        link_model=TipoPokemonEnlace
    )


# Define el modelo principal para la tabla de Pokémon
class Pokemon(SQLModel, table=True):
    """Modelo principal que representa un Pokémon con su nombre y descripción."""
    # Identificador único del Pokémon, se genera automáticamente
    id: Optional[int] = Field(default=None, primary_key=True)
    # Nombre del Pokémon, debe ser único y está indexado para búsquedas rápidas
    nombre: str = Field(index=True, unique=True)
    # Descripción del Pokémon
    descripcion: str
    # Generación del Pokémon
    generacion: int = Field(index=True)

    # Relación muchos a muchos con la tabla TipoPokemon a través de TipoPokemonEnlace
    tipos: list["TipoPokemon"] = Relationship(
        back_populates="pokemons",
        link_model=TipoPokemonEnlace
    )
    # URL pública de la imagen del Pokémon almacenada en Supabase Storage (opcional)
    imagen_url: Optional[str] = Field(default=None)
    # Relación uno a uno con la tabla EstadisticasPokemon
    estadisticas: Optional["EstadisticasPokemon"] = Relationship(
        back_populates="pokemon"
    )


# Define el modelo para la tabla de estadísticas de Pokémon
class EstadisticasPokemon(SQLModel, table=True):
    """
    Estadísticas de combate de un Pokémon.
    Todos los valores deben ser mayores o iguales a cero.
    """
    # Identificador único de las estadísticas, se genera automáticamente
    id: Optional[int] = Field(default=None, primary_key=True)
    # Puntos de salud del Pokémon, debe ser mayor o igual a 0
    punto_salud: int = Field(ge=0)
    # Ataque físico del Pokémon, debe ser mayor o igual a 0
    ataque: int = Field(ge=0)
    # Defensa física del Pokémon, debe ser mayor o igual a 0
    defensa: int = Field(ge=0)
    # Ataque especial del Pokémon, debe ser mayor o igual a 0
    ataque_especial: int = Field(ge=0)
    # Defensa especial del Pokémon, debe ser mayor o igual a 0
    defensa_especial: int = Field(ge=0)
    # Velocidad del Pokémon, debe ser mayor o igual a 0
    velocidad: int = Field(ge=0)
    # ID del Pokémon al que pertenecen estas estadísticas, debe ser único
    pokemon_id: int = Field(foreign_key="pokemon.id", unique=True)

    # Relación inversa con la tabla Pokemon
    pokemon: Optional["Pokemon"] = Relationship(
        back_populates="estadisticas"
    )


# --- Modelos Pydantic para request y response ---

# Define el esquema de entrada para las estadísticas al crear un Pokémon
class EstadisticasPokemonRequest(SQLModel):
    """Esquema de entrada para las estadísticas de un Pokémon."""
    # Todos los campos deben ser mayores o iguales a 0
    punto_salud: int = Field(ge=0)
    ataque: int = Field(ge=0)
    defensa: int = Field(ge=0)
    ataque_especial: int = Field(ge=0)
    defensa_especial: int = Field(ge=0)
    velocidad: int = Field(ge=0)


# Define el esquema de salida para las estadísticas al consultar un Pokémon
class EstadisticasPokemonResponse(SQLModel):
    """Esquema de salida para las estadísticas de un Pokémon."""
    punto_salud: int
    ataque: int
    defensa: int
    ataque_especial: int
    defensa_especial: int
    velocidad: int


# Define el esquema de entrada para el tipo al crear un Pokémon
class TipoPokemonRequest(SQLModel):
    """Esquema de entrada para el tipo de un Pokémon."""
    nombre: str
    color: str


# Define el esquema de entrada para crear un nuevo Pokémon
class PokemonRequest(SQLModel):
    """Esquema de entrada para crear un nuevo Pokémon."""
    nombre: str
    descripcion: str
    tipos: list[TipoPokemonRequest]
    estadisticas: EstadisticasPokemonRequest
    generacion: int


# Define el esquema de salida con la información completa de un Pokémon
class PokemonResponse(SQLModel):
    """Esquema de salida con la información completa de un Pokémon."""
    id: int
    nombre: str
    descripcion: str
    imagen_url: Optional[str] = None
    tipos: list[TipoPokemonRequest] = []
    estadisticas: EstadisticasPokemonResponse | None = None
    generacion: int
