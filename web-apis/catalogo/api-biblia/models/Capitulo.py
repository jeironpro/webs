from sqlmodel import SQLModel, Field, Column
from typing import Optional
from sqlalchemy import Integer, ForeignKey
from sqlalchemy import UniqueConstraint

class Capitulo(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("libro_id", "numero", name="uix_libro_capitulo"),)
    
    id: Optional[int] = Field(primary_key=True)
    numero: int

    libro_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("libro.id", ondelete="CASCADE", onupdate="CASCADE")
        )
    )