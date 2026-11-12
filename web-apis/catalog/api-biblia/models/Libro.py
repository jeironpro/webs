from sqlmodel import SQLModel, Field, Column
from typing import Optional
from sqlalchemy import Integer, ForeignKey

class Libro(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    nombre: str = Field(unique=True)
    abreviatura: str
    orden: int

    testamento_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("testamento.id", ondelete="CASCADE", onupdate="CASCADE")
        )
    )