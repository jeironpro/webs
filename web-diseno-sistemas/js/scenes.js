const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
};

const node = (label, variant = "") =>
    create("div", `sf-node${variant ? ` sf-node--${variant}` : ""}`, label);

const arrow = (active = false) => create("span", `sf-arrow${active ? " sf-arrow--active" : ""}`);

const label = (text) => create("span", "sf-label", text);

const badge = (text, tone = "") =>
    create("span", `sf-badge${tone ? ` sf-badge--${tone}` : ""}`, text);

function caption(step) {
    const element = create("div", "sf-caption");
    element.append(
        create("span", "sf-caption__tag", step.tag),
        create("span", "sf-caption__title", step.title)
    );
    return element;
}

export const SCENE_KINDS = {
    "request-travels": "request",
    "latency-throughput": "latency",
    "napkin-math": "flow",
    "vertical-horizontal": "compare",
    "load-balancing": "cluster",
    "stateless-services": "compare",
    caching: "flow",
    "content-delivery": "flow",
    "sql-vs-nosql": "compare",
    indexes: "flow",
    "storage-engines": "pipeline",
    replication: "cluster",
    sharding: "cluster",
    "consistent-hashing": "cluster",
    "unique-ids": "flow",
    "cap-consistency": "partition",
    "consensus-leader": "cluster",
    "transactions-isolation": "transactions",
    "files-media": "files",
    "rest-rpc-graphql": "compare",
    "message-queues": "queue",
    "pubsub-events": "pubsub",
    "realtime-updates": "chat",
    "redundancy-failover": "cluster",
    "rate-limiting": "security",
    "timeouts-retries": "flow",
    observability: "pipeline",
    "monolith-microservices": "compare",
    "service-discovery-gateway": "discovery",
    "sagas-distributed-transactions": "flow",
    "batch-streaming": "pipeline",
    authentication: "security",
    authorization: "security",
    "encryption-secrets": "security",
    testing: "pipeline",
    "ci-cd": "pipeline",
    "hld-lld": "flow",
    "url-shortener": "flow",
    "news-feed": "feed",
    "chat-system": "chat",
};

const CLUSTER_BADGES = {
    "load-balancing": ["", "round robin", "nodo caído", "sesión pegajosa", "capa 4 / capa 7"],
    replication: [
        "",
        "líder y seguidores",
        "lag de replicación",
        "sin split brain",
        "consistencia declarada",
    ],
    sharding: ["", "clave de partición", "shard caliente", "consulta cruzada", "rebalanceo"],
    "consistent-hashing": ["", "anillo", "nodos virtuales", "réplicas", "cambio de tamaño"],
    "consensus-leader": [
        "",
        "quórum",
        "Raft en una frase",
        "la minoría no avanza",
        "no lo construyas",
    ],
    "redundancy-failover": ["", "activo-activo", "health check", "capacidad N+1", "RTO / RPO"],
};

const SECURITY_BADGES = {
    "rate-limiting": [
        "",
        "token bucket",
        "ventana deslizante",
        "clave por tenant",
        "429 · Retry-After",
    ],
    authentication: ["", "hash + salt", "sesión o token", "MFA", "cookie segura · CSRF"],
    authorization: ["", "RBAC / ABAC", "acceso denegado", "ownership", "denegar por defecto"],
    "encryption-secrets": ["", "TLS", "KMS", "secreto expuesto", "rotación y auditoría"],
};

const FEED_BADGES = [
    "",
    "fan-out al escribir",
    "fan-out al leer",
    "modelo híbrido",
    "cursor estable",
];

