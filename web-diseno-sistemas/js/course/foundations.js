export const lessons = [
    {
        id: "request-travels",
        title: "Cómo viaja una petición",
        lede: "Sigue una carga de página salto a salto y descubre adónde se va de verdad el tiempo. Al final, sabrás qué mirar antes de optimizar.",
        minutes: 10,
        level: "Principiante",
        budget: {
            max: 300,
            costs: [
                ["dns", "Consulta DNS", 24],
                ["connection", "Conexión", 52],
                ["server", "Servidor", 38],
                ["data", "Datos", 92],
                ["return", "Vuelta", 28],
            ],
        },
        scene: {
            url: "https://shop.example",
            status: "una petición en curso",
            labels: ["DNS", "Edge", "API", "Base de datos"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Pulsas Enter",
                body: "El navegador deja de esperar y empieza a trabajar. Todavía no hay red: primero tiene que saber a quién preguntar.",
                insight:
                    "La latencia no empieza en el servidor. Empieza en la decisión de pedir algo.",
                node: 0,
            },
            {
                tag: "Nombre",
                title: "Se resuelve el nombre",
                body: "shop.example no es una dirección. DNS la traduce a una IP; si ya está en caché, este paso casi desaparece.",
                insight: "Cachear el nombre evita un viaje completo antes de tocar la red.",
                costKey: "dns",
                cost: 24,
                node: 1,
            },
            {
                tag: "Conexión",
                title: "Se abre la conexión",
                body: "TCP y TLS negocian cómo hablar. Si la conexión se reutiliza, te ahorras el saludo entero.",
                insight:
                    "Cada conexión nueva cuesta ida y vuelta; reutilizarla es una decisión de arquitectura.",
                costKey: "connection",
                cost: 52,
                node: 2,
            },
            {
                tag: "Borde",
                title: "La petición llega al borde",
                body: "El edge termina TLS, aplica reglas y decide qué servicio responde. Aquí se puede cachear o proteger la API.",
                insight:
                    "El borde no es decoración: es tu primera oportunidad de no llegar al origen.",
                costKey: "server",
                cost: 38,
                node: 3,
            },
            {
                tag: "Datos",
                title: "La API busca la verdad",
                body: "Auth, validación y una consulta. La base de datos tarda porque está haciendo trabajo real, no porque sea lenta por defecto.",
                insight: "Mide la consulta antes de culpar a la base de datos.",
                costKey: "data",
                cost: 92,
                node: 4,
            },
            {
                tag: "Vuelta",
                title: "La respuesta vuelve",
                body: "Serializar, comprimir, viajar y pintar. Si el payload es enorme, el último tramo puede costar más que la consulta.",
                insight: "El usuario percibe la suma de todos los pasos, no el mejor de ellos.",
                costKey: "return",
                cost: 28,
                node: 0,
            },
        ],
        learn: [
            "Qué hace el DNS y por qué se guarda en caché.",
            "Por qué una conexión cuesta viajes de ida y vuelta.",
            "El camino navegador, servidor, base de datos y vuelta.",
            "Dónde se va el tiempo de una carga de página.",
            "Qué medir antes de añadir una pieza.",
        ],
    },
    {
        id: "latency-throughput",
        title: "Latencia y rendimiento",
        lede: "Dos preguntas sobre la velocidad, y por qué un servidor ocupado se vuelve lento mucho antes de llenarse.",
        minutes: 11,
        level: "Principiante",
        metrics: [
            ["Latencia p50", "120 ms"],
            ["Latencia p99", "180 ms"],
            ["Rendimiento", "50 pet/s"],
            ["Uso", "10 %"],
        ],
        scene: {
            url: "https://shop.example",
            status: "mil usuarios, una cola",
            labels: ["Cliente", "Red", "Servidor", "Cola"],
        },
        steps: [
            {
                tag: "Preparación",
                title: "Dos preguntas distintas",
                body: "Latencia es cuánto tarda una petición en ir y volver. Rendimiento es cuántas peticiones termina el sistema por segundo.",
                insight:
                    "Más carriles dejan pasar más coches, pero no hacen que tu trayecto sea más corto.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "La cola crece antes de llenarse",
                body: "Cuando el uso pasa de cierto punto, las llegadas superan a las salidas. La espera no sube en línea recta: se dispara cerca del 100 %.",
                insight:
                    "Un servidor al 70 % no está medio lleno; ya tiene una cola que puede multiplicar la latencia.",
                node: 3,
            },
            {
                tag: "Trade-off",
                title: "La media esconde la cola",
                body: "El p50 describe al usuario típico. El p99 describe a los que peor lo pasan, y suele ser la experiencia de quien vuelve.",
                insight:
                    "Optimiza la distribución, no solo el promedio. Un p99 alto es un producto que se siente roto.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "La distancia impone un mínimo",
                body: "La luz tarda unos 60-70 ms en recorrer 13 000 km de fibra; ida y vuelta, 120-140 ms. Ningún código elimina ese viaje; una CDN o una región cercana sí lo acortan.",
                insight: "La física no se optimiza con un framework. Se diseña alrededor de ella.",
                node: 1,
            },
            {
                tag: "Decisión",
                title: "Presupuesto antes de herramienta",
                body: "Fija cuánto puede costar cada tramo: red, aplicación, datos y vuelta. Luego mide y reparte el presupuesto con datos.",
                insight:
                    "Sin presupuesto, cualquier milisegundo parece optimizable y ninguna mejora parece suficiente.",
                node: 0,
            },
        ],
        learn: [
            "Distinguir latencia de rendimiento.",
            "Por qué la cola dispara el p99 cerca del 100 % de uso.",
            "Leer percentiles en vez de solo la media.",
            "Por qué la distancia fija un mínimo físico.",
            "Repartir un presupuesto de latencia.",
        ],
    },
    {
        id: "napkin-math",
        title: "Cálculos de servilleta",
        lede: "Convierte una idea de producto en peticiones, servidores y terabytes con cuentas que caben en una servilleta.",
        minutes: 10,
        level: "Principiante",
        metrics: [
            ["Usuarios", "1 M"],
            ["Pico", "6 k/s"],
            ["Datos/mes", "8 TB"],
            ["Servidores", "30"],
        ],
        scene: {
            url: "https://numeros.example",
            status: "de usuarios a infraestructura",
            labels: ["Usuarios", "API", "Datos", "Coste"],
        },
        steps: [
            {
                tag: "Preparación",
                title: "Empieza por el usuario",
                body: "Un millón de usuarios no es un millón de peticiones. Estima cuántos están activos, cuántas acciones hacen y en qué franja.",
                insight:
                    "Los cálculos de servilleta no buscan precisión: buscan detectar órdenes de magnitud imposibles.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "De acciones a peticiones por segundo",
                body: "Si un millón de usuarios hace diez acciones al día, son diez millones de acciones. Repartidas en 86 400 segundos, la media ronda 116 por segundo.",
                insight:
                    "La media no dimensiona: el pico puede ser cinco o diez veces mayor. Diseña para el pico razonable.",
                node: 1,
            },
            {
                tag: "Cálculo",
                title: "De peticiones a servidores",
                body: "Si una instancia sostiene 500 peticiones por segundo con margen, el pico de 6 000 necesita al menos doce. Añade réplicas por zona y fallo.",
                insight: "Dimensiona con margen para fallos, no para el día perfecto.",
                node: 2,
            },
            {
                tag: "Datos",
                title: "De filas a terabytes",
                body: "Un registro de 2 KB por acción y diez millones de acciones diarias son 20 GB al día, unos 600 GB al mes antes de índices y réplicas.",
                insight:
                    "El almacenamiento crece en silencio. Calcula retención, backups y réplicas desde el principio.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Anota supuestos y margen",
                body: "Cada número es una hipótesis: usuarios activos, tamaño de registro, pico y coste por unidad. Escríbelos para poder revisarlos.",
                insight: "Un cálculo sin supuestos es una opinión con decimales.",
                node: 4,
            },
        ],
        learn: [
            "Convertir usuarios en peticiones por segundo.",
            "Separar media y pico al dimensionar.",
            "Estimar almacenamiento con retención y réplicas.",
            "Añadir margen para fallos y crecimiento.",
            "Documentar los supuestos del cálculo.",
        ],
    },
];
