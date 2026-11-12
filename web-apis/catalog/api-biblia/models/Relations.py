from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .Biblia import Biblia
    from .Testamento import Testamento
    from .Libro import Libro
    from .Capitulo import Capitulo
    from .Versiculo import Versiculo

testamentos: List["Testamento"] = relationship(
    back_populates="biblia",
    cascade_delete=True,
    cascade_update=True
)

biblia: Optional[Biblia] = relationship(
    back_populates="testamentos",
    cascade_delete=True,
    cascade_update=True
)

libros: List["Libro"] = relationship(
    back_populates="testamento",
    cascade_delete=True,
    cascade_update=True
)

testamento: Optional[Testamento] = relationship(
    back_populates="libros",
    cascade_delete=True,
    cascade_update=True
)

capitulos: List["Capitulo"] = relationship(
    back_populates="libro",
    cascade_delete=True,
    cascade_update=True
)

libro: Optional[Libro] = relationship(
    back_populates="capitulos",
    cascade_delete=True,
    cascade_update=True
)

versiculos: List["Versiculo"] = relationship(
    back_populates="capitulo",
    cascade_delete=True,
    cascade_update=True
)

capitulo: Optional[Capitulo] = relationship(
    back_populates="versiculos",
    cascade_delete=True,
    cascade_update=True
)