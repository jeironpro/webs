export const lessons = [
    {
        id: "monolith-microservices",
        title: "Monolito vs. microservicios",
        lede: "¿Un solo código o muchos servicios? Lo que te da cada uno, lo que cuesta y cómo pasar de uno a otro.",
        minutes: 12,
        level: "Intermedio",
        metrics: [
            ["Servicios", "1"],
            ["Equipos", "2"],
            ["Deploy", "1 artefacto"],
            ["Latencia", "en proceso"],
        ],
        scene: {
            url: "https://app.example",
            status: "un despliegue, varios módulos",
            labels: ["Cliente", "Monolito", "Módulo", "DB"],
        },
        steps: [
            {
                tag: "Problema",
                title: "El precio de distribuir",
                body: "Cada servicio añade red, despliegue, observabilidad y fallos parciales. Si el equipo es pequeño, esa factura llega antes que los beneficios.",
                insight:
                    "Los microservicios resuelven problemas organizativos tanto como técnicos.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Monolito modular",
                body: "Un solo despliegue con límites internos claros. Las llamadas son funciones, las transacciones son locales y el debug es directo.",
                insight: "Un monolito bien modularizado no es un fracaso: es una opción seria.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Servicios y límites",
                body: "Separar permite desplegar y escalar por dominio, pero obliga a contratos, versiones y datos distribuidos.",
                insight:
                    "Un servicio por tabla no es arquitectura; es una base de datos con latencia de red.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "La transacción se vuelve saga",
                body: "Una operación que toca dos servicios ya no puede ser una transacción local. Necesitas compensaciones, estados intermedios e idempotencia.",
                insight: "La primera pregunta antes de partir es quién es dueño del dato.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Parte por dolor real",
                body: "Empieza con un monolito modular. Extrae un servicio cuando un límite de equipo, escala o despliegue lo justifique y puedas operarlo.",
                insight:
                    "La arquitectura evoluciona con el equipo; copiar la de una gran empresa sin su contexto es una trampa.",
                node: 1,
            },
        ],
        learn: [
            "Qué problemas resuelven los microservicios.",
            "Qué cuesta cada servicio adicional.",
            "Cómo modular un monolito.",
            "Cuándo extraer el primer servicio.",
        ],
    },
    {
        id: "service-discovery-gateway",
        title: "Descubrimiento de servicios y gateways",
        lede: "Cómo se encuentran los servicios cuando las instancias van y vienen, y una sola puerta para todos los de fuera.",
        minutes: 13,
        level: "Avanzado",
        metrics: [
            ["Instancias", "40"],
            ["Registry", "Consul"],
            ["Gateway", "1"],
            ["TTL", "15 s"],
        ],
        scene: {
            url: "https://api.example/orders",
            status: "servicios que aparecen y desaparecen",
            labels: ["Cliente", "Gateway", "Registry", "Servicio"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Las IPs cambian",
                body: "En un entorno elástico, las instancias nacen con IP nueva y mueren sin avisar. Un cliente con una lista fija falla en cuanto hay un despliegue.",
                insight: "El descubrimiento convierte una lista de máquinas en un nombre estable.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Registro y descubrimiento",
                body: "Cada instancia se registra con su dirección y salud. El cliente o el balanceador consulta el registro y elige una instancia viva.",
                insight:
                    "La salud del registro debe caducar: una instancia muerta no puede quedarse para siempre.",
                node: 2,
            },
            {
                tag: "Mecanismo",
                title: "Gateway de entrada",
                body: "El gateway termina TLS, autentica, limita y enruta. Los clientes ven una sola API aunque detrás haya veinte servicios.",
                insight:
                    "El gateway simplifica el exterior y concentra el riesgo: necesita réplicas y límites.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Balanceo en cliente o servidor",
                body: "El cliente puede elegir instancia con la lista del registry, o delegar en un proxy. El primero ahorra un salto; el segundo centraliza políticas.",
                insight:
                    "Cada salto que eliminas también elimina un lugar donde aplicar una regla.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "No construyas tu propio registry",
                body: "Usa DNS, un service mesh o el registro de tu plataforma. Lo importante es que la salud, el TTL y el failover estén probados.",
                insight:
                    "El descubrimiento es infraestructura crítica; un script casero se cae con el primer despliegue.",
                node: 1,
            },
        ],
        learn: [
            "Por qué las IPs fijas no escalan.",
            "Cómo funciona un registro con TTL.",
            "Qué responsibilities tiene un gateway.",
            "Cómo elegir entre balanceo cliente y proxy.",
        ],
    },
    {
        id: "sagas-distributed-transactions",
        title: "Sagas y transacciones distribuidas",
        lede: "Una acción, varios servicios, varias bases de datos: cómo mantenerlo todo o nada sin una gran transacción.",
        minutes: 11,
        level: "Avanzado",
        metrics: [
            ["Pasos", "4"],
            ["Compensación", "Sí"],
            ["Estado", "Persistido"],
            ["Reintentos", "Idempotentes"],
        ],
        scene: {
            url: "https://checkout.example/order/42",
            status: "compensando un paso",
            labels: ["Pedido", "Saga", "Pago", "Stock"],
        },
        steps: [
            {
                tag: "Problema",
                title: "No hay una transacción global",
                body: "Reservar stock, cobrar y crear el envío viven en servicios distintos. No puedes abrir una transacción que abarque todos sin acoplarlos.",
                insight:
                    "En distribuido, la consistencia se construye con pasos y compensaciones, no con un commit mágico.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "La saga",
                body: "Una saga ejecuta pasos locales y, si uno falla, lanza acciones compensatorias para deshacer los anteriores. El estado de la saga se guarda.",
                insight:
                    "Compensar no es borrar: es aplicar el efecto de negocio contrario, como reembolsar.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Estados intermedios visibles",
                body: "Entre cobrar y reservar, el pedido está a medias. El usuario puede ver 'procesando' y el soporte necesita saber qué paso falló.",
                insight:
                    "La consistencia eventual es un estado de producto que hay que diseñar y comunicar.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Compensaciones idempotentes",
                body: "Un reintento puede ejecutar dos veces el reembolso o la reserva. Cada paso necesita una clave de idempotencia y un estado verificable.",
                insight:
                    "La saga falla bien solo si cada paso puede repetirse sin romper el negocio.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Orquesta o coreografía",
                body: "Un orquestador central conoce el orden y es fácil de depurar. La coreografía por eventos desacopla más y es más difícil de seguir.",
                insight:
                    "Elige coreografía cuando los equipos son autónomos; orquesta cuando el flujo es crítico y necesitas una vista única.",
                node: 1,
            },
        ],
        learn: [
            "Por qué no hay transacción global.",
            "Cómo funciona una saga y sus compensaciones.",
            "Qué estados intermedios aparecen.",
            "Orquestación frente a coreografía.",
        ],
    },
    {
        id: "batch-streaming",
        title: "Procesamiento por lotes y en flujo",
        lede: "Procesar miles de millones de eventos: de noche en grandes lotes, o de forma continua según llegan.",
        minutes: 14,
        level: "Avanzado",
        metrics: [
            ["Eventos/día", "2 B"],
            ["Batch", "1 h"],
            ["Stream", "5 s"],
            ["Ventana", "1 min"],
        ],
        scene: {
            url: "https://events.example/stream",
            status: "dos formas de procesar",
            labels: ["Fuente", "Cola", "Batch", "Stream"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Datos que no caben en una consulta",
                body: "Un informe diario y una alerta en vivo tienen necesidades distintas. El lote prioriza volumen; el flujo, latencia.",
                insight:
                    "No elijas entre batch y stream por moda: elige por cuánto puede esperar la respuesta.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Batch",
                body: "Un job lee un bloque grande, lo procesa y escribe el resultado. Es eficiente y fácil de reprocesar, pero el resultado llega tarde.",
                insight:
                    "El batch compra eficiencia con latencia; ideal para históricos y conciliaciones.",
                node: 2,
            },
            {
                tag: "Mecanismo",
                title: "Stream",
                body: "Los eventos se procesan al llegar en ventanas de tiempo o de tamaño. Permite alertas y paneles casi en vivo.",
                insight:
                    "El stream no guarda todo para siempre: necesita una política de estado y retención.",
                node: 3,
            },
            {
                tag: "Trade-off",
                title: "Exactly-once es un acuerdo",
                body: "El procesamiento exactamente una vez combina entrega, estado y escritura idempotente. Sin las tres, tendrás duplicados o pérdidas.",
                insight:
                    "La semántica exactly-once no la regala la herramienta: la construye tu sink.",
                node: 1,
            },
            {
                tag: "Decisión",
                title: "Empieza simple",
                body: "Si un batch nocturno cubre el negocio, no montes un cluster de streaming. Añade flujo cuando la decisión necesite minutos, no horas.",
                insight: "La arquitectura más barata es la que no procesa lo que nadie va a mirar.",
                node: 0,
            },
        ],
        learn: [
            "Cuándo elegir batch o stream.",
            "Cómo funcionan las ventanas.",
            "Qué implica exactly-once.",
            "Cómo reprocesar datos históricos.",
        ],
    },
];