const COMPARISONS = {
    "vertical-horizontal": {
        origin: "Tráfico",
        options: [
            { title: "Vertical", nodes: ["Servidor", "+ CPU · RAM"] },
            { title: "Horizontal", nodes: ["Balanceador", "App 1 · App 2"] },
        ],
        focus: [null, 0, 1, 0, 0],
        badges: [
            "dos caminos",
            "más de lo mismo",
            "repartir el trabajo",
            "estado compartido",
            "empieza simple",
        ],
    },
    "stateless-services": {
        origin: "Cliente",
        options: [
            { title: "Token", nodes: ["Token firmado", "sin consulta"] },
            { title: "Sesión central", nodes: ["Sesión", "Redis"] },
        ],
        focus: [null, null, null, null, null],
        badges: [
            "estado fuera",
            "token o sesión",
            "revocación",
            "réplicas",
            "instancia reemplazable",
        ],
    },
    "sql-vs-nosql": {
        origin: "Cliente",
        options: [
            { title: "SQL", nodes: ["Relaciones", "Transacciones"] },
            { title: "NoSQL", nodes: ["Documentos", "Clave-valor"] },
        ],
        focus: [null, 0, 1, 1, 0],
        badges: [
            "la forma manda",
            "relacional",
            "familias NoSQL",
            "consistencia",
            "empieza conocido",
        ],
    },
    "rest-rpc-graphql": {
        origin: "Móvil",
        options: [
            { title: "REST", nodes: ["Recursos", "GET · POST"] },
            { title: "RPC", nodes: ["Acciones", "Contrato tipado"] },
            { title: "GraphQL", nodes: ["Campos", "Una petición"] },
        ],
        focus: [null, 0, 1, 2, null],
        badges: ["un contrato", "recursos", "acciones", "pide lo justo", "elige por cliente"],
    },
    "monolith-microservices": {
        origin: "Cliente",
        options: [
            { title: "Monolito modular", nodes: ["Un despliegue", "Transacciones locales"] },
            { title: "Microservicios", nodes: ["Servicios", "Sagas y contratos"] },
        ],
        focus: [null, 0, 1, 1, 0],
        badges: [
            "el precio de distribuir",
            "módulos con límites",
            "límites por dominio",
            "la saga",
            "parte por dolor",
        ],
    },
};

const PARTITION_BADGES = [
    "la red se rompe",
    "C · A · P",
    "CP o AP",
    "conflicto",
    "elige por operación",
];

const TX_BADGES = ["el mismo asiento", "ACID", "aislamiento", "lost update", "transacción corta"];

const FILE_BADGES = [
    "",
    "subida directa",
    "metadatos y permisos",
    "CDN delante del bucket",
    "ciclo de vida",
];

const DISCOVERY_BADGES = [
    "",
    "registro y salud",
    "gateway de entrada",
    "balanceo",
    "no lo construyas",
];

function renderFlow(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-flow");
    const active = Math.min(index, labels.length - 1);

    labels.forEach((text, position) => {
        if (position > 0) wrapper.append(arrow(position <= active));
        wrapper.append(
            node(text, position === active ? "active" : position < active ? "past" : "")
        );
    });

    stage.append(wrapper, caption(step));
}

function renderQueue(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const depths = [0, 3, 6, 11, 6];
    const depth = depths[Math.min(index, depths.length - 1)];
    const wrapper = create("div", "sf-queue");
    const producer = create("div", "sf-column sf-column--producer");
    const queue = create("div", "sf-queue-box");
    const workers = create("div", "sf-workers");

    producer.append(label("PRODUCTOR"), node(labels[0], "active"));
    queue.append(create("div", "sf-queue-box__head", labels[1]), create("div", "sf-lane"));
    const lane = queue.querySelector(".sf-lane");
    for (let dot = 0; dot < Math.min(depth, 12); dot += 1) {
        lane.append(create("i", dot % 4 === 0 ? "sf-dot sf-dot--hot" : "sf-dot"));
    }
    if (depth === 0) lane.append(create("span", "sf-empty", "vacía"));

    workers.append(label("CONSUMIDORES"));
    [labels[2], labels[3], "Worker 3"].forEach((text, position) => {
        const failed = index === 3 && position === 1;
        workers.append(node(text, failed ? "failed" : index >= 2 ? "active" : ""));
    });

    wrapper.append(producer, arrow(index >= 1), queue, arrow(index >= 2), workers);
    if (index === 4) wrapper.append(badge("profundidad + edad"));
    stage.append(wrapper);
    if (index >= 3) {
        const dlq = create("div", "sf-dlq");
        dlq.append(
            create("strong", "", "DLQ"),
            create("span", "", index === 3 ? "1 mensaje fallido" : "reintento manual")
        );
        stage.append(dlq);
    }
    stage.append(caption(step));
}

