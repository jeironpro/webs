// Punto de entrada del catálogo.
// Renderiza filtros y tarjetas sin inyectar HTML (solo createElement/textContent),
// según la regla de JavaScript de dicresoft.

import { categories, accents, projects } from "./catalog.js";

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const grid = document.getElementById("catalog-grid");
const filtersEl = document.querySelector(".catalog__filters");
const starField = document.querySelector(".star-field");
const cloneCmd = document.getElementById("clone-cmd");
const copyBtn = document.getElementById("copy-btn");
const copyIcon = document.getElementById("copy-icon");
const copyLabel = document.getElementById("copy-label");

// Modal de vista previa (dialog nativo).
const modal = document.getElementById("preview-modal");
const modalCat = document.getElementById("preview-modal-cat");
const modalTitle = document.getElementById("preview-modal-title");
const modalDesc = document.getElementById("preview-modal-desc");
const modalTags = document.getElementById("preview-modal-tags");
const modalDemo = document.getElementById("preview-modal-demo");
const modalDownload = document.getElementById("preview-modal-download");
const modalIcon = document.getElementById("preview-modal-icon");
const modalClose = document.getElementById("preview-modal-close");

let activeCategory = "todos";

/* ---------- utilidades de DOM ---------- */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function icon(name) {
  const span = el("span", "material-symbols-rounded");
  span.setAttribute("aria-hidden", "true");
  span.textContent = name;
  return span;
}

/* ---------- filtros ---------- */

function renderFilters() {
  categories.forEach((category) => {
    const count = category.id === "todos"
      ? projects.length
      : projects.filter((project) => project.category === category.id).length;

    const chip = el("button", "filter-chip");
    chip.type = "button";
    chip.setAttribute("aria-pressed", String(category.id === activeCategory));
    chip.dataset.category = category.id;

    chip.append(el("span", "filter-chip__label", category.label));
    chip.append(el("span", "filter-chip__count", String(count)));

    chip.addEventListener("click", () => {
      activeCategory = category.id;
      filtersEl.querySelectorAll(".filter-chip").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === chip));
      });
      applyFilter();
    });

    filtersEl.append(chip);
  });
}

function applyFilter() {
  projects.forEach((project, index) => {
    const card = grid.children[index];
    if (!card) return;
    const match = activeCategory === "todos" || project.category === activeCategory;
    card.hidden = !match;
  });
}

/* ---------- tarjetas ---------- */

function renderCards() {
  projects.forEach((project, index) => {
    const accent = accents[index % accents.length];
    const card = el("article", `project-card project-card--${accent}`);
    card.dataset.category = project.category;

    // Icono del proyecto: botón que abre la modal.
    const preview = el("button", "project-card__preview");
    preview.type = "button";
    preview.setAttribute("aria-label", `Ver ${project.name} en grande`);

    const image = el("img", "project-card__preview-img");
    image.src = project.icon;
    image.alt = "";
    image.loading = "lazy";
    preview.append(image);

    const expand = el("span", "project-card__expand");
    expand.append(icon("open_in_full"));
    preview.append(expand);

    preview.addEventListener("click", () => openModal(project));

    // Cuerpo de la tarjeta.
    const body = el("div", "project-card__body");
    body.append(el("p", "project-card__cat", project.categoryLabel));

    const meta = el("div", "project-card__meta");
    meta.append(el("h3", "project-card__title", project.name));
    meta.append(el("span", "project-card__index", String(index + 1).padStart(2, "0")));
    body.append(meta);

    body.append(el("p", "project-card__desc", project.description));

    const tags = el("ul", "project-card__tags");
    project.tech.forEach((tech) => tags.append(el("li", null, tech)));
    body.append(tags);

    // Acciones: ver (modal) + descarga.
    const actions = el("div", "project-card__actions");

    const viewButton = el("button", "btn btn--outline btn--sm project-card__view");
    viewButton.type = "button";
    viewButton.append(icon("visibility"));
    viewButton.append(el("span", null, "Ver"));
    viewButton.addEventListener("click", () => openModal(project));
    actions.append(viewButton);

    const downloadLink = el("a", "btn btn--sm btn--card project-card__download");
    downloadLink.href = project.zip;
    downloadLink.setAttribute("download", "");
    downloadLink.append(icon("download"));
    downloadLink.append(el("span", null, "Descargar"));
    downloadLink.addEventListener("click", () => burstFrom(downloadLink));
    actions.append(downloadLink);

    body.append(actions);
    card.append(preview, body);
    grid.append(card);
  });
}

/* ---------- modal de vista previa ---------- */

function openModal(project) {
  modalTags.replaceChildren();
  project.tech.forEach((tech) => modalTags.append(el("li", null, tech)));

  modalCat.textContent = project.categoryLabel;
  modalTitle.textContent = project.name;
  modalDesc.textContent = project.description;
  modalIcon.src = project.icon;

  modalDemo.href = project.entry;
  modalDownload.href = project.zip;

  document.body.classList.add("has-modal");
  modal.showModal();
}

function closeModal() {
  modal.close();
}

modalClose.addEventListener("click", closeModal);

// Clic fuera del panel (backdrop) cierra la modal.
modal.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  const inside = event.clientX >= rect.left
    && event.clientX <= rect.right
    && event.clientY >= rect.top
    && event.clientY <= rect.bottom;
  if (!inside) closeModal();
});

// Escape (nativo) o close(): se restaura el scroll de la página.
modal.addEventListener("close", () => {
  document.body.classList.remove("has-modal");
});

modalDownload.addEventListener("click", () => burstFrom(modalDownload));

/* ---------- contador del hero ---------- */

function animateCount(node) {
  const target = Number(node.dataset.count);
  if (REDUCED_MOTION) {
    node.textContent = String(target);
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    node.textContent = String(Math.round(eased * target));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ---------- estrella (celebración coral) ---------- */

function burstFrom(anchor) {
  if (REDUCED_MOTION) return;
  const rect = anchor.getBoundingClientRect();
  spawnStar(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function spawnStar(x, y) {
  const star = el("span", "star-burst");
  star.style.left = `${x - 12}px`;
  star.style.top = `${y - 12}px`;
  starField.append(star);
  window.setTimeout(() => star.remove(), 430);
}

/* ---------- copiar comando de clonado ---------- */

async function handleCopy() {
  const command = cloneCmd.textContent;
  try {
    await navigator.clipboard.writeText(command);
    showCopiedState();
    burstFrom(copyBtn);
  } catch {
    // Sin permiso de portapapeles: se selecciona el texto para copia manual.
    const range = document.createRange();
    range.selectNodeContents(cloneCmd);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyLabel.textContent = "Seleccionado";
    window.setTimeout(resetCopyButton, 1500);
  }
}

function showCopiedState() {
  copyIcon.textContent = "check";
  copyLabel.textContent = "Copiado";
  window.setTimeout(resetCopyButton, 1500);
}

function resetCopyButton() {
  copyIcon.textContent = "content_copy";
  copyLabel.textContent = "Copiar";
}

/* ---------- inicio ---------- */

function init() {
  renderFilters();
  renderCards();

  const countNode = document.querySelector("[data-count]");
  if (countNode) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(countNode);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(countNode);
  }

  copyBtn.addEventListener("click", handleCopy);
}

init();
