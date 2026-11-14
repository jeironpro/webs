const SITE_ROOT = new URL("../../", import.meta.url);
const MANIFEST_PATH = new URL("data/manifest.json", SITE_ROOT);

export async function loadManifest() {
    let response;
    try {
        response = await fetch(MANIFEST_PATH, { headers: { Accept: "application/json" } });
    } catch {
        throw new Error("No se pudo conectar con el manifiesto del curso.");
    }
    if (!response.ok) {
        throw new Error(`No se pudo cargar el manifiesto (${response.status}).`);
    }
    return response.json();
}

export function fileUrl(file) {
    return new URL(file.path, SITE_ROOT).href;
}

export function viewerUrl(file, topicId) {
    const url = new URL("html/visor.html", SITE_ROOT);
    url.search = new URLSearchParams({ file: file.path, topic: topicId }).toString();
    return url.href;
}
