const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
};

const node = (label, variant = "") =>
    create("div", `sf-node${variant ? ` sf-node--${variant}` : ""}`, label);

const arrow = (active = false) => create("span", `sf-arrow${active ? " sf-arrow--active" : ""}`);

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
    "vertical-horizontal": "cluster",
    "load-balancing": "cluster",
    "stateless-services": "cluster",
    caching: "flow",
    "content-delivery": "flow",
    "sql-vs-nosql": "cluster",
    indexes: "flow",
    "storage-engines": "pipeline",
    replication: "cluster",
    sharding: "cluster",
    "consistent-hashing": "cluster",
    "unique-ids": "flow",
    "cap-consistency": "cluster",
    "consensus-leader": "cluster",
    "transactions-isolation": "flow",
    "files-media": "flow",
    "rest-rpc-graphql": "flow",
    "message-queues": "queue",
    "pubsub-events": "pubsub",
    "realtime-updates": "chat",
    "redundancy-failover": "cluster",
    "rate-limiting": "security",
    "timeouts-retries": "flow",
    observability: "pipeline",
    "monolith-microservices": "cluster",
    "service-discovery-gateway": "cluster",
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

function renderFlow(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-flow");
    const active = Math.min(index, labels.length - 1);

    labels.forEach((label, position) => {
        if (position > 0) wrapper.append(arrow(position <= active));
        wrapper.append(
            node(label, position === active ? "active" : position < active ? "past" : "")
        );
    });

    wrapper.append(create("span", "sf-flow__marker", "flujo"));
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

    producer.append(create("span", "sf-label", "PRODUCTOR"), node(labels[0], "active"));
    queue.append(create("div", "sf-queue-box__head", labels[1]), create("div", "sf-lane"));
    const lane = queue.querySelector(".sf-lane");
    for (let dot = 0; dot < Math.min(depth, 12); dot += 1) {
        lane.append(create("i", dot % 4 === 0 ? "sf-dot sf-dot--hot" : "sf-dot"));
    }
    if (depth === 0) lane.append(create("span", "sf-empty", "vacía"));

    workers.append(create("span", "sf-label", "CONSUMIDORES"));
    [labels[2], labels[3], "Worker 3"].forEach((label, position) => {
        const failed = index === 3 && position === 1;
        workers.append(node(label, failed ? "failed" : index >= 2 ? "active" : ""));
    });

    wrapper.append(producer);
    if (index >= 1) wrapper.append(arrow(true), queue);
    if (index >= 2) wrapper.append(arrow(true), workers);

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

    producer.append(create("span", "sf-label", "PRODUCTOR"), node(labels[0], "active"));
    topic.append(
        create("span", "sf-label", "TOPIC"),
        create("strong", "", labels[1]),
        create("span", "sf-pubsub__event", "order.created")
    );
    subscribers.append(create("span", "sf-label", "SUSCRIPTORES"));
    [labels[2], labels[3], "Susc. C"].forEach((label) => {
        subscribers.append(node(label, index >= 2 ? "active" : ""));
    });

    wrapper.append(producer);
    if (index >= 1) wrapper.append(arrow(true), topic);
    if (index >= 2) wrapper.append(arrow(true), subscribers);

    if (index === 3) {
        wrapper.append(create("span", "sf-badge sf-badge--warn", "orden por clave"));
    }
    if (index === 4) {
        wrapper.append(create("span", "sf-badge", "contrato de evento"));
    }

    stage.append(wrapper, caption(step));
}

function renderCluster(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-cluster");
    const client = create("div", "sf-column");
    const entry = create("div", "sf-column sf-column--entry");
    const nodes = create("div", "sf-nodes");

    client.append(create("span", "sf-label", "ENTRADA"), node(labels[0], "active"));
    entry.append(
        create("span", "sf-label", "COORDINACIÓN"),
        node(labels[1], index >= 1 ? "active" : "")
    );

    const nodeLabels = [labels[2], labels[3], "Nodo C"];
    nodeLabels.forEach((label, position) => {
        const failed = index === 3 && position === 1;
        const leader = index >= 2 && position === 0;
        nodes.append(
            node(label, failed ? "failed" : leader ? "leader" : index >= 1 ? "active" : "")
        );
    });

    if (index === 3) {
        wrapper.append(create("span", "sf-badge sf-badge--bad", "réplica retirada"));
    }
    if (index === 4) {
        wrapper.append(create("span", "sf-badge", "quórum / estado estable"));
    }

    wrapper.append(client);
    if (index === 0) {
        wrapper.append(arrow(true), node(labels[2], "active"));
    } else {
        wrapper.append(arrow(true), entry, arrow(true), nodes);
    }
    stage.append(wrapper, caption(step));
}

