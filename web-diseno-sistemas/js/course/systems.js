export const lessons = [
    {
        id: "hld-lld",
        title: "HLD y LLD",
        lede: "El mismo sistema a dos niveles de zoom: el mapa de servicios, y el interior de uno de ellos.",
        minutes: 8,
        level: "Intermedio",
        metrics: [
            ["Requisitos", "5"],
            ["Servicios", "6"],
            ["Datos", "3"],
            ["ADRs", "4"],
        ],
        scene: {
            url: "https://design.example",
            status: "del mapa al detalle",
            labels: ["Requisitos", "HLD", "LLD", "Código"],
        },
        steps: [
            {
                tag: "Preparación",
                title: "Requisitos antes de cajas",
                body: "Define usuarios, operaciones, volumen, latencia y consistencia. Un diagrama sin números es una ilustración, no un diseño.",
                insight:
                    "El primer entregable de un diseño es la lista de preguntas que aún no tienen respuesta.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "High-level design",
                body: "El HLD muestra clientes, entrada, servicios, almacenes y flujos principales. Debe explicar qué hace cada caja y por qué existe.",
                insight: "Un HLD útil cabe en una página y responde dónde vive cada dato.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "Low-level design",
                body: "El LLD baja a APIs, tablas, índices, claves, estados y errores de un servicio concreto. Es donde aparecen los detalles que rompen el mapa.",
                insight:
                    "El HLD sin LLD es una promesa; el LLD sin HLD es una colección de decisiones locales.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "El zoom adecuado",
                body: "No todos los servicios necesitan el mismo detalle. Profundiza en el camino crítico y en lo que no sabes diseñar todavía.",
                insight: "El nivel de detalle se elige por riesgo, no por estética del diagrama.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Documenta las decisiones",
                body: "Un ADR corto registra contexto, opción elegida y consecuencias. Sirve para que el próximo equipo no repita la discusión sin datos.",
                insight:
                    "La arquitectura es una serie de decisiones con fecha; sin registro, solo queda la leyenda.",
                node: 1,
            },
        ],
        learn: [
            "Qué incluye un HLD.",
            "Qué añade un LLD.",
            "Cómo elegir el nivel de detalle.",
            "Cómo documentar una decisión.",
        ],
    },
    {
        id: "url-shortener",
        title: "Diseña un acortador de URLs",
        lede: "Un primer diseño de principio a fin: de un encargo de una línea a un sistema que sirve miles de millones de redirecciones.",
        minutes: 12,
        level: "Avanzado",
        metrics: [
            ["URLs", "2 B"],
            ["Lectura", "20 k/s"],
            ["Escritura", "2 k/s"],
            ["Latencia", "20 ms"],
        ],
        scene: {
            url: "https://sho.rt/abc123",
            status: "redirección en 20 ms",
            labels: ["Cliente", "API", "ID", "Redirect"],
        },
        steps: [
            {
                tag: "Requisitos",
                title: "El encargo",
                body: "Acortar una URL, redirigir y permitir borrar. Lee mucho más de lo que escribe; la latencia de redirección manda.",
                insight:
                    "La asimetría lectura/escritura decide la arquitectura antes que la tecnología.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Generar el código",
                body: "Un contador base62 produce códigos cortos sin colisiones. Para no depender de un solo contador, combina tiempo, nodo y secuencia.",
                insight: "El identificador es la clave de partición natural del sistema.",
                node: 2,
            },
            {
                tag: "Datos",
                title: "Guardar y cachear",
                body: "Una tabla clave-valor relaciona código y URL. Las redirecciones populares viven en caché o CDN; el resto consulta la base.",
                insight:
                    "El camino de lectura debe ser lo más corto posible; el de escritura puede ser más lento.",
                node: 3,
            },
            {
                tag: "Escala",
                title: "Redirigir sin pasar por la API",
                body: "Si la CDN puede resolver el código, evitas el origen. Si necesitas analítica, registra de forma asíncrona para no bloquear la redirección.",
                insight:
                    "Cada milisegundo del camino crítico se multiplica por cada clic del mundo.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Borrado y abuso",
                body: "Borrar una URL debe invalidar caché. Un acortador también atrae spam y phishing: necesita rate limiting, listas y expiración.",
                insight:
                    "Un acortador es infraestructura de confianza; la seguridad es parte del producto.",
                node: 0,
            },
        ],
        learn: [
            "Cómo derivar requisitos de lectura y escritura.",
            "Cómo generar códigos cortos únicos.",
            "Dónde cachear la redirección.",
            "Cómo manejar borrado y abuso.",
        ],
    },
    {
        id: "news-feed",
        title: "Diseña un feed de noticias",
        lede: "Publicaciones de todos los que sigues, en 200 ms, y la pregunta de cuándo hacer el trabajo.",
        minutes: 12,
        level: "Avanzado",
        metrics: [
            ["Usuarios", "50 M"],
            ["Seguidos", "200"],
            ["Feed", "200 ms"],
            ["Fan-out", "Híbrido"],
        ],
        scene: {
            url: "https://feed.example/home",
            status: "un feed en 200 ms",
            labels: ["Usuario", "Fan-out", "Timeline", "Ranking"],
        },
        steps: [
            {
                tag: "Requisitos",
                title: "Leer mucho, escribir menos",
                body: "Cada usuario abre el feed muchas veces y publica poco. Hay que decidir si el trabajo se hace al publicar o al leer.",
                insight:
                    "El feed es un problema de fan-out: una publicación puede multiplicarse por miles de seguidores.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Fan-out al escribir",
                body: "Al publicar, se inserta el post en el timeline de cada seguidor. Leer es rápido; publicar a una celebridad cuesta mucho.",
                insight:
                    "Precalcular lecturas funciona hasta que un usuario tiene millones de seguidores.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "Fan-out al leer",
                body: "Al abrir el feed, se juntan los últimos posts de los seguidos. Escribir es barato; leer requiere mezclar muchas fuentes.",
                insight:
                    "El fan-out al leer escala publicaciones, pero puede disparar la latencia del feed.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "El híbrido",
                body: "Precalcula para usuarios normales y mezcla en lectura para cuentas gigantes. Cachea el timeline y aplica ranking al final.",
                insight: "La solución real suele ser un híbrido con un umbral de seguidores.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Ranking y páginas",
                body: "El orden cronológico es fácil de paginar; el ranking cambia y exige cursores estables. Define qué se puede repetir o perder.",
                insight: "Un feed rankeado no es una lista: es una vista que se recalcula.",
                node: 1,
            },
        ],
        learn: [
            "Diferencia entre fan-out al leer y al escribir.",
            "Por qué las celebridades rompen el modelo.",
            "Cómo diseñar un feed híbrido.",
            "Cómo paginar un feed rankeado.",
        ],
    },
    {
        id: "chat-system",
        title: "Diseña un sistema de chat",
        lede: "Veinte millones de conexiones abiertas y una promesa: cada mensaje llega, en orden, exactamente una vez.",
        minutes: 12,
        level: "Avanzado",
        metrics: [
            ["Conexiones", "20 M"],
            ["Mensajes/s", "100 k"],
            ["Orden", "Por sala"],
            ["Entrega", "Al menos una"],
        ],
        scene: {
            url: "wss://chat.example/room/42",
            status: "conexiones y mensajes",
            labels: ["Cliente", "WS", "Broker", "Store"],
        },
        steps: [
            {
                tag: "Requisitos",
                title: "Conexiones, no peticiones",
                body: "Un chat mantiene una conexión por usuario y entrega mensajes en tiempo real. La presencia y el historial son estados distintos.",
                insight:
                    "El número de conexiones simultáneas es el primer límite del diseño, no el número de usuarios.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Gateway y broker",
                body: "Cada gateway mantiene WebSockets y se suscribe a las salas. Un broker enruta mensajes entre gateways para que dos usuarios en máquinas distintas se vean.",
                insight: "El gateway recuerda conexiones; el broker recuerda quién escucha qué.",
                node: 2,
            },
            {
                tag: "Datos",
                title: "Historial y orden",
                body: "Cada mensaje recibe un ID ordenado por sala y se guarda antes o después de entregarse. El cliente usa un cursor para recuperar lo perdido.",
                insight: "El orden global es caro; el orden por conversación suele ser suficiente.",
                node: 3,
            },
            {
                tag: "Fallo",
                title: "Entrega y duplicados",
                body: "Un ACK puede perderse y el cliente reenviar. Usa IDs de mensaje y deduplicación para que el receptor muestre una sola vez.",
                insight:
                    "La promesa de exactamente una vez se construye con idempotencia en los extremos.",
                node: 1,
            },
            {
                tag: "Decisión",
                title: "Presencia y escala",
                body: "Presencia es estado efímero: expira y se reconstruye. No la guardes como verdad permanente ni la consultes en la base por cada latido.",
                insight:
                    "No todo estado merece la misma durabilidad; la presencia es una pista, no una transacción.",
                node: 0,
            },
        ],
        learn: [
            "Cómo escalar millones de conexiones.",
            "Qué hace un gateway de WebSockets.",
            "Cómo ordenar y recuperar mensajes.",
            "Cómo evitar duplicados al reintentar.",
        ],
    },
];
