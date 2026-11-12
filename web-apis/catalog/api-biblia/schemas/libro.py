from sqlmodel import SQLModel, Field
from typing import Optional

class LibroRequest(SQLModel):
    nombre: str = Field(min_length=1, description="Nombre del libro")
    abreviatura: str = Field(min_length=2, max_length=10)
    orden: int = Field(gt=0, description="Orden dentro del testamento")
    testamento_id: int = Field(description="ID del testamento")
    
class LibroResponse(SQLModel):
    id: int
    nombre: str
    abreviatura: str
    orden: int
    testamento_id: int
    
class LibroUpdate(SQLModel):
    nombre: Optional[str] = Field(min_length=1, description="Nombre del libro")
    abreviatura: Optional[str] = Field(min_length=2, max_length=10)
    orden: Optional[int] = Field(gt=0, description="Orden dentro del testamento")
    testamento_id: Optional[int] = Field(description="ID del testamento")