function renderPipeline(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-pipeline");
    const activeStage = Math.min(index, 3);

    const visibleStages = index === 4 ? labels.slice(0, 4) : labels.slice(0, index + 1);
    visibleStages.forEach((label, position) => {
        const stageNode = create("div", "sf-stage");
        stageNode.append(
            create("span", "sf-stage__num", `0${position + 1}`),
            create("strong", "", label)
        );
        stageNode.classList.add("is-active");
        if (index === 4) stageNode.classList.add("is-rollback");
        if (position === activeStage) {
            stageNode.classList.add("is-current");
            stageNode.append(create("span", "sf-package", "●"));
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

    client.append(create("span", "sf-label", "ORIGEN"), node(labels[0], "active"));
    gate.append(
        create("span", "sf-gate__icon", "⌑"),
        create("strong", "", index >= 1 ? "frontera" : "sin frontera"),
        create("span", "sf-label", index >= 1 ? "autenticación" : "paso libre")
    );
    policy.append(
        create("span", "sf-label", "POLÍTICA"),
        node(labels[2], index >= 2 ? "active" : "")
    );
    resource.append(
        create("span", "sf-label", "RECURSO"),
        node(labels[3], index >= 3 ? "active" : "")
    );

    if (index === 3) {
        wrapper.append(create("span", "sf-badge sf-badge--bad", "acceso denegado"));
        resource.classList.add("is-denied");
    }
    if (index === 4) {
        wrapper.append(create("span", "sf-badge", "mínimo privilegio"));
    }

    wrapper.append(client);
    if (index >= 1) wrapper.append(arrow(true), gate);
    if (index >= 2) wrapper.append(arrow(true), policy);
    if (index >= 3) wrapper.append(arrow(true), resource);
    stage.append(wrapper, caption(step));
}

function renderFeed(stage, lesson, step, index) {
    const labels = lesson.scene.labels;
    const wrapper = create("div", "sf-feed");
    const source = create("div", "sf-column");
    const fanout = create("div", "sf-fanout");
    const timelines = create("div", "sf-timelines");

    source.append(create("span", "sf-label", "PUBLICACIÓN"), node(labels[0], "active"));
    fanout.append(
        create("strong", "", labels[1]),
        create("span", "sf-fanout__count", index >= 2 ? "200 seguidores" : "sin repartir")
    );

    ["Timeline A", "Timeline B", "Timeline C"].forEach((label, position) => {
        const row = create("div", "sf-timeline");
        row.append(
            create("span", "sf-timeline__name", label),
            create("span", "sf-timeline__line"),
            create("span", "sf-timeline__count", index >= 2 ? `${position + 1} post` : "—")
        );
        timelines.append(row);
    });

    wrapper.append(source);
    if (index >= 1) wrapper.append(arrow(true), fanout);
    if (index >= 2) wrapper.append(arrow(true), timelines);
    stage.append(wrapper);
    if (index >= 3) {
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

    clients.append(create("span", "sf-label", "CONEXIONES"));
    clients.append(node("Cliente A", "active"));
    if (index >= 1) clients.append(node("Cliente B", "active"));

    gateway.append(
        create("span", "sf-label", labels[1]),
        node(labels[1], index >= 1 ? "active" : "")
    );
    broker.append(
        create("span", "sf-label", labels[2]),
        node(labels[2], index >= 2 ? "active" : "")
    );
    store.append(
        create("span", "sf-label", labels[3]),
        node(labels[3], index >= 3 ? "active" : "")
    );

    wrapper.append(clients);
    if (index >= 1) wrapper.append(arrow(true), gateway);
    if (index >= 2) wrapper.append(arrow(true), broker);
    if (index >= 3) wrapper.append(arrow(true), store);
    if (index === 4) {
        wrapper.append(create("span", "sf-badge sf-badge--warn", "reconexión: reenviar cursor"));
    }
    stage.append(wrapper, caption(step));
}

function renderLatency(stage, lesson, step, index) {
    const wrapper = create("div", "sf-latency");
    const values =
        index === 0
            ? [20, 38]
            : index === 1
              ? [55, 92]
              : index === 2
                ? [45, 88]
                : index === 3
                  ? [72, 96]
                  : [30, 55];
    const labels = index === 3 ? ["RTT", "mínimo"] : ["p50", "p99"];

    labels.forEach((label, position) => {
        const column = create("div", "sf-bar");
        const bar = create("span", "sf-bar__fill");
        bar.style.height = `${values[position]}%`;
        column.append(
            create("span", "sf-bar__value", `${values[position]} ms`),
            bar,
            create("span", "sf-bar__label", label)
        );
        wrapper.append(column);
    });

    const queue = create("div", "sf-latency__queue");
    const queueFill = create("span");
    queueFill.style.width = `${[8, 48, 72, 40, 20][index]}%`;
    queue.append(create("span", "sf-label", "cola"), queueFill);
    if (index === 1)
        wrapper.append(create("span", "sf-badge sf-badge--warn", "uso cerca del 100 %"));
    if (index === 4) wrapper.append(create("span", "sf-badge", "presupuesto repartido"));

    stage.append(wrapper, queue, caption(step));
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
    else renderFlow(stage, lesson, step, index);
}
