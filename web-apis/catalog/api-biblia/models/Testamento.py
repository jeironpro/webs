from sqlmodel import SQLModel, Field, Column
from typing import Optional
from sqlalchemy import Integer, ForeignKey

class Testamento(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    nombre: str
    abreviatura: str
    
    biblia_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("biblia.id", ondelete="CASCADE", onupdate="CASCADE")
        )
    )
