# Índice de problemas de diseño Java

Serie de **30 problemas de diseño** repartidos en **8 niveles** (de Modelado simple a Sistemas completos). Cada problema exige decidir el diseño de clases antes de programar: identificar entidades, elegir estructuras, justificar el enfoque POO y argumentar las decisiones. Incluyen contexto, requisitos funcionales, reglas de negocio, ejemplos de comportamiento, preguntas de análisis previo, pistas ocultables y criterios de una buena solución.

## Distribución por nivel

| Nivel | Nombre | Problemas |
|-------|--------|-----------|
| 1 | Modelado simple | 001 |
| 2 | Composición básica | 002, 017 |
| 3 | Colecciones + lógica de negocio | 003, 007, 011, 012, 015, 016, 018, 020, 022, 025, 027, 030 |
| 4 | Herencia y polimorfismo | 005, 014 |
| 5 | Interfaces y contratos | 008 |
| 6 | Manejo de errores realista | 006, 021 |
| 7 | Algoritmos aplicados | 004, 010, 013, 019, 024, 026, 028, 029 |
| 8 | Sistemas completos | 009, 023 |

## Tabla completa

| # | Título | Nivel | Categoría | Enfoque POO |
|---|--------|-------|-----------|-------------|
| 001 | El termómetro del cuarto de servidores | 1 - Modelado simple | Procesamiento de datos | Ninguno (problema procedural) |
| 002 | La máquina expendedora de la terminal | 2 - Composición básica | Modelado de negocio | Composición (`MaquinaExpendedora` gestiona inventario y caja) |
| 003 | El juego de memoria del corredor | 3 - Colecciones + lógica de negocio | Juegos y lógica | Composición (`JuegoDeMemoria` gestiona un tablero de `Carta`) |
| 004 | Las reservas de la sala de reuniones del coworking | 7 - Algoritmos aplicados | Algoritmos con contexto | Ninguno (problema algorítmico) |
| 005 | La nómina de la startup de software | 4 - Herencia y polimorfismo | Sistemas con jerarquías | Herencia y polimorfismo (`Empleado` → subclases) |
| 006 | El simulador del elevador de la torre de oficinas | 6 - Manejo de errores realista | Simulación | Composición + excepciones personalizadas (`Elevador` contiene `Pasajero`) |
| 007 | El registro de préstamos de la biblioteca comunitaria | 3 - Colecciones + lógica de negocio | Gestión / CRUD conceptual | Ninguno (reglas de préstamo) |
| 008 | La pasarela de pagos del gimnasio | 5 - Interfaces y contratos | Modelado de negocio | Interfaz (`Pagable`) con implementaciones intercambiables |
| 009 | El administrador del parqueadero del centro comercial | 8 - Sistemas completos | Gestión / CRUD conceptual | Herencia + excepciones + colecciones (`Parqueadero` gestiona `Vehiculo`) |
| 010 | El reparto equilibrado de los dos camiones | 7 - Algoritmos aplicados | Algoritmos con contexto | Ninguno (problema de optimización) |
| 011 | El analizador de encuestas de la ESE | 3 - Colecciones + lógica de negocio | Procesamiento de datos | Ninguno (parseo y agregación de datos) |
| 012 | El bingo de la feria del pueblo | 3 - Colecciones + lógica de negocio | Juegos y lógica | Composición (`JuegoDeBingo` gestiona una `Carta` de 5x5) |
| 013 | El fixture del campeonato del barrio | 7 - Algoritmos aplicados | Algoritmos con contexto | Ninguno (problema combinatorio) |
| 014 | La cotización de pisos laminados de la constructora | 4 - Herencia y polimorfismo | Sistemas con jerarquías | Herencia y polimorfismo (`Figura` → `Rectangulo`, `Circulo`, `Triangulo`) |
| 015 | El control de medicamentos del dispensario | 3 - Colecciones + lógica de negocio | Gestión / CRUD conceptual | Composición (`Dispensario` gestiona `Medicamento` con lotes) |
| 016 | El validador de códigos de barra de la tienda | 3 - Colecciones + lógica de negocio | Procesamiento de datos | Ninguno (validación normalizada) |
| 017 | La facturación con impuestos de la ferretería | 2 - Composición básica | Modelado de negocio | Composición (`Factura` contiene líneas de `Producto`) |
| 018 | Los anagramas del taller de crucigramas | 3 - Colecciones + lógica de negocio | Juegos y lógica | Ninguno (manipulación de texto y agrupación) |
| 019 | La clasificación general del tour regional de ciclismo | 7 - Algoritmos aplicados | Procesamiento de datos | Composición (`Campeonato` gestiona `Ciclista` y `Etapa`) |
| 020 | La boletería del teatro municipal | 3 - Colecciones + lógica de negocio | Gestión / CRUD conceptual | Ninguno (tablero y búsqueda por rango) |
| 021 | El sistema de reservas del hostal de la montaña | 6 - Manejo de errores realista | Gestión / CRUD conceptual | Composición + excepciones personalizadas (`Hostal` gestiona `Habitacion` y `Reserva`) |
| 022 | El control de horas del vigilante del conjunto | 3 - Colecciones + lógica de negocio | Procesamiento de datos | Ninguno (parseo y cálculo de tiempos) |
| 023 | El blackjack de la feria | 8 - Sistemas completos | Juegos y lógica | Composición (`Baraja` contiene `Carta`; `Mano` evalúa; `Juego` orquesta) |
| 024 | El letrero comprimido de la serigrafía | 7 - Algoritmos aplicados | Procesamiento de datos | Ninguno (codificación/decodificación de texto) |
| 025 | El santuario de fauna de la reserva | 3 - Colecciones + lógica de negocio | Sistemas con jerarquías | Composición (`Santuario` gestiona `Recinto`, `Especie` y `Animal`) |
| 026 | El escáner en espiral de la imprenta | 7 - Algoritmos aplicados | Procesamiento de datos | Ninguno (recorrido de una matriz) |
| 027 | El costeo de recetas del restaurante de barrio | 3 - Colecciones + lógica de negocio | Modelado de negocio | Composición (`Receta` contiene lista de `Ingrediente`) |
| 028 | Las subredes de la cooperativa de internet | 7 - Algoritmos aplicados | Procesamiento de datos | Ninguno (cálculo sobre enteros) |
| 029 | La red de contactos de la asociación de vecinos | 7 - Algoritmos aplicados | Gestión / CRUD conceptual | Composición (`Red` gestiona `Miembro` y enlaces de amistad) |
| 030 | El verificador de boletas del sorteo | 3 - Colecciones + lógica de negocio | Juegos y lógica | Ninguno (conteo de coincidencias y validación) |
