from sqlmodel import SQLModel, Field
from typing import Optional

class VersiculoRequest(SQLModel):
    numero: int = Field(gt=0, description="Número del versículo")
    texto: str = Field(min_length=1, description="Texto del versículo")
    capitulo_id: int = Field(description="ID del capítulo")

class VersiculoResponse(SQLModel):
    id: int
    numero: int
    texto: str
    capitulo_id: int

class VersiculoTextoResponse(SQLModel):
    numero: int
    texto: str

class VersiculoUpdate(SQLModel):
    numero: Optional[int] = Field(gt=0, description="Número del versículo")
    texto: Optional[str] = Field(min_length=1, description="Texto del versículo")
    capitulo_id: Optional[int] = Field(description="ID del capítulo")