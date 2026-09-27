from sqlmodel import SQLModel, Field
from typing import Optional

class Biblia(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    version: str
    idioma: str = Field(default="es")