/* Builds the chapter grid of the current book page from BIBLE_CATALOG
   (js/data/catalog.js). The book is identified by the data-book attribute of
   the #chapters container, so no page repeats its chapter count in its HTML. */
(function () {
  const container = document.getElementById("chapters");
  if (!container || typeof BIBLE_CATALOG === "undefined") return;

  const bookId = container.getAttribute("data-book");
  const book = Object.values(BIBLE_CATALOG)
    .flat()
    .find((b) => b.id === bookId);
  if (!book) return;

  for (let i = 1; i <= book.chapters; i++) {
    const chapter = document.createElement("div");
    chapter.classList.add("chapter");

    const link = document.createElement("a");
    link.href = `${book.id}/${book.id}_${i}.html`;
    link.textContent = i;
    chapter.appendChild(link);

    container.appendChild(chapter);
  }
})();
