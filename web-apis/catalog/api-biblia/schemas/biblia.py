from sqlmodel import SQLModel, Field
from typing import Optional

class BibliaRequest(SQLModel):
    version: str = Field(description="Nombre o versión de la Biblia")
    idioma: str = Field(default="es", description="Abreviatura del idioma de la Biblia")
    
class BibliaResponse(SQLModel):
    id: int
    version: str
    idioma: str

class BibliaUpdate(SQLModel):
    version: Optional[str] = Field(description="Nombre o versión de la Biblia")
    idioma: Optional[str] = Field(default="es", description="Abreviatura del idioma de la Biblia")
