document.addEventListener("DOMContentLoaded", () => {
    const route = [
        "first-steps",
        "gitinit",
        "gitremote",
        "gitconfig",
        "gitstatus",
        "gitadd",
        "gitmv",
        "gitrestore",
        "gitrm",
        "gitclean",
        "gitcommit",
        "gitstash",
        "gitdiff",
        "gitblame",
        "gitlog",
        "gitshow",
        "gitreflog",
        "gitreset",
        "gitrevert",
        "gitbisect",
        "gitpush",
        "gittag",
        "gitbranch",
        "gitcheckout",
        "gitswitch",
        "gitmerge",
        "gitrebase",
        "gitcherrypick",
        "gitgc",
        "gitarchive",
        "gitsubmodule",
        "gitclone",
        "gitpull",
        "gitfetch",
        "final-test"
    ];

    const title = document.querySelector("h1");
    if (!title) return;

    const headerNav = document.createElement("div");
    headerNav.className = "header-nav";

    const homeLink = document.createElement("a");
    homeLink.href = "../index.html";
    homeLink.className = "header-home";
    homeLink.title = "Volver a la página principal";
    homeLink.textContent = "índice";
    headerNav.appendChild(homeLink);

    const previousLink = document.createElement("a");
    previousLink.id = "previous-link";
    previousLink.className = "header-arrow";
    previousLink.title = "Página anterior";
    previousLink.setAttribute("aria-label", "Página anterior");
    previousLink.textContent = "←";
    headerNav.appendChild(previousLink);

    const nextLink = document.createElement("a");
    nextLink.id = "next-link";
    nextLink.className = "header-arrow";
    nextLink.title = "Página siguiente";
    nextLink.setAttribute("aria-label", "Página siguiente");
    nextLink.textContent = "→";

    title.insertAdjacentElement("beforebegin", headerNav);
    title.insertAdjacentElement("afterend", nextLink);

    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    const pageIndex = route.indexOf(currentPage);

    if (pageIndex === -1) {
        previousLink.remove();
        nextLink.remove();
        return;
    }

    const previousPage = route[(pageIndex - 1 + route.length) % route.length];
    const nextPage = route[(pageIndex + 1) % route.length];
    previousLink.href = `./${previousPage}.html`;
    nextLink.href = `./${nextPage}.html`;

    document.querySelectorAll("[data-year]").forEach((year) => {
        year.textContent = new Date().getFullYear();
    });
});
