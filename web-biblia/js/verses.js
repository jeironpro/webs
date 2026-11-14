const DATA_URL = (function () {
    const script = document.currentScript;
    if (script && script.src) {
        return new URL("data/verses.json", script.src).href;
    }
    return new URL("../../../js/data/verses.json", window.location.href).href;
})();

function showMessage(container, message) {
    container.replaceChildren();
    const notice = document.createElement("p");
    notice.textContent = message;
    container.appendChild(notice);
}
function showSkeleton(container) {
    container.replaceChildren();
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    skeleton.setAttribute("role", "status");
    skeleton.setAttribute("aria-label", "Cargando versículos");
    for (let i = 0; i < 12; i++) {
        const line = document.createElement("div");
        line.className = "skeleton-line";
        skeleton.appendChild(line);
    }
    container.appendChild(skeleton);
}

async function main() {
    const versesContainer = document.querySelector(".verses");
    if (!versesContainer) return;

    const parts = window.location.pathname.split("/").filter(Boolean);
    const file = parts.pop() || "";
    const bookId = parts.pop() || "";
    const chapterNumber = parseInt(file.replace(".html", "").split("_").pop(), 10);

    if (!bookId || !Number.isInteger(chapterNumber)) {
        showMessage(versesContainer, "No se pudo identificar este capítulo.");
        return;
    }

    showSkeleton(versesContainer);

    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("Dataset no disponible");
        const data = await response.json();
        const verses = data[bookId] && data[bookId][chapterNumber];

        if (!verses || !verses.length) {
            showMessage(versesContainer, "Contenido en preparación.");
            return;
        }

        const textContainer = document.createElement("pre");
        textContainer.textContent = verses
            .map((verse) => `${verse.number}. ${verse.text}`)
            .join("\n");
        versesContainer.replaceChildren(textContainer);
    } catch {
        showMessage(versesContainer, "Contenido en preparación.");
    }
}

main();
