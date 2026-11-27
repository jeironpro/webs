export const lessons = [
    {
        id: "vertical-horizontal",
        title: "Escalado vertical u horizontal",
        lede: "Tu único servidor se está derritiendo. ¿Compras uno más grande o más servidores pequeños?",
        minutes: 10,
        level: "Principiante",
        metrics: [
            ["Réplicas", "1 → 6"],
            ["Estado", "0"],
            ["Uso", "78 %"],
            ["Coste", "× 4"],
        ],
        scene: {
            url: "https://app.example",
            status: "el servidor al 78 %",
            labels: ["Tráfico", "Balanceador", "App", "Datos"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Un servidor no llega",
                body: "La CPU está al 90 % y la cola crece. Tienes dos caminos: una máquina más potente o varias máquinas que se reparten el trabajo.",
                insight:
                    "Escalar hacia arriba es rápido; escalar hacia fuera es repetible. La decisión depende del tiempo y del límite.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Vertical: más de lo mismo",
                body: "Añadir CPU, RAM o disco a una máquina es simple y no exige cambiar la aplicación. Pero hay un techo físico y el precio crece más rápido que la capacidad.",
                insight: "El escalado vertical compra tiempo, no una estrategia permanente.",
                node: 2,
            },
            {
                tag: "Mecanismo",
                title: "Horizontal: repartir el trabajo",
                body: "Varias instancias idénticas detrás de un balanceador atienden peticiones en paralelo. Necesitas que cualquiera pueda responder cualquiera.",
                insight: "Escalar hacia fuera convierte el estado en el problema principal.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "El estado no se reparte solo",
                body: "Si la sesión vive en la memoria de una instancia, la siguiente petición puede caer en otra. Mueve el estado a un almacén compartido o a un token.",
                insight:
                    "Un servidor sin estado es el requisito que hace posible el resto del escalado.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Primero lo simple que aguante",
                body: "Empieza vertical si el techo está lejos y el equipo es pequeño. Pasa a horizontal cuando necesites redundancia, picos o despliegues sin caída.",
                insight:
                    "La mejor arquitectura no es la más distribuida: es la que puedes operar con el equipo que tienes.",
                node: 0,
            },
        ],
        learn: [
            "Cuándo una máquina más grande es suficiente.",
            "Qué cambia al añadir instancias.",
            "Por qué el estado bloquea el escalado horizontal.",
            "Cómo combinar ambas estrategias.",
        ],
    },
    {
        id: "load-balancing",
        title: "Balanceo de carga",
        lede: "Una sola puerta de entrada para muchos servidores, y las reglas que deciden quién recibe cada petición.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["Instancias", "6"],
            ["Algoritmo", "Round robin"],
            ["Health check", "5 s"],
            ["Sticky", "No"],
        ],
        scene: {
            url: "https://app.example",
            status: "seis instancias detrás",
            labels: ["Cliente", "Balanceador", "App 1", "App 2"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Muchas puertas, una entrada",
                body: "Los clientes no deberían conocer cada instancia. Un balanceador recibe la petición y elige un servidor sano.",
                insight:
                    "El balanceador es a la vez un punto de escala y un punto único de fallo si no está replicado.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Round robin, least connections y hash",
                body: "Round robin reparte por turnos; least connections prefiere la instancia menos ocupada; el hash fija un cliente a una instancia.",
                insight:
                    "No hay algoritmo universal: el patrón de duración y el estado deciden cuál sirve.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "Un servidor que no responde",
                body: "Los health checks retiran instancias enfermas. Si solo comprueban el puerto, una aplicación bloqueada puede seguir recibiendo tráfico.",
                insight: "Comprueba la dependencia crítica, no solo que el proceso esté vivo.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "Sesiones pegajosas",
                body: "Fijar al cliente a un servidor evita perder la sesión en memoria, pero crea desequilibrio y complica los despliegues.",
                insight:
                    "Las sesiones pegajosas son una muleta útil, no un sustituto de un servicio sin estado.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Capa 4 o capa 7",
                body: "Un balanceador L4 reparte conexiones sin mirar HTTP; uno L7 entiende rutas, cabeceras y cookies, a cambio de más trabajo por petición.",
                insight: "Elige L4 para volumen bruto y L7 cuando la ruta o el contenido importan.",
                node: 1,
            },
        ],
        learn: [
            "Qué hace un balanceador y dónde falla.",
            "Diferencias entre algoritmos de reparto.",
            "Cómo funcionan los health checks.",
            "Cuándo usar sticky sessions.",
            "L4 frente a L7.",
        ],
    },
    {
        id: "stateless-services",
        title: "Servicios sin estado",
        lede: "Por qué la siguiente petición debe funcionar en cualquier servidor, y adónde va el estado en su lugar.",
        minutes: 10,
        level: "Intermedio",
        metrics: [
            ["Estado local", "0"],
            ["Sesión", "Token"],
            ["Réplicas", "N"],
            ["Escala", "Lineal"],
        ],
        scene: {
            url: "https://app.example",
            status: "cualquier réplica responde",
            labels: ["Cliente", "Token", "Sesión", "Redis"],
        },
        steps: [
            {
                tag: "Problema",
                title: "La sesión vive en un servidor",
                body: "Si el carrito está en la memoria de la instancia A, la instancia B no puede atender al mismo usuario. El balanceador tiene que recordar dónde enviarlo.",
                insight:
                    "El estado local convierte un pool de servidores en un conjunto de servidores especiales.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Saca el estado de la instancia",
                body: "Sesiones, carritos y trabajos en curso van a Redis, una base de datos o un token firmado que viaja con el cliente.",
                insight: "El servicio se vuelve reemplazable cuando su memoria deja de importar.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Token frente a sesión central",
                body: "Un token evita una consulta por petición, pero no se puede revocar al instante. Una sesión central se revoca fácil y añade una dependencia.",
                insight: "La seguridad y la latencia se negocian en el mismo sitio: la sesión.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "El almacén compartido también cae",
                body: "Mover el estado no elimina el problema: lo concentra. Redis necesita réplicas, persistencia o una degradación explícita.",
                insight:
                    "Un servicio sin estado no es un sistema sin estado; solo tiene el estado en otro lugar.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Diseña para reemplazar instancias",
                body: "Cualquier instancia debe poder morir en cualquier momento. Si el despliegue puede matar una sin perder trabajo, el diseño está listo.",
                insight:
                    "La prueba real del servicio sin estado es un despliegue sin sesión perdida.",
                node: 1,
            },
        ],
        learn: [
            "Qué cuenta como estado.",
            "Dónde guardar sesiones y carritos.",
            "Ventajas y límites de los tokens.",
            "Cómo hacer instancias reemplazables.",
        ],
    },
    {
        id: "caching",
        title: "Caché",
        lede: "Guarda las respuestas más pedidas en un sitio mucho más rápido que la base de datos, sin mentir durante demasiado tiempo.",
        minutes: 12,
        level: "Intermedio",
        metrics: [
            ["Hit ratio", "92 %"],
            ["TTL", "60 s"],
            ["Latencia hit", "2 ms"],
            ["Latencia miss", "180 ms"],
        ],
        scene: {
            url: "https://shop.example",
            status: "caché caliente",
            labels: ["Cliente", "CDN", "Caché", "Origen"],
        },
        steps: [
            {
                tag: "Problema",
                title: "La misma lectura, otra vez",
                body: "Miles de usuarios piden el mismo producto. Si cada petición llega a la base de datos, pagas el mismo trabajo una y otra vez.",
                insight:
                    "Una caché compra latencia con memoria y acepta el riesgo de servir algo viejo.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Hit, miss y origen",
                body: "En un hit respondes desde la caché. En un miss consultas el origen, respondes y guardas el resultado para la próxima vez.",
                insight:
                    "El hit ratio importa, pero el coste y la frecuencia de los misses importan más.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "Invalidar es el problema",
                body: "Puedes caducar por TTL, borrar al escribir o versionar la clave. Cada opción cambia entre datos viejos y carga extra.",
                insight:
                    "Una caché sin política de invalidación es una fuente de bugs rápida y difícil de rastrear.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "La estampida",
                body: "Si una clave popular caduca, cientos de peticiones caen al origen a la vez. Usa bloqueo, stale-while-revalidate o jitter en el TTL.",
                insight: "El peor momento para perder la caché es cuando más tráfico hay.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Cachea lo que se repite",
                body: "Mide qué lecturas dominan, cuánto toleran estar viejas y cuánto cuesta un miss. Si no hay repetición, la caché solo añade una pieza.",
                insight:
                    "La primera pregunta no es qué caché usar, sino qué dato puede repetirse sin drama.",
                node: 0,
            },
        ],
        learn: [
            "Qué es un hit, un miss y el origen.",
            "Cómo elegir TTL y política de invalidación.",
            "Cómo evitar estampidas de misses.",
            "Cuándo una caché no compensa.",
        ],
    },
    {
        id: "content-delivery",
        title: "Entrega de contenido",
        lede: "Copia lo que todo el mundo descarga en servidores cerca de tus usuarios y deja de pelearte con la velocidad de la luz.",
        minutes: 10,
        level: "Intermedio",
        metrics: [
            ["Hits CDN", "96 %"],
            ["TTL estático", "1 año"],
            ["Origen", "10 %"],
            ["Regiones", "18"],
        ],
        scene: {
            url: "https://cdn.example/app.js",
            status: "contenido cerca del usuario",
            labels: ["Usuario", "Edge", "Origen", "Purga"],
        },
        steps: [
            {
                tag: "Problema",
                title: "El archivo pesa y está lejos",
                body: "Una imagen de 2 MB desde otro continente tarda más que cualquier optimización de CPU. El problema es la distancia y el tamaño.",
                insight:
                    "Para contenido estático, acercar el archivo suele ganar a hacerlo más rápido en el origen.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "El edge guarda una copia",
                body: "La primera petición llena la caché del nodo cercano. Las siguientes se responden desde allí sin cruzar el mundo.",
                insight: "Una CDN es una caché geográfica con reglas propias.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "TTL largo, purga difícil",
                body: "Un TTL largo da hits altos y obliga a versionar nombres o purgar. Un TTL corto se actualiza rápido y protege menos el origen.",
                insight:
                    "Versiona los assets en el nombre; reserva la purga para lo que no puedes renombrar.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Contenido dinámico y personalizado",
                body: "Una respuesta con el carrito de un usuario no se puede compartir. Usa claves por usuario, cookies o deja ese tráfico fuera del edge.",
                insight:
                    "Cachear de más es tan peligroso como cachear de menos: puede filtrar datos entre usuarios.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Estático primero, dinámico después",
                body: "Empieza por JS, CSS, imágenes y vídeo. Luego evalúa APIs cacheables y HTML generado; mide el ahorro real en cada capa.",
                insight:
                    "La CDN no arregla una consulta lenta; elimina la parte del viaje que no necesitas hacer.",
                node: 1,
            },
        ],
        learn: [
            "Cómo una CDN reduce la distancia.",
            "Qué TTL elegir para cada tipo de asset.",
            "Cómo versionar y purgar contenido.",
            "Qué contenido nunca debe compartirse.",
        ],
    },
];
