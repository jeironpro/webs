// Loads the verses from the local static dataset.
// The book and chapter are derived from the path, which supports multi-word
// names such as hechos_de_los_apostoles or cantar_de_los_cantares.

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

// Loading skeleton: text-like lines shown while the dataset downloads.
function showSkeleton(container) {
  container.replaceChildren();
  const skeleton = document.createElement("div");
  skeleton.className = "skeleton";
  skeleton.setAttribute("role", "status");
  skeleton.setAttribute("aria-label", "Cargando versículos");
  for (let i = 0; i < 12; i++) {
    const line = document.createElement("div");
    line.className = "skeleton-line";
    // Varying widths to mimic the rhythm of the real text.
    line.style.width = `${38 + ((i * 17) % 56)}%`;
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
  } catch (err) {
    console.log("Error:", err);
    showMessage(versesContainer, "Contenido en preparación.");
  }
}

main();
