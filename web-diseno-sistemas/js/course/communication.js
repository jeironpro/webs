export const lessons = [
    {
        id: "rest-rpc-graphql",
        title: "REST, RPC y GraphQL",
        lede: "Tres formas de que los programas se pidan cosas entre sí, y lo que le cuesta cada una a un móvil con 4G.",
        minutes: 10,
        level: "Intermedio",
        metrics: [
            ["Estilo", "REST"],
            ["Payload", "8 KB"],
            ["RTT", "2"],
            ["Versión", "URL"],
        ],
        scene: {
            url: "https://api.example/v1/orders",
            status: "contrato de comunicación",
            labels: ["Móvil", "REST", "RPC", "GraphQL"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Dos programas necesitan hablar",
                body: "El cliente quiere pedidos; el servidor sabe cómo darlos. El estilo de API decide cómo se nombra, se pide y se evoluciona ese contrato.",
                insight:
                    "La API no es solo una URL: es una promesa que muchos clientes van a depender de mantener.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "REST y recursos",
                body: "REST modela recursos con verbos HTTP: GET /orders, POST /orders. Es uniforme, cacheable y fácil de inspeccionar.",
                insight:
                    "REST brilla cuando los recursos son claros y el cliente solo necesita una parte predecible.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "RPC y acciones",
                body: "RPC llama a procedimientos con un contrato tipado, como createOrder. Encaja cuando la operación importa más que el recurso.",
                insight:
                    "RPC puede ser más eficiente y explícito, pero acopla cliente y contrato con más fuerza.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "GraphQL pide lo justo",
                body: "El cliente declara los campos que necesita en una sola petición. Evita overfetching, a cambio de consultas complejas y caché más difícil.",
                insight:
                    "GraphQL traslada la flexibilidad al cliente y la responsabilidad de coste al servidor.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Elige por cliente y evolución",
                body: "REST para APIs públicas simples; RPC para servicios internos; GraphQL para clientes con necesidades cambiantes. Define versionado y errores.",
                insight: "El peor contrato es el que no documenta qué pasa cuando algo falla.",
                node: 1,
            },
        ],
        learn: [
            "Qué hace REST distinto de RPC.",
            "Cuándo GraphQL compensa.",
            "Cómo evolucionar un contrato sin romper clientes.",
            "Qué coste tiene cada estilo en móvil.",
        ],
    },
    {
        id: "message-queues",
        title: "Colas de mensajes",
        lede: "Responde al momento, haz el trabajo lento después y no pierdas una tarea por el camino.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["Cola", "pedidos"],
            ["Profundidad", "12 k"],
            ["Workers", "8"],
            ["Reintentos", "3"],
        ],
        scene: {
            url: "https://api.example/checkout",
            status: "trabajo en segundo plano",
            labels: ["API", "Cola", "Worker 1", "Worker 2"],
        },
        steps: [
            {
                tag: "Problema",
                title: "No hagas esperar al usuario",
                body: "Enviar un correo o generar una factura puede tardar. Si el checkout espera, la conversión cae y el pico se propaga.",
                insight: "Una cola convierte una tarea lenta en una promesa de trabajo futuro.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Productor, cola y consumidor",
                body: "La API publica un mensaje y responde. Un worker lo recoge, hace el trabajo y confirma. Si falla, el mensaje vuelve a estar disponible.",
                insight: "La cola desacopla el ritmo del productor del ritmo del consumidor.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Entrega al menos una vez",
                body: "La mayoría de colas garantizan al menos una entrega. Eso significa que un mensaje puede llegar dos veces y el consumidor debe ser idempotente.",
                insight:
                    "Diseña para duplicados desde el primer día; la red no promete una sola entrega.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Backpressure y DLQ",
                body: "Si los workers no dan abasto, la cola crece. Si un mensaje falla siempre, necesita una dead-letter queue y una alerta, no reintentos infinitos.",
                insight: "Una cola sin límite ni DLQ es una forma lenta de perder trabajo.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Mide profundidad y edad",
                body: "No basta con saber que la cola existe. Vigila cuántos mensajes hay y cuánto espera el más antiguo para detectar un consumidor caído.",
                insight: "La edad del mensaje más viejo es la latencia real del trabajo pendiente.",
                node: 1,
            },
        ],
        learn: [
            "Cómo desacopla una cola.",
            "Por qué la entrega puede duplicar.",
            "Qué es backpressure.",
            "Cómo usar una dead-letter queue.",
        ],
    },
    {
        id: "pubsub-events",
        title: "Pub/Sub y eventos",
        lede: "Anuncia que algo ha pasado y deja que reaccione quien le interese, sin que nadie espere.",
        minutes: 10,
        level: "Intermedio",
        metrics: [
            ["Topic", "order.created"],
            ["Suscriptores", "5"],
            ["Entrega", "At-least-once"],
            ["Orden", "Por clave"],
        ],
        scene: {
            url: "https://eventos.example/order.created",
            status: "un evento, cinco reacciones",
            labels: ["Productor", "Topic", "Susc. A", "Susc. B"],
        },
        steps: [
            {
                tag: "Problema",
                title: "El checkout hace demasiado",
                body: "Al confirmar un pedido hay que enviar email, actualizar stock, facturar y avisar al almacén. Si el checkout llama a todos, cualquier fallo lo bloquea.",
                insight:
                    "Un evento describe un hecho pasado; no ordena a un servicio concreto qué hacer.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Topic y suscriptores",
                body: "El productor publica en un topic y varios consumidores reciben una copia. Añadir uno nuevo no cambia al productor.",
                insight:
                    "Pub/Sub cambia acoplamiento por multiplicación de copias y responsabilidad de cada consumidor.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Orden y particiones",
                body: "El orden global es caro. Muchos sistemas solo garantizan orden dentro de una clave, como el ID del pedido.",
                insight:
                    "Si dos eventos del mismo pedido deben ir en orden, comparten clave de partición.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Duplicados y eventos perdidos",
                body: "La entrega puede repetirse o fallar. Los consumidores necesitan idempotencia y una forma de reprocesar desde un punto conocido.",
                insight:
                    "Un evento no es una transacción: es una notificación que puede llegar tarde, dos veces o nunca.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Eventos de negocio, no de base",
                body: "Publica order.created con datos suficientes para reaccionar. No publiques cada cambio interno de una tabla o acoplarás a todos a tu esquema.",
                insight: "El contrato del evento es parte de la API pública de tu sistema.",
                node: 1,
            },
        ],
        learn: [
            "Diferencia entre cola y Pub/Sub.",
            "Cómo añadir consumidores sin tocar al productor.",
            "Qué orden se puede garantizar.",
            "Cómo diseñar un evento idempotente.",
        ],
    },
    {
        id: "realtime-updates",
        title: "Actualizaciones en tiempo real",
        lede: "Cómo te avisa el servidor de que algo ha pasado: chat, resultados en directo, notificaciones.",
        minutes: 10,
        level: "Intermedio",
        metrics: [
            ["Conexiones", "20 M"],
            ["Protocolo", "WebSocket"],
            ["Latencia", "80 ms"],
            ["Reconexión", "Sí"],
        ],
        scene: {
            url: "wss://chat.example/room/42",
            status: "conexiones abiertas",
            labels: ["Cliente", "Gateway", "Broker", "Presencia"],
        },
        steps: [
            {
                tag: "Problema",
                title: "El usuario no quiere recargar",
                body: "Un chat o un marcador necesita recibir cambios sin preguntar cada segundo. El servidor debe poder empujar información.",
                insight:
                    "Tiempo real no es solo velocidad: es mantener una conexión y un estado por usuario.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Polling, SSE y WebSocket",
                body: "El polling pregunta cada intervalo; SSE mantiene un flujo de servidor a cliente; WebSocket abre una conexión bidireccional.",
                insight: "Elige la opción más simple que cubra la dirección de tus mensajes.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Cada conexión cuesta",
                body: "Un WebSocket abierto consume memoria y un latido. Millones de conexiones requieren servidores especializados y un enrutador de mensajes.",
                insight:
                    "El estado de presencia es tan real como una fila de base de datos, pero vive en otro sitio.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Reconexión y mensajes perdidos",
                body: "La red móvil cambia y la conexión se cae. Al volver, el cliente necesita un cursor para pedir lo que se perdió.",
                insight: "Un WebSocket sin reconexión ni recuperación es una demo, no un sistema.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Autoriza cada sala",
                body: "La conexión debe comprobar quién eres y a qué salas puedes entrar. No confíes en el ID de usuario que envía el cliente.",
                insight:
                    "Tiempo real multiplica la superficie de autorización: cada suscripción es una decisión.",
                node: 1,
            },
        ],
        learn: [
            "Cuándo usar polling, SSE o WebSocket.",
            "Qué cuesta mantener conexiones abiertas.",
            "Cómo recuperar mensajes tras reconectar.",
            "Cómo autorizar salas y presencia.",
        ],
    },
];
