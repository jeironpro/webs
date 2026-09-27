/**
 * Modal informativo sobre el guardado de datos.
 * @module modules/modal
 */

import { qs } from "../utils/dom.js";

const FOCUSABLE_SELECTOR = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

/**
 * Conecta el botón de información con el modal y gestiona su ciclo de vida:
 * apertura, cierre, foco y bloqueo del scroll.
 * @returns {void}
 */
export function initModal() {
  const trigger = qs("#info-trigger");
  const modal = qs("#data-modal");
  const closeButton = qs("#modal-close");
  const dialog = qs(".modal__dialog", modal);

  if (!trigger || !modal || !closeButton || !dialog) {
    return;
  }

  let lastFocused = null;

  /**
   * Abre el modal: muestra el overlay, bloquea el scroll y enfoca el diálogo.
   */
  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    dialog.focus();
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  /**
   * Cierra el modal: restaura el scroll y devuelve el foco al origen.
   */
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  trigger.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusables = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
      (node) => !node.hidden && node.getClientRects().length > 0
    );

    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}