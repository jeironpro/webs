export const lessons = [
    {
        id: "sql-vs-nosql",
        title: "SQL vs. NoSQL",
        lede: "Tablas, documentos o simples claves: para qué sirve cada tipo de base de datos y a qué renuncia.",
        minutes: 11,
        level: "Principiante",
        metrics: [
            ["Modelo", "Relacional"],
            ["Joins", "Sí"],
            ["Escala", "Vertical"],
            ["Flexibilidad", "Media"],
        ],
        scene: {
            url: "https://datos.example",
            status: "eligiendo modelo",
            labels: ["Cliente", "API", "SQL", "NoSQL"],
        },
        steps: [
            {
                tag: "Problema",
                title: "No todo encaja en una tabla",
                body: "Un pedido tiene relaciones claras; un catálogo de atributos cambia cada semana. La forma de los datos y las consultas deberían guiar la elección.",
                insight: "Elige el motor por el acceso que necesitas, no por la moda del diagrama.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Relacional: relaciones y transacciones",
                body: "SQL brilla cuando varias tablas se relacionan, las consultas son variadas y necesitas transacciones fuertes.",
                insight: "Las restricciones de una base relacional son documentación ejecutable.",
                node: 2,
            },
            {
                tag: "Mecanismo",
                title: "Documentos, clave-valor y columnas",
                body: "NoSQL agrupa familias con compromisos distintos: documentos flexibles, claves simples, columnas anchas o grafos. No es una sola cosa.",
                insight:
                    "NoSQL no significa sin esquema; significa que el esquema vive en la aplicación o en el acceso.",
                node: 3,
            },
            {
                tag: "Trade-off",
                title: "Escala y consistencia",
                body: "Muchos motores NoSQL sacrifican joins o transacciones multi-documento para repartir datos con facilidad.",
                insight:
                    "Si necesitas joins y transacciones en todas partes, probablemente ya elegiste SQL.",
                node: 2,
            },
            {
                tag: "Decisión",
                title: "Empieza por lo conocido",
                body: "Una base relacional resuelve la mayoría de productos pequeños. Cambia cuando un acceso concreto duela de verdad, no antes.",
                insight:
                    "La mejor base de datos es la que tu equipo sabe operar a las tres de la mañana.",
                node: 0,
            },
        ],
        learn: [
            "Qué aporta un modelo relacional.",
            "Qué familias existen bajo NoSQL.",
            "Qué se gana y se pierde al repartir datos.",
            "Cómo elegir según el patrón de acceso.",
        ],
    },
    {
        id: "indexes",
        title: "Índices",
        lede: "Por qué la misma consulta puede tardar dos segundos o dos milisegundos.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["Filas", "10 M"],
            ["Sin índice", "2.1 s"],
            ["Con índice", "3 ms"],
            ["Coste escritura", "+ 15 %"],
        ],
        scene: {
            url: "https://datos.example/orders",
            status: "buscando una fila",
            labels: ["Query", "Índice", "B-tree", "Tabla"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Leer toda la tabla",
                body: "Sin índice, buscar por email obliga a revisar cada fila. El tiempo crece con el tamaño de la tabla.",
                insight:
                    "Un índice es una estructura ordenada que evita recorrer el mundo para encontrar una aguja.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "El árbol que ordena",
                body: "Un B-tree mantiene las claves ordenadas y permite descartar ramas enteras en cada comparación. La búsqueda pasa de lineal a logarítmica.",
                insight:
                    "El índice no guarda magia: guarda una copia ordenada de la columna y punteros a las filas.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "El orden de las columnas importa",
                body: "Un índice compuesto por (cliente, fecha) sirve para cliente o cliente+fecha, pero no para fecha sola. El prefijo manda.",
                insight: "Diseña el índice como diseñas la consulta: por el orden en que filtras.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "Cada índice encarece escribir",
                body: "Cada inserción o actualización mantiene todos los índices afectados. Un exceso de índices hace lentas las escrituras y ocupa disco.",
                insight:
                    "Los índices son una factura que pagas en cada escritura, no solo al crearlos.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Mira el plan, no adivines",
                body: "Usa EXPLAIN para ver si la consulta usa el índice, cuántas filas estima y dónde hace un escaneo completo.",
                insight:
                    "La consulta que crees que corre por el índice puede estar recorriendo la tabla entera.",
                node: 0,
            },
        ],
        learn: [
            "Cómo un índice evita escaneos completos.",
            "Cómo funciona un B-tree a grandes rasgos.",
            "Por qué importa el orden de un índice compuesto.",
            "Cómo leer un plan de ejecución.",
        ],
    },
    {
        id: "storage-engines",
        title: "Motores de almacenamiento",
        lede: "Qué hace de verdad una base de datos con tu escritura, y por qué unos motores están hechos para leer y otros para escribir.",
        minutes: 13,
        level: "Avanzado",
        metrics: [
            ["Escrituras", "120 k/s"],
            ["Lecturas", "40 k/s"],
            ["WAL", "Sí"],
            ["Compactación", "Background"],
        ],
        scene: {
            url: "https://datos.example/write",
            status: "una escritura en disco",
            labels: ["Write", "WAL", "Memtable", "SSTable"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Escribir sin perder nada",
                body: "Una base de datos debe confirmar una escritura sin esperar a reorganizar el disco entero. El diseño del motor decide cuánto cuesta.",
                insight:
                    "La durabilidad se compra con un registro ordenado antes de tocar la estructura principal.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "WAL: primero el diario",
                body: "El write-ahead log apunta el cambio de forma secuencial y confirma. Si el proceso cae, el diario permite reconstruir lo que faltaba.",
                insight:
                    "Escribir al final de un archivo es mucho más barato que escribir en posiciones aleatorias.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "B-tree frente a LSM",
                body: "Un B-tree actualiza páginas en el sitio y favorece lecturas. Un LSM acumula escrituras en memoria y las vuelca ordenadas, favoreciendo ingesta.",
                insight: "No hay motor mejor: hay un patrón de lectura y escritura para cada uno.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "La compactación no es gratis",
                body: "Los motores LSM compactan archivos para no acumular versiones. Ese trabajo de fondo consume CPU y disco, y puede competir con el tráfico.",
                insight: "Un motor rápido escribiendo puede ser caro manteniéndose ordenado.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Mide el patrón real",
                body: "Si dominan lecturas puntuales, un B-tree suele encajar. Si dominan ingestas masivas y escrituras secuenciales, un LSM puede ganar.",
                insight:
                    "Elige el motor por la mezcla de operaciones, no por una prueba de un solo insert.",
                node: 2,
            },
        ],
        learn: [
            "Qué es un write-ahead log.",
            "Diferencias entre B-tree y LSM.",
            "Por qué la compactación afecta la latencia.",
            "Cómo elegir según lectura y escritura.",
        ],
    },
    {
        id: "replication",
        title: "Replicación",
        lede: "Guarda copias de la base de datos en varias máquinas: para más lecturas y para sobrevivir.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["Réplicas", "3"],
            ["Lag", "80 ms"],
            ["Lecturas", "2×"],
            ["Failover", "30 s"],
        ],
        scene: {
            url: "https://datos.example/replica",
            status: "tres copias, un líder",
            labels: ["Cliente", "Líder", "Réplica 1", "Réplica 2"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Una copia es un punto de fallo",
                body: "Si la única base de datos cae, el producto se detiene. Una réplica permite sobrevivir y repartir lecturas.",
                insight: "Replicar no es solo copiar datos: es decidir qué copia manda.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Líder y seguidores",
                body: "Las escrituras van al líder y se propagan a los seguidores. Las lecturas pueden ir a réplicas, aceptando un pequeño retraso.",
                insight:
                    "La replicación introduce una ventana en la que dos usuarios pueden ver mundos distintos.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Lag de replicación",
                body: "El seguidor va por detrás. Si el usuario escribe y lee de una réplica, puede no ver su propio cambio.",
                insight:
                    "Lee de la réplica para lo que tolera retraso; lee del líder para lo que debe ser exacto.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Promover sin split brain",
                body: "Si el líder cae, promover un seguidor requiere quórum y comprobar que el antiguo líder no sigue aceptando escrituras.",
                insight: "Un failover mal hecho crea dos líderes y dos historias incompatibles.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Define la consistencia esperada",
                body: "Réplicas síncronas protegen más y escriben más lento; asíncronas responden rápido y pueden perder los últimos cambios.",
                insight: "La pregunta no es si replicar, sino cuánto puedes perder en un failover.",
                node: 1,
            },
        ],
        learn: [
            "Cómo funciona líder-seguidores.",
            "Qué es el lag y cómo afecta al usuario.",
            "Cómo evitar split brain en un failover.",
            "Replicación síncrona frente a asíncrona.",
        ],
    },
    {
        id: "sharding",
        title: "Sharding",
        lede: "Cuando los datos o las escrituras no caben en una máquina, repártelos entre muchas.",
        minutes: 12,
        level: "Avanzado",
        metrics: [
            ["Shards", "8"],
            ["Clave", "tenant_id"],
            ["Hot shard", "1"],
            ["Rebalanceo", "Manual"],
        ],
        scene: {
            url: "https://datos.example/shard",
            status: "ocho particiones",
            labels: ["Cliente", "Router", "Shard A", "Shard B"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Una tabla que ya no cabe",
                body: "El disco se llena o las escrituras saturan una sola máquina. Partir los datos permite crecer más allá de ese límite.",
                insight:
                    "El sharding es la última palanca: complica consultas, transacciones y operación.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Elige una clave de partición",
                body: "La clave decide en qué shard cae cada fila. Debe repartir carga y permitir las consultas más frecuentes sin cruzar particiones.",
                insight: "Una clave cómoda para escribir puede ser desastrosa para leer.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "El shard caliente",
                body: "Si un tenant gigante cae en un shard, ese shard sufre mientras los demás están tranquilos. La media global oculta el problema.",
                insight: "Distribuir filas no garantiza distribuir trabajo.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "Consultas y transacciones cruzadas",
                body: "Un join entre shards requiere coordinación o duplicar datos. Una transacción que toca dos shards necesita un protocolo más caro.",
                insight: "Cada frontera de partición es una frontera de consistencia.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Planifica el rebalanceo",
                body: "Añadir shards no debe requerir mover todo. Usa hashing consistente o rangos preparados para dividir.",
                insight: "Si no sabes cómo mover datos, todavía no estás listo para shardear.",
                node: 1,
            },
        ],
        learn: [
            "Cuándo el sharding es necesario.",
            "Cómo elegir una clave de partición.",
            "Qué es un shard caliente.",
            "Qué complica una consulta entre shards.",
        ],
    },
    {
        id: "consistent-hashing",
        title: "Hashing consistente",
        lede: "Añade o quita servidores y mueve solo una pizca de los datos.",
        minutes: 10,
        level: "Avanzado",
        metrics: [
            ["Nodos", "6"],
            ["Virtual nodes", "150"],
            ["Datos movidos", "1/6"],
            ["Replicas", "2"],
        ],
        scene: {
            url: "https://cluster.example",
            status: "anillo de nodos",
            labels: ["Clave", "Anillo", "Nodo A", "Nodo B"],
        },
        steps: [
            {
                tag: "Problema",
                title: "El módulo mueve casi todo",
                body: "Con hash % N, pasar de 5 a 6 nodos cambia la posición de la mayoría de claves. El cluster se rebalancea entero.",
                insight:
                    "Una función de reparto demasiado rígida convierte cada cambio de capacidad en una migración masiva.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "El anillo",
                body: "Cada nodo ocupa posiciones en un círculo. Una clave pertenece al siguiente nodo en el sentido de las agujas del reloj.",
                insight:
                    "Añadir un nodo solo se lleva las claves de su tramo, no las de todo el anillo.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Nodos virtuales",
                body: "Un nodo con una sola posición puede recibir un tramo enorme. Los virtual nodes reparten mejor y permiten nodos de distinta capacidad.",
                insight:
                    "Más virtual nodes dan equilibrio, a cambio de más metadatos y complejidad.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Réplicas y reconstrucción",
                body: "Cada clave se copia en los siguientes nodos del anillo. Si uno cae, otro puede servirla, pero la reconstrucción consume red.",
                insight:
                    "El anillo también es una política de replicación; no lo trates solo como un hash.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Úsalo cuando cambies de tamaño",
                body: "Si el cluster es fijo, un hash simple basta. Si crece y se reduce con frecuencia, el hashing consistente evita migraciones dolorosas.",
                insight: "La consistencia no evita mover datos; evita moverlos todos.",
                node: 1,
            },
        ],
        learn: [
            "Por qué hash % N es problemático.",
            "Cómo funciona un anillo consistente.",
            "Para qué sirven los nodos virtuales.",
            "Cómo se replican claves en el anillo.",
        ],
    },
    {
        id: "unique-ids",
        title: "IDs únicos a escala",
        lede: "Da a cada fila un nombre que nadie más usará jamás, sin un contador ante el que todos hagan cola.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["IDs/s", "50 k"],
            ["Formato", "Snowflake"],
            ["Colisión", "0"],
            ["Orden", "Aproximado"],
        ],
        scene: {
            url: "https://api.example/orders",
            status: "generando identidad",
            labels: ["Cliente", "ID", "Secuencia", "Nodo"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Un contador central",
                body: "Un autoincremento es simple y ordenado, pero todas las escrituras dependen de una secuencia. A escala se convierte en un cuello.",
                insight:
                    "Un identificador debe ser único sin convertirse en el punto de coordinación del sistema.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "UUID y sus variantes",
                body: "Un UUID se genera sin coordinación y tiene una colisión prácticamente imposible. UUIDv7 añade tiempo al inicio y mejora el orden.",
                insight:
                    "La aleatoriedad elimina la coordinación, pero puede destrozar la localidad de los índices.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "Snowflake: tiempo, nodo y secuencia",
                body: "Un ID combina milisegundos, identificador de máquina y contador local. Es único, ordenable y no requiere una llamada por ID.",
                insight:
                    "El tiempo aporta orden; el nodo evita colisiones; la secuencia cubre el mismo milisegundo.",
                node: 3,
            },
            {
                tag: "Fallo",
                title: "Relojes que retroceden",
                body: "Si el reloj de una máquina salta atrás, dos IDs pueden repetirse. Hay que detectar el salto y esperar o cambiar de nodo.",
                insight: "Cualquier ID basado en tiempo asume un reloj razonablemente monótono.",
                node: 2,
            },
            {
                tag: "Decisión",
                title: "Elige por orden y opacidad",
                body: "Si necesitas IDs ordenables para paginar, usa tiempo más nodo. Si necesitas opacidad y simplicidad, un UUID aleatorio sirve.",
                insight: "El formato del ID filtra información: decide qué quieres revelar.",
                node: 0,
            },
        ],
        learn: [
            "Por qué un autoincremento no siempre escala.",
            "Ventajas de UUID y UUIDv7.",
            "Cómo se compone un ID Snowflake.",
            "Qué falla cuando el reloj retrocede.",
        ],
    },
    {
        id: "cap-consistency",
        title: "CAP y consistencia",
        lede: "Cuando la red se parte, las copias de tus datos deben elegir entre tener razón y estar disponibles.",
        minutes: 11,
        level: "Avanzado",
        metrics: [
            ["Partición", "P"],
            ["Elección", "AP"],
            ["Staleness", "2 s"],
            ["Quórum", "No"],
        ],
        scene: {
            url: "https://datos.example/partition",
            status: "red partida",
            labels: ["Cliente", "Partición", "C", "A"],
        },
        steps: [
            {
                tag: "Problema",
                title: "La red se rompe",
                body: "Dos centros de datos dejan de verse. Cada uno tiene una copia y debe decidir si responde o si se niega a servir datos posiblemente viejos.",
                insight: "CAP no se elige en el día a día; se revela cuando hay una partición.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "C, A y P",
                body: "Consistencia significa que todos ven el mismo dato; disponibilidad, que toda petición recibe respuesta; partición, que la red puede perder mensajes.",
                insight:
                    "Las particiones son inevitables, así que la elección real es qué hacer mientras duran.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "CP o AP",
                body: "Un sistema CP rechaza escrituras sin quórum para no divergir. Un AP sigue aceptando y reconcilia después, aceptando conflictos.",
                insight:
                    "AP no significa datos malos: significa que la resolución se pospone y debe diseñarse.",
                node: 3,
            },
            {
                tag: "Fallo",
                title: "Conflictos y reconciliación",
                body: "Dos réplicas aceptan cambios distintos. Necesitas versiones, marcas de tiempo o reglas de negocio para decidir cuál gana.",
                insight:
                    "La última escritura gana suena simple hasta que dos relojes no coinciden.",
                node: 1,
            },
            {
                tag: "Decisión",
                title: "Elige por operación",
                body: "Un saldo bancario puede preferir CP. Un contador de likes puede preferir AP. La misma aplicación puede mezclar ambos.",
                insight: "La consistencia se decide por caso de uso, no por base de datos.",
                node: 0,
            },
        ],
        learn: [
            "Qué significa cada letra de CAP.",
            "Por qué la partición es inevitable.",
            "Qué implica elegir CP o AP.",
            "Cómo se reconcilian conflictos.",
        ],
    },
    {
        id: "consensus-leader",
        title: "Consenso y elección de líder",
        lede: "Cómo un grupo de servidores se pone de acuerdo en un líder y una historia, aunque no pueda hablar con todos.",
        minutes: 12,
        level: "Avanzado",
        metrics: [
            ["Nodos", "5"],
            ["Quórum", "3"],
            ["Elección", "Raft"],
            ["Latencia", "2 RTT"],
        ],
        scene: {
            url: "https://cluster.example/raft",
            status: "eligiendo líder",
            labels: ["Cliente", "Líder", "Seguidor", "Quórum"],
        },
        steps: [
            {
                tag: "Problema",
                title: "¿Quién manda?",
                body: "Varios nodos pueden aceptar escrituras, pero solo uno debe ordenarlas. Si dos se creen líderes, las copias divergen.",
                insight:
                    "El consenso convierte un grupo de máquinas en una sola historia ordenada.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Quórum",
                body: "Una decisión se acepta cuando la confirma la mayoría. Con cinco nodos, tres bastan; dos grupos disjuntos no pueden formar mayoría a la vez.",
                insight:
                    "El quórum es lo que impide dos líderes simultáneos con la misma autoridad.",
                node: 3,
            },
            {
                tag: "Mecanismo",
                title: "Raft en una frase",
                body: "Los seguidores esperan latidos. Si no llegan, uno se presenta y pide votos. Quien obtiene mayoría se convierte en líder y replica un log.",
                insight:
                    "El líder no inventa la verdad: propone entradas y espera que la mayoría las confirme.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "La minoría no puede avanzar",
                body: "Sin quórum, el sistema deja de aceptar escrituras para no partir la historia. Prefiere no estar disponible antes que mentir.",
                insight:
                    "El consenso prioriza la corrección sobre la disponibilidad durante una partición.",
                node: 2,
            },
            {
                tag: "Decisión",
                title: "No lo construyas sin necesidad",
                body: "Usa un sistema probado para metadatos críticos. El consenso es caro: cada escritura necesita coordinación y latencia.",
                insight:
                    "Reserva el consenso para lo que no puede divergir; el resto puede ser eventual.",
                node: 0,
            },
        ],
        learn: [
            "Por qué hace falta un líder.",
            "Cómo un quórum evita dos líderes.",
            "Los pasos básicos de una elección Raft.",
            "Cuándo el consenso es demasiado caro.",
        ],
    },
    {
        id: "transactions-isolation",
        title: "Transacciones y aislamiento",
        lede: "Dos personas, un asiento, el mismo milisegundo. Cómo mantienen las bases de datos correctos los cambios concurrentes.",
        minutes: 13,
        level: "Avanzado",
        metrics: [
            ["Aislamiento", "Read committed"],
            ["Bloqueos", "Por fila"],
            ["Anomalía", "Phantom"],
            ["MVCC", "Sí"],
        ],
        scene: {
            url: "https://datos.example/seat",
            status: "dos transacciones",
            labels: ["Tx A", "Bloqueo", "Tx B", "Commit"],
        },
        steps: [
            {
                tag: "Problema",
                title: "El mismo asiento dos veces",
                body: "Dos usuarios compran el último asiento a la vez. Sin coordinación, ambos leen libre, ambos escriben y el inventario queda mal.",
                insight:
                    "Una transacción agrupa operaciones para que el mundo pase de un estado válido a otro.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "ACID",
                body: "Atomicidad, consistencia, aislamiento y durabilidad. O todo cambia, o nada; y lo confirmado sobrevive a un fallo.",
                insight:
                    "La atomicidad no significa que no haya concurrencia: significa que no ves estados intermedios.",
                node: 3,
            },
            {
                tag: "Trade-off",
                title: "Niveles de aislamiento",
                body: "Read committed evita lecturas sucias; repeatable read evita cambios entre lecturas; serializable evita casi toda anomalía a costa de bloquear o abortar.",
                insight: "Más aislamiento suele significar menos concurrencia y más reintentos.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "Lost update y phantom",
                body: "Dos escrituras se pisan o una fila aparece entre dos lecturas. Cada anomalía requiere bloqueo, versión o una comprobación explícita.",
                insight:
                    "Elige el nivel de aislamiento por las anomalías que tu negocio no tolera.",
                node: 2,
            },
            {
                tag: "Decisión",
                title: "Transacción corta y explícita",
                body: "Mantén las transacciones breves, toca pocas filas y define el orden de bloqueo. Las transacciones largas multiplican conflictos.",
                insight:
                    "Una transacción que espera a una API externa es una cola disfrazada de transacción.",
                node: 0,
            },
        ],
        learn: [
            "Qué garantiza una transacción.",
            "Qué permite cada nivel de aislamiento.",
            "Cómo aparecen lost updates y phantoms.",
            "Cómo reducir conflictos.",
        ],
    },
    {
        id: "files-media",
        title: "Archivos y multimedia",
        lede: "Las fotos y los vídeos no van en tu base de datos: adónde van en su lugar, y cómo llegan allí y vuelven.",
        minutes: 12,
        level: "Intermedio",
        metrics: [
            ["Objeto", "4 MB"],
            ["Bucket", "S3"],
            ["Subida", "Directa"],
            ["CDN", "Sí"],
        ],
        scene: {
            url: "https://media.example/photo.jpg",
            status: "subiendo un archivo",
            labels: ["Cliente", "URL", "S3", "CDN"],
        },
        steps: [
            {
                tag: "Problema",
                title: "La base de datos no es un disco",
                body: "Guardar imágenes en una columna infla backups, consultas y réplicas. El binario merece un almacén hecho para objetos.",
                insight: "La base de datos guarda metadatos; el objeto guarda el contenido.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Subida directa al bucket",
                body: "La API firma una URL temporal y el cliente sube directo al object storage. El servidor no gasta memoria ni ancho de banda proxies.",
                insight:
                    "Una URL prefirmada traslada la carga de datos sin regalar permisos permanentes.",
                node: 2,
            },
            {
                tag: "Mecanismo",
                title: "Metadatos y permisos",
                body: "La base guarda el ID, propietario, tipo y estado. El bucket guarda bytes; la API decide quién puede leerlos.",
                insight:
                    "Un bucket público por accidente es una filtración, no una decisión de rendimiento.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Servir desde el origen",
                body: "Si cada descarga pasa por la API, pagas CPU y ancho de banda. Una CDN delante del bucket reduce latencia y coste.",
                insight: "Los objetos grandes se sirven cerca y se cachean; la API solo autoriza.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Ciclo de vida explícito",
                body: "Define cuándo se borra, se archiva o se transforma un objeto. Los buckets crecen y nadie recuerda por qué.",
                insight:
                    "El almacenamiento barato sigue costando; la retención es parte del diseño.",
                node: 2,
            },
        ],
        learn: [
            "Por qué no guardar binarios en la base.",
            "Cómo funciona una subida directa firmada.",
            "Qué metadatos sí pertenecen a la base.",
            "Cómo servir multimedia con CDN.",
        ],
    },
];