function renderPubsub(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-pubsub");
    const producer = create("div", "sf-column");
    const topic = create("div", "sf-pubsub__topic");
    const subscribers = create("div", "sf-subscribers");

    producer.append(label("PRODUCTOR"), node(labels[0], "active"));
    topic.append(
        label("TOPIC"),
        create("strong", "", labels[1]),
        create("span", "sf-pubsub__event", "order.created")
    );
    subscribers.append(label("SUSCRIPTORES"));
    [labels[2], labels[3], "Susc. C"].forEach((text) => {
        subscribers.append(node(text, index >= 2 ? "active" : ""));
    });

    wrapper.append(producer, arrow(index >= 1), topic, arrow(index >= 2), subscribers);
    const message =
        index === 2
            ? "orden por clave"
            : index === 3
              ? "duplicados · idempotencia"
              : index === 4
                ? "evento de negocio"
                : "";
    if (message) wrapper.append(badge(message, index === 3 ? "warn" : ""));
    stage.append(wrapper, caption(step));
}

function renderCluster(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-cluster");
    const client = create("div", "sf-column");
    const entry = create("div", "sf-column sf-column--entry");
    const nodes = create("div", "sf-nodes");
    const leader = ["replication", "consensus-leader"].includes(lesson.id) && index >= 2;

    client.append(label("ENTRADA"), node(labels[0], "active"));
    entry.append(label("COORDINACIÓN"), node(labels[1], index >= 1 ? "active" : ""));
    if (leader) entry.querySelector(".sf-node").classList.add("leader");

    [labels[2], labels[3]].forEach((text, position) => {
        const failed = lesson.id === "load-balancing" && index === 2 && position === 1;
        nodes.append(node(text, failed ? "failed" : index >= 1 ? "active" : ""));
    });

    wrapper.append(client, arrow(true), entry, arrow(index >= 1), nodes);
    const message = CLUSTER_BADGES[lesson.id]?.[index];
    if (message)
        wrapper.append(badge(message, index === 2 && lesson.id === "load-balancing" ? "bad" : ""));
    stage.append(wrapper, caption(step));
}

function renderPipeline(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-pipeline");
    const current = Math.min(index, labels.length - 1);
    const rollback = lesson.id === "ci-cd" && index === 4;

    labels.forEach((text, position) => {
        const stageNode = create("div", "sf-stage");
        stageNode.append(
            create("span", "sf-stage__num", `0${position + 1}`),
            create("strong", "", text)
        );
        if (position <= current) stageNode.classList.add("is-active");
        if (rollback) stageNode.classList.add("is-rollback");
        if (position === current) {
            stageNode.classList.add("is-current");
            stageNode.append(create("span", "sf-package", rollback ? "↺" : "●"));
        }
        wrapper.append(stageNode);
    });

    stage.append(wrapper, caption(step));
}

function renderSecurity(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-security");
    const client = create("div", "sf-column");
    const gate = create("div", "sf-gate");
    const policy = create("div", "sf-column");
    const resource = create("div", "sf-column");

    client.append(label("ORIGEN"), node(labels[0], "active"));
    gate.append(
        create("span", "sf-gate__icon", "⌑"),
        create("strong", "", labels[1]),
        label(index >= 1 ? "control" : "paso libre")
    );
    policy.append(label("POLÍTICA"), node(labels[2], index >= 2 ? "active" : ""));
    resource.append(label("RECURSO"), node(labels[3], index >= 3 ? "active" : ""));
    if (lesson.id === "authorization" && index === 2) resource.classList.add("is-denied");

    wrapper.append(
        client,
        arrow(index >= 1),
        gate,
        arrow(index >= 2),
        policy,
        arrow(index >= 3),
        resource
    );
    const message = SECURITY_BADGES[lesson.id]?.[index];
    if (message) {
        const bad =
            (lesson.id === "authorization" && index === 2) ||
            (lesson.id === "encryption-secrets" && index === 3);
        wrapper.append(badge(message, bad ? "bad" : ""));
    }
    stage.append(wrapper, caption(step));
}

function renderFeed(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-feed");
    const source = create("div", "sf-column");
    const fanout = create("div", "sf-fanout");
    const timelines = create("div", "sf-timelines");
    const ranking = create("div", "sf-column");

    source.append(label("PUBLICACIÓN"), node(labels[0], "active"));
    fanout.append(
        create("strong", "", labels[1]),
        create("span", "sf-fanout__count", index >= 1 ? "200 seguidores" : "sin repartir")
    );

    ["A", "B", "C"].forEach((suffix, position) => {
        const row = create("div", "sf-timeline");
        row.append(
            create("span", "sf-timeline__name", `${labels[2]} ${suffix}`),
            create("span", "sf-timeline__line"),
            create("span", "sf-timeline__count", index >= 2 ? `${position + 1} post` : "—")
        );
        timelines.append(row);
    });

    ranking.append(label("ORDEN"), node(labels[3], index >= 3 ? "active" : ""));

    wrapper.append(
        source,
        arrow(index >= 1),
        fanout,
        arrow(index >= 2),
        timelines,
        arrow(index >= 3),
        ranking
    );
    const message = FEED_BADGES[index];
    if (message) wrapper.append(badge(message, index === 1 ? "warn" : ""));
    stage.append(wrapper);
    if (index === 1 || index === 3) {
        const celebrity = create("div", "sf-celebrity");
        celebrity.append(
            create("strong", "", "Fan-out al leer"),
            create("span", "", "cuenta con 50 M de seguidores")
        );
        stage.append(celebrity);
    }
    stage.append(caption(step));
}

