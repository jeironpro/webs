export const lessons = [
    {
        id: "redundancy-failover",
        title: "Redundancia y failover",
        lede: "Todo acaba fallando. Diseña para que ningún fallo individual te tumbe.",
        minutes: 12,
        level: "Intermedio",
        metrics: [
            ["AZ", "3"],
            ["Réplicas", "6"],
            ["RTO", "5 min"],
            ["RPO", "1 min"],
        ],
        scene: {
            url: "https://app.example/health",
            status: "una zona caída",
            labels: ["Cliente", "LB", "Activo", "Standby"],
        },
        steps: [
            {
                tag: "Problema",
                title: "El fallo no es una excepción",
                body: "Discos, zonas, redes y procesos fallan. La pregunta no es si ocurrirá, sino qué parte del sistema sobrevive cuando ocurra.",
                insight: "La redundancia no evita fallos: evita que un solo fallo sea el final.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Activo-activo y activo-pasivo",
                body: "En activo-activo, varias réplicas atienden a la vez. En activo-pasivo, una espera preparada para asumir. La primera escala mejor; la segunda es más simple.",
                insight: "Un standby que nunca se prueba es una hipótesis, no una garantía.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "Health checks y failover",
                body: "Un monitor detecta que la instancia no responde y el balanceador deja de enviarle tráfico. El failover promueve otra copia o redirige la carga.",
                insight:
                    "El tiempo de detección forma parte del RTO; no basta con tener una copia.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "Capacidad para el fallo",
                body: "Si tres réplicas trabajan al 50 % y una cae, las otras dos quedan al 75 %. Diseña para que el sistema sobreviva con menos capacidad.",
                insight: "La redundancia sin margen solo reparte el colapso.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Define RTO y RPO",
                body: "RTO es cuánto tardas en volver; RPO, cuántos datos puedes perder. Son decisiones de negocio, no solo técnicas.",
                insight:
                    "Un failover que pierde una hora de pagos no es aceptable aunque el servicio vuelva.",
                node: 1,
            },
        ],
        learn: [
            "Activo-activo frente a activo-pasivo.",
            "Cómo funcionan health checks y failover.",
            "Por qué hace falta margen de capacidad.",
            "Qué significan RTO y RPO.",
        ],
    },
    {
        id: "rate-limiting",
        title: "Limitación de tasa",
        lede: "Da a cada cliente un presupuesto justo, para que un script desbocado no tumbe a todos.",
        minutes: 10,
        level: "Intermedio",
        metrics: [
            ["Límite", "100/min"],
            ["Algoritmo", "Token bucket"],
            ["Ventana", "60 s"],
            ["Respuesta", "429"],
        ],
        scene: {
            url: "https://api.example/search",
            status: "presupuesto por cliente",
            labels: ["Cliente", "Límite", "Token", "API"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Un cliente puede consumir todo",
                body: "Un scraper o un bug del móvil puede enviar miles de peticiones. Sin límite, el resto de usuarios paga la factura.",
                insight:
                    "Limitar no es castigar: es repartir un recurso escaso de forma predecible.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Token bucket",
                body: "Cada cliente tiene una cubeta que se rellena a ritmo constante. Cada petición gasta un token; si no hay, se rechaza o se espera.",
                insight:
                    "El token bucket permite ráfagas cortas sin permitir un flujo sostenido infinito.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "Ventana fija y sus bordes",
                body: "Un límite de 100 por minuto con ventana fija permite 200 en el borde entre dos minutos. La ventana deslizante o el bucket lo suavizan.",
                insight: "El reloj importa: dos ventanas mal alineadas pueden duplicar el pico.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "Dónde y con qué clave",
                body: "Limita por usuario, IP, API key o tenant según el abuso. En varios nodos necesitas un contador compartido o una aproximación aceptable.",
                insight:
                    "Un límite por IP castiga a oficinas enteras; un límite por API key castiga al cliente correcto.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Devuelve una señal útil",
                body: "Responde 429 con Retry-After y cabeceras de cuota. Un rechazo silencioso solo invita al cliente a reintentar más fuerte.",
                insight:
                    "El límite forma parte de la API: documenta cuota, ventana y comportamiento.",
                node: 0,
            },
        ],
        learn: [
            "Por qué limitar por cliente.",
            "Cómo funciona token bucket.",
            "Qué problema tiene la ventana fija.",
            "Cómo elegir la clave y la respuesta.",
        ],
    },
    {
        id: "timeouts-retries",
        title: "Timeouts y reintentos",
        lede: "Llamar con seguridad a un servicio en apuros: rendirse a tiempo, reintentar con cuidado y saber cuándo parar.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["Timeout", "800 ms"],
            ["Reintentos", "2"],
            ["Backoff", "Jitter"],
            ["Circuito", "Abierto"],
        ],
        scene: {
            url: "https://api.example/dependency",
            status: "dependencia lenta",
            labels: ["Cliente", "Timeout", "Retry", "Servicio"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Esperar para siempre",
                body: "Si una dependencia no responde, cada petición se queda colgada y consume un hilo o una conexión. El fallo se propaga.",
                insight:
                    "Un timeout es una decisión de producto: cuánto está dispuesto el usuario a esperar.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Presupuesto y deadline",
                body: "El timeout debe caber dentro del presupuesto total de la petición. Si el cliente espera 1 s, no puedes gastar 5 s en una dependencia.",
                insight:
                    "Los timeouts se reparten, no se suman: cada salto consume el mismo presupuesto.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Reintentar puede empeorar",
                body: "Si todos reintentan a la vez, el servicio caído recibe más carga. Usa backoff exponencial y jitter para dispersar los intentos.",
                insight: "Un reintento sin espera es una amplificación de la caída.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Reintentar una escritura",
                body: "Si el pago se cobró pero la respuesta se perdió, reintentar puede cobrar dos veces. Solo reintenta operaciones idempotentes o con clave de idempotencia.",
                insight: "No todas las operaciones se pueden repetir sin consecuencias.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Circuito y degradación",
                body: "Si una dependencia falla repetidamente, abre el circuito y responde con un valor por defecto o un error claro. Cierra cuando se recupere.",
                insight: "A veces la mejor respuesta es dejar de llamar.",
                node: 1,
            },
        ],
        learn: [
            "Cómo fijar un timeout por presupuesto.",
            "Por qué el backoff necesita jitter.",
            "Cuándo un reintento duplica efectos.",
            "Cómo funciona un circuit breaker.",
        ],
    },
    {
        id: "observability",
        title: "Observabilidad",
        lede: "Métricas, logs y trazas: cómo averiguar qué falla, dónde y por qué, rápido.",
        minutes: 9,
        level: "Intermedio",
        metrics: [
            ["SLI", "p99"],
            ["SLO", "99.9 %"],
            ["Retención", "30 d"],
            ["Alertas", "6"],
        ],
        scene: {
            url: "https://ops.example/trace/abc",
            status: "una traza, tres saltos",
            labels: ["Métrica", "Log", "Traza", "Alerta"],
        },
        steps: [
            {
                tag: "Problema",
                title: "No puedes arreglar lo que no ves",
                body: "El usuario dice que va lento, pero no sabes si es red, API o base de datos. Sin señales, la investigación empieza de cero.",
                insight:
                    "Observabilidad es poder hacer preguntas nuevas sobre el sistema sin desplegar código.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Los tres pilares",
                body: "Las métricas agregan números; los logs cuentan eventos; las trazas siguen una petición por varios servicios.",
                insight: "Las métricas detectan, los logs explican y las trazas conectan.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Cardinalidad y coste",
                body: "Etiquetar por usuario o pedido multiplica series y factura. Usa etiquetas acotadas y muestrea trazas y logs.",
                insight:
                    "La observabilidad sin presupuesto se convierte en la mayor factura del sistema.",
                node: 2,
            },
            {
                tag: "Decisión",
                title: "SLI, SLO y error budget",
                body: "Elige una señal que represente al usuario, fija un objetivo y mide cuánto presupuesto de error queda. Alerta cuando se consume rápido.",
                insight: "Un SLO sin consecuencia operativa es un adorno en un panel.",
                node: 3,
            },
            {
                tag: "Fallo",
                title: "Alertas que nadie mira",
                body: "Una alerta por cada métrica genera ruido. Alerta sobre síntomas de usuario y deja los detalles para el panel.",
                insight: "Si todo alerta, nada alerta.",
                node: 1,
            },
        ],
        learn: [
            "Para qué sirve cada pilar.",
            "Qué es la cardinalidad y por qué cuesta.",
            "Cómo definir SLI y SLO.",
            "Qué alertas merecen despertar a alguien.",
        ],
    },
];
