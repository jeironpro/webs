from sqlmodel import SQLModel, Field
from typing import Optional

class CapituloRequest(SQLModel):
    numero: int = Field(gt=0, description="Número del capítulo")
    libro_id: int = Field(description="ID del libro")
    
class CapituloResponse(SQLModel):
    id: int
    numero: int
    libro_id: int

class CapituloUpdate(SQLModel):
    numero: Optional[int] = Field(gt=0, description="Número del capítulo")
    libro_id: Optional[int] = Field(description="ID del libro")