function renderChat(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-chat");
    const clients = create("div", "sf-clients");
    const gateway = create("div", "sf-column");
    const broker = create("div", "sf-column");
    const store = create("div", "sf-column");

    clients.append(
        label("CONEXIONES"),
        node(`${labels[0]} A`, "active"),
        node(`${labels[0]} B`, index >= 1 ? "active" : "")
    );
    gateway.append(label(labels[1]), node(labels[1], index >= 1 ? "active" : ""));
    broker.append(label(labels[2]), node(labels[2], index >= 2 ? "active" : ""));
    store.append(label(labels[3]), node(labels[3], index >= 3 ? "active" : ""));

    wrapper.append(
        clients,
        arrow(index >= 1),
        gateway,
        arrow(index >= 2),
        broker,
        arrow(index >= 3),
        store
    );
    if (index === 3) wrapper.append(badge("reconexión · cursor", "warn"));
    if (index === 4) wrapper.append(badge("presencia efímera"));
    stage.append(wrapper, caption(step));
}

function renderLatency(stage, lesson, step, index) {
    const wrapper = create("div", "sf-latency");
    const values = [
        [20, 38],
        [55, 92],
        [45, 160],
        [130, 65],
        [30, 55],
    ][index];
    const names = index === 3 ? ["RTT", "un viaje"] : ["p50", "p99"];

    names.forEach((text, position) => {
        const column = create("div", "sf-bar");
        const bar = create("span", "sf-bar__fill");
        bar.style.height = `${Math.min(values[position], 160) / 1.6}%`;
        column.append(
            create("span", "sf-bar__value", `${values[position]} ms`),
            bar,
            create("span", "sf-bar__label", text)
        );
        wrapper.append(column);
    });

    const queue = create("div", "sf-latency__queue");
    const queueFill = create("span");
    queueFill.style.width = `${[8, 88, 72, 40, 20][index]}%`;
    queue.append(label("cola"), queueFill);

    stage.append(wrapper, queue);
    const message =
        index === 1
            ? "cola al 88 %"
            : index === 2
              ? "la media esconde la cola"
              : index === 3
                ? "mínimo físico"
                : index === 4
                  ? "presupuesto repartido"
                  : "";
    if (message) stage.append(badge(message, index === 1 || index === 2 ? "warn" : ""));
    stage.append(caption(step));
}

function renderCompare(stage, lesson, step, index) {
    const config = COMPARISONS[lesson.id];
    const wrapper = create("div", "sf-compare");
    const origin = create("div", "sf-column sf-compare__origin");
    const options = create("div", "sf-options");
    const focus = config.focus[index];
    const highlight = focus === null ? config.options.map((_, position) => position) : [focus];

    origin.append(label("ORIGEN"), node(config.origin, "active"));
    config.options.forEach((option, position) => {
        const card = create("div", `sf-option${highlight.includes(position) ? " is-active" : ""}`);
        card.append(create("span", "sf-option__title", option.title));
        option.nodes.forEach((text) =>
            card.append(node(text, highlight.includes(position) ? "active" : ""))
        );
        options.append(card);
    });

    wrapper.append(origin, arrow(true), options);
    if (config.badges[index]) wrapper.append(badge(config.badges[index]));
    stage.append(wrapper, caption(step));
}

