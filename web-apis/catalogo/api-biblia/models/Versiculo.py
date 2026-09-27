from sqlmodel import SQLModel, Field, Column
from typing import Optional
from sqlalchemy import Integer, ForeignKey

class Versiculo(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    numero: int
    texto: str

    capitulo_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("capitulo.id", ondelete="CASCADE", onupdate="CASCADE")
        )
    )