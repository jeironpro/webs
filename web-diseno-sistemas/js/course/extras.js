export const extraSteps = {
    "latency-throughput": [
        {
            tag: "Cálculo",
            title: "Diez llamadas, un p99",
            body: "Si una petición hace diez llamadas en paralelo y cada una tiene un 1 % de tardar un segundo, la probabilidad de que al menos una sea lenta es 1 − 0,99¹⁰, casi un 10 %.",
            insight:
                "El fan-out multiplica la cola: el p99 de una dependencia se convierte en el p50 de la página.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "Black Friday a medianoche",
            body: "El tráfico se multiplica por ocho, pero el servidor solo sube al 85 % de uso. La latencia se dispara porque la cola ya no absorbe la ráfaga, no porque falte CPU.",
            insight:
                "Un pico no siempre rompe por capacidad absoluta; a menudo rompe por falta de margen para la cola.",
            node: 3,
        },
    ],
    "napkin-math": [
        {
            tag: "Cálculo",
            title: "El byte que se multiplica",
            body: "Dos kilobytes por fila se convierten en más de seis con índices, réplicas y backups. Diez millones de acciones diarias pueden pasar de 20 GB a 60 GB reales al día.",
            insight:
                "Presupuesta entre dos y tres veces el dato crudo; el almacenamiento real incluye copias y estructuras.",
            node: 3,
        },
        {
            tag: "Caso",
            title: "La campaña de una hora",
            body: "Una campaña concentra el 30 % del tráfico diario en una hora. La media de 116 req/s se convierte en un pico de más de 800 req/s; dimensionar con la media deja el sistema en cola.",
            insight:
                "El pico relevante no es el del día, sino el de la ventana más estrecha que el sistema debe soportar.",
            node: 1,
        },
    ],
    indexes: [
        {
            tag: "Cálculo",
            title: "Cuatro saltos, no diez millones",
            body: "Un B-tree con cien punteros por página necesita unos cuatro niveles para diez millones de filas. La diferencia entre escanear 10 000 000 y leer 4 páginas es la diferencia entre segundos y milisegundos.",
            insight:
                "El índice no hace la consulta instantánea: reduce el número de páginas que hay que tocar.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "El índice que no se usa",
            body: "Un índice (tenant_id, created_at) sirve para filtrar por tenant y ordenar por fecha. Si la consulta filtra solo por fecha, el prefijo no coincide y el motor puede escanear la tabla.",
            insight:
                "Un índice compuesto solo ayuda si la consulta usa su prefijo; el orden de las columnas es parte del contrato.",
            node: 1,
        },
    ],
    replication: [
        {
            tag: "Cálculo",
            title: "R + W > N",
            body: "Con tres réplicas, leer de dos y escribir en dos garantiza que lectura y escritura se solapen al menos en una réplica. Con una lectura y una escritura, pueden caer en nodos distintos y no verse.",
            insight:
                "El quórum no es un número mágico: es una intersección entre el conjunto que lee y el que escribe.",
            node: 3,
        },
        {
            tag: "Caso",
            title: "Acabo de cambiar mi perfil",
            body: "El usuario escribe en el líder y recarga desde una réplica con 300 ms de lag. Ve el nombre anterior y cree que la aplicación perdió el cambio.",
            insight:
                "Para lectura de lo propio, usa el líder o una sesión pegada; para el resto, la réplica puede bastar.",
            node: 2,
        },
    ],
    sharding: [
        {
            tag: "Cálculo",
            title: "Dos mil millones de filas",
            body: "Dos mil millones de pedidos de 2 KB ocupan unos 4 TB crudos. Con dieciséis shards, cada uno recibe 125 millones de filas y unos 250 GB, antes de índices y réplicas.",
            insight:
                "El número de shards debe salir del tamaño y del crecimiento, no de una simetría bonita.",
            node: 3,
        },
        {
            tag: "Caso",
            title: "El tenant que pesa demasiado",
            body: "Un cliente concentra el 40 % de las escrituras y cae en un solo shard. Los otros quince están tranquilos mientras ese nodo hace cola para todos sus usuarios.",
            insight:
                "Si un tenant puede dominar la carga, la clave de partición debe permitir aislarlo o subdividirlo.",
            node: 2,
        },
    ],
    "consistent-hashing": [
        {
            tag: "Cálculo",
            title: "Un sexto, no todo",
            body: "Al pasar de cinco a seis nodos, un hash consistente mueve alrededor de 1/6 de las claves, no 5/6. Ese es el ahorro frente al módulo: solo migra el tramo que pertenece al nodo nuevo.",
            insight:
                "La ganancia del anillo crece con el número de nodos, porque cada cambio afecta a una fracción pequeña.",
            node: 1,
        },
        {
            tag: "Caso",
            title: "Se cae un nodo",
            body: "Las claves del nodo caído pertenecen al siguiente nodo del anillo. Si hay dos réplicas, el tercer nodo también tiene copia; sin réplicas, esa porción desaparece hasta reconstruirla.",
            insight:
                "El anillo decide dónde viven las claves; la replicación decide si sobreviven a la caída de una posición.",
            node: 3,
        },
    ],
    "unique-ids": [
        {
            tag: "Cálculo",
            title: "Cuántos IDs por milisegundo",
            body: "Snowflake reserva 12 bits para la secuencia: 4 096 IDs por milisegundo y nodo. Para 50 000 IDs/s hacen falta al menos trece nodos, o más bits de secuencia si el reloj es el mismo.",
            insight:
                "El techo de un generador distribuido se calcula por nodo y por milisegundo, no por una intuición de escala.",
            node: 3,
        },
        {
            tag: "Caso",
            title: "El reloj que vuelve atrás",
            body: "Una máquina sincroniza su reloj y salta 40 ms al pasado. Si sigue generando IDs, puede repetir la parte temporal; el generador debe esperar o cambiar de nodo.",
            insight:
                "Un ID ordenado por tiempo depende de un reloj monótono; sin esa garantía, el orden es solo una intención.",
            node: 2,
        },
    ],
    "cap-consistency": [
        {
            tag: "Cálculo",
            title: "La intersección del quórum",
            body: "Con cinco réplicas, escribir en tres y leer en tres garantiza que ambos conjuntos se cruzan al menos en una réplica. Leer de una sola no garantiza ver la última escritura.",
            insight:
                "La consistencia read-your-writes se compra con intersección de quórums o con una lectura al líder.",
            node: 3,
        },
        {
            tag: "Caso",
            title: "Saldo y likes no son iguales",
            body: "Un saldo negativo por una partición es un incidente financiero; un like perdido es una molestia. La misma base puede usar CP para pagos y AP para contadores.",
            insight:
                "La elección CAP es por operación y por coste del error, no una etiqueta para todo el producto.",
            node: 2,
        },
    ],
    "consensus-leader": [
        {
            tag: "Cálculo",
            title: "Cinco nodos, dos fallos",
            body: "Un quórum de tres sobre cinco tolera dos fallos. Con cuatro nodos el quórum sigue siendo tres, así que solo tolera uno: añadir el cuarto no mejora la tolerancia y sí añade latencia.",
            insight:
                "Los clústeres de consenso suelen usar números impares porque el quórum no mejora con un nodo par.",
            node: 3,
        },
        {
            tag: "Caso",
            title: "La partición de tres contra dos",
            body: "El lado con tres nodos elige líder y sigue aceptando escrituras. El lado con dos no puede formar quórum y rechaza las suyas para no crear una segunda historia.",
            insight:
                "Durante una partición, el consenso prefiere la corrección a la disponibilidad de la minoría.",
            node: 1,
        },
    ],
    "transactions-isolation": [
        {
            tag: "Caso",
            title: "El último asiento",
            body: "Dos transacciones leen que el asiento 12A está libre. Si ambas escriben sin bloqueo ni versión, las dos confirman y el asiento se vende dos veces.",
            insight:
                "Leer y escribir en pasos separados necesita un bloqueo, una versión o una restricción única que falle.",
            node: 2,
        },
        {
            tag: "Cálculo",
            title: "Serializable también cuesta",
            body: "Si una transacción tarda 50 ms y toca la misma fila que otras diez, la concurrencia efectiva se limita. Serializable puede abortar y reintentar, así que el rendimiento no es solo CPU.",
            insight:
                "El aislamiento se paga en espera o en reintentos; elige el nivel que tu operación puede sostener.",
            node: 1,
        },
    ],
    caching: [
        {
            tag: "Cálculo",
            title: "La media miente",
            body: "Con 95 % de hits a 2 ms y 5 % de misses a 180 ms, la media es 0,95×2 + 0,05×180 = 11 ms. El p95 puede seguir cerca de 180 ms si los misses se concentran.",
            insight:
                "Un hit ratio alto mejora la media; para el p95 importa qué usuarios caen en el 5 % que falla.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "La estampida de la clave popular",
            body: "La ficha de un producto viral caduca y 500 peticiones consultan el origen a la vez. Sin bloqueo ni stale-while-revalidate, la base recibe exactamente el pico que la caché debía evitar.",
            insight:
                "Protege el miss de las claves calientes; la caché también necesita un plan para el momento en que falla.",
            node: 3,
        },
    ],
    "message-queues": [
        {
            tag: "Cálculo",
            title: "Cuántos workers hacen falta",
            body: "Si llegan 100 mensajes/s y un worker procesa 20/s, necesitas al menos cinco para no crecer. Con ocho tienes margen para picos y para que uno se reinicie.",
            insight:
                "La profundidad de la cola es la integral entre llegadas y salidas; sin margen, el retraso crece aunque la media parezca estable.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "El mensaje que llegó dos veces",
            body: "El worker cobró la factura, pero se cayó antes de confirmar. La cola lo reintenta; sin una clave de idempotencia, el cliente recibe dos cargos.",
            insight:
                "En una cola al menos una vez, el consumidor es responsable de que repetir no duplique el efecto.",
            node: 3,
        },
    ],
    "sagas-distributed-transactions": [
        {
            tag: "Caso",
            title: "Pedido, pago y stock",
            body: "El pedido reserva stock, cobra y falla al crear el envío. La saga compensa el pago con un reembolso y libera la reserva; el pedido queda cancelado, no a medias.",
            insight: "Cada paso necesita una compensación de negocio, no solo un rollback técnico.",
            node: 2,
        },
        {
            tag: "Cálculo",
            title: "Cuatro pasos, cuatro estados",
            body: "Una saga de cuatro pasos puede fallar en tres transiciones. Si cada paso tiene éxito el 99 %, la probabilidad de completar los cuatro sin compensar es 0,99⁴, aproximadamente 96 %.",
            insight:
                "Más pasos distribuidos multiplican las oportunidades de compensación; simplifica el flujo antes de añadir servicios.",
            node: 1,
        },
    ],
    "batch-streaming": [
        {
            tag: "Cálculo",
            title: "Dos mil millones al día",
            body: "Dos mil millones de eventos diarios son unos 23 000 por segundo de media. Un pico de tres veces exige 70 000/s; un batch nocturno reparte esa carga de otra forma.",
            insight:
                "La media diaria no dimensiona un stream: el pico y la ventana de retención mandan.",
            node: 0,
        },
        {
            tag: "Caso",
            title: "Exactly-once en la práctica",
            body: "El stream procesa un pago y escribe el resultado. Si el sink no es idempotente, un reintento después de una caída puede duplicar la fila aunque la plataforma prometa exactly-once.",
            insight:
                "La semántica exactamente una vez termina en la escritura final; verifica el sink, no solo el motor.",
            node: 3,
        },
    ],
    "url-shortener": [
        {
            tag: "Cálculo",
            title: "Siete caracteres base62",
            body: "62⁶ supera los 56 000 millones de combinaciones; 62⁷ supera los 3,5 billones. Para 2 000 millones de URLs, seis caracteres alcanzan y siete dejan margen para crecer.",
            insight:
                "La longitud del código se deriva del espacio de IDs y del crecimiento esperado, no de una preferencia estética.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "El enlace que se hizo viral",
            body: "Un código recibe un millón de clics en una hora. La CDN o la caché de borde absorben la lectura; si cada clic llega a la base, el acortador se convierte en el cuello del enlace.",
            insight:
                "El camino de redirección debe ser cacheable y barato; la analítica puede ir por un camino asíncrono.",
            node: 1,
        },
    ],
    "news-feed": [
        {
            tag: "Cálculo",
            title: "Doscientos timelines por post",
            body: "Si un usuario medio tiene 200 seguidores, cada publicación escribe 200 entradas. Un millón de publicaciones diarias genera 200 millones de escrituras de timeline, antes de ranking y réplicas.",
            insight:
                "El fan-out al escribir convierte una publicación en muchas escrituras; dimensiona por ese multiplicador.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "La celebridad con 50 millones",
            body: "Precalcular el timeline de una cuenta con 50 millones de seguidores para cada post es inviable. El sistema híbrido deja sus posts para el fan-out al leer y mezcla con timelines precalculados.",
            insight:
                "La solución no es elegir un bando, sino aplicar la estrategia según el tamaño del fan-out.",
            node: 3,
        },
    ],
    "chat-system": [
        {
            tag: "Cálculo",
            title: "Veinte millones de conexiones",
            body: "Si un gateway sostiene 50 000 WebSockets, hacen falta 400 gateways solo para las conexiones. Un heartbeat cada 30 segundos genera además unos 667 000 mensajes por segundo.",
            insight:
                "En tiempo real, la conexión y el latido son parte de la carga; no son gratis aunque no haya mensajes de usuario.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "El móvil cambia de red",
            body: "El usuario pierde la conexión en el metro. Al volver, envía el último cursor que recibió y pide los mensajes posteriores; sin ese cursor, se pierde lo que ocurrió mientras estaba desconectado.",
            insight:
                "La reconexión necesita un punto de reanudación, no solo volver a abrir el socket.",
            node: 3,
        },
    ],
    "rate-limiting": [
        {
            tag: "Cálculo",
            title: "Cien por minuto",
            body: "Cien peticiones por minuto son 1,67 por segundo de recarga. Un bucket de 100 permite una ráfaga inicial y luego sostiene ese ritmo; una ventana fija puede dejar pasar 200 en el borde.",
            insight:
                "El límite tiene dos parámetros: tamaño de ráfaga y ritmo sostenido. Elegir solo el total por minuto esconde el pico.",
            node: 2,
        },
        {
            tag: "Caso",
            title: "El cliente que reintenta el 429",
            body: "Un SDK recibe 429 y reintenta inmediatamente. Si todos los clientes hacen lo mismo, el límite se convierte en una tormenta; Retry-After y jitter reparten los reintentos.",
            insight:
                "El rechazo también es parte de la API; si no enseña cuándo volver, el cliente empeora el problema.",
            node: 3,
        },
    ],
    "timeouts-retries": [
        {
            tag: "Cálculo",
            title: "El presupuesto no se suma",
            body: "Si el usuario espera como máximo 1 000 ms y una dependencia consume 800 ms, solo quedan 200 para el resto. Reintentar dos veces con 800 ms rompe el presupuesto aunque cada intento parezca razonable.",
            insight:
                "Cada salto y cada reintento consumen el mismo deadline; el timeout se diseña hacia atrás desde el usuario.",
            node: 1,
        },
        {
            tag: "Caso",
            title: "La tormenta de reintentos",
            body: "Un servicio cae y mil clientes reintentan a la vez cada segundo. El backoff exponencial con jitter dispersa los intentos; sin jitter, todos vuelven en el mismo instante.",
            insight:
                "Reintentar es correcto solo si el intervalo también está diseñado para no amplificar la caída.",
            node: 2,
        },
    ],
};