function renderPartition(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-partition");
    const client = create("div", "sf-column sf-partition__client");
    const zones = create("div", "sf-partition__zones");

    client.append(label("CLIENTE"), node(labels[0], "active"));
    const zoneA = create("div", "sf-zone");
    const zoneB = create("div", "sf-zone");
    zoneA.append(
        label("Zona A"),
        node(labels[2], index >= 1 ? "active" : ""),
        create("span", "sf-zone__note", "consistencia")
    );
    zoneB.append(
        label("Zona B"),
        node(labels[3], index >= 1 ? "active" : ""),
        create("span", "sf-zone__note", "disponibilidad")
    );
    zones.append(zoneA, create("div", "sf-break", `× ${labels[1]}`), zoneB);

    wrapper.append(client, zones);
    if (PARTITION_BADGES[index]) wrapper.append(badge(PARTITION_BADGES[index]));
    stage.append(wrapper, caption(step));
}

function renderTransactions(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-tx");
    const first = create("div", "sf-column");
    const second = create("div", "sf-column");
    const lock = create("div", "sf-column sf-tx__lock");
    const commit = create("div", "sf-column sf-tx__commit");

    first.append(label("TRANSACCIÓN"), node(labels[0], "active"));
    second.append(label("TRANSACCIÓN"), node(labels[2], "active"));
    lock.append(label("RECURSO"), node(labels[1], index >= 1 ? "active" : ""));
    commit.append(node(labels[3], index >= 1 ? "active" : ""));

    wrapper.append(first, lock, second, commit);
    if (TX_BADGES[index]) wrapper.append(badge(TX_BADGES[index], index === 3 ? "bad" : ""));
    stage.append(wrapper, caption(step));
}

function renderFiles(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-files");
    const upload = create("div", "sf-files__path");
    const read = create("div", "sf-files__path sf-files__path--read");

    upload.append(
        create("span", "sf-path", "SUBIDA"),
        node(labels[0], index >= 1 ? "active" : ""),
        arrow(index >= 1),
        node(labels[1], index >= 1 ? "active" : ""),
        arrow(index >= 1),
        node(labels[2], index >= 1 ? "active" : "")
    );
    read.append(
        create("span", "sf-path", "LECTURA"),
        node(labels[2]),
        arrow(index >= 3),
        node(labels[3], index >= 3 ? "active" : ""),
        arrow(index >= 3),
        node(labels[0])
    );

    wrapper.append(upload, read);
    if (FILE_BADGES[index]) wrapper.append(badge(FILE_BADGES[index], index === 3 ? "warn" : ""));
    stage.append(wrapper, caption(step));
}

function renderDiscovery(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-discovery");
    const client = create("div", "sf-column");
    const gateway = create("div", "sf-column sf-discovery__gateway");
    const service = create("div", "sf-column");
    const registry = create("div", "sf-registry");

    client.append(label("CLIENTE"), node(labels[0], "active"));
    gateway.append(label("ENTRADA"), node(labels[1], index >= 2 ? "active" : ""));
    registry.append(label("REGISTRO"), node(labels[2], index >= 1 ? "active" : ""));
    service.append(label("SERVICIO"), node(labels[3], index >= 3 ? "active" : ""));
    gateway.append(registry);

    wrapper.append(client, arrow(index >= 2), gateway, arrow(index >= 3), service);
    if (DISCOVERY_BADGES[index]) wrapper.append(badge(DISCOVERY_BADGES[index]));
    stage.append(wrapper, caption(step));
}

export function renderScene(stage, lesson, step, index) {
    stage.replaceChildren();
    stage.dataset.step = String(index);
    const kind = SCENE_KINDS[lesson.id] ?? "flow";
    stage.className = `scene__stage scene-stage scene-stage--${kind}`;

    if (kind === "queue") renderQueue(stage, lesson, step, index);
    else if (kind === "pubsub") renderPubsub(stage, lesson, step, index);
    else if (kind === "cluster") renderCluster(stage, lesson, step, index);
    else if (kind === "pipeline") renderPipeline(stage, lesson, step, index);
    else if (kind === "security") renderSecurity(stage, lesson, step, index);
    else if (kind === "feed") renderFeed(stage, lesson, step, index);
    else if (kind === "chat") renderChat(stage, lesson, step, index);
    else if (kind === "latency") renderLatency(stage, lesson, step, index);
    else if (kind === "compare") renderCompare(stage, lesson, step, index);
    else if (kind === "partition") renderPartition(stage, lesson, step, index);
    else if (kind === "transactions") renderTransactions(stage, lesson, step, index);
    else if (kind === "files") renderFiles(stage, lesson, step, index);
    else if (kind === "discovery") renderDiscovery(stage, lesson, step, index);
    else renderFlow(stage, lesson, step, index);
}
