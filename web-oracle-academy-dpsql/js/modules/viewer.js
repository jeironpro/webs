export function findFile(manifest, filePath) {
    for (const topic of manifest.topics) {
        const file = topic.files.find((item) => item.path === filePath);
        if (file !== undefined) {
            return { topic, file };
        }
    }
    return null;
}

export function buildPagination(topic, currentFile) {
    const visible = topic.files.filter((file) => file.type === "pdf" && file.external !== true);
    const index = visible.findIndex((file) => file.path === currentFile.path);
    return {
        prev: index > 0 ? visible[index - 1] : null,
        next: index >= 0 && index < visible.length - 1 ? visible[index + 1] : null,
        position: index >= 0 ? index + 1 : null,
        total: visible.length,
    };
}
