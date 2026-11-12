from sqlmodel import SQLModel, Field
from typing import Optional

class TestamentoRequest(SQLModel):
    nombre: str = Field(description="Nombre del testamento")
    abreviatura: str = Field(description="Abreviatura del testamento")
    biblia_id: int = Field(description="ID de la Biblia a la que pertenece")
    
class TestamentoResponse(SQLModel):
    id: int
    nombre: str
    abreviatura: str
    biblia_id: int

class TestamentoUpdate(SQLModel):
    nombre: Optional[str] = Field(description="Nombre del testamento")
    abreviatura: Optional[str] = Field(description="Abreviatura del testamento")
    biblia_id: Optional[int] = Field(description="ID de la Biblia a la que pertenece")