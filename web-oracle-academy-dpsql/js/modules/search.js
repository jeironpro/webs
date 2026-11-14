const ALL_TYPES = "all";

export function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es");
}

export function filterFiles(files, query, type, context = "") {
    const normalized = normalizeText(query.trim());
    return files.filter((file) => {
        const matchesType = type === ALL_TYPES || file.type === type;
        if (!matchesType) {
            return false;
        }
        if (normalized === "") {
            return true;
        }
        const text = normalizeText([file.title, file.name, file.lesson ?? "", context].join(" "));
        return text.includes(normalized);
    });
}

export function filterManifest(manifest, query, type) {
    const topics = manifest.topics
        .map((topic) => ({
            ...topic,
            files: filterFiles(topic.files, query, type, topic.title),
        }))
        .filter((topic) => topic.files.length > 0);
    const total = topics.reduce((sum, topic) => sum + topic.files.length, 0);
    return { topics, total };
}
