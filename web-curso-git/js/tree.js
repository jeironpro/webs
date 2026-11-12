let treeData = [];
const treeElement = document.getElementById("tree");

// Pinta un nodo por comando en la página principal
function renderTree() {
    treeElement.replaceChildren();

    treeData.forEach((node) => {
        const item = document.createElement("a");
        item.classList.add("tree-item");
        item.href = node.href;

        const title = document.createElement("span");
        title.classList.add("tree-title");
        title.textContent = node.title;

        item.appendChild(title);
        treeElement.appendChild(item);
    });
}

const slugify = (value) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "")
        .replace(/-/g, "")
        .toLowerCase();

function addNode(title, href) {
    treeData.push({ title, href: href || `html/${slugify(title)}.html` });
}

addNode("Primeros pasos", "html/first-steps.html");
addNode("Git init");
addNode("Git clone");
addNode("Git remote");
addNode("Git config");
addNode("Git status");
addNode("Git add");
addNode("Git restore");
addNode("Git rm");
addNode("Git clean");
addNode("Git mv");
addNode("Git commit");
addNode("Git blame");
addNode("Git log");
addNode("Git show");
addNode("Git reflog");
addNode("Git stash");
addNode("Git diff");
addNode("Git pull");
addNode("Git push");
addNode("Git tag");
addNode("Git fetch");
addNode("Git reset");
addNode("Git revert");
addNode("Git bisect");
addNode("Git branch");
addNode("Git checkout");
addNode("Git switch");
addNode("Git cherry-pick");
addNode("Git merge");
addNode("Git rebase");
addNode("Git gc");
addNode("Git archive");
addNode("Git submodule");
addNode("Prueba final", "html/final-test.html");

function renderCurrentYear() {
    document.querySelectorAll("[data-year]").forEach((year) => {
        year.textContent = new Date().getFullYear();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderTree();
    renderCurrentYear();
});
